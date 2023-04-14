<template>
  <div class="wrap">
    <div v-if="conReadyState === 0" class="status-text"
      ><span>{{ statusText }}</span
      ><icon-loading class="size-12"
    /></div>
    <div ref="terminal"></div>
  </div>
</template>

<script lang="ts" setup>
  import qs from 'query-string';
  import hasAnsi from 'has-ansi';
  import stripAnsi from 'strip-ansi';
  import {
    ref,
    onMounted,
    onBeforeUnmount,
    watch,
    computed,
    nextTick
  } from 'vue';
  import {
    debounce,
    trim,
    split,
    get,
    throttle,
    replace,
    includes,
    compact
  } from 'lodash';
  import { Terminal } from 'xterm';
  import { FitAddon } from 'xterm-addon-fit';
  import 'xterm/css/xterm.css';
  import { deleteModal } from '@/utils/monitor';
  import platformCall from '@/utils/platform';

  const props = defineProps({
    terminalDetail: Object,
    type: String,
    url: {
      type: String,
      default() {
        return '';
      }
    }
  });
  const platform = platformCall();
  const terminalEnvList = ['bash', 'sh', 'powershell', 'pwsh', 'cmd', 'bash'];
  const fitAddon = new FitAddon();
  const terminal = ref(null);
  const first = ref(true);
  const loading = ref(true);
  const terminalSocket = ref<any>(null);
  const term = ref<any>(null);
  const command = ref('');
  const statusText = ref('connecting...');
  const actived = ref(true);
  const statusCode = ref<number>(0);
  const terminalEnvIndex = ref(0);
  const wssUrl = ref('');
  const bufferLength = ref(0);

  const conReadyState = ref(0);
  const runRealTerminal = () => {
    loading.value = false;
  };
  const initData = () => {
    return `\x1B[1;3;31m\x1B[0m`;
  };
  const setData = (data) => {
    return `${data}\x1B[1;3;31m\x1B[0m`;
  };
  const setErrorData = (data) => {
    return `\x1b[31m${data}\x1b[m`;
  };
  // readyState: 0 1 2 3
  const isWsOpen = () => {
    const readyState = terminalSocket.value && terminalSocket.value.readyState;
    return readyState === 1;
  };
  const resizeRemoteTerminal = () => {
    const { cols, rows } = term.value;
    console.log('wss: resize', cols, rows);
    if (isWsOpen()) {
      terminalSocket.value.send(`#{"width":${cols},"height":${rows}}#`);
    }
  };
  const clearCommand = () => {
    command.value = '';
    // term.value.write('\r\n$ ');
  };
  const enterPrompt = () => {
    // command.value = '';
    // term.value.write('\r\n');
  };
  const runCommand = () => {
    command.value = trim(command.value);
    if (isWsOpen()) {
      terminalSocket.value.send(`${command.value}\r`);
    }
    console.log('wss: commond', command.value);
  };
  const runCancel = () => {
    if (isWsOpen()) {
      terminalSocket.value.send(`\r`);
    }
    command.value = '';
  };
  const onDataCallback = (e) => {
    console.log('data code===', e);
    switch (e) {
      case '\u0003': // Ctrl+C
        term.value.write('^C');
        runCancel();
        break;
      case '\r': // Enter
        runCommand();
        break;
      case '\u007F': // Backspace (DEL)
        // Do not delete the clearCommand
        if (term.value._core.buffer.x > 2) {
          term.value.write('\b \b');
          if (command.value.length > 0) {
            command.value = command.value.substr(0, command.value.length - 1);
          }
        }
        break;
      default: // Print all other characters
        if (
          (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7e)) ||
          e >= '\u00a0'
        ) {
          command.value += e;
          term.value.write(e);
        }
    }
  };
  const onWSReceive = (message) => {
    if (first.value === true) {
      first.value = false;
      resizeRemoteTerminal();
    }
    const data = { Data: message.data };
    conReadyState.value = terminalSocket.value.readyState;

    // const data = JSON.parse(message.data) || '';
    if (term.value.element) term.value.focus();
    const inputCommand = `${command.value}\r\n`;
    const output = data.Data;
    const index = command.value ? output.indexOf(inputCommand) : -1;
    if (index > -1) {
      const str2 = output.substring(index + inputCommand.length);
      term.value.write(setData(`\r\n${str2}`));
    } else {
      term.value.write(setData(output));
    }
    bufferLength.value = term.value._core.buffer.x;
    console.log('wss: receive', { index, output, inputCommand });
    // term.value.write(setData(`${output}`));
    setTimeout(() => {
      clearCommand();
    }, 100);
  };

  const errorRealTerminal = (ex) => {
    let { message } = ex;
    if (!message) message = 'disconnected';
    conReadyState.value = terminalSocket.value.readyState;
    term.value.write(setErrorData(message));
    clearCommand();
    console.log('wss: err', message);
  };
  const setWssUrl = (flag?) => {
    if (terminalEnvIndex.value >= terminalEnvList.length - 1) return;
    if (flag) {
      terminalEnvIndex.value = 0;
    } else {
      terminalEnvIndex.value += 1;
    }
    const params = qs.stringify({
      shell: terminalEnvList[terminalEnvIndex.value]
    });
    wssUrl.value = `${props.url}&${params}`;
    console.log('wssUrl===', params);
  };
  const closeRealTerminal = (data) => {
    statusCode.value = get(data, 'code');
    conReadyState.value = terminalSocket.value.readyState;
    term.value.write(setData(data.reason));
    clearCommand();
    console.log('wss: close:', statusCode.value, data);
  };
  const createWS = () => {
    if (!props.url) return;
    term.value?.write?.('');
    terminalSocket.value = new WebSocket(wssUrl.value);
    terminalSocket.value.onopen = runRealTerminal;
    terminalSocket.value.onmessage = onWSReceive;
    terminalSocket.value.onclose = closeRealTerminal;
    terminalSocket.value.onerror = errorRealTerminal;
  };
  const initWS = () => {
    if (!terminalSocket.value) {
      createWS();
      return;
    }
    terminalSocket.value?.close?.();
    createWS();
  };
  const initTerm = () => {
    term.value = new Terminal({
      lineHeight: 1.2,
      fontSize: 12,
      fontFamily:
        "'Menlo For Powerline', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
      theme: {
        background: '#181d28'
      },
      // 光标闪烁
      cursorBlink: true,
      cursorStyle: 'underline',
      scrollback: 100,
      tabStopWidth: 4
    });
    term.value.open(terminal.value);
    term.value.loadAddon(fitAddon);
    nextTick(() => {
      fitAddon.fit();
    });
  };

  const fitTerm = () => {
    fitAddon.fit();
    resizeRemoteTerminal();
  };
  const onResize = debounce(() => fitTerm(), 500);

  const registerTermHandler = () => {
    term.value.onData((data) => {
      console.log('wss: data', data, isWsOpen());
      onDataCallback(data);
    });
    term.value.onKey((e) => {
      console.log('key>>ee>>=1==', e);
    });
    term.value.attachCustomKeyEventHandler(async (e) => {
      if (platform.isMac && e.metaKey && e.code === 'KeyV') {
        const val = await navigator.clipboard.readText();
        command.value = val;
        term.value.write(val);
      } else if (e.ctrlKey && e.code === 'KeyV') {
        const val = await navigator.clipboard.readText();
        command.value = val;
        term.value.write(val);
      }
    });
  };
  const onTerminalResize = () => {
    window.addEventListener('resize', onResize);
  };
  const removeResizeListener = () => {
    window.removeEventListener('resize', onResize);
  };

  const init = () => {
    initWS();
    initTerm();
    registerTermHandler();
    onTerminalResize();
  };
  const retry = () => {
    terminalSocket.value.close?.();
    init();
    term.value.reset();
  };
  const handleTryConnect = () => {
    deleteModal({
      title: 'common.ws.close',
      onOk: retry,
      okText: 'common.ws.reconnect'
    });
  };

  watch(
    () => props.url,
    () => {
      if (!props.url) {
        term.value?.reset?.();
        term.value?.dispose?.();
        terminalSocket.value?.close?.();
        terminalSocket.value = {};
      } else {
        first.value = true;
        loading.value = true;
        setWssUrl(true);
        initWS();
        term.value.reset();
      }
    },
    {
      immediate: false
    }
  );
  watch(
    () => statusCode.value,
    (ov) => {
      if (statusCode.value === 1003) {
        term.value?.write?.('');
        setWssUrl();
        initWS();
        term.value.reset();
      }
    },
    {
      immediate: true
    }
  );

  onMounted(() => {
    init();
  });
  onBeforeUnmount(() => {
    removeResizeListener();
    console.log('wss: dispose');
    actived.value = false;
    term.value?.dispose?.();
    if (terminalSocket.value) terminalSocket.value.close?.();
  });
</script>

<style lang="less" scoped>
  #terminal {
    width: 100%;
    height: 100%;
  }

  .wrap {
    position: relative;

    .status-text {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      color: #fff;
    }
  }
</style>

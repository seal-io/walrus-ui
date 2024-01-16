<template>
  <div ref="wrapper" class="wrap" :style="{ height: `${height}px` }">
    <div v-if="(conReadyState === 0 || loading) && url" class="status-text"
      ><span>{{ statusText }}</span
      ><icon-loading class="size-12"
    /></div>
    <div ref="terminal" class="terminal" style="height: 100%"></div>
  </div>
</template>

<script lang="ts" setup>
  import qs from 'query-string';
  import { useResizeObserver } from '@vueuse/core';
  import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
  import _, { trim, get, throttle } from 'lodash';
  import { Terminal } from 'xterm';
  import { FitAddon } from 'xterm-addon-fit';
  import 'xterm/css/xterm.css';

  const props = defineProps({
    height: {
      type: Number,
      default() {
        return 270;
      }
    },
    url: {
      type: String,
      default() {
        return '';
      }
    }
  });
  const wrapper = ref();
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
  const toRetry = ref(false);
  const RECONNECT_MSG = '--- press Y to reconnect! ---';

  const conReadyState = ref(0);
  const runRealTerminal = () => {
    term.value?.clear?.();
    loading.value = false;
    toRetry.value = false;
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
    if (isWsOpen()) {
      terminalSocket.value.send(`#{"width":${cols},"height":${rows}}#`);
    }
  };
  const clearCommand = () => {
    for (let i = 0; i < command.value.length; i += 1) {
      term.value.write('\b \b');
    }
    command.value = '';
  };
  const closeRealTerminal = (data) => {
    statusCode.value = get(data, 'code');
    conReadyState.value = terminalSocket.value.readyState;
    clearCommand();
    if ([1011, 1006, 1000].includes(statusCode.value)) {
      toRetry.value = true;
      if (first.value) {
        term.value?.reset?.();
      }
      if (!loading.value) {
        term.value.write(setData(`${data.reason}\r\n`));
        term.value.write(setErrorData(`\r${RECONNECT_MSG}`));
      }
      first.value = true;
    }
    loading.value = false;
  };
  const errorRealTerminal = (ex) => {
    let { message } = ex;
    if (!message) {
      message = 'disconnected!';
      toRetry.value = true;
      first.value = true;
      loading.value = false;
    }
    clearCommand();
    conReadyState.value = terminalSocket.value.readyState;
    term.value.write(setErrorData(`\r${message}`));
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
    term.value.write(setData(output));
    setTimeout(() => {
      bufferLength.value = term.value._core.buffer.x;
    }, 100);
  };
  const createWS = () => {
    if (!props.url) return;
    term.value?.write?.('');
    statusCode.value = 0;
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
  const retry = () => {
    loading.value = true;
    term.value.reset();
    initWS();
  };
  const runCommand = () => {
    command.value = trim(command.value);
    if (isWsOpen()) {
      terminalSocket.value.send(`${command.value}\r`);
      clearCommand();
    }
  };
  const runCancel = () => {
    if (isWsOpen()) {
      terminalSocket.value.send(`\x03`);
      command.value = '';
    }
  };
  const onDataCallback = (e) => {
    switch (e) {
      case '\u0003': // Ctrl+C
        runCancel();
        break;
      case '\r': // Enter
        runCommand();
        break;
      case '\u007F': // Backspace (DEL)
        if (term.value._core.buffer.x > bufferLength.value) {
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
  };

  const initTerm = () => {
    term.value?.dispose?.();
    term.value = new Terminal({
      lineHeight: 1.2,
      fontSize: 12,
      fontFamily:
        "monospace,Menlo,Courier,'Courier New',Consolas,Monaco, 'Liberation Mono'",
      theme: {
        background: '#181d28'
      },
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
  const onResize = throttle(() => fitTerm(), 100);
  useResizeObserver(wrapper, () => {
    onResize();
  });
  const registerTermHandler = () => {
    term.value.onData((data) => {
      if (isWsOpen()) {
        terminalSocket.value.send(data);
      }
    });
    term.value.onKey((e) => {
      if (toRetry.value && e.domEvent.code === 'KeyY') {
        retry();
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
    setWssUrl();
    initWS();
    initTerm();
    registerTermHandler();
    onTerminalResize();
  };

  const debounceCall = _.debounce(() => {
    first.value = true;
    loading.value = true;
    setWssUrl(true);
    initWS();
  }, 100);
  const destoryedTerm = () => {
    removeResizeListener();
    actived.value = false;
    if (terminalSocket.value) terminalSocket.value?.close?.();
  };
  watch(
    () => props.url,
    () => {
      if (!props.url) {
        term.value?.reset?.();
        terminalSocket.value?.close?.();
        terminalSocket.value = {};
      } else {
        term.value?.reset?.();
        debounceCall();
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
  defineExpose({
    destoryedTerm
  });
  onMounted(() => {
    nextTick(() => {
      init();
    });
  });
  onBeforeUnmount(() => {
    destoryedTerm();
  });
</script>

<style lang="less">
  .xterm {
    height: 100%;

    .xterm-viewport {
      overflow-y: auto;
    }
  }
</style>

<style lang="less" scoped>
  #terminal {
    width: 100%;
  }

  .wrap {
    position: relative;
    text-align: left;

    .terminal {
      height: 100%;
      padding: 5px;
      overflow: hidden;
      background-color: #181d28;
      border-radius: 0 0 4px 4px;
    }

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

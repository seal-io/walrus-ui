<template>
  <div ref="terminal"></div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
  import {
    debounce,
    trim,
    split,
    get,
    throttle,
    replace,
    includes
  } from 'lodash';
  import { Terminal } from 'xterm';
  import { FitAddon } from 'xterm-addon-fit';
  import 'xterm/css/xterm.css';

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
  const terminalEnvList = ['bash', 'sh', 'powershell', 'pwsh', 'cmd'];
  const fitAddon = new FitAddon();

  const terminal = ref(null);
  const first = ref(true);
  const loading = ref(true);
  const terminalSocket = ref<any>(null);
  const term = ref<any>(null);
  const command = ref('');

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
  // 是否连接中0 1 2 3
  const isWsOpen = () => {
    const readyState = terminalSocket.value && terminalSocket.value.readyState;
    return readyState === 1;
  };
  // 发送给后端,调整后端终端大小,和前端保持一致,不然前端只是范围变大了,命令还是会换行
  const resizeRemoteTerminal = () => {
    const { cols, rows } = term.value;
    console.log('wss: resize', cols, rows);
    if (isWsOpen()) {
      terminalSocket.value.send(`#{"width":${cols},"height":${rows}}#`);
      // terminalSocket.value.send(
      //   JSON.stringify({
      //     Op: 'resize',
      //     Cols: cols,
      //     Rows: rows
      //   })
      // );
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
    const data = trim(command.value);
    if (isWsOpen()) {
      terminalSocket.value.send(`${data}\r\n`);
      // terminalSocket.value.send(
      //   JSON.stringify({
      //     Op: 'stdin',
      //     Data: `${data}\r\n`
      //   })
      // );
    }
    enterPrompt();
    console.log('wss: commond', data, command.value);
  };
  const onDataCallback = (e) => {
    switch (e) {
      case '\u0003': // Ctrl+C
        term.value.write('^C');
        clearCommand();
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
    // 首次接收消息,发送给后端，进行同步适配
    if (first.value === true) {
      first.value = false;
      resizeRemoteTerminal();
    }
    const data = { Data: message.data };
    console.log('wss: receive', message);
    // const data = JSON.parse(message.data) || '';
    if (term.value.element) term.value.focus();
    const inputCommand = `${command.value}\r\n`;
    const output = data.Data;
    const index = output.indexOf(inputCommand);
    if (index > -1) {
      const str2 = output.substring(index + inputCommand.length);
      term.value.write(setData(`${str2}`));
    } else {
      term.value.write(setData(output));
    }
    setTimeout(() => {
      clearCommand();
    }, 100);
  };

  const errorRealTerminal = (ex) => {
    let { message } = ex;
    if (!message) message = 'disconnected';
    term.value.write(setErrorData(message));
    clearCommand();
    console.log('wss: err', message);
  };
  const closeRealTerminal = (data) => {
    const code = get(data, 'code');
    term.value.write(setData(data.reason));
    clearCommand();
    console.log('wss: close:', data);
  };

  const createWS = () => {
    if (!props.url) return;
    terminalSocket.value = new WebSocket(props.url);
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
    terminalSocket.value.close();
    createWS();
  };

  const initTerm = () => {
    term.value = new Terminal({
      lineHeight: 1.2,
      fontSize: 12,
      fontFamily: "Monaco, Menlo, Consolas, 'Courier New', monospace",
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
    // term.value.write(initData());
    // 不能初始化的时候fit,需要等terminal准备就绪,可以设置延时操作
    setTimeout(() => {
      fitAddon.fit();
    }, 100);
  };

  const fitTerm = () => {
    fitAddon.fit();
    resizeRemoteTerminal();
  };
  const onResize = debounce(() => fitTerm(), 500);

  const termData = () => {
    // 输入与粘贴的情况,onData不能重复绑定,不然会发送多次
    term.value.onData((data) => {
      console.log('wss: data', data, isWsOpen());
      onDataCallback(data);
      // if (isWsOpen()) {
      //   terminalSocket.value.send(
      //     JSON.stringify({
      //       Op: 'stdin',
      //       Data: data
      //     })
      //   );
      // }
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
    termData();
    onTerminalResize();
  };
  // 监听类型变化，重置term
  watch(
    () => props.url,
    () => {
      if (!props.url) return;
      first.value = true;
      loading.value = true;
      initWS();
      // 重置
      term.value.reset();
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
    if (terminalSocket.value) terminalSocket.value.close();
  });
</script>

<style lang="less" scoped>
  #terminal {
    width: 100%;
    height: 100%;
  }
</style>

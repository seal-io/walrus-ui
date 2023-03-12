<template>
  <div ref="terminal"></div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
  import { debounce } from 'lodash';
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
  const fitAddon = new FitAddon();

  const terminal = ref(null);
  const first = ref(true);
  const loading = ref(true);
  const terminalSocket = ref<any>(null);
  const term = ref<any>(null);

  const runRealTerminal = () => {
    loading.value = false;
  };
  // 是否连接中0 1 2 3
  const isWsOpen = () => {
    const readyState = terminalSocket.value && terminalSocket.value.readyState;
    return readyState === 1;
  };
  // 发送给后端,调整后端终端大小,和前端保持一致,不然前端只是范围变大了,命令还是会换行
  const resizeRemoteTerminal = () => {
    const { cols, rows } = term.value;
    if (isWsOpen()) {
      terminalSocket.value.send(
        JSON.stringify({
          Op: 'resize',
          Cols: cols,
          Rows: rows
        })
      );
    }
  };
  const onWSReceive = (message) => {
    // 首次接收消息,发送给后端，进行同步适配
    if (first.value === true) {
      first.value = false;
      resizeRemoteTerminal();
    }
    const data = JSON.parse(message.data);
    if (term.value.element) term.value.focus();
    term.value.write(data.Data);
  };

  const errorRealTerminal = (ex) => {
    let { message } = ex;
    if (!message) message = 'disconnected';
    term.value.write(`\x1b[31m${message}\x1b[m\r\n`);
    console.log('err');
  };
  const closeRealTerminal = () => {
    console.log('close');
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
    }
    if (terminalSocket.value && terminalSocket.value.readyState > 1) {
      terminalSocket.value.close();
      createWS();
    }
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
    // 不能初始化的时候fit,需要等terminal准备就绪,可以设置延时操作
    setTimeout(() => {
      fitAddon.fit();
    }, 5);
  };

  const fitTerm = () => {
    fitAddon.fit();
  };
  const onResize = debounce(() => fitTerm(), 800);

  const termData = () => {
    // 输入与粘贴的情况,onData不能重复绑定,不然会发送多次
    term.value.onData((data) => {
      if (isWsOpen()) {
        terminalSocket.value.send(
          JSON.stringify({
            Op: 'stdin',
            Data: data
          })
        );
      }
    });
  };
  const onTerminalResize = () => {
    window.addEventListener('resize', onResize);
  };
  const removeResizeListener = () => {
    window.removeEventListener('resize', onResize);
  };
  // 监听类型变化，重置term
  watch(
    () => props.type,
    () => {
      first.value = true;
      loading.value = true;
      terminalSocket.value = null;
      initWS();
      // 重置
      term.value.reset();
    }
  );

  onMounted(() => {
    initWS();
    initTerm();
    termData();
    onTerminalResize();
  });
  onBeforeUnmount(() => {
    removeResizeListener();
    if (terminalSocket.value) terminalSocket.value.close();
  });
</script>

<style lang="less" scoped>
  #terminal {
    width: 100%;
    height: 100%;
  }
</style>

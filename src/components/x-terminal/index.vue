<template>
  <div>
    <div id="x-terminal" ref="wrapper" class="x-terminal-wrapper"></div>
  </div>
</template>

<script lang="ts" setup>
  import 'xterm/css/xterm.css';
  import { onMounted, ref, nextTick } from 'vue';
  import { Terminal } from 'xterm';

  const term = new Terminal();
  const wrapper: any = ref();
  const initTerminal = () => {
    const div = document.getElementById('x-terminal') as HTMLElement;
    term?.open(div);
    term.write('\x1B[1;3;31mseal\x1B[0m>$');
    term.onData((val) => {
      term.write(val);
    });
  };
  onMounted(() => {
    nextTick(() => {
      initTerminal();
    });
  });
</script>

<style lang="less">
  .x-terminal-wrapper {
    width: 100%;
    height: 200px;
  }
</style>

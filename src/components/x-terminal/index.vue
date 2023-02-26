<template>
  <div id="terminal" ref="wrapper" class="x-terminal-wrapper"></div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, nextTick } from 'vue';
  import { Terminal } from 'xterm';

  const term = new Terminal();
  const wrapper: any = ref();
  const initTerminal = () => {
    term?.open(wrapper);
    term?.write('Hello world!');
  };
  onMounted(() => {
    nextTick(() => {
      initTerminal();
    });
  });
</script>

<style lang="less" scoped>
  .x-terminal-wrapper {
    height: 200px;
  }
</style>

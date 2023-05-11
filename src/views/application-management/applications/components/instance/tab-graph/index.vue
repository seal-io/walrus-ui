<template>
  <div class="flow-wrapper">
    <VueFlow :default-zoom="4" :max-zoom="4" :min-zoom="0.1" fit-view-on-init>
      <Background></Background>
      <Controls></Controls>
      <template #node-custom>
        <div class="custom-node">
          <Handle id="a" type="source"></Handle>
          <Handle id="b" type="source"></Handle>
        </div>
      </template>
    </VueFlow>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { VueFlow, useVueFlow, Node, Handle } from '@vue-flow/core';
  import { Background } from '@vue-flow/background';
  import { Controls } from '@vue-flow/controls';
  import { initialElements } from './config';

  const elements = ref(initialElements);
  const { onConnect, addEdges, nodes, edges } = useVueFlow({
    maxZoom: 4,
    minZoom: 0.1,
    nodes: elements
  });
</script>

<style lang="less">
  @import url('./style/index.less');

  .flow-wrapper {
    width: 100%;
    height: 400px;
  }
</style>

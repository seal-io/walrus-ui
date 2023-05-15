<template>
  <div class="flow-wrapper">
    <VueFlow
      v-model="elements"
      :default-zoom="4"
      :max-zoom="4"
      :min-zoom="0.1"
      fit-view-on-init
      @node-click="handleNodeClick"
    >
      <Background></Background>
      <Controls></Controls>
      <template #node-custom="data">
        <CustomNode :data="data" @action="handleActionSelect"></CustomNode>
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
  import CustomNode from './components/custom-node.vue';

  const elements = ref(initialElements);
  const { onConnect, addEdges, nodes, edges } = useVueFlow({
    maxZoom: 4,
    minZoom: 0.1
  });

  const handleNodeClick = ({ node }) => {
    console.log('node==click', node);
    node.toolbar.isVisible = true;
  };
  const handleActionSelect = ({ node, action }) => {
    console.log('node===action', { node, action });
    node.toolbar.isVisible = false;
  };
</script>

<style lang="less">
  @import url('./style/index.less');

  .flow-wrapper {
    width: 100%;
    height: 400px;
  }
</style>

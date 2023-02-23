<template>
  <div class="flow-wrapper">
    <VueFlow
      v-model="elements"
      :default-zoom="4"
      :max-zoom="4"
      :min-zoom="0.1"
      fit-view-on-init
    >
      <!-- <Background></Background> -->
      <Controls></Controls>
    </VueFlow>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { VueFlow, useVueFlow } from '@vue-flow/core';
  import { Background } from '@vue-flow/background';
  import { Controls } from '@vue-flow/controls';
  import '@vue-flow/core/dist/style.css';
  import '@vue-flow/core/dist/theme-default.css';
  import '@vue-flow/controls/dist/style.css';
  import { initialElements } from '../config/flow-test';

  const { onConnect, addEdges } = useVueFlow({
    maxZoom: 4,
    minZoom: 0.1
  });
  const elements = ref(initialElements);
</script>

<style lang="less">
  @import url('../config/flow-chart.less');

  .flow-wrapper {
    width: 100%;
    height: 400px;
  }
</style>

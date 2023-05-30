<template>
  <div ref="flowWrapper" class="flow-wrapper">
    <div class="g6-box">
      <GraphG6
        @nodeClick="handleNodeClick"
        @canvasClick="handleCanvasClick"
      ></GraphG6>
    </div>
    <!-- <div class="node-info" :class="{ 'node-active': nodeActive }">
      <div class="title">{{ nodeInfo.name }}</div>
      <div class="content"></div>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { ref, inject, watch } from 'vue';
  import { onClickOutside } from '@vueuse/core';
  import GraphG6 from './components/graph-g6.vue';
  import { queryInstanceResourceGraph } from '../../../api';

  const instanceId = inject('instanceId', ref(''));
  const nodeActive = ref(false);
  const flowWrapper = ref();
  const nodeInfo = ref<any>({});

  onClickOutside(flowWrapper, () => {
    nodeActive.value = false;
  });
  const handleNodeClick = (node) => {
    nodeActive.value = true;
    nodeInfo.value = node;
    console.log('node===', node);
  };
  const handleCanvasClick = () => {
    nodeActive.value = false;
  };
  watch(
    () => instanceId.value,
    () => {
      // getInstanceResourceGraph();
    },
    {
      immediate: true
    }
  );
</script>

<style lang="less" scoped>
  @boxWidth: 300px;
  @boxHeight: 500px;

  .flow-wrapper {
    position: relative;
    display: flex;
    width: 100%;
    height: @boxHeight;

    .g6-box {
      flex: 1;
    }

    .node-info {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 0;
      height: @boxHeight;
      overflow: hidden;
      background-color: #fff;
      border-radius: var(--border-radius-small);
      transition: all 0.3s var(--seal-transition-func);

      &.node-active {
        width: @boxWidth;
        height: @boxHeight;
        border: 1px solid var(--color-border-2);
        transition: all 0.3s var(--seal-transition-func);
      }

      .title {
        width: @boxWidth;
        padding: 8px 10px;
        color: #fff;
        background-color: rgba(var(--arcoblue-6), 0.9);
      }

      .content {
        width: @boxWidth;
        padding: 10px;
      }
    }
  }
</style>

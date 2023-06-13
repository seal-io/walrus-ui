<template>
  <div class="custom-node-wrapper">
    <span
      class="title"
      :class="[setInstanceStatus(_.get(data, 'data.status'))]"
      >{{ _.get(data, 'label') }}</span
    >
    <TooBarNode :data="data" @select="handleActionSelect"></TooBarNode>
    <Handle id="source" type="source" :position="Position.Bottom"></Handle>
    <Handle id="target" type="target" :position="Position.Top"></Handle>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { Handle, Position } from '@vue-flow/core';
  import { setInstanceStatus } from '../../../../config';
  import TooBarNode from './tool-bar-node.vue';

  defineProps({
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  });

  const emits = defineEmits(['action']);
  const handleActionSelect = (obj) => {
    emits('action', obj);
  };
</script>

<style lang="less" scoped>
  .custom-node-wrapper {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    width: 160px;
    height: 60px;
    overflow: hidden;
    font-size: 14px;
    background-color: #fff;
    border: 1px solid var(--color-border-2);
    border-radius: var(--border-radius-small);

    .title {
      width: 100%;
      height: 24px;
      color: #fff;
      line-height: 24px;
      text-align: center;
      background-color: rgba(var(--arcoblue-5), 1);

      &.error {
        background-color: #f53f3f;
      }

      &.warning {
        background-color: #f7ba1e;
      }
    }
  }
</style>

<template>
  <div class="condition-wrap">
    <a-space class="btn-wrap" :size="10">
      <a-button type="primary">
        <icon-plus style="margin-right: 4px" />
        <span>添加策略</span>
      </a-button>
      <a-button type="primary">
        <icon-layers style="margin-right: 4px" />
        <span>添加策略组</span>
      </a-button>
    </a-space>
    <ConditionItem></ConditionItem>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import ConditionItem from './condition-item.vue';

  const operatorList = [
    { label: 'AND', value: 'and' },
    { label: 'OR', value: 'or' }
  ];
</script>

<style lang="less" scoped>
  .condition-wrap {
    .btn-wrap {
      display: flex;
      margin-bottom: 20px;
    }
  }
</style>

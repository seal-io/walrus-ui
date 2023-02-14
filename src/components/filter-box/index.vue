<template>
  <div class="filter-box-wrap">
    <a-space direction="horizontal">
      <slot name="params"></slot>
    </a-space>
    <a-space>
      <slot name="button-group"></slot>
    </a-space>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="less" scoped>
  .filter-box-wrap {
    display: flex;
    justify-content: space-between;
    width: 100%;
    // margin-top: 20px;
    // margin-bottom: 12px;

    // :deep(.arco-select) {
    //   background-color: #fff;
    // }

    // :deep(.arco-input-wrapper) {
    //   background-color: #fff;
    // }
  }
</style>

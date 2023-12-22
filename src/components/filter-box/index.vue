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
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;

    .arco-space {
      height: max-content;
    }
  }
</style>

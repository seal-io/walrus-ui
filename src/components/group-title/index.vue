<template>
  <div
    class="group-title"
    :class="{ 'bordered': bordered, 'is-detail': isDetail }"
  >
    <div class="label"
      ><slot name="title">{{ title }}</slot></div
    >
    <div><slot name="right"></slot></div>
  </div>
</template>

<script lang="ts" setup>
  defineProps({
    title: String,
    bordered: {
      type: Boolean,
      default() {
        return true;
      }
    },
    isDetail: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });
</script>

<style lang="less" scoped>
  .group-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    padding-bottom: 10px;
    font-weight: 400;

    &.bordered {
      font-weight: 400;
      border-bottom: 1px solid var(--seal-border-gray);
    }

    &.is-detail {
      margin-bottom: 10px;
      border-bottom: 1px solid #fff;
    }

    .label {
      color: var(--color-text-2);
      font-weight: 500;
      font-size: 14px;
    }
  }
</style>

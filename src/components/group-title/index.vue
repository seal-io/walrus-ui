<template>
  <div
    class="group-title"
    :class="{ 'bordered': bordered, 'is-detail': isDetail }"
  >
    <div class="label">
      <a-link v-if="showBack" @click="handleBack"
        ><icon-arrow-left style="stroke-width: 5; font-size: 16px"
      /></a-link>
      <a-divider v-if="showBack" direction="vertical"></a-divider>
      <slot name="title">{{ title }}</slot>
    </div>
    <div><slot name="right"></slot></div>
  </div>
</template>

<script lang="ts" setup>
  import useCallCommon from '@/hooks/use-call-common';

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
    },
    showBack: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });
  const { router } = useCallCommon();
  const handleBack = () => {
    router.back();
  };
</script>

<style lang="less" scoped>
  .group-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 25px;
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
      display: flex;
      align-items: center;
      width: 100%;
      color: var(--color-text-2);
      font-weight: 500;
      font-size: 14px;
    }
  }
</style>

<template>
  <div class="header-info" :class="{ 'top-gap': topGap }">
    <div class="left">
      <div class="img">
        <slot name="icon"></slot>
      </div>
    </div>
    <div class="right">
      <slot title>
        <div class="title">{{ info?.name }}</div>
      </slot>
      <slot name="description">
        <div class="desc">{{ info.description }}</div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
  defineProps({
    topGap: {
      type: Boolean,
      default() {
        return false;
      }
    },
    info: {
      type: Object,
      default() {
        return {};
      }
    }
  });
</script>

<style lang="less" scoped>
  .header-info {
    display: flex;
    align-items: center;
    height: 112px;
    padding: 16px;
    background-color: #fff;
    border-radius: var(--border-radius-small);

    &.top-gap {
      margin-top: 10px;
    }

    .left {
      width: 80px;

      .img {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 80px;
        background-color: transparent;

        :deep(.iconfont) {
          color: rgb(var(--arcoblue-5));
          font-size: 56px;
          background-color: transparent;
          // box-shadow: 0 0 16px 2px rgb(var(--arcoblue-4));
          border-radius: 50%;
        }
      }
    }

    .right {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: center;
      padding: 8px 16px;
      line-height: 32px;

      .title {
        font-weight: 500;
        font-size: 16px;
      }
    }
  }
</style>

<template>
  <div class="task-card" :class="{ active: active }">
    <div class="icon">
      <i
        :class="['iconfont ic', dataInfo.icon]"
        :style="{ ...dataInfo.iconStyle }"
      ></i>
    </div>
    <div class="content">
      <div class="title">{{ $t(dataInfo.title) }}</div>
      <div class="desc">{{ $t(dataInfo.description) }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps({
    dataInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    active: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });
</script>

<style lang="less" scoped>
  .task-card {
    display: flex;
    align-items: center;
    width: 180px;
    height: 64px;
    padding: 10px;
    color: var(--color-text-2);
    font-size: 12px;
    background-color: var(--color-white-1);
    .thumbCard();

    &:hover {
      .thumbCardHover();
    }

    &.active {
      .thumbCardActive();
    }

    .content {
      .title {
        font-weight: var(--font-weight-medium);
      }
    }

    .icon {
      margin-right: 10px;

      .ic {
        color: rgb(var(--arcoblue-5));
        font-size: 26px;
        stroke-width: 2px;
      }
    }
  }
</style>

<template>
  <a-space class="chart-btn-wrap" :size="8">
    <i
      class="iconfont icon-chart"
      :class="{ active: active === 'bar' }"
      @click="handleClick('bar')"
    ></i>
    <i
      class="iconfont icon-line_chart"
      :class="{ active: active === 'line' }"
      @click="handleClick('line')"
    ></i>
  </a-space>
</template>

<script lang="ts" setup>
  defineProps({
    active: {
      type: String,
      default() {
        return 'bar';
      }
    }
  });
  const emits = defineEmits(['update:active', 'change']);
  const handleClick = (type) => {
    emits('update:active', type);
    emits('change', type);
  };
</script>

<style lang="less" scoped>
  .chart-btn-wrap {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .arco-icon {
      color: rgb(var(--arcoblue-4));
      font-size: 20px;
      border-radius: var(--border-radius-small);
      .hoverable();

      &:hover {
        color: rgb(var(--arcoblue-6));
        .hoverableHover();
      }
    }

    .arco-icon.active {
      color: rgb(var(--arcoblue-6));
      box-shadow: var(--seal-hoverable-shadow);
    }
  }
</style>

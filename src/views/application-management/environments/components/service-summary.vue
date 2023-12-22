<template>
  <span class="box">
    <a-tooltip
      v-for="(item, index) in dataList"
      :key="index"
      :content="item.label"
    >
      <span class="item" :class="[item.status]">
        <span class="val">
          {{ item.value }}
        </span>
      </span>
    </a-tooltip>
  </span>
</template>

<script lang="ts" setup>
  import { ref, PropType } from 'vue';

  const props = defineProps({
    dataList: {
      type: Array as PropType<any[]>,
      default: () => []
    }
  });
</script>

<style lang="less" scoped>
  .box {
    display: flex;
    align-items: center;
    padding: 0;
    color: rgba(78, 89, 105, 0.8);
    font-weight: 500;
    font-size: 0;
    border-radius: 10px 10px;

    .item {
      display: flex;
      flex-basis: 40px;
      align-items: center;
      justify-content: center;
      padding: 0;
      font-size: 12px;
      line-height: 1.6;
      border-radius: 4px;

      &.error {
        margin-right: 10px;
        background-color: rgba(245, 63, 63, 0.7);
      }

      &.ready {
        background-color: rgba(0, 191, 114, 0.7);
      }

      &.transitioning {
        margin: 0 10px;
        background-color: rgba(247, 186, 30, 0.7);
      }

      &.inactive {
        background-color: rgba(201, 205, 212, 0.9);
      }
    }
  }
</style>

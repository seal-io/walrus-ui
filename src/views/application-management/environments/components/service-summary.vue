<template>
  <span class="box">
    <a-tooltip
      v-for="(item, index) in dataList"
      :key="index"
      :content="item.label"
    >
      <span
        class="item"
        :class="[item.status]"
        :style="{
          backgroundColor: _.get(StatusColorBgMap, [item.status])
        }"
      >
        <span class="val">
          {{ item.value }}
        </span>
      </span>
    </a-tooltip>
  </span>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { ref, PropType } from 'vue';
  import { StatusColorBgMap } from '@/views/config';

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
    color: rgb(255 255 255 / 90%);
    font-weight: 700;
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
      border-radius: var(--border-radius-small);

      &.error {
        margin-right: 10px;
        // background-color: rgba(var(--red-6), 0.7);
      }

      &.ready {
        // background-color: rgba(var(--green-6), 0.7);
      }

      &.transitioning {
        margin: 0 10px;
        // background-color: rgb(251, 222, 55);
      }

      &.inactive {
        // background-color: rgba(var(--gray-4), 0.9);
      }
    }
  }
</style>

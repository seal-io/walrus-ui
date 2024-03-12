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
    color: var(--color-text-white);
    font-weight: 700;
    font-size: 0;
    border-radius: 10px 10px;

    .item {
      display: flex;
      flex-basis: 40px;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
      padding: 0;
      font-size: 12px;
      line-height: 1.6;
      border-radius: var(--border-radius-small);

      &.inactive {
        margin-right: 0;
      }
    }
  }
</style>

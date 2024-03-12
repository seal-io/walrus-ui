<template>
  <span class="box" :class="[{ isDark: appStore.isDark }]">
    <a-tooltip
      v-for="(item, index) in dataList"
      :key="index"
      :content="item.label"
    >
      <span
        class="item"
        :class="[item.status]"
        :style="{
          backgroundColor: appStore.isDark
            ? `rgba(var(${_.get(StatusColorBgMap, [item.status])}),0.6)`
            : `rgba(var(${_.get(StatusColorBgMap, [item.status])}),0.7)`
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
  import { useAppStore } from '@/store';
  import { ref, PropType } from 'vue';
  import { StatusColorBgMap } from '@/views/config';

  const props = defineProps({
    dataList: {
      type: Array as PropType<any[]>,
      default: () => []
    }
  });
  const appStore = useAppStore();
</script>

<style lang="less" scoped>
  .box {
    display: flex;
    align-items: center;
    padding: 0;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 700;
    font-size: 0;
    border-radius: 10px 10px;

    &.isDark {
      color: rgba(255, 255, 255, 0.7);
    }

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

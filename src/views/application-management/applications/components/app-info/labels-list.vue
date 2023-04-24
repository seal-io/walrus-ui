<template>
  <div class="labels-wrap">
    <span
      v-for="(item, index) in labelList"
      :key="index"
      class="label-item"
      :style="{ backgroundColor: bgColor }"
    >
      <AutoTip
        :tooltip-props="{
          content: `${item.key}:${JSON.stringify(item.value)}`
        }"
      >
        <span>
          <span>{{ item.key }}:{{ item.value }}</span>
        </span>
      </AutoTip>
    </span>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { get, keys, map } from 'lodash';

  const props = defineProps({
    labels: {
      type: Object,
      default() {
        return {};
      }
    },
    bgColor: {
      type: String,
      default() {
        return 'rgb(232, 242, 255)';
      }
    }
  });
  const labelList = computed(() => {
    const keysList = map(keys(props.labels), (k) => {
      return {
        key: k,
        value: get(props.labels, k)
      };
    });
    return keysList;
  });
</script>

<style lang="less" scoped>
  .labels-wrap {
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    .label-item {
      display: inline-block;
      max-width: 160px;
      height: 24px;
      margin-top: 4px;
      margin-right: 10px;
      padding: 2px 10px;
      line-height: 20px;
      // text-align: center;
      // text-overflow: ellipsis;
      // overflow: hidden;
      white-space: nowrap;
      background-color: rgba(var(--arcoblue-1), 1);
      // color: var(--color-text-2);
      border-radius: 12px;
    }
  }
</style>

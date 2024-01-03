<template>
  <span class="tag-box" :size="6">
    <span v-for="(item, index) in values" :key="index" class="tag-item">
      <Autotip>
        {{
          isLocale
            ? $t(_.find(list, (s) => s.value === item)?.label)
            : _.find(list, (s) => s.value === item)?.label
        }}
      </Autotip>
    </span>
  </span>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import Autotip from '@arco-design/web-vue/es/_components/auto-tooltip/auto-tooltip';
  import { PropType } from 'vue';

  defineProps({
    values: {
      type: Array as PropType<any[]>,
      default() {
        return [];
      }
    },
    list: {
      type: Array as PropType<any[]>,
      default: () => []
    },
    isLocale: {
      type: Boolean,
      default: false
    }
  });
</script>

<style lang="less" scoped>
  .tag-box {
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    .tag-item {
      display: flex;
      justify-content: center;
      min-width: 32px;
      max-width: 100px;
      margin-top: 5px;
      margin-right: 6px;
      padding: 4px 6px;
      line-height: 1.1;
      background-color: var(--color-fill-1);
      border: 1px solid var(--color-fill-1);
      border-radius: 12px;
    }
  }
</style>

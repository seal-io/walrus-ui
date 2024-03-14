<template>
  <a-space :size="20" class="tabs" fill>
    <span
      v-for="item in tabs"
      :key="item.key"
      class="item"
      :class="{ active: item.key === activeKey }"
    >
      <span @click="handleTabChange(item)">
        {{ item.label && $t(item.label) }}
      </span>
    </span>
  </a-space>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';

  interface TabItem {
    label: string;
    key: string;
  }
  defineProps({
    activeKey: {
      type: String,
      default: ''
    },
    tabs: {
      type: Array as PropType<TabItem[]>,
      default: () => []
    }
  });

  const emits = defineEmits(['change', 'update:activeKey']);
  const handleTabChange = (item) => {
    emits('change', item.key);
    emits('update:activeKey', item.key);
  };
</script>

<style lang="less" scoped>
  .tabs {
    padding: 8px 0;

    .item {
      position: relative;
      padding: 0 4px;
      line-height: 1.5;
      border-radius: var(--border-radius-small);
      cursor: pointer;

      &:hover {
        background-color: var(--color-fill-2);
      }

      &.active::after {
        position: absolute;
        right: 0;
        bottom: -8px;
        left: 0;
        height: 2px;
        background-color: rgb(var(--primary-6));
        content: '';
      }
    }

    border-bottom: 1px solid var(--color-border-2);
  }
</style>

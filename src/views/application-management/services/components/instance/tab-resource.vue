<template>
  <div>
    <a-space class="title">
      <icon-font
        type="icon-table"
        :class="{ active: activeKey === 'list' }"
        @click="handleToggle('list')"
      />
      <icon-font
        type="icon-a-relation3-line"
        :class="{ active: activeKey === 'graph' }"
        @click="handleToggle('graph')"
      />
    </a-space>
    <a-tabs v-model:active-key="activeKey" :default-active-key="activeKey">
      <a-tab-pane key="list">
        <ServiceResources
          :resource-list="resourceList"
          :is-loading="isLoading"
        ></ServiceResources>
      </a-tab-pane>
      <a-tab-pane key="graph">
        <TabGraph></TabGraph>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
  import { ref, PropType } from 'vue';
  import ServiceResources from './service-resources.vue';
  import TabGraph from './tab-graph/index.vue';
  import { ServiceResource } from '../../config/interface';

  const props = defineProps({
    resourceList: {
      type: Array as PropType<ServiceResource[]>,
      default() {
        return [];
      }
    },
    isLoading: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });
  const activeKey = ref('list');

  const handleToggle = (val) => {
    activeKey.value = val;
  };
</script>

<style lang="less" scoped>
  .title {
    display: flex;
    align-items: center;
    padding: 2px 0 15px 2px;

    :deep(.arco-icon) {
      margin-right: 6px;
      color: var(--color-text-2);
      font-size: 20px;
      border-radius: 4px;
      cursor: pointer;
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

  :deep(.arco-tabs-nav-tab) {
    display: none;
  }

  :deep(.arco-tabs-content) {
    padding-top: 0;
  }
</style>

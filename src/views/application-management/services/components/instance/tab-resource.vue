<template>
  <div>
    <a-tabs
      v-model:active-key="activeKey"
      :default-active-key="activeKey"
      lazy-load
      class="tab-resource"
    >
      <a-tab-pane key="list">
        <ServiceResources :resource-list="resourceList" :is-loading="isLoading">
          <template #right>
            <IconBtnGroup
              v-model:active="activeKey"
              :icon-list="iconList"
              @change="handleToggle"
            ></IconBtnGroup>
          </template>
        </ServiceResources>
      </a-tab-pane>
      <a-tab-pane key="graph">
        <div>
          <div
            v-show="activeKey === 'graph'"
            class="flex"
            style="justify-content: flex-end; margin-bottom: 20px; padding: 0"
          >
            <IconBtnGroup
              v-model:active="activeKey"
              :icon-list="iconList"
              @change="handleToggle"
            ></IconBtnGroup>
          </div>

          <TabGraph ref="graph"></TabGraph>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
  import { ref, PropType } from 'vue';
  import { emitCloseControlPanel } from '@/views/application-management/services/hooks/use-close-control-panel';
  import IconBtnGroup from '@/components/icon-btn-group/index.vue';
  import ServiceResources from './service-resources.vue';
  import TabGraph from './tab-graph/index.vue';
  import { ServiceResource } from '../../config/interface';

  const iconList = [
    {
      icon: 'icon-table',
      view: 'list',
      iconfont: true
    },
    {
      icon: 'icon-a-relation3-line',
      view: 'graph',
      iconfont: true
    }
  ];
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
  const graph = ref();

  const handleToggle = (val) => {
    activeKey.value = val;
    if (val === 'graph') {
      graph.value?.handleRefresh();
    }
    emitCloseControlPanel();
  };
</script>

<style lang="less" scoped>
  .title {
    display: flex;
    align-items: center;

    :deep(.arco-icon) {
      margin-right: 6px;
      padding: 4px 16px;
      color: var(--color-text-2);
      font-size: 20px;
      border-radius: 6px;
      cursor: pointer;

      &:hover {
        background-color: var(--color-fill-1);
      }

      &.active {
        background-color: var(--color-fill-1);
      }
    }

    .arco-icon.active {
      color: rgb(var(--arcoblue-6));
      background-color: var(--color-fill-1);
    }
  }

  :deep(.arco-tabs) {
    &.tab-resource {
      > .arco-tabs-nav > .arco-tabs-nav-tab {
        display: none;
      }

      > .arco-tabs-content {
        padding-top: 0;
      }
    }
  }
</style>

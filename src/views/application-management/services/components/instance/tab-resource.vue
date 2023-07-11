<template>
  <div>
    <a-tabs
      v-model:active-key="activeKey"
      :default-active-key="activeKey"
      class="tab-resource"
    >
      <a-tab-pane key="list">
        <ServiceResources :resource-list="resourceList" :is-loading="isLoading">
          <template #right>
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
          </template>
        </ServiceResources>
      </a-tab-pane>
      <a-tab-pane key="graph">
        <div>
          <a-space
            v-if="activeKey === 'graph'"
            class="title"
            style="
              justify-content: flex-end;
              margin-bottom: 10px;
              padding: 6px 0;
            "
          >
            <icon-font type="icon-table" @click="handleToggle('list')" />
            <icon-font
              type="icon-a-relation3-line"
              :class="{ active: activeKey === 'graph' }"
              @click="handleToggle('graph')"
            />
          </a-space>
          <TabGraph ref="graph"></TabGraph>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
  import { ref, PropType } from 'vue';
  import { emitCloseControlPanel } from '@/views/application-management/services/hooks/use-close-control-panel';
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

  :deep(.arco-tabs) {
    &.tab-resource {
      > .arco-tabs-nav > .arco-tabs-nav-tab {
        display: none;
      }
    }
  }

  :deep(.arco-tabs-content) {
    padding-top: 0;
  }
</style>

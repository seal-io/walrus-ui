<template>
  <slTransition>
    <resizeContainer
      v-if="visible"
      v-show="visible"
      :act-edges="{ top: true }"
      class="operation-control"
      @change="handleHeightChange"
    >
      <a-tabs
        v-model:active-key="activeKey"
        type="card-gutter"
        lazy-load
        :editable="true"
        @delete="handleDelete"
      >
        <a-tab-pane v-for="item in tabs" :key="item.tabName" :title="item.name">
          <template #title>
            <div style="width: 150px"
              ><AutoTip :tooltip-props="{ content: item.name }">
                <i
                  v-if="item.tabType === drawerType.LOGS"
                  class="iconfont icon-rizhi font-16 m-r-4"
                ></i>

                <i
                  v-if="item.tabType === drawerType.TERMINAL"
                  class="size-14 iconfont icon-terminal m-r-4"
                ></i>
                <span>{{ item.name }}</span>
              </AutoTip></div
            >
          </template>
          <tabTerminal
            v-if="item.tabType === drawerType.TERMINAL"
            :container-id="item.tabName"
            :height="containerHeight"
            :node-info="item.nodeInfo"
            :data-list="item.dataList"
          ></tabTerminal>
          <tabLogs
            v-if="item.tabType === drawerType.LOGS"
            :container-id="item.tabName"
            :data-list="item.dataList"
            :node-info="item.nodeInfo"
            :height="containerHeight"
          ></tabLogs>
        </a-tab-pane>
        <template #extra>
          <a-button
            size="mini"
            type="text"
            shape="circle"
            class="m-r-8"
            style="color: var(--color-text-1)"
            @click="handleClose"
            ><icon-close
          /></a-button>
        </template>
      </a-tabs>
    </resizeContainer>
  </slTransition>
</template>

<script lang="ts" setup>
  import _, { min, wrap } from 'lodash';
  import {
    PropType,
    ref,
    watch,
    nextTick,
    onMounted,
    onBeforeUnmount
  } from 'vue';
  import resizeContainer from '@/components/resizeable-container/index.vue';
  import slTransition from '@/components/sl-transition/index.vue';
  import { listenerCloseControlPanel } from '../../hooks/use-close-control-panel';
  import tabTerminal from './x-terminal/tab-terminal.vue';
  import tabLogs from './tab-logs.vue';
  import { ResourceKey } from '../../config/interface';

  const props = defineProps({
    containerId: {
      type: String,
      default() {
        return '';
      }
    },
    type: {
      type: String,
      default() {
        return 'terminal';
      }
    },
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    updateActive: {
      type: String,
      default() {
        return '';
      }
    },
    tabs: {
      type: Array as PropType<
        {
          dataList: ResourceKey[];
          name: string;
          id: string;
          tabName: string;
          tabId: string;
          tabType: string;
          nodeInfo: object;
        }[]
      >,
      default() {
        return [];
      }
    }
  });
  const drawerType = {
    TERMINAL: 'terminal',
    LOGS: 'logs'
  };
  const activeKey = ref<string>('terminnal');
  const containerHeight = ref(270);
  const emits = defineEmits(['update:visible', 'update:tabs', 'delete']);

  const handleHeightChange = ({ height }) => {
    containerHeight.value = height - 120;
  };

  const handleClose = () => {
    emits('update:visible', false);
    emits('update:tabs', []);
  };
  const handleOpened = () => {
    activeKey.value = _.get(props.tabs, '0.tabName') || `${Date.now()}`;
  };
  const handleDelete = (key) => {
    emits('delete', key);
    nextTick(() => {
      if (activeKey.value === key) {
        activeKey.value = _.get(props.tabs, '0.tabName') || `${Date.now()}`;
      }
    });
  };

  watch(
    () => props.visible,
    (val) => {
      nextTick(() => {
        if (val) {
          document.body.style.overflow = 'auto';
          document.body.style.paddingBottom = '360px';
          document.body.style.height = 'max-content';
        } else {
          document.body.style.overflow = 'auto';
          document.body.style.paddingBottom = '0px';
        }
      });
    },
    {
      immediate: true
    }
  );
  watch(
    () => props.updateActive,
    (val) => {
      if (val) {
        activeKey.value = val;
      }
    }
  );
  listenerCloseControlPanel(() => {
    setTimeout(() => {
      document.body.style.overflow = 'auto';
      document.body.style.paddingBottom = '0px';
    }, 50);
  });
  onMounted(() => {
    handleOpened();
    window.addEventListener('resize', () => {
      const wrapper: HTMLElement | null =
        document.querySelector('.operation-control');
      if (wrapper) {
        wrapper.style.width = '100%';
      }
    });
  });
  // remove event listener
  onBeforeUnmount(() => {
    window.removeEventListener('resize', () => {
      const wrapper: HTMLElement | null =
        document.querySelector('.operation-control');
      if (wrapper) {
        wrapper.style.width = '100%';
      }
    });
  });
</script>

<style lang="less" scoped>
  .operation-control {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 3000;
    overflow: hidden;
    background-color: var(--color-white);
    border: 1px solid var(--color-border-2);
    border-radius: var(--border-radius-small) var(--border-radius-small) 0 0;

    :deep(.arco-tabs) {
      .arco-tabs-nav {
        background-color: var(--color-control-bg);

        &::before {
          background-color: var(--color-control-bg);
        }
      }

      .arco-tabs-content {
        background-color: var(--color-white);
      }

      .arco-tabs-tab {
        margin-right: 5px;
        border-top: 0 solid transparent;

        &:hover {
          background-color: var(--color-white);
        }
      }

      .arco-tabs-tab-active {
        background-color: var(--color-white);
      }
    }
  }
</style>

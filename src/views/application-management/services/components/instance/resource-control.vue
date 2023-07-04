<template>
  <a-drawer
    :height="380"
    :drawer-style="{
      border: '1px solid var(--color-border-2)'
    }"
    class="terminal-control"
    style="top: 100%"
    :bordered="true"
    placement="bottom"
    :mask-closable="false"
    :visible="visible"
    :closable="false"
    :header="false"
    :footer="false"
    :hide-cancel="true"
    :render-to-body="true"
    :mask="false"
    draggable
    unmount-on-close
    @ok="handleClose"
    @open="handleOpened"
  >
    <a-tabs
      v-model:active-key="activeKey"
      type="card-gutter"
      lazy-load
      :editable="true"
      @delete="handleDelete"
    >
      <a-tab-pane v-for="item in tabs" :key="item.name" :title="item.name">
        <template #title>
          <div style="width: auto"
            ><AutoTip :tooltip-props="{ content: item.name }">
              <span>{{ item.name }}</span>
            </AutoTip></div
          >
        </template>
        <tabTerminal
          v-if="type === 'terminal'"
          :data-list="item.dataList"
        ></tabTerminal>
        <tabLogs v-if="type === 'logs'" :data-list="item.dataList"></tabLogs>
      </a-tab-pane>
      <template #extra>
        <a-button size="mini" type="text" @click="handleClose"
          ><icon-close
        /></a-button>
      </template>
    </a-tabs>
  </a-drawer>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { PropType, ref, watch, nextTick } from 'vue';
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
    tabs: {
      type: Array as PropType<
        { dataList: ResourceKey[]; name: string; id: string }[]
      >,
      default() {
        return [];
      }
    }
  });
  const activeKey = ref('terminnal');
  const emits = defineEmits(['update:visible', 'update:tabs', 'delete']);

  const getContainer = () => {
    return document.getElementById('footer');
  };
  const handleClose = () => {
    emits('update:visible', false);
    emits('update:tabs', []);
  };
  const handleOpened = () => {
    activeKey.value = _.get(props.tabs, '0.name');
  };
  const handleDelete = (key) => {
    emits('delete', key);
    nextTick(() => {
      if (activeKey.value === key) {
        activeKey.value = _.get(props.tabs, '0.name');
      }
    });
  };
  watch(
    () => props.visible,
    (val) => {
      nextTick(() => {
        if (val) {
          document.body.style.overflow = 'auto';
          document.body.style.paddingBottom = '380px';
          document.body.style.height = 'max-content';
        } else {
          document.body.style.overflow = 'auto';
          document.body.style.paddingBottom = '0px';
        }
      });
    }
  );
</script>

<style lang="less">
  .terminal-control.arco-drawer-container {
    .arco-drawer-container {
      top: 100% !important;
    }

    .arco-drawer-body {
      padding: 0;
    }
  }

  .arco-drawer-container {
    &.terminal-control {
      .arco-tabs {
        .arco-tabs-tab {
          border-top: 0 solid transparent;
        }
        // .arco-tabs-tab-active {
        //   border-top: 2px solid var(--sealblue-6);
        // }
      }
    }
  }
</style>

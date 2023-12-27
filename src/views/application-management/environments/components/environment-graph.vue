<template>
  <div ref="flowWrapper" class="flow-wrapper">
    <div class="g6-box">
      <a-spin
        :loading="loading"
        style="width: 100%; backgroundcolor: var(--color-fill-2)"
      >
        <GraphG6
          ref="graph"
          :is-fullscreen="isFullscreen || windownFullScreen"
          :source-data="resultData"
          :show-all="showAll"
          page-type="environment"
          :container-height="containerHeight"
          @nodeClick="handleNodeClick"
          @canvasClick="handleCanvasClick"
        >
          <template #toolbar>
            <a-space class="toolbar" :size="12">
              <a-tooltip
                :content="$t('applications.environment.graph.fitview')"
              >
                <span
                  class="iconfont icon-fit_screen-o icon"
                  @click="handleFitView"
                ></span>
              </a-tooltip>
              <a-tooltip :content="$t('common.button.refresh')">
                <span @click="handleRefresh"> <icon-sync class="icon" /> </span>
              </a-tooltip>
              <a-tooltip
                :content="
                  isFullscreen
                    ? $t('applications.environment.graph.cancelfullscreen')
                    : $t('applications.environment.graph.fullscreen')
                "
              >
                <span
                  class="icon iconfont"
                  :class="{
                    'icon-fullscreen': !isFullscreen,
                    'icon-fullscreen-exit': isFullscreen
                  }"
                  @click="handleToggleFullScreen"
                ></span>
              </a-tooltip>
              <a-tooltip
                :content="
                  showAll
                    ? $t('applications.environment.graph.hide')
                    : $t('applications.environment.graph.show')
                "
              >
                <span
                  class="icon iconfont"
                  :class="{
                    'icon-node_multiple_outlined': !showAll,
                    'icon-node_outlined': showAll
                  }"
                  @click="handleToggleShow"
                ></span>
              </a-tooltip>
            </a-space>
          </template>
        </GraphG6>
      </a-spin>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue';
  import { onClickOutside, useFullscreen } from '@vueuse/core';
  import useCallCommon from '@/hooks/use-call-common';
  import GraphG6 from '../../services/components/instance/tab-graph/components/graph-g6.vue';
  import {
    INode,
    IEdge
  } from '../../services/components/instance/tab-graph/config/interface';
  import { queryEnvironmentServiceGraph } from '../../services/api';

  const minHeight = 'calc(100vh - 266px)';
  const { route } = useCallCommon();
  const containerHeight = ref(minHeight);
  const nodeActive = ref(false);
  const loading = ref(false);
  const showAll = ref(false);
  const windownFullScreen = ref(false);
  const flowWrapper = ref();
  const nodeInfo = ref<any>({});
  const graph = ref();
  const { document } = window;
  const resultData = ref<{ links: IEdge[]; nodes: any[] }>({
    links: [],
    nodes: []
  });
  const { isFullscreen, toggle } = useFullscreen(flowWrapper);
  onClickOutside(flowWrapper, () => {
    nodeActive.value = false;
  });
  const handleNodeClick = (node) => {
    nodeActive.value = true;
    nodeInfo.value = node;
  };
  const handleCanvasClick = () => {
    nodeActive.value = false;
  };

  const getServiceGraph = async () => {
    try {
      loading.value = true;
      const { data } = await queryEnvironmentServiceGraph();
      resultData.value.links = _.map(data.edges, (item) => {
        return {
          edgeType: item.type,
          source: `${_.get(item, 'start.kind')}-${_.get(item, 'start.id')}`,
          target: `${_.get(item, 'end.kind')}-${_.get(item, 'end.id')}`
        };
      });
      resultData.value.nodes = _.map(data.vertices, (item) => {
        return {
          ...item,
          nodeId: _.get(item, 'id'),
          id: `${_.get(item, 'kind')}-${_.get(item, 'id')}`
        };
      });
      loading.value = false;
    } catch (error) {
      resultData.value.links = [];
      resultData.value.nodes = [];
      loading.value = false;
    }
  };
  const handleRefresh = () => {
    getServiceGraph();
  };
  const handleFitView = () => {
    graph.value?.fitView();
  };
  const handleToggleFullScreen = () => {
    toggle();
  };
  const handleToggleShow = () => {
    showAll.value = !showAll.value;
    graph.value?.toggleAllNodeShow(showAll.value);
  };
  const isBrowserFullscreen = () => {
    return (
      document.body.scrollHeight === window.screen.height &&
      document.body.scrollWidth === window.screen.width
    );
  };
  const resizeDebounce = _.debounce(() => {
    windownFullScreen.value = false;
  }, 50);
  const resizeThrrolte = _.throttle(() => {
    windownFullScreen.value = isBrowserFullscreen();
    if (windownFullScreen.value) {
      containerHeight.value = minHeight;
    }
    nextTick(() => {
      windownFullScreen.value = false;
    });
  }, 400);
  defineExpose({
    handleRefresh
  });
  onMounted(() => {
    getServiceGraph();

    nextTick(() => {
      window.addEventListener('resize', resizeThrrolte, false);
    });
  });
  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeThrrolte, false);
  });
</script>

<style lang="less" scoped>
  @boxWidth: 300px;
  @boxHeight: 400px;

  .flow-wrapper {
    position: relative;
    display: flex;
    width: 100%;
    // height: @boxHeight;
    .g6-box {
      flex: 1;
    }

    .toolbar {
      padding: 5px 6px;

      .icon {
        font-size: 16px;
        cursor: pointer;
        transition: all 0.3s var(--seal-transition-func);

        &:hover {
          color: rgb(var(--arcoblue-5));
          transform: scale(1.1);
          transition: all 0.3s var(--seal-transition-func);
        }
      }
    }

    .node-info {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 0;
      height: @boxHeight;
      overflow: hidden;
      background-color: #fff;
      border-radius: var(--border-radius-small);
      transition: all 0.3s var(--seal-transition-func);

      &.node-active {
        width: @boxWidth;
        height: @boxHeight;
        border: 1px solid var(--color-border-2);
        transition: all 0.3s var(--seal-transition-func);
      }

      .title {
        width: @boxWidth;
        padding: 8px 10px;
        color: #fff;
        background-color: rgba(var(--arcoblue-6), 0.9);
      }

      .content {
        width: @boxWidth;
        padding: 10px;
      }
    }
  }
</style>

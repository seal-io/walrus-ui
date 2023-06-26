<template>
  <div ref="flowWrapper" class="flow-wrapper">
    <div class="g6-box">
      <a-spin
        :loading="loading"
        style="width: 100%; backgroundcolor: var(--color-fill-2)"
      >
        <GraphG6
          ref="graph"
          :source-data="resultData"
          @nodeClick="handleNodeClick"
          @canvasClick="handleCanvasClick"
        >
          <template #toolbar>
            <a-space class="toolbar" :size="12"
              ><span
                class="iconfont icon-fit_screen-o icon"
                @click="handleFitView"
              ></span>
              <span @click="handleRefresh"> <icon-sync class="icon" /> </span
            ></a-space>
          </template>
        </GraphG6>
      </a-spin>
    </div>
    <!-- <div class="node-info" :class="{ 'node-active': nodeActive }">
      <div class="title">{{ nodeInfo.name }}</div>
      <div class="content"></div>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { ref, onMounted } from 'vue';
  import { onClickOutside } from '@vueuse/core';
  import useCallCommon from '@/hooks/use-call-common';
  import GraphG6 from '../../services/components/instance/tab-graph/components/graph-g6.vue';
  import {
    INode,
    IEdge
  } from '../../services/components/instance/tab-graph/config/interface';
  import { queryServiceGraph } from '../../services/api';

  const { route } = useCallCommon();
  const nodeActive = ref(false);
  const loading = ref(false);
  const flowWrapper = ref();
  const nodeInfo = ref<any>({});
  const graph = ref();
  const resultData = ref<{ links: IEdge[]; nodes: any[] }>({
    links: [],
    nodes: []
  });

  onClickOutside(flowWrapper, () => {
    nodeActive.value = false;
  });
  const handleNodeClick = (node) => {
    nodeActive.value = true;
    nodeInfo.value = node;
    console.log('node===', node);
  };
  const handleCanvasClick = () => {
    nodeActive.value = false;
  };

  const getServiceGraph = async () => {
    try {
      loading.value = true;
      const params = {
        environmentID: route.params.environmentId as string,
        projectID: route.params.projectId as string
      };
      const { data } = await queryServiceGraph(params);
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
          id: `${_.get(item, 'kind')}-${_.get(item, 'id')}`
        };
      });
      loading.value = false;
    } catch (error) {
      resultData.value.links = [];
      resultData.value.nodes = [];
      console.log(error);
      loading.value = false;
    }
  };
  const handleRefresh = () => {
    getServiceGraph();
  };
  const handleFitView = () => {
    graph.value?.fitView();
  };
  onMounted(() => {
    getServiceGraph();
  });
</script>

<style lang="less" scoped>
  @boxWidth: 300px;
  @boxHeight: 400px;

  .flow-wrapper {
    position: relative;
    display: flex;
    width: 100%;
    height: @boxHeight;

    .g6-box {
      flex: 1;
    }

    .toolbar {
      padding: 5px 6px;

      .icon {
        font-size: 18px;
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
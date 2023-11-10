<template>
  <div class="wrapper">
    <a-spin style="width: 100%" :loading="loading">
      <div
        ref="graphWrapper"
        class="graphWrapper"
        :style="{
          height: `max(${containerHeight},600px)`,
          width: '100%'
        }"
      >
        <div ref="container" style="width: 100%; height: 100%"> </div>
      </div>
    </a-spin>
    <LogsPanel
      v-model:visible="showLogModal"
      v-model:tabs="logTabs"
      v-model:update-active="updateActive"
      type="logs"
      @delete="handleDeleteLogTab"
    >
    </LogsPanel>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { websocketEventType } from '@/views/config';
  import { useSetChunkRequest } from '@/api/axios-chunk-request';
  import useCallCommon from '@/hooks/use-call-common';
  import { PROJECT } from '@/router/config';
  import { ref, onMounted, nextTick, computed, watch, provide } from 'vue';
  import { Graph, Node, Edge, Platform } from '@antv/x6';
  import '@antv/x6-vue-shape';
  import { useResizeObserver } from '@vueuse/core';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import { querySubjects } from '@/views/system/api/users';
  import { queryItemServiceDetail } from '@/views/application-management/services/api';
  import toolBar from './tool-bar.vue';
  import { setPipelineNodeStyle } from '../custom/style';
  import {
    NodeSize,
    PipelineNodeSize,
    tools,
    CustomShape,
    WorkflowStatus
  } from '../config';
  import { defineCustomNode } from '../custom/node';
  import { defineConnector } from '../custom/edge';
  import LogsPanel from './logs-panel.vue';
  import {
    queryPipelineRecordDetail,
    getPipelineTaskLogUrl,
    getPipelineTaskDetail,
    queryPipelineLatestRecordDetail,
    approvePipelineTask,
    PROJECT_API_PREFIX,
    PIPELINE_API,
    PIPELINE_EXECUTION_API
  } from '../api';

  const props = defineProps({
    containerHeight: {
      type: String,
      default: '100%'
    },
    showLatest: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });
  setPipelineNodeStyle(PipelineNodeSize);

  const DX2 = 30;
  const DY = PipelineNodeSize.height + 40;
  const DX = PipelineNodeSize.width + 2 * DX2;
  let chunkRequestToken: any = null;
  const { setChunkRequest } = useSetChunkRequest();
  const { route, router } = useCallCommon();
  let graphIns: any = null;
  const showLogModal = ref(false);
  const updateActive = ref('');
  const logTabs = ref<any[]>([]);
  const container = ref();
  const graphWrapper = ref();
  const width = ref(0);
  const height = ref(0);
  const loading = ref(false);
  const flowId = route.params.flowId as string;
  const execId = route.query.execId as string;
  const lastestExecId = ref('');
  const subjectList = ref<{ id: string; name: string }[]>([]);

  const handleDeleteLogTab = (key) => {
    const index = _.findIndex(logTabs.value, (item) => item.id === key);
    logTabs.value.splice(index, 1);
    if (logTabs.value.length === 0) {
      showLogModal.value = false;
    }
  };

  const getPipelineLatestDetail = async () => {
    if (!flowId) return null;
    try {
      const { data } = await queryPipelineLatestRecordDetail({ flowId });
      lastestExecId.value = data?.id || '';
      return data;
    } catch (error) {
      // eslint-disable-next-line no-console
    }
    return null;
  };
  const getPipelineDetail = async () => {
    if (!flowId || !execId) return null;
    try {
      const { data } = await queryPipelineRecordDetail({ flowId, execId });
      return data;
    } catch (error) {
      // eslint-disable-next-line no-console
    }
    return null;
  };

  const handleApprovePipelineTask = async (nodeData, comment) => {
    try {
      const {
        project: { id: projectId },
        workflowID: flowId,
        workflowExecutionID: flowExecId,
        stageExecution: { id: stageExecId },
        id: stepExecId
      } = nodeData || {};
      await approvePipelineTask(
        {
          projectId,
          flowId,
          flowExecId,
          stageExecId,
          stepExecId
        },
        comment
      );
      execSucceed();
    } catch (error) {
      // ingore
    }
  };
  const getDetailData = async () => {
    if (props.showLatest) return getPipelineLatestDetail();
    return getPipelineDetail();
  };
  useResizeObserver(graphWrapper, (entries) => {
    const entry = entries[0];
    const { width: boxWidth, height: boxHeight } = entry.contentRect;
    width.value = boxWidth;
    height.value = boxHeight < 600 ? 600 : boxHeight;
    if (boxHeight < 600) {
      graphWrapper.value.style.height = '600px';
    }
    if (!width.value || !height.value) return;
    graphIns?.resize(width.value, height.value);
  });
  const initNodes = (list: any[]) => {
    const nodes: Node.Metadata[] = [];
    const edges: Edge.Metadata[] = [];
    _.each(list, (item, index: number) => {
      const steps = item.steps || [];
      const nextStage = _.get(list, `${index + 1}`) || {};
      const nextStageSteps = nextStage.steps || [];
      const nextStageStepsFirstChild = _.get(nextStageSteps, `0`);
      nodes.push({
        shape: CustomShape.separatorNode,
        x: DX * index - DX2,
        y: 0
      });
      _.each(steps, (sItem, sIndex: number) => {
        nodes.push({
          ...sItem,
          parent: item.id,
          shape: CustomShape.pipelineNode,
          x: DX * index,
          y: DY * sIndex,
          ports: [
            { id: `${sItem.id}-in`, group: 'in' },
            { id: `${sItem.id}-out`, group: 'out' }
          ],
          data: {
            ...sItem,
            stepPosition: sIndex,
            stageName: item.name,
            nextStageId: _.get(nextStage, `id`) || ''
          }
        });
        if (nextStageStepsFirstChild && sIndex === 0) {
          edges.push({
            id: `${sItem.id}-${_.get(nextStageStepsFirstChild, `id`)}`,
            source: {
              cell: sItem.id,
              port: `${sItem.id}-out`
            },
            target: {
              cell: nextStageStepsFirstChild?.id,
              port: `${nextStageStepsFirstChild?.id}-in`
            },
            shape: CustomShape.pipelineEdge,
            zIndex: -1,
            data: {
              source: sItem.name,
              target: nextStageStepsFirstChild?.name
            }
          });
        }
      });
    });
    return {
      nodes,
      edges
    };
  };

  const createGraph = () => {
    graphIns = new Graph({
      container: container.value,
      width: width.value || 1400,
      height: height.value || 600,
      panning: {
        enabled: true,
        eventTypes: ['leftMouseDown']
      },
      background: {
        color: '#f3f6fa'
      },
      grid: {
        visible: false
      },
      mousewheel: {
        enabled: true,
        modifiers: 'ctrl',
        factor: 1.1,
        maxScale: 2,
        minScale: 0.5
      },
      highlighting: {
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#fff',
              stroke: '#31d0c6',
              strokeWidth: 4
            }
          }
        }
      },
      interacting: {
        nodeMovable: false,
        magnetConnectable: false
      },
      connecting: {
        snap: false,
        allowBlank: false,
        allowLoop: false,
        highlight: true,
        sourceAnchor: {
          name: 'left',
          args: {
            dx: Platform.IS_SAFARI ? 4 : 8
          }
        },
        targetAnchor: {
          name: 'right',
          args: {
            dx: Platform.IS_SAFARI ? 4 : -8
          }
        },
        createEdge() {
          return graphIns?.createEdge({
            shape: CustomShape.pipelineEdge,
            attrs: {
              line: {
                strokeDasharray: '5 5'
              }
            },
            zIndex: -1
          });
        }
      }
    });
  };

  const fitPosition = () => {
    graphIns?.positionPoint({ x: 0, y: 0 }, 50, 50);
    graphIns?.zoomTo(1);
  };

  const initData = async () => {
    loading.value = true;
    const data = await getDetailData();
    const stages = data?.stages || [];
    const result = initNodes(stages);
    graphIns.fromJSON(result);
    loading.value = false;
  };

  const initEvent = () => {
    graphIns?.on('node:logs', async ({ view, e }) => {
      e.stopPropagation();
      const nodeData = view.cell.getData?.();
      if (_.find(logTabs.value, (item) => item.id === nodeData.id)) {
        updateActive.value = nodeData.id;
        showLogModal.value = true;
        return;
      }
      const {
        project: { id: projectId },
        workflowID: flowId,
        workflowExecutionID: flowExecId,
        stageExecution: { id: stageExecId },
        id: stepExecId
      } = nodeData || {};
      if (WorkflowStatus.Running === nodeData?.status?.summaryStatus) {
        logTabs.value.push({
          content: '',
          url: getPipelineTaskLogUrl({
            projectId,
            flowId,
            flowExecId,
            stageExecId,
            stepExecId
          }),
          name: `${nodeData.stageName}/${nodeData.name}`,
          id: nodeData.id
        });
      }

      if (
        [WorkflowStatus.Completed, WorkflowStatus.Failed].includes(
          nodeData?.status?.summaryStatus
        )
      ) {
        loading.value = true;
        const { data } = await getPipelineTaskDetail({
          projectId,
          flowId,
          flowExecId,
          stageExecId,
          stepExecId
        });
        logTabs.value.push({
          url: '',
          content: data?.record || '',
          name: `${nodeData.stageName}/${nodeData.name}`,
          id: nodeData.id
        });
      }

      updateActive.value = nodeData.id;
      loading.value = false;

      setTimeout(() => {
        showLogModal.value = true;
      }, 100);
    });

    graphIns?.on('node:approve', ({ view, e }) => {
      e.stopPropagation();
      const nodeData = view.cell.getData?.();
      deleteModal({
        okText: 'common.button.approval',
        cancelText: 'common.button.reject',
        title: 'workflow.stage.approve',
        maskClosable: true,
        onOk: async () => {
          await handleApprovePipelineTask(nodeData, {
            approved: true
          });
          await initData();
        },
        onCancel: async () => {
          await handleApprovePipelineTask(nodeData, {
            approved: false
          });
          await initData();
        }
      });
    });

    graphIns?.on('node:view-service', async ({ view, e }) => {
      e.stopPropagation();
      const nodeData = view.cell.getData?.();
      const params = {
        projectID: route.params.projectId as string,
        environmentID: nodeData?.attributes?.environment?.id as string,
        serviceID: nodeData?.attributes?.name as string
      };
      const { data } = await queryItemServiceDetail(params);
      const serviceID = _.get(data, 'id');
      if (!serviceID) return;
      router.push({
        name: PROJECT.ServiceDetail,
        params: {
          projectId: route.params.projectId,
          environmentId: nodeData?.attributes?.environment?.id,
          dataType: 'service'
        },
        query: {
          id: serviceID
        }
      });
    });
    graphIns?.on('node:click', (e) => {
      console.log('node:click', e);
    });
  };
  const getSubjects = async () => {
    try {
      const params = {
        page: -1
      };
      const { data } = await querySubjects(params);
      subjectList.value = data.items || [];
    } catch (error) {
      subjectList.value = [];
    }
  };
  const init = async () => {
    graphIns?.clearCells();
    defineCustomNode();
    defineConnector();
    createGraph();
    initEvent();
    await initData();
    nextTick(() => {
      fitPosition();
    });
  };

  const updateChunkedList = (data) => {
    const collections = data?.collection || [];
    // UPDATE
    if (data?.type === websocketEventType.UPDATE) {
      const currentData = _.find(collections, (item) => item.id === execId);
      if (currentData) {
        const stages = currentData?.stages || [];
        const result = initNodes(stages);
        console.log('result..', result);
        graphIns.fromJSON(result, { silent: true });
      }
    }
  };
  const updateHandler = (list) => {
    _.each(list, (data) => {
      updateChunkedList(data);
    });
  };

  const createWorkflowsChunkRequest = () => {
    chunkRequestToken?.cancel();
    const url = `${PROJECT_API_PREFIX()}${PIPELINE_API}/${flowId}${PIPELINE_EXECUTION_API}`;
    try {
      chunkRequestToken = setChunkRequest({
        params: {
          id: execId
        },
        url: `${url}`,
        handler: updateHandler
      });
    } catch (error) {
      // ignore
    }
  };

  onMounted(async () => {
    await init();
    nextTick(() => {
      createWorkflowsChunkRequest();
    });
  });
</script>

<style lang="less" scoped>
  .wrapper {
    position: relative;
    font-size: 0;
    background-color: var(--color-fill-2);

    .tools {
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 10;
    }
  }
</style>

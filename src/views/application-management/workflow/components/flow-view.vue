<template>
  <div class="wrapper">
    <div class="tools">
      <toolBar :tool-list="toolList" @select="handleToolSelect"></toolBar>
    </div>
    <div ref="container" style="height: 800px"> </div>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';
  import { Graph, Node, Path, Edge, Cell, Platform, StringExt } from '@antv/x6';
  import '@antv/x6-vue-shape';
  import toolBar from './tool-bar.vue';
  import {
    setStyle,
    setPlusButtonStyle,
    setPipelineNodeStyle
  } from '../custom/style';
  import { NodeSize, PipelineNodeSize, tools } from '../config';
  import { defineCustomNode } from '../custom/node';
  import { defineConnector } from '../custom/edge';
  import test from '../config/test';

  // setStyle(NodeSize);
  // setPlusButtonStyle(NodeSize);
  setPipelineNodeStyle(PipelineNodeSize);

  const DX = 300;
  const DY = 120;
  const DX2 = 40;
  let graphIns: any = null;
  const canRedo = ref(false);
  const canUndo = ref(false);
  const container = ref();
  const nodes = ref<Node.Metadata[]>([]);
  const edges = ref<Edge.Metadata[]>([]);

  const toolList = computed(() => {
    return tools.map((item) => {
      let disabled = false;
      if (item.value === 'redo') {
        disabled = !canRedo.value;
      } else if (item.value === 'undo') {
        disabled = !canUndo.value;
      }
      return {
        ...item,
        disabled
      };
    });
  });
  const handleFitCenter = () => {
    graphIns?.centerContent();
    graphIns?.zoomTo(1);
  };
  const handleUndo = () => {
    graphIns?.undo();
    canRedo.value = graphIns?.canRedo();
    canUndo.value = graphIns?.canUndo();
  };

  const handleRedo = () => {
    graphIns?.redo();
    canRedo.value = graphIns?.canRedo();
    canUndo.value = graphIns?.canUndo();
  };

  const initNodes = (list: any[]) => {
    const nodes: Node.Metadata[] = [];
    const edges: Edge.Metadata[] = [];
    _.each(list, (item, index: number) => {
      const steps = item.steps || [];
      const nextStage = _.get(list, `${index + 1}`) || {};
      const nextStageSteps = nextStage.steps || [];
      const nextStageStepsFirstChild = _.get(nextStageSteps, `0`);
      nodes.push({
        shape: 'separator-node',
        x: DX * index - DX2,
        y: 0
      });
      _.each(steps, (sItem, sIndex: number) => {
        nodes.push({
          ...sItem,
          shape: 'pipeline-node',
          x: DX * index,
          y: DY * sIndex,
          ports: [
            { id: `${sItem.id}-in`, group: 'in' },
            { id: `${sItem.id}-out`, group: 'out' }
          ],
          data: {
            stepPosition: sIndex,
            name: sItem.name,
            stageName: item.stageName,
            stageId: item.id,
            nextStageId: _.get(nextStage, `id`) || ''
          }
        });
        if (nextStageStepsFirstChild) {
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
            shape: 'data-processing-curve',
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

  const handleToolSelect = (val) => {
    if (val === 'fitCenter') {
      handleFitCenter();
    } else if (val === 'undo') {
      handleUndo();
    } else if (val === 'redo') {
      handleRedo();
    }
  };
  const createGraph = () => {
    graphIns = new Graph({
      container: container.value,
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
        nodeMovable: false
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
            shape: 'data-processing-curve',
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

  const initEvent = () => {
    graphIns?.on('node:plus-button:click', (e) => {
      console.log('node:plus-button:click 1', e);
    });

    graphIns?.on('node:click', (e) => {
      console.log('node:plus-button:click 2', e);
    });
  };
  const setDefaultData = () => {};
  const saveGraphData = () => {
    const data = graphIns?.toJSON();
    console.log(data);
  };

  const init = () => {
    graphIns?.clearCells();
    defineCustomNode();
    defineConnector();
    createGraph();
    initEvent();
    const result = initNodes(test);
    graphIns.fromJSON(result);
    console.log('result', result);
    nextTick(() => {
      graphIns?.centerContent();
      graphIns?.zoomTo(1);
    });
  };
  onMounted(() => {
    nextTick(() => {
      init();
    });
  });
</script>

<style lang="less" scoped>
  .wrapper {
    position: relative;

    .tools {
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 10;
    }
  }
</style>

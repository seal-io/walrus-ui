<template>
  <div ref="graphWrapper" class="graph-wrapper">
    <div id="graph-mount" ref="graphMount" class="graph-mount"></div>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { ref, onMounted, nextTick } from 'vue';
  import G6, { Edge, Graph, Node } from '@antv/g6';
  import insertCss from 'insert-css';
  import { IGroup, IShape } from '@antv/g-base';
  import {
    onClickOutside,
    useThrottleFn,
    useResizeObserver
  } from '@vueuse/core';
  import { defineCustomNode, defaultNode } from '../config/common';
  import { contextMenu, toolbar, createToolTip } from '../config/plugins';
  import { fittingString } from '../config/utils';
  import { statusMap } from '../config';
  import { setInstanceStatus } from '../../../../config';

  import testData from '../config/test';

  insertCss(`
    #contextMenu {
      position: absolute;
      list-style-type: none;
      padding: 10px 8px;
      left: -150px;
      background-color: rgba(255, 255, 255, 0.9);
      border: 1px solid #e2e2e2;
      border-radius: 4px;
      font-size: 12px;
      color: #545454;
    }
    #contextMenu li {
      cursor: pointer;
  		list-style-type:none;
      list-style: none;
      margin-left: 0px;
    }
    #contextMenu li:hover {
      color: #aaa;
    }
  `);

  const emits = defineEmits(['nodeClick', 'canvasClick']);
  const graphMount = ref();
  const graphWrapper = ref();
  const nodeList = ref<Node[]>([]);
  const edgeList = ref<Edge[]>([]);
  let graph: any = null;
  const width = ref(0);
  const height = ref(0);

  const handleWindowResize = () => {
    if (!graph || graph.get('destroyed')) return;
    if (!width.value || !height.value) return;
    graph.changeSize(width.value, height.value);
    graph.fitView();
  };
  const throttleFn = useThrottleFn(() => {
    handleWindowResize();
  }, 200);
  useResizeObserver(graphWrapper, (entries) => {
    const entry = entries[0];
    const { width: boxWidth, height: boxHeight } = entry.contentRect;
    width.value = boxWidth;
    height.value = boxHeight;
    console.log('resize===', width.value, height.value);
    throttleFn();
  });

  const setNodeList = (data) => {
    nodeList.value = _.map(data.nodes || [], (o) => {
      const node = _.cloneDeep(o);
      const { name } = node;
      node.resourceType = node.type;
      node.subType = _.get(node, 'data.type');
      node.type = 'modelRect';
      node.label = fittingString(name, 120);
      node.description = node.subType ? `${node.subType}` : node.resourceType;
      node.stateIcon = {
        show: true,
        img: _.get(statusMap, setInstanceStatus(_.get(node, 'data.status')))
      };
      return node;
    });
  };
  const setLinks = (data) => {
    edgeList.value = _.map(data.edges || [], (o) => {
      const link = _.cloneDeep(o);
      return link;
    });
  };
  const fitView = () => {
    graph?.fitView();
  };
  const initData = () => {
    setNodeList(testData);
    setLinks(testData);
  };
  const renderGraph = () => {
    if (!graph) return;
    graph.data({ nodes: nodeList.value, edges: edgeList.value });
    graph.render();
  };
  const initNodeEvent = () => {
    graph?.on('node:mouseenter', (e) => {
      graph.setItemState(e.item, 'active', true);
    });
    graph?.on('node:mouseleave', (e) => {
      const node = e.item;
      // node.stateIcon.show = true;
      // const model = node.getModel();
      // model.stateIcon.show = true;
      // node.update(model);
      graph.setItemState(e.item, 'active', false);
    });
    graph?.on('node:click', (e) => {
      const node = e.item;
      graph.getNodes().forEach((n) => {
        graph.clearItemStates(n);
      });
      graph.setItemState(node, 'selected', true);
      emits('nodeClick', node.getModel());

      // node.stateIcon.show = true;
    });
    graph.on('canvas:click', (ev) => {
      emits('canvasClick', ev);
    });
    graph.on('wheelzoom', (e) => {
      e.stopPropagation();
      // 这里的 className 根据实际情况而定，默认是 g6-component-tooltip
      const contextmenu = Array.from(
        document.getElementsByClassName('g6-component-contextmenu')
      );
      contextmenu.forEach((menu) => {
        if (menu && menu.style) {
          menu.style.transform = `scale(${graph.getZoom()})`;
        }
      });
    });
  };

  const createGraph = () => {
    console.log('width==height==', width, height);
    graph = new G6.Graph({
      container: 'graph-mount',
      plugins: [toolbar, createToolTip()],
      width: width.value || 1400,
      height: height.value || 500,
      layout: {
        type: 'dagre',
        rankdir: 'LR',
        nodesepFunc: (d) => {
          return 0;
        },
        ranksep: 40
      },
      pixelRatio: 2,
      defaultNode,
      defaultEdge: {
        type: 'cubic-horizontal',
        style: {
          radius: 0,
          offset: 0,
          endArrow: {
            path: G6.Arrow.triangle(5, 5, 0),
            fill: 'rgba(102, 139, 220,.8)'
          },
          lineWidth: 1.2,
          stroke: 'rgba(66, 106, 208,.8)'
        }
      },
      nodeStateStyles: {
        selected: {
          stroke: 'rgb(33, 74, 196)',
          lineWidth: 1
        }
      },
      modes: {
        default: ['drag-canvas', 'zoom-canvas', 'click-select']
      },
      fitView: true
    });
  };
  const init = () => {
    graph?.clear();
    graph?.off();
    // defineCustomNode();
    initData();
    createGraph();
    renderGraph();
    initNodeEvent();
  };
  onMounted(() => {
    init();
  });
</script>

<style lang="less" scoped>
  @import url('../style/modelRect-keyShape.less');

  .graph-wrapper {
    width: 100%;
    background-color: var(--color-fill-2);

    .graph-mount {
      position: relative;
      height: 500px;
    }
  }
</style>

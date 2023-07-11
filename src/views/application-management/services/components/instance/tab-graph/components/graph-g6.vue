<template>
  <div>
    <a-grid :cols="24">
      <a-grid-item :span="24">
        <div ref="graphWrapper" class="graph-wrapper">
          <div
            id="graph-mount"
            ref="graphMount"
            class="graph-mount"
            :class="{ isFullscreen: isFullscreen }"
          ></div>
          <div class="legend">
            <a-space :size="20">
              <span
                v-for="item in customeLegend"
                :key="item.label"
                class="legend-item"
                @mouseenter="handleLegengHover(item)"
                @mouseleave="handleLegengLeave(item)"
              >
                <img :src="item.icon" alt="" class="img" />
                {{ item.label }}
              </span>
            </a-space>
          </div>
          <div class="toolbar">
            <slot name="toolbar"></slot>
          </div>
        </div>
      </a-grid-item>
    </a-grid>
    <!-- <loggableModal
      v-model:show="showLogModal"
      v-model:nodeInfo="resourceNodeInfo"
      :data-list="logDataList"
    >
    </loggableModal>
    <terminalModal
      v-model:show="showTermModal"
      v-model:nodeInfo="resourceNodeInfo"
      :data-list="termDataList"
    >
    </terminalModal> -->

    <resourceControl
      v-model:visible="terminalShow"
      v-model:tabs="drawerTabs"
      :update-active="updateActive"
      :type="modalType"
      @delete="handleTerminalDelete"
    >
    </resourceControl>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import i18n from '@/locale';
  import resourceImages from '@/views/application-management/resource-images';
  import serviceImg from '@/assets/images/service.png';
  import {
    ref,
    onMounted,
    nextTick,
    PropType,
    watch,
    onBeforeUnmount,
    defineExpose,
    watchEffect
  } from 'vue';
  import G6 from '@antv/g6';
  import {
    onClickOutside,
    useThrottleFn,
    useResizeObserver
  } from '@vueuse/core';
  import { defineCustomNode, defaultNode } from '../config/common';
  import { createToolTip } from '../config/plugins';
  import { fittingString } from '../config/utils';
  import { statusMap, edgeType, nodeKindType, customeLegend } from '../config';
  import { ICombo, IEdge, INode } from '../config/interface';
  import { setInstanceStatus, Status } from '../../../../config';
  import { getResourceKeyList } from '../../../../config/utils';
  import { ResourceKey } from '../../../../config/interface';
  import loggableModal from './loggable-modal.vue';
  import terminalModal from './terminal-modal.vue';
  import resourceControl from '../../resource-control.vue';
  import useResourceControl from '../../../hooks/use-resource-control';

  const props = defineProps({
    sourceData: {
      type: Object as PropType<{ links: IEdge[]; nodes: INode[] }>,
      default() {
        return {
          links: [],
          nodes: []
        };
      }
    },
    isFullscreen: {
      type: Boolean,
      default() {
        return false;
      }
    },
    showAll: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });

  const {
    modalType,
    drawerTabs,
    terminalShow,
    updateActive,
    handleViewLogs,
    handleConnectTerminal,
    handleTerminalDelete
  } = useResourceControl();
  const emits = defineEmits(['nodeClick', 'canvasClick']);
  const showLogModal = ref(false);
  const showTermModal = ref(false);
  const logDataList = ref<ResourceKey[]>([]);
  const termDataList = ref<ResourceKey[]>([]);
  const resourceNodeInfo = ref({});
  const graphMount = ref();
  const graphWrapper = ref();
  const loading = ref(false);
  const animateFlag = ref(false);
  let nodeList: INode[] = [];
  let edgeList: IEdge[] = [];
  let combosList: ICombo[] = [];
  let graph: any = null;
  const width = ref(0);
  const height = ref(0);
  const toolTipRef = ref<any>({});
  const contextMenu = ref<any>({});
  const contextMenuNode: any = { value: null };

  contextMenu.value = new G6.Menu({
    trigger: 'click',
    shouldBegin(e) {
      // const isFull = e?.target
      //   .getParent?.()
      //   .cfg?.item?.getModel?.()?.isFullscreen;

      if (_.get(e?.target, 'cfg.name') === 'more-button-icon') {
        contextMenuNode.value = e?.item;
        return true;
      }
      return false;
    },
    getContent(evt) {
      const node = evt?.item;
      const model: INode = node?.getModel();
      const logabble = model?.loggableInfo?.loggable;
      const executable = model?.executableInfo?.executable;
      let logHtml = '';
      let execHtml = '';
      if (!logabble && !executable) {
        return '';
      }
      if (logabble) {
        logHtml = `<li code="log" class="iconfont icon-xiangqing-">
      ${i18n.global.t('applications.instance.tab.log')}
    </li>`;
      }
      if (executable) {
        execHtml = `<li code="exec" class="iconfont icon-code">
      ${i18n.global.t('applications.instance.tab.term')}

      </li>`;
      }
      return `
    <div id="contextMenu-wrapper">
    <ul >
      ${logHtml}${execHtml}
    </ul>
    </div>
    `;
    },
    handleMenuClick: (target, item) => {
      const code = target.getAttribute('code');
      const model = item.getModel();
      resourceNodeInfo.value = model;

      if (code === 'log') {
        // logDataList.value = model?.loggableInfo?.data;
        // setTimeout(() => {
        //   showLogModal.value = true;
        // }, 100);
        handleViewLogs({
          ...(_.get(model, 'extensions') || {}),
          id: model.nodeId,
          name: model.name
        });
        return;
      }
      if (code === 'exec') {
        // termDataList.value = model?.executableInfo?.data;
        // setTimeout(() => {
        //   showTermModal.value = true;
        // }, 100);
        handleConnectTerminal({
          ...(_.get(model, 'extensions') || {}),
          id: model.nodeId,
          name: model.name
        });
      }
    },

    // offsetX and offsetY include the padding of the parent container
    // 需要加上父级容器的 padding-left 16 与自身偏移量 10
    offsetX: 16 + 10,
    // 需要加上父级容器的 padding-top 24 、画布兄弟元素高度、与自身偏移量 10
    offsetY: 0,
    // the types of items that allow the menu show up
    // 在哪些类型的元素上响应
    itemTypes: ['node']
  });
  const fitView = () => {
    // graph.zoomTo(1);
    graph?.fitView();
  };
  const handleWindowResize = () => {
    if (!graph || graph.get('destroyed')) return;
    if (!width.value || !height.value) return;
    graph.changeSize(width.value, height.value);
    fitView();
  };

  const throttleFn = useThrottleFn(() => {
    handleWindowResize();
  }, 200);
  useResizeObserver(graphWrapper, (entries) => {
    const entry = entries[0];
    const { width: boxWidth, height: boxHeight } = entry.contentRect;
    width.value = boxWidth;
    height.value = boxHeight;
    throttleFn();
  });

  const setCombosList = () => {
    const { sourceData: data } = props;
    const parentNodeList: string[] = [];
    _.each(data.nodes, (node) => {
      if (node.parentNode) {
        parentNodeList.push(node.parentNode);
      }
    });
    const result = _.filter(data.nodes, (node) => {
      return _.includes(parentNodeList, node.id);
    });
    combosList = _.map(result, (node, index) => {
      return {
        id: node.id,
        label: `${node.name}(${node.type})`,
        nodeType: 'combo',
        order: index
      };
    });
  };
  const removeVersions = (inputString) => {
    return _.replace(inputString, /_v[\d]/g, '');
  };

  const hasCompositionNodes = (node) => {
    return _.some(props.sourceData.links, (item) => {
      return (
        _.get(item, 'source') === node.id &&
        _.get(item, 'edgeType') === edgeType.Realization
      );
    });
  };

  const setNodeList = () => {
    const { sourceData: data } = props;
    const style = {
      lineWidth: 1,
      stroke: 'transparent',
      cursor: 'grabbing'
    };
    nodeList = _.map(data.nodes || [], (o) => {
      const node = _.cloneDeep(o);
      const loggableList = getResourceKeyList(
        { ...node.extensions, id: node.nodeId },
        'loggable'
      );
      const execList = getResourceKeyList(
        { ...node.extensions, id: node.nodeId },
        'executable'
      );

      const animate =
        setInstanceStatus(_.get(node, 'status')) === Status.Warning;
      node.resourceType =
        removeVersions(_.get(node, 'extensions.type')) || _.get(node, 'kind');

      node.isFullscreen = props.isFullscreen;
      node.isCollapsed = props.showAll;
      node.hasComposition = hasCompositionNodes(node);
      node.providerType = _.get(_.split(node.resourceType, '_'), '0') || '';
      node.subType = _.get(node, 'data.type');
      node.type = 'resource';

      node.loggableInfo = {
        loggable: !!loggableList.length,
        data: loggableList
      };
      node.executableInfo = {
        executable: !!execList.length,
        data: loggableList
      };

      node.descTips = _.get(node, 'extensions.type') || _.get(node, 'kind');

      if (_.get(node, 'kind') !== nodeKindType.ServiceResource) {
        node.description = fittingString(node.descTips, 120);
        node.label = fittingString(node.name, 120);
      } else {
        node.label = fittingString(node.name, 112);
      }

      node.stateIcon = {
        animate,
        width: animate ? 20 : 14,
        height: animate ? 20 : 14,
        show: true,
        img: _.get(statusMap, setInstanceStatus(_.get(node, 'status')))
      };
      node.logoIcon = {
        width: 32,
        height: 32,
        offset: -25,
        img:
          resourceImages.get(node.providerType)?.get(node.resourceType) ||
          serviceImg
      };
      if (_.get(node, 'kind') === nodeKindType.ServiceResourceGroup) {
        node.style = {
          ...style,
          fill: '#e8f2ff',
          radius: 30
        };
        node.stateStyles = {
          inactive: {
            fill: 'rgba(232,242,255,.5)'
          },
          highlight: {
            fill: 'rgba(142, 173, 231,.7)'
          },
          selected: {
            stroke: 'rgb(33, 74, 196)',
            lineWidth: 1
          },
          hover: {
            stroke: 'rgb(33, 74, 196)',
            lineWidth: 1
          }
        };
      } else {
        node.style = {
          ...style
        };
        node.stateStyles = {
          inactive: {
            fill: 'rgba(255,255,255,.5)'
          },
          selected: {
            stroke: 'rgb(33, 74, 196)',
            lineWidth: 1
          },
          hover: {
            stroke: 'rgb(33, 74, 196)',
            lineWidth: 1
          }
        };
      }

      return node;
    });
  };
  const setLinks = () => {
    const { sourceData: data } = props;
    edgeList = _.map(data.links || [], (o) => {
      const link = _.cloneDeep(o);
      const style: any = {};
      if (o.edgeType === edgeType.Dependency) {
        style.lineWidth = 1.5;
        style.lineDash = [5, 5];
      }

      if (o.edgeType === edgeType.Composition) {
        style.endArrow = false;
        style.startArrow = {
          path: G6.Arrow.diamond(12, 14, 0),
          fill: 'rgba(102, 139, 220,1)'
        };
      }

      if (o.edgeType === edgeType.Realization) {
        style.endArrow = {
          path: G6.Arrow.triangle(8, 8, 0),
          fill: '#86909c'
        };
        style.stroke = '#86909c';
        style.lineDash = [8, 3, 3];
      }

      link.labelCfg = {
        refY: 15,
        autoRotate: true,
        show: false,
        style: {
          fontSize: 16,
          fontWeight: 500
        }
      };
      link.style = { ...style };

      return link;
    });
  };

  const initData = () => {
    setNodeList();
    setLinks();
  };
  const toggleAllNodeShow = (show) => {
    _.each(graph.getNodes(), (node) => {
      const model = node.getModel();
      if (show) {
        graph.showItem(node);
      } else if (model.kind === nodeKindType.ServiceResource) {
        graph.hideItem(node);
      }
      if (model.hasComposition) {
        node.update({
          ...model,
          isCollapsed: show
        });
      }
    });
    animateFlag.value = true;
    graph?.layout();
    graph?.set('animate', false);
  };
  const renderGraph = () => {
    if (!graph) return;
    graph.data({
      nodes: nodeList,
      edges: edgeList
    });
    graph.render();
  };
  // click select node
  const getRelateNodesAndEdges = (node: INode, type) => {
    const result: INode[] = [];
    const stack: INode[] = [];
    stack.push(node);
    while (stack.length) {
      const currentNode: INode = stack.pop() as INode;
      result.push(currentNode);
      const neighbors: INode[] = currentNode?.getNeighbors(type) as INode[];
      const filterNeighbors = _.filter(neighbors, (item) => {
        const model = item.getModel();
        return model.kind === nodeKindType.ServiceResource;
      });
      if (filterNeighbors.length) {
        _.each(filterNeighbors, (item) => {
          stack.push(item);
        });
      }
    }
    return _.tail(result);
  };
  const toggleNodeCollapse = (node) => {
    // if (node.getModel().kind !== nodeKindType.ServiceResourceGroup) {
    //   return;
    // }
    const result: INode[] = getRelateNodesAndEdges(node, 'target');
    if (!result.length) return;
    const model = node.getModel();

    _.each(result, (n) => {
      if (model.isCollapsed) {
        graph.hideItem(n);
      } else {
        graph.showItem(n);
      }
    });
    node.update({
      ...model,
      isCollapsed: !model.isCollapsed
    });
    animateFlag.value = true;

    graph.layout();
    graph.set('animate', true);
  };
  const handleLegengHover = (item) => {
    _.each(graph?.getEdges(), (edge) => {
      const model = edge.getModel();
      if (item.type === model.edgeType) {
        edge.toFront();
        graph.setItemState(edge, 'hover', true);
      } else {
        edge.toBack();
        graph.setItemState(edge, 'inactive', true);
      }
    });
    _.each(graph?.getNodes(), (node) => {
      const edges = node.getEdges();
      const res = _.some(edges, (edge) => {
        const model = edge.getModel();
        return model.edgeType === item.type;
      });
      if (!res) {
        node.toBack();
        graph.setItemState(node, 'inactive', true);
      } else {
        node.toFront();
        graph.setItemState(node, 'highlight', true);
      }
    });
  };
  const handleLegengLeave = (item) => {
    _.each(graph?.getEdges(), (edge) => {
      graph.clearItemStates(edge);
    });
    _.each(graph?.getNodes(), (node) => {
      graph.clearItemStates(node);
    });
  };
  const resetContextMenu = () => {
    const contextVisibility = contextMenu.value?.get('menu')?.style?.visibility;
    if (contextVisibility === 'hidden') {
      contextMenuNode.value = null;
    }
  };
  const initNodeEvent = () => {
    graph?.on('node:mouseenter', (e) => {
      graph.setItemState(e.item, 'hover', true);
      resetContextMenu();
    });

    graph?.on('node:mouseleave', (e) => {
      const node = e.item;
      graph.setItemState(e.item, 'hover', false);
    });

    // graph?.on('combo:click', (e) => {
    //   const node = e.item;
    //   const model = node.getModel();
    // });
    graph?.on('node:click', (e) => {
      const node = e.item;
      const model = node.getModel();
      toggleNodeCollapse(node);

      graph.setItemState(node, 'selected', true);
      emits('nodeClick', model);
    });
    graph?.on('edge:mouseenter', (e) => {
      const edge = e.item;
      const model = edge.getModel();
      edge.update({
        ...model,
        label: model.edgeType
      });
      edge.toFront();

      graph.setItemState(edge, 'hover', true);
    });
    graph?.on('edge:mouseleave', (e) => {
      const edge = e.item;
      const model = edge.getModel();
      edge.update({
        ...model,
        label: ''
      });
      edge.toBack();
      graph.setItemState(edge, 'hover', false);
    });
    graph.on('canvas:click', (ev) => {
      emits('canvasClick', ev);
    });
  };

  const createGraph = () => {
    graph = new G6.Graph({
      // groupByTypes: true,
      // renderer: 'svg', // arrow style will be change
      container: 'graph-mount',
      plugins: [
        contextMenu.value,
        (toolTipRef.value = createToolTip(contextMenuNode))
      ],
      width: width.value || 1400,
      height: height.value || 400,
      layout: {
        type: 'dagre',
        rankdir: 'LR',
        nodesepFunc: (d) => {
          return 0;
        },
        ranksep: 40,
        onLayoutEnd() {
          loading.value = false;
          nextTick(() => {
            graph?.fitCenter?.(animateFlag.value);
            animateFlag.value = false;
          });
        }
        // sortByCombo: false
      },
      pixelRatio: 2,
      defaultNode,
      defaultEdge: {
        type: 'cubic-horizontal',
        style: {
          cursor: 'pointer',
          radius: 0,
          offset: 0,
          shadowBlur: 0,
          endArrow: {
            path: G6.Arrow.vee(8, 8, 0),
            fill: 'rgba(102, 139, 220,1)',
            lineDash: [0, 0]
          },
          lineWidth: 1.2,
          stroke: 'rgba(66, 106, 208,.8)'
        }
      },
      edgeStateStyles: {
        hover: {
          lineWidth: 4,
          opacity: 0.8,
          animate: true,
          shadowBlur: 10
        },
        inactived: {
          opacity: 0.5
        }
      },

      nodeStateStyles: {
        selected: {
          stroke: 'rgb(33, 74, 196)',
          lineWidth: 1
        },
        hover: {
          stroke: 'rgb(33, 74, 196)',
          lineWidth: 1
        },
        inactived: {
          fill: 'rgba(255,255,255,0)'
        }
      },
      comboStateStyles: {
        selected: {
          fill: 'transparent',
          lineWidth: 1
        }
      },
      modes: {
        default: ['drag-canvas', 'zoom-canvas', 'click-select']
      },
      fitView: false
    });
  };
  const updateNodeFullscreen = () => {
    if (!graph) return;
    graph?.clear();
    initData();
    graph.read({ nodes: nodeList, edges: edgeList });
    toggleAllNodeShow(props.showAll);
  };
  const updateGraph = () => {
    loading.value = true;
    graph?.clear();
    initData();
    graph.read({ nodes: nodeList, edges: edgeList });
    toggleAllNodeShow(props.showAll);
  };
  const init = () => {
    loading.value = true;
    graph?.clear();
    defineCustomNode();
    initData();
    createGraph();
    renderGraph();
    initNodeEvent();
    toggleAllNodeShow(props.showAll);
  };
  defineExpose({
    fitView,
    toggleAllNodeShow
  });
  watch(
    () => props.sourceData?.nodes,
    () => {
      if (graph && graphMount.value) {
        updateGraph();
      } else if (graphMount.value) {
        init();
      }
    },
    {
      immediate: true
    }
  );
  watch(
    () => props.isFullscreen,
    () => {
      updateNodeFullscreen();
    },
    {
      immediate: false
    }
  );
  onBeforeUnmount(() => {
    graph?.clear();
    graph?.destroy();
  });
</script>

<style lang="less" scoped>
  @import url('../style/modelRect-keyShape.less');
  @height: 610px;

  .graph-wrapper {
    position: relative;
    width: 100%;
    background-color: var(--color-fill-2);

    .legend {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 6px 4px;
      font-size: 14px;
      background-color: rgba(255, 255, 255, 0.8);
      border-radius: 2px;

      .legend-item {
        color: rgb(var(--arcoblue-5));
        cursor: pointer;
        transition: color var(--seal-transition-func) 0.2s;

        &:hover {
          color: rgb(var(--arcoblue-6));
          transition: color var(--seal-transition-func) 0.2s;
        }
      }

      .img {
        width: 24px;
        margin-right: 5px;
      }
    }

    .toolbar {
      position: absolute;
      top: 10px;
      left: 10px;
      color: var(--color-text-2);
      background-color: rgba(255, 255, 255, 0.8);
    }

    .graph-mount {
      position: relative;
      height: @height;

      &.isFullscreen {
        height: 100vh;
      }
    }
  }
</style>

<style lang="less">
  .g6-component-contextmenu {
    padding: 6px 8px;
    border: none;
  }

  .g6-component-tooltip {
    border: none;
  }

  #contextMenu-wrapper {
    .res-name {
      font-weight: 500;
      font-size: 14px;
    }

    ul {
      margin: 0;
      padding: 0;

      .iconfont {
        margin-right: 4px;
        color: var(--sealblue-6);
      }

      a {
        color: var(--sealblue-6);
        cursor: pointer;
      }
    }

    ul li {
      font-size: 12px;
      line-height: 24px;
      list-style: none;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }
</style>

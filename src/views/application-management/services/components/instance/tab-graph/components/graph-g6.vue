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
          <div class="toolbar">
            <slot name="toolbar"></slot>
          </div>
        </div>
      </a-grid-item>
    </a-grid>
    <loggableModal
      v-model:show="showLogModal"
      v-model:nodeInfo="resourceNodeInfo"
      :info="logInfo"
    >
    </loggableModal>
    <terminalModal
      v-model:show="showTermModal"
      v-model:nodeInfo="resourceNodeInfo"
      :info="termInfo"
    >
    </terminalModal>
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
    defineExpose
  } from 'vue';
  import G6 from '@antv/g6';
  import {
    onClickOutside,
    useThrottleFn,
    useResizeObserver
  } from '@vueuse/core';
  import {
    defineCustomNode,
    defaultNode,
    defaultCombo
  } from '../config/common';
  import { toolbar, createToolTip } from '../config/plugins';
  import { fittingString } from '../config/utils';
  import { statusMap, edgeType, nodeKindType } from '../config';
  import { ICombo, IEdge, INode } from '../config/interface';
  import { setInstanceStatus, Status } from '../../../../config';
  import {
    generateResourcesKeys,
    getDefaultValue,
    getResourceId
  } from '../../../../config/utils';
  import loggableModal from './loggable-modal.vue';
  import terminalModal from './terminal-modal.vue';

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
    }
  });
  const emits = defineEmits(['nodeClick', 'canvasClick']);
  const showLogModal = ref(false);
  const showTermModal = ref(false);
  const logInfo = ref<{ key: string; id: string }>({ key: '', id: '' });
  const termInfo = ref<{ key: string; id: string }>({ key: '', id: '' });
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

  const contextMenu = new G6.Menu({
    // trigger: 'click',
    shouldBegin(e) {
      const node = e?.item;
      const model: INode = node?.getModel();
      const logabble = model?.loggableInfo?.loggable;
      const executable = model?.executableInfo?.executable;
      if (!logabble && !executable) {
        return false;
      }
      return true;
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
      </i>
      </li>`;
      }
      return `
    <div id="contextMenu-wrapper">
    <div class="res-name">${model?.name}</div>
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
        logInfo.value = model?.loggableInfo?.data;
        setTimeout(() => {
          showLogModal.value = true;
        }, 100);
        return;
      }
      if (code === 'exec') {
        termInfo.value = model?.executableInfo?.data;
        setTimeout(() => {
          showTermModal.value = true;
        }, 100);
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
    graph.fitCenter();
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
  const getLoggableExcutableInfo = (list): { key: string; id: string } => {
    const result = getDefaultValue(list);
    return getResourceId(result);
  };
  const hasCompositionNodes = (node) => {
    return _.some(props.sourceData.links, (item) => {
      return (
        _.get(item, 'source') === node.id &&
        _.get(item, 'edgeType') === edgeType.Composition
      );
    });
  };
  const hasParentNode = (node) => {
    return _.some(props.sourceData.links, (item) => {
      return _.get(item, 'target') === node.id;
    });
  };
  const setNodeList = () => {
    const { sourceData: data } = props;
    nodeList = _.map(data.nodes || [], (o) => {
      const node = _.cloneDeep(o);
      const loggableList = generateResourcesKeys([node.data || {}], 'loggable');
      const execList = generateResourcesKeys([node.data || {}], 'executable');

      // if (node.kind === nodeKindType.ServiceResource && hasParentNode(node)) {
      //   node.visible = false;
      // }
      const animate =
        setInstanceStatus(_.get(node, 'status')) === Status.Warning;
      node.resourceType =
        removeVersions(_.get(node, 'extensions.type')) || _.get(node, 'kind');

      node.isCollapsed = false;
      node.hasComposition = hasCompositionNodes(node);
      node.providerType = _.get(_.split(node.resourceType, '_'), '0') || '';
      node.subType = _.get(node, 'data.type');
      node.type = 'resource';

      node.loggableInfo = {
        loggable: !!loggableList.length,
        data: getLoggableExcutableInfo(loggableList)
      };
      node.executableInfo = {
        executable: !!execList.length,
        data: getLoggableExcutableInfo(execList)
      };

      node.label = fittingString(node.name, 120);
      node.description = _.get(node, 'extensions.type') || _.get(node, 'kind');
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
      return node;
    });
  };
  const setLinks = () => {
    const { sourceData: data } = props;
    edgeList = _.map(data.links || [], (o) => {
      const link = _.cloneDeep(o);
      const style: any = {};
      if (o.edgeType === edgeType.Dependency) {
        style.lineDash = [5, 5];
      }
      if (o.edgeType === edgeType.Composition) {
        // link.visible = false;
        style.endArrow = false;
        style.startArrow = {
          path: G6.Arrow.diamond(8, 10, 0),
          fill: 'rgba(102, 139, 220,1)'
        };
      }
      // if (
      //   _.find(
      //     combosList,
      //     (item) =>
      //       item.id === o.source &&
      //       _.find(combosList, (item) => item.id === o.target)
      //   )
      // ) {
      //   style = {
      //     lineDash: [5, 5]
      //   };
      // }

      link.style = { ...style };

      return link;
    });
  };

  const initData = () => {
    // setCombosList();
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
      // combos: combosList
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
  const initNodeEvent = () => {
    graph?.on('node:mouseenter', (e) => {
      graph.setItemState(e.item, 'hover', true);
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
      // graph.getNodes().forEach((n) => {
      //   graph.clearItemStates(n);
      // });
      graph.setItemState(node, 'selected', true);
      emits('nodeClick', model);

      // node.stateIcon.show = true;
    });
    graph.on('canvas:click', (ev) => {
      emits('canvasClick', ev);
    });
    // graph.on('wheelzoom', (e) => {
    //   e.stopPropagation();
    //   const contextmenu = Array.from(
    //     document.getElementsByClassName('g6-component-contextmenu')
    //   );
    //   contextmenu.forEach((menu) => {
    //     if (menu && menu.style) {
    //       menu.style.transform = `scale(${graph.getZoom()})`;
    //     }
    //   });
    //   const tooltips = Array.from(
    //     document.getElementsByClassName('g6-component-tooltip')
    //   );
    //   tooltips.forEach((item) => {
    //     if (item && item.style) {
    //       item.style.transform = `scale(${graph.getZoom()})`;
    //     }
    //   });
    // });
  };

  const createGraph = () => {
    graph = new G6.Graph({
      // groupByTypes: true,
      // renderer: 'svg',
      container: 'graph-mount',
      plugins: [contextMenu, createToolTip()],
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
      // defaultCombo,
      defaultNode,
      defaultEdge: {
        type: 'cubic-horizontal',
        style: {
          radius: 0,
          offset: 0,
          shadowBlur: 0,
          endArrow: {
            path: G6.Arrow.vee(5, 5, 0),
            fill: 'rgba(102, 139, 220,1)',
            lineDash: [0, 0]
          },
          lineWidth: 1.2,
          stroke: 'rgba(66, 106, 208,.8)'
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
  const updateGraph = () => {
    loading.value = true;
    graph?.clear();
    initData();
    graph.read({ nodes: nodeList, edges: edgeList });
  };
  const init = () => {
    loading.value = true;
    graph?.clear();
    defineCustomNode();
    initData();
    createGraph();
    renderGraph();
    initNodeEvent();
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
      margin: 5px 0 0 0;
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

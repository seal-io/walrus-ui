<template>
  <div ref="graphWrapper" class="graph-wrapper">
    <div id="graph-mount" ref="graphMount" class="graph-mount"></div>
    <span class="iconfont icon-fit_screen-o" @click="fitview"></span>
    <loggableModal v-model:show="showLogModal" :info="logInfo"> </loggableModal>
    <terminalModal v-model:show="showTermModal" :info="termInfo">
    </terminalModal>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import i18n from '@/locale';
  import {
    ref,
    onMounted,
    nextTick,
    PropType,
    watch,
    onBeforeUnmount
  } from 'vue';
  import G6 from '@antv/g6';
  import {
    onClickOutside,
    useThrottleFn,
    useResizeObserver
  } from '@vueuse/core';
  import {
    defineCustomNode,
    defineDomNode,
    defaultNode,
    defaultCombo
  } from '../config/common';
  import { toolbar, createToolTip } from '../config/plugins';
  import { fittingString } from '../config/utils';
  import { statusMap } from '../config';
  import { ICombo, IEdge, INode } from '../config/interface';
  import { setInstanceStatus } from '../../../../config';
  import {
    generateResourcesKeys,
    getDefaultValue,
    getResourceId
  } from '../../../../config/utils';
  import loggableModal from './loggable-modal.vue';
  import terminalModal from './terminal-modal.vue';

  import testData from '../config/test';

  const props = defineProps({
    sourceData: {
      type: Object as PropType<{ links: IEdge[]; nodes: INode[] }>,
      default() {
        return {
          links: [],
          nodes: []
        };
      }
    }
  });
  const emits = defineEmits(['nodeClick', 'canvasClick']);
  const showLogModal = ref(false);
  const showTermModal = ref(false);
  const logInfo = ref<{ key: string; id: string }>({ key: '', id: '' });
  const termInfo = ref<{ key: string; id: string }>({ key: '', id: '' });
  const graphMount = ref();
  const graphWrapper = ref();
  const loading = ref(false);
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
      console.log('menu===', model);
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

  const handleWindowResize = () => {
    if (!graph || graph.get('destroyed')) return;
    if (!width.value || !height.value) return;
    graph.changeSize(width.value, height.value);
    graph.fitView();
  };
  const fitview = () => {
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
    combosList = _.map(result, (node) => {
      return {
        id: node.id,
        label: `${node.name}(${node.type})`,
        nodeType: 'combo',
        collapsed: false
      };
    });
  };
  const getLoggableExcutableInfo = (list): { key: string; id: string } => {
    const result = getDefaultValue(list);
    return getResourceId(result);
  };
  const setNodeList = () => {
    const { sourceData: data } = props;
    nodeList = _.map(data.nodes || [], (o) => {
      const node = _.cloneDeep(o);
      const loggableList = generateResourcesKeys([node.data || {}], 'loggable');
      const execList = generateResourcesKeys([node.data || {}], 'executable');
      const { name } = node;
      node.resourceType = node.type;
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
      node.label = fittingString(name, 120);
      node.comboId = node.parentNode || '';
      node.description = node.subType ? `${node.subType}` : node.resourceType;
      node.stateIcon = {
        show: true,
        img: _.get(statusMap, setInstanceStatus(_.get(node, 'data.status')))
      };
      return node;
    });
    nodeList = _.filter(nodeList, (node) => {
      return !_.find(combosList, (item) => item.id === node.id);
    });
  };
  const setLinks = () => {
    const { sourceData: data } = props;
    edgeList = _.map(data.links || [], (o) => {
      const link = _.cloneDeep(o);
      return link;
    });
  };
  const fitView = () => {
    graph?.fitView();
  };
  const initData = () => {
    setCombosList();
    setNodeList();
    setLinks();
  };
  const renderGraph = () => {
    if (!graph) return;
    graph.data({
      nodes: nodeList,
      edges: edgeList,
      combos: combosList
    });
    graph.render();
  };
  const initNodeEvent = () => {
    graph?.on('node:mouseenter', (e) => {
      graph.setItemState(e.item, 'hover', true);
    });
    graph?.on('node:mouseleave', (e) => {
      const node = e.item;
      // node.stateIcon.show = true;
      // const model = node.getModel();
      // model.stateIcon.show = true;
      // node.update(model);
      graph.setItemState(e.item, 'hover', false);
    });
    graph?.on('combo:click', (e) => {
      const node = e.item;
      const model = node.getModel();
      console.log('combo:click===', model);
    });
    graph?.on('node:click', (e) => {
      const node = e.item;
      const model = node.getModel();

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
    console.log('width==height==', width, height);
    graph = new G6.Graph({
      groupByTypes: false,
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
          console.log('onLayoutEnd');
        }
      },
      pixelRatio: 2,
      defaultCombo,
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
      fitView: true
    });
  };
  const updateGraph = () => {
    loading.value = true;
    graph?.clear();
    initData();
    graph.read({ nodes: nodeList, edges: edgeList, combos: combosList });
  };
  const init = () => {
    loading.value = true;
    graph?.clear();
    // defineDomNode();
    defineCustomNode();
    initData();
    createGraph();
    renderGraph();
    initNodeEvent();
  };
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
  @height: 400px;

  .graph-wrapper {
    position: relative;
    width: 100%;
    background-color: var(--color-fill-2);

    .icon-fit_screen-o {
      position: absolute;
      top: 10px;
      left: 10px;
      color: var(--color-text-2);
      font-size: 22px;
      background-color: rgba(255, 255, 255, 0.8);
      cursor: pointer;
      transition: all 0.3s var(--seal-transition-func);

      &:hover {
        color: rgb(var(--arcoblue-5));
        transform: scale(1.1);
        transition: all 0.3s var(--seal-transition-func);
      }
    }

    .graph-mount {
      position: relative;
      height: @height;
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

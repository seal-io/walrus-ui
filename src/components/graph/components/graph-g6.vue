<template>
  <div ref="ChartMountWrap" class="chart-box">
    <div id="chart-mount" ref="chartMount" class="chart-mount"></div>
  </div>
</template>

<script lang="ts" setup>
  import { get, map, join, each, filter, includes, concat, some } from 'lodash';
  import {
    onClickOutside,
    useElementSize,
    useThrottleFn,
    useResizeObserver
  } from '@vueuse/core';
  import { severityMap, severityInactiveMap } from '@/config/global';
  import { repoIcon } from '@/components/provider-icon/config';
  import {
    nextTick,
    PropType,
    ref,
    watch,
    defineExpose,
    computed,
    onUnmounted,
    onMounted,
    onBeforeUnmount,
    toRaw
  } from 'vue';
  import G6, { Edge, Graph, Node } from '@antv/g6';
  import useNodeData from '../config/g6-config';
  import { EdgeItem, NodeItem } from '../config/interface';
  import {
    dataColorMap,
    dataInactiveColorMap,
    dataStrokeColorMap,
    graphColorConfig,
    nodeSizeMap,
    resourceNodeSizeMap,
    NodeType,
    vulnNodeInfo
  } from '../config';

  const props = defineProps({
    sourceData: {
      type: Object as PropType<{ Edges: EdgeItem[]; Nodes: NodeItem[] }>,
      default() {
        return {};
      }
    },
    filterViewEnable: {
      type: Boolean,
      default() {
        return false;
      }
    },
    filerViewByMode: {
      type: Function,
      default() {
        return null;
      }
    }
  });
  const { modes, defaultEdge, defaultNode, primaryColor } = useNodeData();
  const emits = defineEmits([
    'layoutEnd',
    'nodeClick',
    'canvasClick',
    'edgeClick'
  ]);
  const chartMount = ref();
  const ChartMountWrap = ref();
  let t1: any = null;
  let t2: any = null;
  let currentActivedNode: any = null;
  let graph: any = null;
  let updateTimer: any = null;
  let lockNodeTimer: any = null;
  let fitViewTimer: any = null;
  let currentActivedLink: Node[] = [];
  let expandedNodeList: Node[] = [];
  let nodeList: NodeItem[] = [];
  let edgesList: EdgeItem[] = [];
  let width = 0;
  let height = 0;
  let needFitView = true;
  let needLockPosition = true;
  // let { width, height } = useElementSize(ChartMountWrap);

  const handleWindowResize = () => {
    if (!graph || graph.get('destroyed')) return;
    if (!width || !height) return;
    graph.changeSize(width, height);
    graph.layout();
    graph.fitView();
  };
  const throttleFn = useThrottleFn(() => {
    handleWindowResize();
  }, 200);
  useResizeObserver(ChartMountWrap, (entries) => {
    const entry = entries[0];
    const { width: boxWidth, height: boxHeight } = entry.contentRect;
    width = boxWidth;
    height = boxHeight;
    throttleFn();
  });
  const getNodes = () => {
    const list = get(props.sourceData, 'Nodes') || [];
    nodeList = toRaw(list);
    console.log('nodeList====', nodeList);
  };
  const getEdges = () => {
    const list = get(props.sourceData, 'Edges') || [];
    const edges = toRaw(list);
    edgesList = map(edges, (item) => {
      return {
        ...item,
        source: item.startNode,
        target: item.endNode
      };
    });
    console.log('edgesList===', edgesList);
  };

  const initNodesAndEdges = () => {
    getNodes();
    getEdges();
  };
  const setNodeSize = (data) => {
    const resourceType = get(data, 'resourceType');
    const vulnSummary = get(data, 'vulnSummary') || {};
    // package
    if (NodeType.isPackage(resourceType)) {
      let fill: any = dataColorMap[get(data, 'resourceType')];
      let inactive = dataInactiveColorMap[get(data, 'resourceType')];
      if (vulnSummary.critical) {
        fill = severityMap.get('critical');
        inactive = severityInactiveMap.get('critical');
      } else if (vulnSummary.high) {
        fill = severityMap.get('high');
        inactive = severityInactiveMap.get('high');
      } else if (vulnSummary.medium) {
        fill = severityMap.get('medium');
        inactive = severityInactiveMap.get('medium');
      } else if (vulnSummary.low) {
        fill = severityMap.get('low');
        inactive = severityInactiveMap.get('low');
      } else if (vulnSummary.none) {
        fill = severityMap.get('none');
        inactive = severityInactiveMap.get('none');
      }
      return {
        type: 'circle',
        size: nodeSizeMap.get(data.sizeLevel),
        inactive,
        fill
      };
    }
    // resource
    // if (NodeType.isResource(resourceType)) {
    //   let stroke: any = '102, 143, 204';
    //   let fill: any = '255,255,255';
    //   let inactiveStroke: any = '';
    //   let inactive: any = '228,230,231';
    //   if (vulnSummary.high) {
    //     stroke = severityMap.get('critical');
    //     fill = severityMap.get('critical');
    //     inactiveStroke = severityInactiveMap.get('critical');
    //     inactive = severityInactiveMap.get('critical');
    //   } else if (vulnSummary.medium) {
    //     stroke = severityMap.get('medium');
    //     fill = severityMap.get('medium');
    //     inactiveStroke = severityInactiveMap.get('medium');
    //     inactive = severityInactiveMap.get('medium');
    //   } else if (vulnSummary.low) {
    //     stroke = severityMap.get('low');
    //     fill = severityMap.get('low');
    //     inactiveStroke = severityInactiveMap.get('low');
    //     inactive = severityInactiveMap.get('low');
    //   }
    //   return {
    //     fill: '255,255,255',
    //     stroke: `${stroke},1`,
    //     lineWidth: resourceNodeSizeMap.get(data.sizeLevel),
    //     inactive,
    //     inactiveStroke,
    //     size: 20,
    //   };
    // }
    // file
    return {
      size:
        NodeType.isResource(resourceType) || NodeType.isFile(resourceType)
          ? 25
          : nodeSizeMap.get(data.sizeLevel),
      fill: NodeType.isResource(resourceType)
        ? '255,255,255'
        : dataColorMap[get(data, 'resourceType')],
      type: NodeType.isResource(resourceType) ? 'image' : 'circle',
      inactive: NodeType.isResource(resourceType)
        ? '228,230,231'
        : dataInactiveColorMap[get(data, 'resourceType')]
    };
  };
  const setGraphData = () => {
    const data = {
      nodes: nodeList.map((s) => {
        const nodesizeInfo = setNodeSize(s);
        const img = NodeType.isFile(s.resourceType) ? repoIcon['file'] : null;
        s.size = nodesizeInfo.size;
        s.primaryColor = nodesizeInfo.fill;
        s.inactiveColor = nodesizeInfo.inactive;

        s.icon = {
          show:
            NodeType.isResource(s.resourceType) ||
            NodeType.isFile(s.resourceType),
          height: 12,
          width: 12,
          img: NodeType.isResource(s.resourceType)
            ? repoIcon[get(s, 'properties.provider')]
            : img
        };
        s.style = {
          fill: `rgba(${nodesizeInfo.fill},.8)`,
          lineWidth: NodeType.isResource(s.resourceType) ? 1.5 : 0,
          stroke: NodeType.isResource(s.resourceType)
            ? 'rgba(83, 129, 198,.8)'
            : ''
        };
        s.stateStyles = {
          selected: {
            lineWidth: NodeType.isResource(s.resourceType) ? 1.5 : 0,
            stroke: NodeType.isResource(s.resourceType)
              ? 'rgba(17, 75, 163,.9)'
              : '',
            fill: `rgba(${s.primaryColor},1)`
          },
          hover: {
            lineWidth: NodeType.isResource(s.resourceType) ? 2 : 0,
            fill: `rgba(${s.primaryColor},1)`,
            stroke: NodeType.isResource(s.resourceType)
              ? 'rgba(17, 75, 163,.9)'
              : ''
          },
          highlight: {
            lineWidth: NodeType.isResource(s.resourceType) ? 1.5 : 0,
            fill: `rgba(${s.primaryColor},1)`,
            stroke: NodeType.isResource(s.resourceType)
              ? 'rgba(17, 75, 163,.9)'
              : ''
          },
          inactive: {
            lineWidth: 0,
            fill: `rgb(${s.inactiveColor})`
          },
          disabled: {
            lineWidth: 0,
            fill: `rgb(${s.inactiveColor})`
          }
        };
        return s;
      }),
      edges: edgesList.map((s) => {
        const styleObj: any = {};
        if (s.type === 'AssociatesWith') {
          styleObj.lineWidth = 1.5;
          styleObj.stroke = 'rgba(83, 129, 198,.7)';
        }
        s.style = {
          endArrow: {
            path: G6.Arrow.triangle(3, 3, 20),
            fill: primaryColor,
            fontSize: 5
          },
          ...styleObj
        };
        s.stateStyles = {
          hover: {
            stroke:
              s.type === 'AssociatesWith'
                ? 'rgba(17, 75, 163,.7)'
                : `rgb(${graphColorConfig.edge})`,
            lineWidth: 2
          },
          highlight: {
            lineWidth: 1.5,
            stroke:
              s.type === 'AssociatesWith'
                ? 'rgba(17, 75, 163,.7)'
                : `rgba(${graphColorConfig.edge},1)`
          },
          inactive: {
            stroke: `rgba(${graphColorConfig.inactiveEdge},1)`
          },
          disabled: {
            stroke: `rgba(${graphColorConfig.edge},.5)`
          }
        };
        return s;
      })
    };
    return data;
  };
  const setCollapseMakerOnResourceNode = () => {
    if (!graph) return;
    each(graph.getNodes(), (node) => {
      const model = node.getModel();
      if (
        NodeType.isResource(model.resourceType) &&
        get(model, 'properties.partial')
      ) {
        node.update({
          ...model,
          isCollapsed: true,
          label: '...',
          labelCfg: {
            ...model.labelCfg,
            position: 'bottom',
            offset: -8,
            style: {
              fontSize: 16
            }
          }
        });
      }
    });
  };
  // hide package at depth great than 1
  const hidePackageDefault = () => {
    if (!graph || props.sourceData?.Nodes.length < 1000) return;
    each(graph.getEdges(), (edge) => {
      const model = edge.getModel();
      const depth = get(model, 'properties.depth');
      const edgeTargetNode = edge.getTarget();
      const edgeSourceNode = edge.getSource();
      const resourceType = edgeTargetNode.getModel()?.resourceType;
      if (NodeType.isPackage(resourceType) && depth > 2) {
        graph.hideItem(edgeTargetNode);
        const sourceModel = edgeSourceNode.getModel();
        if (!NodeType.isResource(sourceModel?.resourceType)) {
          const edgeSourceNodeModel = edgeSourceNode.getModel();
          edgeSourceNode.update({
            ...edgeSourceNodeModel,
            isCollapsed: true,
            label: '+',
            labelCfg: {
              ...edgeSourceNodeModel.labelCfg,
              position: 'center'
            }
          });
        }
      }
    });
    each(graph.getNodes(), (node, index) => {
      const model = node.getModel();
      const resourceType = get(model, 'resourceType');
      if (
        Number(index) >= 300 &&
        NodeType.isPackage(resourceType) &&
        node.isVisible() &&
        !model.isCollapsed
      ) {
        graph.hideItem(node);
        // add plus icon on source node
        const neighbors = node.getNeighbors('source');
        each(neighbors, (nNode) => {
          if (!NodeType.isResource(nNode.getModel()?.resourceType)) {
            const nNodeModel = nNode.getModel();
            nNode.update({
              ...nNodeModel,
              label: '+',
              labelCfg: {
                ...nNodeModel.labelCfg,
                position: 'center'
              }
            });
          }
        });
      }
    });
    // graph.refresh()
  };
  const setResourceEdgeStyle = () => {
    if (!graph) return;
    graph.edge((edge) => {
      const source = edge.getSource();
      const target = edge.getTarget();
      if (
        get(source.getModel(), 'resourceType') === 'Resource' &&
        get(target.getModel(), 'resource') === 'Resource'
      ) {
        return {
          id: edge.id,
          style: {
            lineWidth: 2,
            stroke: 'rgba(17, 75, 163,.8)'
          }
        };
      }
      return edge;
    });
  };
  const renderGraph = () => {
    if (!graph) return;
    const data = setGraphData();
    graph.data(data);
    graph.render();
  };
  const clearAllStats = () => {
    if (!graph) return;
    const autoPaint = graph.get('autoPaint');
    graph.setAutoPaint(false);
    currentActivedLink = [];
    currentActivedNode = null;
    graph.getNodes().forEach(function (node) {
      graph.clearItemStates(node);
    });
    graph.getEdges().forEach(function (edge) {
      graph.clearItemStates(edge);
    });
    graph.paint();
    graph.setAutoPaint(autoPaint);
  };

  onClickOutside(ChartMountWrap, (ev) => {
    // clearAllStats();
  });
  const refreshDragedNodePosition = (e) => {
    const model = e.item.get('model');
    model.fx = e.x;
    model.fy = e.y;
  };
  const updateGraphViewBySwitch = (fn, viewOn?: boolean) => {
    // const typeParams = get(params, type) || [];
    clearAllStats();
    each(graph.getNodes(), (node) => {
      const nodeModel = node.getModel();
      const updateFlag = fn?.(nodeModel);
      if (updateFlag !== -1) {
        if (updateFlag) {
          graph.setItemState(node, 'highlight', true);
          // graph.setItemState(node, 'inactive', false);
          node.unlock();
          node.toFront();
        } else {
          graph.setItemState(node, 'inactive', true);
          // graph.setItemState(node, 'highlight', false);
          node.lock();
          node.toBack();
        }
      }
    });
    each(graph.getEdges(), (edge) => {
      const edgeSourceModel = edge.getSource()?.getModel();
      const edgeTargetModel = edge.getTarget()?.getModel();
      const edgeSourceUpdateFlag = fn?.(edgeSourceModel);
      const edgeTargetUpdateFlag = fn?.(edgeTargetModel);
      // source
      if (edgeSourceUpdateFlag !== -1) {
        if (edgeSourceUpdateFlag) {
          graph.setItemState(edge, 'highlight', true);
          // graph.setItemState(edge, 'inactive', false);
          edge.toFront();
        } else {
          graph.setItemState(edge, 'inactive', true);
          // graph.setItemState(edge, 'highlight', false);
          edge.toBack();
        }
      }
      // target
      if (edgeTargetUpdateFlag !== -1) {
        if (edgeTargetUpdateFlag) {
          graph.setItemState(edge, 'highlight', true);
          // graph.setItemState(edge, 'inactive', false);
          edge.toFront();
        } else {
          graph.setItemState(edge, 'inactive', true);
          // graph.setItemState(edge, 'highlight', false);
          edge.toBack();
        }
      }
    });
    // graph.fitView()
  };
  // click select node
  const getRelateNodesAndEdges = (node, type) => {
    const result: Node[] = [];
    const stack: Node[] = [];
    stack.push(node);
    while (stack.length) {
      const currentNode: Node = stack.pop() as Node;
      result.push(currentNode);
      const neighbors: Node[] = currentNode?.getNeighbors(type) as Node[];
      const filterNeighbors = filter(neighbors, (item) => {
        const hasExist = result.find((s) => {
          return s === item;
        });
        return !hasExist;
      });
      if (filterNeighbors.length) {
        each(filterNeighbors, (item) => {
          stack.push(item);
        });
      }
    }
    return result;
  };
  const getOffsetInDrag = (e) => {
    const { item } = e;
    const model = item.getModel();
    const dx: any = e.x - model.fx;
    const dy: any = e.y - model.fy;
    model.fx = e.x;

    model.fy = e.y;
    graph.updateItem(item, model);
    return { dx, dy };
  };
  const updateLayoutInDrag = (nodes: Node[], type: string, e) => {
    const offset = getOffsetInDrag(e);
    if (type === 'start') {
      each(nodes, (node) => {
        const model = node.getModel();
        model.fx = null;
        model.fy = null;
        model.vx = 0;
        model.vy = 0;
        // model.x = undefined
        // model.y = undefined
        // model.fx += offset.dx;
        // model.fy += offset.dy;
        node.clearCache();
        // graph.updateItem(node, model);
      });
    }
    if (type === 'end') {
      each(nodes, (node) => {
        const model = node.getModel();
        model.fx = null;
        model.fy = null;
        model.vx = 0;
        model.vy = 0;
        // model.fx += offset.dx;
        // model.fy += offset.dy;
        node.clearCache();
        // graph.updateItem(node, model);
      });
    }
  };
  const dragNode = (node, type, e) => {
    // const nodes: Node[] = getRelateNodesAndEdges(node, 'target');

    const nodes: Node[] = node.getNeighbors('target');
    updateLayoutInDrag(nodes, type, e);
  };
  // expand target node
  const getExpandTargtNodes = (node) => {
    const hasExpand = expandedNodeList.find(
      (expandedNode) => expandedNode === node
    );
    if (hasExpand) {
      return false;
    }
    const result: Node[] = [];
    const stack: Node[] = [];
    stack.push(node);
    while (stack.length) {
      const currentNode: Node = stack.pop() as Node;
      const neighbors: Node[] = currentNode?.getNeighbors('target') as Node[];
      const filterNeighbors = filter(neighbors, (item) => {
        const hasExist = result.find((s) => {
          return s === item;
        });
        return !hasExist && !item.isVisible();
      });
      if (filterNeighbors.length) {
        each(filterNeighbors, (item) => {
          stack.push(item);
          result.push(item);
        });
      }
    }
    if (result.length) {
      // clearAllStats();
      each(result, (vulnNode) => {
        graph.showItem(vulnNode);
        // reset the label value,sometimes vulnNode has plus icon that added at the init graph moment.
        const vulnNodeModel = vulnNode.getModel();
        vulnNode.update({
          ...vulnNodeModel,
          label: vulnNodeModel.name as string,
          isCollapsed: false,
          labelCfg: {
            ...vulnNodeModel.labelCfg,
            position: 'top'
          }
        });
      });
      // remove target's plus icon
      const nodeModel = node.getModel();
      node.update({
        ...nodeModel,
        isCollapsed: false,
        label: nodeModel.name || '',
        labelCfg: {
          ...nodeModel.labelCfg,
          position: 'top'
        }
      });
      graph.updateLayout();
      clearTimeout(updateTimer);
      updateTimer = setTimeout(() => {
        updateGraphViewBySwitch(props.filerViewByMode);
      }, 100);
    }
    expandedNodeList = concat(expandedNodeList, result);
    return !!result.length;
  };
  // clear node state
  const clearState = (activeNode) => {
    graph.getNodes().forEach((node) => {
      if (node !== activeNode) {
        graph.clearItemStates(node);
      }
    });
    graph.getEdges().forEach((edge) => {
      graph.clearItemStates(edge);
    });
  };
  // set nodes edgs state inactive or highlight
  const setNodeAndeEdgesState = (list: Node[], active?: boolean) => {
    // all nodes
    each(graph.getNodes(), (node) => {
      if (active) {
        graph.setItemState(node, 'inactive', true);
        graph.setItemState(node, 'highlight', false);
        node.toBack();
        each(node.getEdges() || [], (edge) => {
          graph.setItemState(edge, 'inactive', true);
          graph.setItemState(node, 'highlight', false);
          edge.toBack();
        });
      } else {
        graph.setItemState(node, 'highlight', true);
        node.toFront();
        each(node.getEdges() || [], (edge) => {
          graph.setItemState(edge, 'highlight', true);
          edge.toFront();
        });
      }
    });
    // relate to select nodes
    each(list, (node) => {
      if (active) {
        graph.setItemState(node, 'highlight', true);
        node.toFront();
        each(node.getEdges(), (edge) => {
          const edgeTargetNode = edge.getTarget();
          const edgeSourceNode = edge.getSource();
          if (
            edgeTargetNode.getStates().includes('highlight') &&
            edgeSourceNode.getStates().includes('highlight')
          ) {
            graph.setItemState(edge, 'highlight', true);
            edge.toFront();
          }
        });
      } else {
        graph.setItemState(node, 'inactive', true);
        node.toBack();
        each(node.getEdges(), (edge) => {
          graph.setItemState(edge, 'inactive', true);
          edge.toBack();
        });
      }
    });
  };
  const getCurrentNodeRelation = (node) => {
    const autoPaint = graph.get('autoPaint');
    graph.setAutoPaint(false);
    const targetNodes = getRelateNodesAndEdges(node, 'target');
    const sourceNodes = getRelateNodesAndEdges(node, 'source');
    currentActivedLink = [...targetNodes, ...sourceNodes];
    setNodeAndeEdgesState(currentActivedLink, true);
    graph.paint();
    graph.setAutoPaint(autoPaint);
  };
  const initNodeEvent = () => {
    // node events
    graph.on('node:click', (ev) => {
      const node = ev.item;
      const modelData = node.getModel();
      const isShowChild = false;
      if (node.hasLocked()) {
        graph.clearItemStates(node, 'selected');
        return;
      }
      if (currentActivedNode === modelData.id) {
        return;
      }
      // highlight relate to current selected node
      if (!some(graph.getNodes(), (n) => n.hasLocked())) {
        clearAllStats();
      }
      // getCurrentNodeRelation(node);
      // isShowChild = getExpandTargtNodes(node);
      // it means expand all the chilren nodes first,then highlight the path.
      currentActivedNode = modelData.id;
      emits('nodeClick', modelData);
    });

    graph.on('node:mouseenter', (ev) => {
      const { item } = ev;
      console.log('state===', item.getStates());
      if (!item.hasState('inactive')) {
        item.unlock();
      }
      graph.setItemState(item, 'hover', true);
    });
    graph.on('node:mouseleave', (ev) => {
      const { item } = ev;
      item.lock();
      graph.setItemState(item, 'hover', false);
    });
    graph.on('node:dragstart', (e) => {
      const { item } = e;
      dragNode(item, 'start', e);
      graph.layout();
      refreshDragedNodePosition(e);
    });

    graph.on('node:drag', (e) => {
      const { item } = e;
      dragNode(item, 'start', e);
      graph.layout();
      refreshDragedNodePosition(e);
    });

    graph.on('node:dragend', (e) => {
      const { item } = e;
      dragNode(item, 'end', e);
      e.item.get('model').fx = e.x;
      e.item.get('model').fy = e.y;
      graph.layout();
      needLockPosition = true;
    });
  };
  const initEdgeEvent = () => {
    // edge events
    graph.on('edge:mouseenter', (ev) => {
      const { item } = ev;
      graph.setItemState(item, 'hover', true);
    });
    graph.on('edge:mouseleave', (ev) => {
      const { item } = ev;
      graph.setItemState(item, 'hover', false);
    });
    graph.on('edge:click', (ev) => {
      emits('edgeClick', ev);
    });
  };
  const initEvents = () => {
    graph.on('canvas:click', (ev) => {
      if (props.filterViewEnable) {
        return;
      }
      clearAllStats();
      emits('canvasClick', ev);
    });
    initNodeEvent();
    initEdgeEvent();
  };
  const fitView = () => {
    graph.fitView();
  };
  const lockNodePosition = () => {
    each(graph.getNodes(), (node) => {
      const model = node.getModel();
      // if (
      //   NodeType.isResource(model.resourceType) ||
      //   NodeType.isFile(model.resourceType)
      // ) {
      //   model.fx = model.x;
      //   model.fy = model.y;
      // }
      model.fx = model.x;
      model.fy = model.y;
      node.lock();
      node.clearCache();
      graph.updateItem(node, model);
    });
  };
  const createToolTip = () => {
    const toolTip = new G6.Tooltip({
      offsetX: 5,
      offsetY: 5,
      itemTypes: ['node'],
      getContent(e) {
        const provider = get(
          e?.item?.getModel(),
          'properties.provider'
        ) as string;
        const box = document.createElement('div');
        box.style.width = 'max-content';
        box.innerHTML = `
            <span>${get(e?.item?.getModel(), 'properties.name')}</span>
            </div>
        `;
        return box;
      }
    });
    return toolTip;
  };

  const createGraph = () => {
    console.log('width==height==', width, height);
    const toolTip = createToolTip();
    graph = new G6.Graph({
      container: 'chart-mount',
      width: width || 1400, // 1400
      height: height || 500,
      defaultNode,
      defaultEdge,
      fitViewPadding: [0, 0, 0, 0],
      plugins: [toolTip],
      linkCenter: true,
      animate: false,
      layout: {
        type: 'force',
        gravity: 0,
        factor: 0,
        clustering: false,
        center: [width / 2 || 700, height / 2 || 270],
        animate: false,
        workerEnabled: false,
        preventOverlap: true,
        alpha: 0.15,
        alphaMin: 0.003,
        alphaDecay: 0.05,
        minMovement: 50,
        speed: 100,
        maxSpeed: 300,
        // damping: 0,
        // coulombDisScale: 0,
        maxIteration: 1000,
        nodeSpacing: 20,
        // linkDistance(d) {
        //   if (NodeType.isResource(d.resourceType)) {
        //     return 150;
        //   }
        //   return 50;
        // },
        getMass() {
          return 10;
        },
        clusterNodeStrength(d) {
          if (
            NodeType.isResource(d.resourceType) ||
            NodeType.isFile(d.resourceType)
          ) {
            return -10;
          }
          return 0;
        },
        clusterEdgeStrength: 0.1,
        nodeStrength: (d) => {
          if (
            NodeType.isResource(d.resourceType) ||
            NodeType.isFile(d.resourceType)
          ) {
            return 30;
          }
          return 0;
        },
        edgeStrength: 0,
        onLayoutEnd() {
          t2 = window.performance.now();
          console.log('layoutend===', t2 - t1);
          if (needFitView) {
            emits('layoutEnd');
            clearTimeout(fitViewTimer);
            fitViewTimer = setTimeout(() => {
              graph?.fitView();
            }, 100);
            needFitView = false;
          }
          if (needLockPosition) {
            clearTimeout(lockNodeTimer);
            lockNodeTimer = setTimeout(() => {
              lockNodePosition();
            }, 100);
            needLockPosition = false;
          }
        }
      },
      modes
    });
  };

  const init = () => {
    graph?.clear();
    graph?.off();
    initNodesAndEdges();
    createGraph();
    renderGraph();
    initEvents();
    setCollapseMakerOnResourceNode();
  };
  const updateGraph = () => {
    graph?.clear();
    needFitView = true;
    needLockPosition = true;
    initNodesAndEdges();
    const data = setGraphData();
    graph.read(data);
    setCollapseMakerOnResourceNode();
    // initEvents();
  };
  watch(
    () => props.sourceData?.Nodes,
    () => {
      if (graph && chartMount.value) {
        t1 = window.performance.now();
        updateGraph();
      } else if (chartMount.value) {
        t1 = window.performance.now();
        init();
      }
    },
    {
      immediate: true
    }
  );
  defineExpose({
    fitView,
    clearAllStats,
    updateGraphViewBySwitch
  });
  // onUnmounted(() => {
  //   window.removeEventListener('resize', () => {
  //     throttleFn();
  //   });
  // });
  onBeforeUnmount(() => {
    graph?.clear();
    graph?.destroy();
  });
</script>

<style lang="less" scoped>
  .chart-box {
    width: 100%;
    background: rgba(230, 244, 254, 30%);
  }

  .chart-mount {
    height: calc(100vh - 170px);
  }
</style>

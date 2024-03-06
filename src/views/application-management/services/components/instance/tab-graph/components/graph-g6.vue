<script lang="tsx">
  import {
    defineComponent,
    ref,
    nextTick,
    PropType,
    watch,
    onBeforeUnmount,
    computed
  } from 'vue';
  import _ from 'lodash';
  import i18n from '@/locale';
  import { useAppStore } from '@/store';
  import resourceImages from '@/views/application-management/resource-images';
  import serviceImg from '@/assets/images/service.png';
  import resourceImg from '@/assets/images/resource.png';
  import dependencyIcon from '@/assets/images/dependency-03.png';
  import compositionIcon from '@/assets/images/composition-03.png';
  import realizationIcon from '@/assets/images/realization-03.png';
  import G6 from '@antv/g6';
  import { useResizeObserver } from '@vueuse/core';
  import { loadImage, createCanvasImage } from '@/utils/load-canvas-image';
  import { defineCustomNode, defaultNode } from '../config/common';
  import { createToolTip } from '../config/plugins';
  import { fittingString } from '../config/utils';
  import {
    statusMap,
    edgeType,
    nodeKindType,
    customeLegend,
    darkNodeStyle
  } from '../config';
  import { ICombo, IEdge, INode } from '../config/interface';
  import { setServiceStatus, Status } from '../../../../config';
  import { getResourceKeyList } from '../../../../config/utils';
  import ResourceControl from '../../resource-control.vue';
  import useResourceControl from '../../../hooks/use-resource-control';
  import DriftResource from '../../../drift-resource.vue';

  export default defineComponent({
    emits: ['nodeClick', 'canvasClick'],
    props: {
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
      },
      pageType: {
        type: String as PropType<'environment' | 'service'>,
        default() {
          return 'environment';
        }
      },
      containerHeight: {
        type: String,
        default() {
          return '600px';
        }
      }
    },
    setup(props, { expose, slots, emit }) {
      const {
        modalType,
        drawerTabs,
        terminalShow,
        updateActive,
        handleViewLogs,
        handleConnectTerminal,
        handleTerminalDelete
      } = useResourceControl();
      const pageTypeScope = {
        ENVIRONMENT: 'environment',
        SERVICE: 'service'
      };
      const showDriftModal = ref(false);
      const driftChangeData = ref({});
      const resourceNodeInfo = ref({});
      const graphMount = ref();
      const graphWrapper = ref();
      const loading = ref(false);
      const animateFlag = ref(false);
      const allNodeToggle = ref(false);
      const nodeList = ref<INode[]>([]);
      const edgeList = ref<IEdge[]>([]);
      let graph: any = null;
      const width = ref(0);
      const height = ref(0);
      const toolTipRef = ref<any>({});
      const contextMenu = ref<any>({});
      const contextMenuNode: any = { value: null };
      const appStore = useAppStore();

      contextMenu.value = new G6.Menu({
        trigger: 'click',
        shouldBegin(e) {
          // click more button
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
          const drifted = model?.drifted;
          if (!logabble && !executable && !drifted) {
            return '';
          }

          const renderDriftHtml = () => {
            if (!drifted) return '';
            return `<li code="drift" class="iconfont icon-xiangqing-">
                ${i18n.global.t('applications.service.resource.driftInfo')}
              </li>`;
          };

          const renderLogHtml = () => {
            if (!logabble) return '';
            return ` <li code="log" class="iconfont icon-log">
                ${i18n.global.t('applications.instance.tab.log')}
              </li>`;
          };
          const renderExecHtml = () => {
            if (!executable) return '';
            return `<li code="exec" class="iconfont icon-terminal">
                ${i18n.global.t('applications.instance.tab.term')}
              </li>`;
          };

          return `<div id="contextMenu-wrapper">
                <ul>
                  ${renderDriftHtml()}
                  ${renderLogHtml()}
                  ${renderExecHtml()}
                </ul>
              </div>`;
        },
        handleMenuClick: (target, item) => {
          const code = target.getAttribute('code');
          const model = item.getModel();
          resourceNodeInfo.value = model;

          if (code === 'log') {
            handleViewLogs({
              ...(_.get(model, 'extensions') || {}),
              id: model.nodeId,
              name: model.name
            });
            return;
          }
          if (code === 'exec') {
            handleConnectTerminal({
              ...(_.get(model, 'extensions') || {}),
              id: model.nodeId,
              name: model.name
            });
          }
          if (code === 'drift') {
            driftChangeData.value =
              _.get(model, 'extensions.drift.drift.change') || {};
            showDriftModal.value = true;
          }
        },
        offsetX: 16 + 10,
        offsetY: 0,
        itemTypes: ['node']
      });

      const wrapHeight = computed(() => {
        return props.isFullscreen ? '100vh' : props.containerHeight;
      });
      const setGraphToCenter = () => {
        // get the center of the canvas
        const width = graph?.getWidth?.();
        const height = graph?.getHeight?.();
        const centerX = width / 2;
        const centerY = height / 2;
        graph?.zoomTo(1, { x: centerX, y: centerY });
      };
      const fitView = () => {
        const nodes = graph?.findAll('node', (node) => {
          return node.isVisible();
        });
        if (nodes.length <= 5) {
          graph?.fitView?.();
          nextTick(() => {
            setGraphToCenter();
          });
          return;
        }
        graph?.fitView();
      };
      const handleWindowResize = () => {
        if (!graph || graph?.get('destroyed')) return;
        if (!width.value || !height.value) return;
        graph?.changeSize(width.value, height.value);
        fitView();
      };

      useResizeObserver(graphWrapper, (entries) => {
        const entry = entries[0];
        const { width: boxWidth, height: boxHeight } = entry.contentRect;
        width.value = boxWidth;
        height.value = boxHeight < 600 ? 600 : boxHeight;
        if (boxHeight < 600) {
          graphWrapper.value.style.height = '600px';
        }
        handleWindowResize();
      });

      const removeVersions = (inputString) => {
        return _.replace(inputString, /_v[\d]/g, '');
      };
      const hasCompositionNodeEdgeFilter = (edge) => {
        // service page
        if (props.pageType === pageTypeScope.SERVICE)
          return edge.edgeType === edgeType.Realization;
        // environment page
        return [edgeType.Composition, edgeType.Realization].includes(
          edge.edgeType
        );
      };
      const hasCompositionNodes = (node) => {
        return _.some(props.sourceData.links, (item) => {
          return (
            _.get(item, 'source') === node.id &&
            hasCompositionNodeEdgeFilter(item)
          );
        });
      };
      const setNodeDescription = (node) => {
        if (_.hasIn(node.extensions, 'isService')) {
          return node.extensions.isService
            ? i18n.global.t('applications.applications.table.service')
            : i18n.global.t('applications.applications.table.resource');
        }
        return _.get(node, 'extensions.type') || _.get(node, 'kind');
      };

      const setNodeList = async () => {
        const { sourceData: data } = props;
        const style = {
          lineWidth: 1,
          stroke: 'transparent',
          cursor: 'grabbing'
        };
        nodeList.value = _.map(data.nodes || [], (o) => {
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
            setServiceStatus(_.get(node, 'status')) === Status.Warning;
          node.resourceType =
            removeVersions(_.get(node, 'extensions.type')) ||
            _.get(node, 'kind');

          node.isFullscreen = props.isFullscreen;
          node.isCollapsed = props.showAll;
          node.hasComposition = hasCompositionNodes(node);
          node.providerType = _.get(_.split(node.resourceType, '_'), '0') || '';
          node.subType = _.get(node, 'data.type');
          node.type = 'resource';

          // ========== node loggable and executable ==========
          node.loggableInfo = {
            loggable: !!loggableList.length,
            data: loggableList
          };
          node.executableInfo = {
            executable: !!execList.length,
            data: loggableList
          };

          // ========== node drifted ==========
          node.descTips = setNodeDescription(node);
          node.drifted = _.get(node, 'extensions.drift.drifted') || false;

          if (_.get(node, 'kind') !== nodeKindType.ServiceResource) {
            node.description = fittingString(node.descTips, 120);
            node.label = fittingString(node.name, 120);
          } else {
            node.label = fittingString(node.name, 112);
          }

          // ========== state icon ==========
          node.stateIcon = {
            animate,
            width: animate ? 20 : 14,
            height: animate ? 20 : 14,
            show: true,
            img: _.get(statusMap, setServiceStatus(_.get(node, 'status')))
          };

          // ========== logo icon ==========
          const defaultImg =
            resourceImages.get(node.providerType)?.get(node.resourceType) ||
            (_.get(node, 'extensions.isService') ? serviceImg : resourceImg);

          node.logoIcon = {
            width: 32,
            height: 32,
            offset: -25,
            img: node.icon || defaultImg
          };

          // updateNodeImage(node, defaultImg);

          // ========== node state style ==========
          if (_.get(node, 'kind') === nodeKindType.ServiceResourceGroup) {
            node.style = {
              ...style,
              fill: node.drifted ? 'rgba(247, 186, 30,.5)' : '#e8f2ff',
              radius: 30
            };

            node.stateStyles = {
              inactive: {
                fill: node.drifted
                  ? 'rgba(247, 186, 30,.2)'
                  : 'rgba(232,242,255,.5)'
              },
              highlight: {
                fill: node.drifted
                  ? 'rgba(247, 186, 30,.7)'
                  : 'rgba(142, 173, 231,.7)'
              },
              selected: {
                stroke: node.drifted
                  ? 'rgba(247, 186, 30,.8)'
                  : 'rgb(33, 74, 196)',
                lineWidth: 1
              },
              hover: {
                stroke: node.drifted
                  ? 'rgba(247, 186, 30,.8)'
                  : 'rgb(33, 74, 196)',
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
        edgeList.value = _.map(data.links || [], (o) => {
          const link = _.cloneDeep(o);
          const style: any = {};
          if (o.edgeType === edgeType.Dependency) {
            style.lineWidth = 1.5;
            style.lineDash = [5, 5];
            const targetNode = _.find(nodeList.value, (item) => {
              return item.id === o.target;
            });

            if (targetNode) {
              targetNode.UMLDependencyIcon = dependencyIcon;
            }
          }

          if (o.edgeType === edgeType.Composition) {
            // style.endArrow = false;
            // style.startArrow = {
            //   path: G6.Arrow.diamond(12, 14, -7),
            //   fill: 'rgba(102, 139, 220,1)'
            // };
            const sourceNode = _.find(nodeList.value, (item) => {
              return item.id === o.source;
            });
            if (sourceNode) {
              sourceNode.UMLCompositionIcon = {
                img: compositionIcon,
                width: 14,
                height: 14
              };
              console.log('icon========', sourceNode);
            }
          }

          if (o.edgeType === edgeType.Realization) {
            // style.endArrow = {
            //   path: G6.Arrow.triangle(8, 8, 0),
            //   fill: '#86909c'
            // };
            style.stroke = '#86909c';
            style.lineDash = [8, 3, 3];
            const targetNode = _.find(nodeList.value, (item) => {
              return item.id === o.target;
            });
            if (targetNode) {
              targetNode.UMLRealizationIcon = realizationIcon;
            }
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
      // update each node theme
      const updateNodeTheme = () => {
        _.each(graph?.getNodes(), (item) => {
          const model = item.getModel();
          console.log('model=============', model);
          graph.updateItem(item, {
            ...model,
            style: {
              ...model.style,
              ...darkNodeStyle.style
            }
          });
        });
        graph?.changeData();
      };
      const nodeFilter = (model) => {
        // service page
        if (props.pageType === pageTypeScope.SERVICE)
          return model.kind === nodeKindType.ServiceResource;
        // environment page
        return (
          model.kind === nodeKindType.ServiceResource ||
          model.kind === nodeKindType.ServiceResourceGroup
        );
      };
      const toggleAllNodeShow = (show) => {
        _.each(graph?.getNodes(), (node) => {
          const model = node.getModel();
          if (show) {
            graph?.showItem(node);
          } else if (nodeFilter(model)) {
            graph?.hideItem(node);
          }
          if (model.hasComposition) {
            graph.updateItem(node, {
              ...model,
              UMLCompositionIcon: {
                ...model.UMLCompositionIcon,
                img: compositionIcon
              },
              isCollapsed: show
            });
            // graph.refreshItem(node);
          }
        });
        animateFlag.value = true;
        allNodeToggle.value = true;
        if (graph?.getZoom() !== 1) {
          graph?.zoomTo(1);
        }

        graph?.layout();
        graph?.set('animate', false);
      };
      const renderGraph = () => {
        if (!graph) return;
        graph?.data({
          nodes: nodeList.value,
          edges: edgeList.value
        });
        graph?.render();
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
            return nodeFilter(model);
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

        _.each(result, (nd) => {
          if (model.isCollapsed) {
            graph?.hideItem(nd);
          } else {
            graph?.showItem(nd);
          }

          graph.updateItem(nd, {
            ...nd.getModel(),
            isCollapsed: !model.isCollapsed
          });
        });

        graph.updateItem(node, {
          ...model,
          isCollapsed: !model.isCollapsed
        });

        // graph.refreshItem(node);
        animateFlag.value = true;

        graph?.layout();
        graph?.set('animate', true);
      };
      const handleLegengHover = (item) => {
        _.each(graph?.getEdges(), (edge) => {
          const model = edge.getModel();
          if (item.type === model.edgeType) {
            edge.toFront();
            graph?.setItemState(edge, 'hover', true);
          } else {
            edge.toBack();
            graph?.setItemState(edge, 'inactive', true);
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
            graph?.setItemState(node, 'inactive', true);
          } else {
            node.toFront();
            graph?.setItemState(node, 'highlight', true);
          }
        });
      };
      const handleLegengLeave = (item) => {
        _.each(graph?.getEdges(), (edge) => {
          graph?.clearItemStates(edge);
        });
        _.each(graph?.getNodes(), (node) => {
          graph?.clearItemStates(node);
        });
      };
      const resetContextMenuNode = () => {
        const contextVisibility =
          contextMenu.value?.get('menu')?.style?.visibility;
        if (contextVisibility === 'hidden') {
          contextMenuNode.value = null;
        }
      };
      const isClickMoreButton = (e) => {
        return _.get(e?.target, 'cfg.name') === 'more-button-icon';
      };
      const initNodeEvent = () => {
        graph?.on('node:mouseenter', (e) => {
          graph?.setItemState(e.item, 'hover', true);
          resetContextMenuNode();
        });

        graph?.on('node:mouseleave', (e) => {
          const node = e.item;
          graph?.setItemState(e.item, 'hover', false);
        });

        graph?.on('node:click', (e) => {
          if (isClickMoreButton(e)) return;
          const node = e.item;
          const model = node.getModel();
          toggleNodeCollapse(node);

          graph?.setItemState(node, 'selected', true);
          emit('nodeClick', model);
        });
        graph?.on('edge:mouseenter', (e) => {
          const edge = e.item;
          const model = edge.getModel();
          edge.update({
            ...model,
            label: model.edgeType
          });
          edge.toFront();

          graph?.setItemState(edge, 'hover', true);
        });
        graph?.on('edge:mouseleave', (e) => {
          const edge = e.item;
          const model = edge.getModel();
          edge.update({
            ...model,
            label: ''
          });
          edge.toBack();
          graph?.setItemState(edge, 'hover', false);
        });
        graph?.on('canvas:click', (ev) => {
          emit('canvasClick', ev);
        });
      };

      const createGraph = () => {
        graph = new G6.Graph({
          renderer: 'svg', // arrow style will be change
          container: 'graph-mount',
          plugins: [
            contextMenu.value,
            (toolTipRef.value = createToolTip(contextMenuNode))
          ],
          width: width.value || 1400,
          height: height.value || 600,
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
                if (allNodeToggle.value) {
                  graph?.fitCenter?.(animateFlag.value);
                  animateFlag.value = false;
                  allNodeToggle.value = false;
                }
              });
            }
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
              // endArrow: {
              //   path: G6.Arrow.vee(8, 8, 0),
              //   fill: 'rgba(102, 139, 220,1)',
              //   lineDash: [0, 0]
              // },
              lineWidth: 1.2,
              stroke: 'rgba(66, 106, 208,.8)'
            }
          },
          edgeStateStyles: {
            hover: {
              lineWidth: 4,
              opacity: 0.8,
              animate: true
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
        graph?.read({ nodes: nodeList.value, edges: edgeList.value });
        toggleAllNodeShow(props.showAll);
      };
      const updateGraph = () => {
        loading.value = true;
        graph?.clear();
        initData();
        graph?.read({ nodes: nodeList.value, edges: edgeList.value });
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
      expose({
        fitView,
        toggleAllNodeShow
      });
      // watch(
      //   () => appStore.isDark,
      //   () => {
      //     if (graph && graphMount.value) {
      //       updateNodeTheme();
      //     }
      //   },
      //   {
      //     immediate: false
      //   }
      // );
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

      return () => (
        <div>
          <a-grid cols={24}>
            <a-grid-item span={24}>
              <div
                ref={(el) => {
                  graphWrapper.value = el;
                }}
                class="graph-wrapper"
                style={{
                  height: `max(${wrapHeight.value}, 600px, ${props.containerHeight})`,
                  width: '100%'
                }}
              >
                <div
                  id="graph-mount"
                  ref={(el) => {
                    graphMount.value = el;
                  }}
                  class={[
                    'graph-mount',
                    {
                      isFullscreen: props.isFullscreen,
                      dark: appStore.theme === 'dark'
                    }
                  ]}
                ></div>
                <div class="legend">
                  <a-space size={20}>
                    {_.map(customeLegend, (item) => {
                      return (
                        <>
                          <span
                            key={item.label}
                            class="legend-item"
                            onMouseenter={() => handleLegengHover(item)}
                            onMouseleave={() => handleLegengLeave(item)}
                          >
                            <img src={item.icon} alt="" class="img" />
                            {item.label}
                          </span>
                        </>
                      );
                    })}
                  </a-space>
                </div>
                <div class="toolbar">{slots?.toolbar?.()}</div>
              </div>
            </a-grid-item>
          </a-grid>
          <ResourceControl
            v-model:visible={terminalShow.value}
            v-model:tabs={drawerTabs.value}
            update-active={updateActive.value}
            type={modalType.value}
            onDelete={(val) => handleTerminalDelete(val)}
          ></ResourceControl>
          <DriftResource
            v-model:show={showDriftModal.value}
            title={i18n.global.t('applications.service.resource.drift')}
            change-data={driftChangeData.value}
            single={true}
          ></DriftResource>
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  @import url('../style/modelRect-keyShape.less');

  @height: 610px;

  .graph-wrapper {
    position: relative;
    width: 100%;
    min-height: 50vh;
    background-color: var(--color-fill-1);
    border-radius: var(--border-radius-small);

    .legend {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 6px 8px;
      font-size: var(--font-size-small);
      background-color: rgba(var(--color-background-1), 0.8);
      border-radius: 4px;

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
      background-color: rgba(var(--color-background-1), 0.8);
    }

    .graph-mount {
      position: relative;
      // &.dark {
      //   filter: var(--color-filter-inverted);
      // }
      &.isFullscreen {
        height: 100vh;
      }
    }
  }
</style>

<style lang="less">
  @import url('../style/g6-component-tooltip.less');

  .graph-mount {
    .g6-component-contextmenu {
      padding: 6px 8px;
      border: none;
      box-shadow: rgba(174, 174, 174, 0.5) 0 0 10px !important;
    }
  }

  .uml-comp-icon {
    display: none;
  }

  #contextMenu-wrapper {
    .res-name {
      font-weight: var(--font-weight-medium);
      font-size: var(--font-size-small);
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

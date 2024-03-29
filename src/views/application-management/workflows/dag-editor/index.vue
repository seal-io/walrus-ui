<script lang="tsx">
  import '@antv/x6-vue-shape';
  import _ from 'lodash';
  import { Cell, Node, Point } from '@antv/x6';
  import dagre from 'dagre';
  import { PageAction } from '@/views/config';
  import {
    defineComponent,
    onMounted,
    PropType,
    ref,
    nextTick,
    watch,
    computed
  } from 'vue';
  import { useAppStore } from '@/store';
  import { deleteModal } from '@/utils/monitor';
  import { useResizeObserver } from '@vueuse/core';
  import resigterNode from './shapes';
  import createGraph from './core/graph';
  import initEvents from './core/events';
  import { ArgoTestData } from '../config/argo-test';
  import dagData from '../config/dag-data';
  import { parseWorkflowSpec } from './utils';
  import { NODE_SIZE, NODE_GAP, NodeShape, tools } from './config';
  import { Workflow } from './config/interface';
  import ToolBar from '../components/tool-bar.vue';
  import BasicInfo from './components/basic-info.vue';
  import CreateFlowTask from '../components/create-flow-task.vue';

  export default defineComponent({
    emits: ['refresh'],
    props: {
      containerHeight: {
        type: String,
        default: '100%'
      },
      loading: {
        type: Boolean,
        default: false
      },
      dagData: {
        type: Object,
        default() {
          return {};
        }
      },
      action: {
        type: String as PropType<'create' | 'edit' | 'view'>,
        default: PageAction.EDIT
      }
    },
    setup(props, { emit, expose }) {
      let graphIns: any = null;
      const container = ref();
      const stencilContainer = ref();
      const graphWrapper = ref();
      const basicForm = ref();
      const appStore = useAppStore();
      const width = ref(0);
      const height = ref(0);
      const showModal = ref(false);
      const activeStep = ref({});
      const activeNode = ref<any>({});
      const nodeAction = ref<'create' | 'edit'>('create');
      const basicInfo = ref({
        name: '',
        description: '',
        parallelism: 10,
        timeout: null
      });

      const historyState = ref({
        canRedo: false,
        canUndo: false
      });
      const dir: any = 'LR';

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

      const toolList = computed(() => {
        return tools
          .map((item) => {
            let disabled = false;
            if (item.value === 'redo') {
              disabled = !historyState.value.canRedo;
            }
            if (item.value === 'undo') {
              disabled = !historyState.value.canUndo;
            }
            return {
              ...item,
              disabled
            };
          })
          .filter((item) => {
            if (props.action === PageAction.VIEW) {
              return ['fitCenter', 'refresh'].includes(item.value);
            }
            return true;
          });
      });

      const setBasicInfo = () => {
        if (props.action === PageAction.CREATE) return;
        const data = _.get(props.dagData, 'metadata', {});
        basicInfo.value = {
          name: data.name,
          description: data.description,
          parallelism: _.get(data, 'spec.parallelism', 10),
          timeout: _.get(data, 'spec.activeDeadlineSeconds', null)
        };
      };
      const updateNodeParameters = (data) => {
        const params = _.map(_.keys(data), (key) => {
          return {
            name: key,
            value: JSON.stringify(data[key])
          };
        });
        const nodeData = activeNode.value.getData?.() || {};

        const rawArgs = _.get(nodeData, 'raw.arguments', {});

        activeNode.value.setData({
          nodeAction: 'edit',
          label: data.name,
          raw: {
            ...nodeData.raw,
            arguments: {
              ...rawArgs,
              parameters: params
            }
          }
        });
      };

      // is valida json
      const isJson = (val) => {
        try {
          JSON.parse(val);
          return true;
        } catch (e) {
          return false;
        }
      };

      const parseNodeParameters = (node) => {
        const data = node.getData?.();
        nodeAction.value = data?.nodeAction || 'create';
        const params = _.get(data, 'raw.arguments.parameters', []);

        const res = _.reduce(
          params,
          (obj, item) => {
            obj[item.name] = isJson(item.value)
              ? JSON.parse(item.value)
              : item.value;
            return obj;
          },
          {}
        );
        activeStep.value = res;
        console.log('activestep===========', data, activeStep.value);
      };

      const handleSaveFlowTask = (data) => {
        console.log('handleSaveFlowTask====', data);
        updateNodeParameters(data);
        setTimeout(() => {
          showModal.value = false;
          activeStep.value = {};
        }, 100);
      };
      const handleDeleteTask = () => {
        deleteModal({
          onOk() {
            showModal.value = false;
          }
        });
      };

      const layoutStages = () => {
        const stages = _.filter(
          graphIns.getNodes(),
          (node: any) => node.shape === NodeShape.Stage
        );

        _.each(stages, (stage, index) => {
          const list = _.sortBy(stage.getChildren(), (child: any, i) => {
            return child.position()?.x;
          });
          stage.position(_.get(list[0]?.position?.(), 'x') - 50, 0);

          const contentWidth =
            _.get(_.nth(list, -1)?.position(), 'x') -
            _.get(_.nth(list, 0)?.position(), 'x');
          stage.setData({ width: contentWidth });
        });
      };

      // custom layout
      const layout = () => {
        const nodes = graphIns.getNodes();
        const edges = graphIns.getEdges();
        const g = new dagre.graphlib.Graph({
          multigraph: false,
          compound: false
        });
        g.setGraph({
          rankdir: dir,
          nodesep: NODE_GAP.nodeSep,
          ranksep: NODE_GAP.rankSep
        });

        /* eslint-disable */
        g.setDefaultEdgeLabel(() => {
          return { weight: 1 };
        });

        const taskNodes = _.filter(
          nodes,
          (node: any) => node.shape !== NodeShape.Stage
        );

        const { width, height } = NODE_SIZE;
        _.each(taskNodes, (node) => {
          g.setNode(node.id, {
            width,
            height,
            rank: 1
          });
        });

        edges.forEach((edge) => {
          const source = edge.getSource();
          const target = edge.getTarget();
          g.setEdge(source.cell, target.cell);
        });

        dagre.layout(g);

        g.nodes().forEach((id) => {
          const node = graphIns.getCellById(id) as Node;
          if (node) {
            const pos = g.node(id) as Point;
            node.position(pos.x, pos.y, { relative: false });
          }
        });
      };

      const setChildNodes = () => {
        const stageNodes = _.filter(
          graphIns.getNodes(),
          (node: any) => node.shape === NodeShape.Stage
        );
        _.each(stageNodes, (node) => {
          const childNodes = _.filter(
            graphIns.getNodes(),
            (childNode: any) =>
              childNode.store?.data?.parent === node.store?.data?.id
          );
          // add child
          _.each(childNodes, (childNode) => {
            node.addChild(childNode);
          });
        });
      };
      const setData = () => {
        const data = parseWorkflowSpec(props.dagData);
        data.nodes = _.filter(
          data.nodes,
          (item) => item.shape !== NodeShape.Stage
        );
        graphIns.fromJSON(data);
        // setChildNodes();
        layout();
        // layoutStages();
        graphIns.zoomTo({ padding: 10, maxScale: 1 });
      };
      const resigterEvent = () => {
        graphIns.on('node:dblclick', ({ node }) => {
          activeNode.value = node;
          parseNodeParameters(node);
          showModal.value = true;
        });

        graphIns.on('history:change', (data) => {
          console.log('history change+++++++++', data);

          historyState.value = {
            canRedo: graphIns.canRedo(),
            canUndo: graphIns.canUndo()
          };
        });

        graphIns.on('history:undo', (data) => {
          console.log('history undo+++++++++', data);
        });

        graphIns.on('history:redo', (data) => {
          console.log('history redo+++++++++', data);
        });
      };
      const handleUndo = () => {
        console.log('undo+++++++');
        graphIns.undo();
      };
      const handleRedo = () => {
        console.log('redo+++++++');
        graphIns.redo();
      };
      const handleSelectTool = (val) => {
        if (val === 'fitCenter') {
          fitPosition();
        }
        if (val === 'undo') {
          handleUndo();
        }
        if (val === 'redo') {
          handleRedo();
        }
        if (val === 'refresh') {
          emit('refresh');
        }
      };

      const resetHistory = () => {
        graphIns.enableHistory();
        historyState.value = {
          canRedo: false,
          canUndo: false
        };
      };
      const init = () => {
        // init window hook
        window.__x6_instances__ = [];

        graphIns?.dispose?.();
        resigterNode();
        graphIns = createGraph({
          container,
          width: null,
          height: null,
          editable: props.action !== PageAction.VIEW,
          stencilContainer
        });
        if (!_.isEmpty(props.dagData)) {
          setData();
        }
        initEvents({
          graph: graphIns,
          container: graphWrapper.value,
          editable: props.action !== PageAction.VIEW
        });
        resigterEvent();
        resetHistory();
        window.__x6_instances__.push(graphIns);
      };

      const renderStencil = () => {
        if (props.action === PageAction.VIEW) return null;
        return (
          <div
            class="stencil"
            ref={(el) => {
              stencilContainer.value = el;
            }}
          ></div>
        );
      };
      const fitPosition = () => {
        graphIns?.positionPoint({ x: 0, y: 0 }, 50, 50);
        graphIns?.centerContent();
      };

      const getSubmitData = async (): Promise<Workflow | undefined> => {
        if (await basicForm.value?.validate?.()) {
          return;
        }
        const basicInfo = basicForm.value?.flowBasic;
        const edges = graphIns.getEdges();
        const dependsMap = {};
        _.each(edges, (edge) => {
          const source = edge.getSourceCell();
          const target = edge.getTargetCell();
          const sourceData = source.getData();
          const targetData = target.getData();
          if (!dependsMap[targetData.name]) {
            dependsMap[targetData.name] = [];
          }
          dependsMap[targetData.name].push(sourceData.name);
        });
        const tasks = _.map(graphIns.getNodes(), (node) => {
          const data = node.getData();
          return {
            ...data.raw,
            template: 'echo',
            dependencies: dependsMap[data.name] || []
          };
        });
        return {
          workflow: {
            metadata: {
              name: basicInfo.name,
              description: basicInfo.description
            },
            spec: {
              entrypoint: 'main',
              activeDeadlineSeconds: basicInfo.timeout,
              parallelism: basicInfo.parallelism,
              templates: [
                {
                  name: 'main',
                  steps: [
                    [
                      {
                        name: 'stage-1',
                        template: 'stage-1'
                      }
                    ]
                  ]
                },
                {
                  name: 'stage-1',
                  dag: {
                    tasks
                  }
                },
                {
                  name: 'echo',
                  inputs: {
                    parameters: [
                      {
                        name: 'message',
                        value: 'hello world'
                      }
                    ]
                  },
                  outputs: {},
                  metadata: {},
                  container: {
                    name: '',
                    image: 'alpine:3.7',
                    command: ['echo', '{{inputs.parameters.message}}'],
                    resources: {}
                  }
                }
              ]
            }
          }
        };
      };
      onMounted(() => {
        init();
        nextTick(() => {
          fitPosition();
        });
      });

      expose({
        getSubmitData
      });

      watch(
        () => props.dagData,
        (newVal) => {
          init();
          nextTick(() => {
            fitPosition();
          });
          setBasicInfo();
        },
        {
          immediate: false
        }
      );
      return () => (
        <>
          <div class={['wrapper', { dark: appStore.theme === 'dark' }]}>
            <div class="side">
              <BasicInfo
                basicInfo={basicInfo.value}
                ref={(el) => {
                  basicForm.value = el;
                }}
              ></BasicInfo>
            </div>
            <a-spin
              style={{
                width: '100%',
                height: `max(${props.containerHeight},600px)`
              }}
              loading={props.loading}
              class={[
                'spin',
                { 'show-stencil': props.action !== PageAction.VIEW }
              ]}
            >
              {renderStencil()}
              <div class="right-content">
                <ToolBar
                  tool-list={toolList.value}
                  onSelect={(val) => handleSelectTool(val)}
                ></ToolBar>
                <div
                  ref={(el) => {
                    graphWrapper.value = el;
                  }}
                  class="graphWrapper"
                  style={{
                    height: '100%',
                    width: '100%'
                  }}
                >
                  <div
                    ref={(el) => {
                      container.value = el;
                    }}
                    style={{ width: '100%', height: '100%' }}
                    class="content-container"
                  ></div>
                </div>
              </div>
            </a-spin>
            <CreateFlowTask
              v-model:show={showModal.value}
              v-model:dataInfo={activeStep.value}
              onSave={handleSaveFlowTask}
              onDelete={handleDeleteTask}
              action={nodeAction.value}
            ></CreateFlowTask>
          </div>
        </>
      );
    }
  });
</script>

<style scoped lang="less">
  .wrapper {
    display: flex;
  }

  .spin {
    position: relative;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    height: 100%;
    overflow: hidden;
    border-radius: var(--border-radius-small);

    .right-content {
      position: relative;
      flex: 1;
      height: 100%;

      .toolbar {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        padding: 10px;
      }
    }

    &.show-stencil {
      padding-left: 200px;
      border-radius: 0;
    }

    .stencil {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 200px;
      height: 100%;
      overflow-y: auto;
    }
  }
</style>

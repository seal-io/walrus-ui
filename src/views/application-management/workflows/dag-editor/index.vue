<script lang="tsx">
  import '@antv/x6-vue-shape';
  import _ from 'lodash';
  import { Cell, Node, Point } from '@antv/x6';
  import dagre from 'dagre';
  import { defineComponent, onMounted, ref, nextTick, watch } from 'vue';
  import { useAppStore } from '@/store';
  import { useResizeObserver } from '@vueuse/core';
  import resigterNode from './shapes';
  import createGraph from './core/graph';
  import initEvents from './core/events';
  import testData from './config/test-data';
  import { ArgoTestData } from '../config/argo-test';
  import dagData from '../config/dag-data';
  import { parseWorkflowSpec } from './utils';
  import { NODE_SIZE, NODE_GAP } from './config';
  import BasicInfo from '../components/basic-info.vue';

  export default defineComponent({
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
      }
    },
    setup(props, { emit }) {
      let graphIns: any = null;
      const container = ref();
      const stencilContainer = ref();
      const graphWrapper = ref();
      const appStore = useAppStore();
      const width = ref(0);
      const height = ref(0);
      const showStencil = ref(false);
      const showModal = ref(false);
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

      const layoutStages = () => {
        const stages = _.filter(
          graphIns.getNodes(),
          (node: any) => node.shape === 'lane'
        );

        _.each(stages, (stage, index) => {
          const list = _.sortBy(stage.getChildren(), (child: any, i) => {
            return child.position()?.x;
          });
          stage.position(_.get(list[0]?.position(), 'x') - 50, 0);

          const contentWidth =
            _.get(_.nth(list, -1).position(), 'x') -
            _.get(_.nth(list, 0).position(), 'x');
          stage.setData({ width: contentWidth });
        });
      };

      // 自动布局
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
        g.setDefaultEdgeLabel(() => ({}));

        const taskNodes = _.filter(nodes, (node: any) => node.shape !== 'lane');

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
          (node: any) => node.shape === 'lane'
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

        graphIns.fromJSON(data);
        setChildNodes();
        layout();
        layoutStages();
        graphIns.zoomToFit({ padding: 10, maxScale: 1 });
      };
      const resigterEvent = () => {
        graphIns.on('node:dblclick', ({ node }) => {
          console.log('node click', node);
          showModal.value = true;
        });
      };
      const init = () => {
        graphIns?.dispose?.();
        // register custom node
        resigterNode();

        graphIns = createGraph({
          container,
          width: null,
          height: null,
          stencilContainer
        });
        setData();
        // init events
        initEvents(graphIns, graphWrapper.value);
        resigterEvent();
      };

      const renderStencil = () => {
        if (!showStencil.value) return null;
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
        // graphIns?.positionPoint({ x: 0, y: 0 }, 50, 50);
        // graphIns?.zoomTo(1);
        graphIns.zoomToFit();
      };
      onMounted(() => {});

      watch(
        () => props.dagData,
        (newVal) => {
          if (!_.isEmpty(newVal)) {
            init();
            nextTick(() => {
              fitPosition();
            });
          }
        }
      );
      return () => (
        <>
          <div class={['wrapper', { dark: appStore.theme === 'dark' }]}>
            <a-spin
              style={{ width: '100%' }}
              loading={props.loading}
              class={['spin', { 'show-stencil': showStencil.value }]}
            >
              {renderStencil()}
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
            </a-spin>
          </div>
          <BasicInfo v-model:show={showModal.value}></BasicInfo>
        </>
      );
    }
  });
</script>

<style scoped lang="less">
  .spin {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    &.show-stencil {
      padding-left: 200px;
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

<script lang="tsx">
  import '@antv/x6-vue-shape';
  import { Cell } from '@antv/x6';
  import dagre from 'dagre';
  import { defineComponent, onMounted, ref } from 'vue';
  import { useAppStore } from '@/store';
  import { useResizeObserver } from '@vueuse/core';
  import resigterNode from './shapes';
  import createGraph from './core/graph';
  import initEvents from './core/events';
  import testData from './config/test-data';
  import { ArgoTestData } from '../config/argo-test';
  import { parseWorkflowSpec } from './utils.ts';

  export default defineComponent({
    props: {
      containerHeight: {
        type: String,
        default: '100%'
      },
      loading: {
        type: Boolean,
        default: false
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
      const showStencil = ref(true);
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

      // 自动布局
      const layout = () => {
        const nodes = graphIns.getNodes();
        const edges = graphIns.getEdges();
        const g = new dagre.graphlib.Graph();
        g.setGraph({ rankdir: dir, nodesep: 50, ranksep: 100 });
        g.setDefaultEdgeLabel(() => ({}));

        const width = 100;
        const height = 60;
        nodes.forEach((node) => {
          g.setNode(node.id, { width, height });
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
            const pos = g.node(id);
            node.position(pos.x, pos.y);
          }
        });

        // edges.forEach((edge) => {
        //   const source = edge.getSourceNode()!;
        //   const target = edge.getTargetNode()!;
        //   const sourceBBox = source.getBBox();
        //   const targetBBox = target.getBBox();

        //   if ((dir === 'LR' || dir === 'RL') && sourceBBox.y !== targetBBox.y) {
        //     const gap =
        //       dir === 'LR'
        //         ? targetBBox.x - sourceBBox.x - sourceBBox.width
        //         : -sourceBBox.x + targetBBox.x + targetBBox.width;
        //     const fix = dir === 'LR' ? sourceBBox.width : 0;
        //     const x = sourceBBox.x + fix + gap / 2;
        //     edge.setVertices([
        //       { x, y: sourceBBox.center.y },
        //       { x, y: targetBBox.center.y }
        //     ]);
        //   } else if (
        //     (dir === 'TB' || dir === 'BT') &&
        //     sourceBBox.x !== targetBBox.x
        //   ) {
        //     const gap =
        //       dir === 'TB'
        //         ? targetBBox.y - sourceBBox.y - sourceBBox.height
        //         : -sourceBBox.y + targetBBox.y + targetBBox.height;
        //     const fix = dir === 'TB' ? sourceBBox.height : 0;
        //     const y = sourceBBox.y + fix + gap / 2;
        //     edge.setVertices([
        //       { x: sourceBBox.center.x, y },
        //       { x: targetBBox.center.x, y }
        //     ]);
        //   } else {
        //     edge.setVertices([]);
        //   }
        // });
      };
      const setData = () => {
        const t1 = new Date().getTime();
        const data = parseWorkflowSpec(ArgoTestData);
        const cells: Cell[] = [];
        // testData.forEach((item: any) => {
        //   if (item.shape === 'lane-edge') {
        //     cells.push(graphIns.createEdge(item));
        //   } else {
        //     cells.push(graphIns.createNode(item));
        //   }
        // });
        // graphIns.resetCells(cells);
        const t2 = new Date().getTime();
        console.log('time=============', data, t2 - t1);
        graphIns.fromJSON(data);
        layout();
        graphIns.zoomToFit({ padding: 10, maxScale: 1 });
      };
      const init = () => {
        graphIns?.dispose?.();
        // register custom node
        resigterNode();

        graphIns = createGraph({
          container,
          width: '100%',
          height: '100%',
          stencilContainer
        });
        setData();
        // init events
        initEvents(graphIns);
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
      onMounted(() => {
        init();
      });

      return () => (
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
      left: 0;
      width: 200px;
      height: 100%;
      overflow-y: auto;
    }
  }
</style>

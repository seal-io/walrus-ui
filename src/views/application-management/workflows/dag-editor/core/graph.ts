import { Graph, Node, Edge, Platform, CellView } from '@antv/x6';
import useStencil from '../plugins/use-stencil';
import useTransform from '../plugins/use-transform';
import useSnapline from '../plugins/use-snapline';
import useKeyboard from '../plugins/use-keyboard';
import connecting from './connecting';

export default function createGraph({
  container,
  width,
  height,
  stencilContainer
}) {
  const graph = new Graph({
    container: container.value,
    width: width || 1400,
    height: height || 600,
    connecting: connecting(),
    // connecting: {
    //   allowBlank: false,
    //   router: 'manhattan',
    //   connector: {
    //     name: 'rounded',
    //     args: {
    //       radius: 20
    //     }
    //   }
    // },
    translating: {
      restrict: false
      // restrict(cellView: CellView) {
      //   const cell = cellView.cell as Node;
      //   const parentId = cell.prop('parent');
      //   if (parentId) {
      //     const parentNode = graph.getCellById(parentId) as Node;
      //     if (parentNode) {
      //       return parentNode.getBBox().moveAndExpand({
      //         x: 0,
      //         y: 30,
      //         width: 0,
      //         height: -30
      //       });
      //     }
      //   }
      //   return cell.getBBox();
      // }
    },
    panning: {
      enabled: true,
      eventTypes: ['leftMouseDown']
    },
    background: {
      color: 'var(--color-workflow-bg)'
    },
    grid: {
      visible: true,
      size: 10
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
            fill: 'var(--color-white)',
            stroke: '#31d0c6',
            strokeWidth: 4
          }
        }
      }
    },
    interacting: {
      nodeMovable: true,
      magnetConnectable: true
    },
    embedding: {
      enabled: true,
      findParent({ node }) {
        const bbox = node.getBBox();
        return this.getNodes().filter((node) => {
          const data = node.getData<any>();
          if (data && data.parent) {
            const targetBBox = node.getBBox();
            return bbox.isIntersectWithRect(targetBBox);
          }
          return false;
        });
      }
    }
  });

  // register plugins
  const stencil = useStencil(graph);
  stencilContainer.value?.appendChild?.(stencil.container);

  // useTransform(graph);
  useSnapline(graph);
  // useKeyboard(graph);

  return graph;
}

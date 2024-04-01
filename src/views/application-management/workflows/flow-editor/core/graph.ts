import { Graph, Node, Edge, Platform } from '@antv/x6';
import useStencil from '../plugins/use-stencil';

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
    translating: {
      restrict: true
    },
    panning: {
      enabled: true,
      eventTypes: ['leftMouseDown']
    },
    background: {
      color: 'var(--color-workflow-bg)'
    },
    grid: {
      visible: true
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
      nodeMovable: false,
      magnetConnectable: false
    },
    connecting: {
      snap: false,
      allowBlank: false,
      allowLoop: false,
      highlight: true,
      sourceAnchor: {
        name: 'left',
        args: {
          dx: Platform.IS_SAFARI ? 4 : 8
        }
      },
      targetAnchor: {
        name: 'right',
        args: {
          dx: Platform.IS_SAFARI ? 4 : -8
        }
      }
    }
  });

  const stencil = useStencil(graph);
  stencilContainer.value.appendChild(stencil.container);

  return graph;
}

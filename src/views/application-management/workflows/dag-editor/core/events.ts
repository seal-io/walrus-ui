import { Graph } from '@antv/x6';

const registerEditEvents = (graph: Graph, editable: boolean) => {
  if (!editable) return;
  graph.on('edge:connected', (data) => {
    const { isNew, edge, currentCell, previousCell } = data;
    // console.log('edge:connected', isNew, edge, data, {
    //   currentCell: currentCell?.getData?.(),
    //   previousCell: previousCell?.getData?.()
    // });
  });

  graph.on('edge:removed', (data) => {
    console.log('edge:removed', data);
  });

  graph.on('node:added', ({ node }) => {
    console.log('node:added', node);
    setTimeout(() => {
      const counts = graph.getNodes().length;
      node.setData({
        label: `new-task-${counts}`,
        name: `new-task-${counts}`,
        raw: { name: `new-task-${counts}` }
      });
    }, 100);
  });

  graph.on('edge:mouseenter', ({ cell }) => {
    cell.addTools([
      {
        name: 'source-arrowhead',
        args: {
          tagName: 'circle',
          attrs: {
            'r': 4,
            'stroke': '#fe854f',
            'stroke-width': 2,
            'fill': 'red',
            'cursor': 'pointer'
          }
        }
      },
      {
        name: 'target-arrowhead',
        args: {
          attrs: {
            'd': 'M -12 0 -12 -6 4 0 -12 6 Z',
            'stroke-width': 1,
            'fill': 'red',
            'cursor': 'pointer'
          }
        }
      }
    ]);
  });

  graph.on('edge:mouseleave', ({ cell }) => {
    cell.removeTools();
  });
};
export default (data: { graph: Graph; container: any; editable: boolean }) => {
  const { graph, container, editable } = data;
  // graph.on('node:change:position', ({ node, options }) => {
  //   console.log('node:change:position', node, options);
  // });
  const changePortsVisible = (visible) => {
    if (!editable) return;
    const ports = container.querySelectorAll('.x6-port-body');
    ports?.forEach((port) => {
      if (port) {
        port.style.visibility = visible ? 'visible' : 'hidden';
      }
    });
  };
  graph.on('node:click', ({ node }) => {
    graph.select(node);
  });
  graph.on('node:mouseenter', () => {
    changePortsVisible(true);
  });

  graph.on('node:mouseleave', () => {
    changePortsVisible(false);
  });

  graph.on('blank:click', () => {
    graph.getCells().forEach((cell) => {
      cell.removeTools();
    });
  });

  // edit events
  registerEditEvents(graph, editable);
};

import { Graph } from '@antv/x6';

export default (graph: Graph, container: any) => {
  // graph.on('node:change:position', ({ node, options }) => {
  //   console.log('node:change:position', node, options);
  // });
  const changePortsVisible = (visible) => {
    const ports = container.querySelectorAll('.x6-port-body');
    for (let i = 0, len = ports.length; i < len; i += 1) {
      ports[i].style.visibility = visible ? 'visible' : 'hidden';
    }
  };

  graph.on('node:mouseenter', () => {
    changePortsVisible(true);
  });

  graph.on('node:mouseleave', () => {
    changePortsVisible(false);
  });

  graph.on('edge:connected', (data) => {
    const { isNew, edge } = data;
    console.log('edge:connected', isNew, edge, data);
  });
};

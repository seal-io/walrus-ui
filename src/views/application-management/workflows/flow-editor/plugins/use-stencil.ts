import { Stencil } from '@antv/x6-plugin-stencil';

export default function useStencil(graph) {
  const stencil = new Stencil({
    target: graph,
    stencilGraphWidth: 200,
    stencilGraphHeight: 180,
    collapsable: true,
    groups: [
      {
        name: 'group1',
        title: 'Group 1',
        graphHeight: 180,
        graphWidth: 200
      },
      {
        name: 'group2',
        title: 'Group 2',
        graphHeight: 180,
        graphWidth: 200
      }
    ],
    layoutOptions: {
      columns: 1,
      marginX: 10,
      marginY: 10
    }
  });

  return stencil;
}

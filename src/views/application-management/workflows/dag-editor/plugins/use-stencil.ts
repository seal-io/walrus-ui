import { Stencil } from '@antv/x6-plugin-stencil';
import setStencilStyle from '../style/stencil';

export default function useStencil(graph) {
  setStencilStyle();
  const stencil = new Stencil({
    target: graph,
    stencilGraphWidth: 200,
    stencilGraphHeight: 180,
    collapsable: true,

    groups: [
      {
        name: 'Basic',
        title: 'Group 1',
        graphHeight: 180,
        graphWidth: 200
      },
      {
        name: 'Advanced',
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

  const RectShape = graph.createNode({ shape: 'lane-rect', label: 'Rect' });
  const PolygonShape = graph.createNode({
    shape: 'lane-polygon',
    width: 80,
    height: 80,
    label: 'Polygon'
  });

  stencil.load([RectShape], 'Basic');
  stencil.load([PolygonShape], 'Advanced');

  return stencil;
}

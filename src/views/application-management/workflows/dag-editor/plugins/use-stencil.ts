import { Stencil } from '@antv/x6-plugin-stencil';
import setStencilStyle from '../style/stencil';
import { NodeShape } from '../config';

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
        title: 'Basic'
        // graphHeight: 180,
        // graphWidth: 200
      },
      {
        name: 'Advanced',
        title: 'Advanced',
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

  const TaskNode = graph.createNode({
    shape: NodeShape.Task,
    label: 'Task',
    width: 100,
    height: 80
  });
  const ApprovalNode = graph.createNode({
    shape: NodeShape.Approval,
    width: 60,
    height: 60,
    label: 'Approval'
  });

  const StageShape = graph.createNode({
    shape: NodeShape.Stage,
    width: 30,
    height: 60,
    label: 'Stage'
  });

  stencil.load([TaskNode], 'Basic');
  stencil.load([ApprovalNode], 'Advanced');

  return stencil;
}

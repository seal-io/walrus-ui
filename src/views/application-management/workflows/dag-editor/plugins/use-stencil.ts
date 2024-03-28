import { Stencil } from '@antv/x6-plugin-stencil';
import setStencilStyle from '../style/stencil';
import { NodeShape, NODE_SIZE } from '../config';

export default function useStencil(graph) {
  setStencilStyle();
  const stencil = new Stencil({
    target: graph,
    title: 'Task Types',
    stencilGraphWidth: 200,
    stencilGraphHeight: 500,
    collapsable: false,

    groups: [
      {
        name: 'Basic',
        title: 'Basic'
      }
    ],
    getDragNode: (node) => {
      const item = node.clone();
      if (node.shape === NodeShape.Task) {
        item.size(NODE_SIZE.width, NODE_SIZE.height);
        return item;
      }
      return item;
    },
    layoutOptions: {
      columns: 1,
      marginX: 10,
      marginY: 40
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

  stencil.load([TaskNode, ApprovalNode], 'Basic');
  // stencil.load([ApprovalNode]);

  return stencil;
}

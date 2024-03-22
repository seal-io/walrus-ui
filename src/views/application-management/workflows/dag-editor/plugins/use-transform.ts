import { Transform } from '@antv/x6-plugin-transform';
import { Node } from '@antv/x6';

export default (graph) => {
  graph.use(
    new Transform({
      resizing: {
        enabled: true,
        minWidth: 1,
        maxWidth: 200,
        minHeight: 1,
        maxHeight: 150,
        orthogonal: false,
        restrict: false,
        preserveAspectRatio: false
      }
    })
  );
};

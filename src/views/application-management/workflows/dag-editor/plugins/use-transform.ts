import { Transform } from '@antv/x6-plugin-transform';

export default (graph) => {
  graph.use(
    new Transform({
      resizing: {
        enabled: true,
        minWidth: 60,
        maxWidth(node) {
          if (node.data.parent) {
            return 100000;
          }
          return 200;
        },
        minHeight: 30,
        maxHeight(node) {
          if (node.data.parent) {
            return 100000;
          }
          return 100;
        },
        orthogonal: false,
        restrict: false,
        preserveAspectRatio: false
      }
    })
  );
};

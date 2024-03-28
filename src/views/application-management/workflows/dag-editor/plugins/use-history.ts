import { History } from '@antv/x6-plugin-history';

export default (graph) => {
  graph.use(
    new History({
      enabled: true,
      ignoreAdd: false,
      ignoreRemove: false,
      ignoreChange: true
    })
  );
};

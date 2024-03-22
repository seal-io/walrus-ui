import { Snapline } from '@antv/x6-plugin-snapline';

export default (graph) => {
  graph.use(
    new Snapline({
      enabled: true,
      sharp: true
    })
  );
};

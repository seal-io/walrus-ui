import { Keyboard } from '@antv/x6-plugin-keyboard';

export default (graph) => {
  graph.use(
    new Keyboard({
      enabled: true,
      global: true,
      guard(e) {
        if (e.altKey) {
          return false;
        }
        return true;
      }
    })
  );
};

import { Selection } from '@antv/x6-plugin-selection';
import setSelectionStyle from '../style/selection';

export default (graph, editable) => {
  setSelectionStyle();
  graph.use(
    new Selection({
      enabled: editable,
      multiple: false,
      showEdgeSelectionBox: true
      // showNodeSelectionBox: true
    })
  );
};

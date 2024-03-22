import { register } from '@antv/x6-vue-shape';
import { Graph, Edge } from '@antv/x6';
import StageNode from './stage/index';
import { edgeConfig } from './edge/index';

export default () => {
  register(StageNode);
  Graph.registerNode(
    'lane-rect',
    {
      inherit: 'rect',
      width: 100,
      height: 60,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: '#5F95FF',
          fill: '#EFF4FF'
        },
        text: {
          fontSize: 12,
          fill: '#262626'
        }
      }
    },
    true
  );

  Graph.registerNode(
    'lane-polygon',
    {
      inherit: 'polygon',
      width: 80,
      height: 80,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: '#5F95FF',
          fill: '#EFF4FF',
          refPoints: '0,10 10,0 20,10 10,20'
        },
        text: {
          fontSize: 12,
          fill: '#262626'
        }
      }
    },
    true
  );

  Graph.registerEdge('lane-edge', edgeConfig, true);
};

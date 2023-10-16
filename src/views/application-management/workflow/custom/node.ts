import { Graph } from '@antv/x6';
import _ from 'lodash';
import { register } from '@antv/x6-vue-shape';
import PipelineNode from './pipeline-node.vue';
import SeparatorLine from './separator-line.vue';
import { PipelineNodeSize, CustomShape } from '../config';

export const defineCustomNode = () => {
  // PipelineNode
  register({
    shape: CustomShape.pipelineNode,
    inherit: 'vue-shape',
    width: PipelineNodeSize.width,
    height: PipelineNodeSize.height,
    component: PipelineNode,
    attr: {
      button: {
        event: 'node:plus-button:click'
      }
    },
    ports: {
      groups: {
        in: {
          position: {
            name: 'absolute',
            args: {
              x: 0,
              y: PipelineNodeSize.height / 2 - 10
            }
          },

          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: 'transparent',
              strokeWidth: 1,
              fill: 'transparent'
            }
          }
        },

        out: {
          position: {
            name: 'absolute',
            args: {
              x: PipelineNodeSize.width,
              y: PipelineNodeSize.height / 2 - 10
            }
          },

          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: 'transparent',
              strokeWidth: 1,
              fill: 'transparent'
            }
          }
        }
      }
    }
  });
  // SeparatorNode
  register({
    shape: CustomShape.separatorNode,
    inherit: 'vue-shape',
    component: SeparatorLine,
    attr: {
      button: {
        event: 'node:plus-button:click'
      }
    },
    ports: {
      groups: {
        in: {
          position: 'left',

          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: 'transparent',
              strokeWidth: 1,
              fill: 'transparent'
            }
          }
        },

        out: {
          position: 'right',

          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: 'transparent',
              strokeWidth: 1,
              fill: 'transparent'
            }
          }
        }
      }
    }
  });
};

export default {};

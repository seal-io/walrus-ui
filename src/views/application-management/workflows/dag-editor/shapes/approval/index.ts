import { NodeShape, APPROVAL_NODE_SIZE as nodeSize } from '../../config';
import Component from './component.vue';
import ports from '../../core/custom-shape-ports';

export default {
  shape: NodeShape.Approval,
  inherit: 'vue-shape',
  component: Component,
  ports: {
    groups: {
      top: {
        position: {
          name: 'absolute',
          args: {
            x: nodeSize.width / 2,
            y: 0
          }
        },
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#5F95FF',
            strokeWidth: 1,
            fill: '#fff',
            style: {
              visibility: 'hidden'
            }
          }
        }
      },
      right: {
        position: {
          name: 'absolute',
          args: {
            x: 100,
            y: nodeSize.height / 2
          }
        },
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#5F95FF',
            strokeWidth: 1,
            fill: '#fff',
            style: {
              visibility: 'hidden'
            }
          }
        }
      },
      bottom: {
        position: {
          name: 'absolute',
          args: {
            x: nodeSize.width / 2,
            y: nodeSize.height
          }
        },
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#5F95FF',
            strokeWidth: 1,
            fill: '#fff',
            style: {
              visibility: 'hidden'
            }
          }
        }
      },
      left: {
        position: {
          name: 'absolute',
          args: {
            x: -20,
            y: nodeSize.height / 2
          }
        },
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#5F95FF',
            strokeWidth: 1,
            fill: '#fff',
            style: {
              visibility: 'hidden'
            }
          }
        }
      }
    },
    items: [
      {
        group: 'left',
        id: 'left'
      },
      {
        group: 'right',
        id: 'right'
      },
      {
        group: 'bottom',
        id: 'bottom'
      },
      {
        group: 'top',
        id: 'top'
      }
    ]
  },
  attrs: {}
};

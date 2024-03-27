import { Graph } from '@antv/x6';

export default (nodeSize) => {
  return {
    groups: {
      top: {
        position: {
          name: 'absolute',
          args: {
            x: nodeSize.width / 2,
            y: 4
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
            x: nodeSize.width - 4,
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
            y: nodeSize.height - 4
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
            x: 4,
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
  };
};

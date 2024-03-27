import { Platform } from '@antv/x6';

export default (store?) => {
  return {
    allowBlank: false,
    allowLoop: false,
    sourceAnchor: {
      name: 'left',
      args: {
        dx: Platform.IS_SAFARI ? 4 : 8
      }
    },
    targetAnchor: {
      name: 'right',
      args: {
        dx: Platform.IS_SAFARI ? 4 : -8
      }
    },
    // edge connect to node
    allowNode: true,
    // edge connect to edge
    allowEdge: false,
    // edge connect to port
    allowPort: true,
    // between two nodes
    allowMulti: false,

    anchor: 'center',
    connectionPoint: {
      name: 'anchor',
      args: {}
    },
    // 路由将边的路径点 vertices 做进一步转换处理，并在必要时添加额外的点，然后返回处理后的点，默认值为 normal。
    router: {
      name: 'manhattan', // orth
      args: {
        // 路由算法步进步长，其值越小计算量越大。推荐使用画布的网格大小
        step: 5,
        // 设置锚点距离转角的最小距离，和 orth 路由配置一致。20
        padding: 10,
        // 忽略起始或终止节点，忽略后不参与障碍物计算。
        excludeTerminals: ['source', 'target'],

        excludeShapes: [],
        excludeNodes: [],
        // 忽略隐藏的节点，忽略后不参与障碍物计算。
        excludeHiddenNodes: false
      }
    },
    // 连接器将起点、路由返回的点、终点加工为 <path> 元素的 d 属性，决定了边渲染到画布后的样式
    connector: {
      name: 'rounded',
      args: {
        radius: 20
      }
    },

    // 自动吸附
    snap: {
      radius: 20
    },
    // 高亮显示所有可用的连接桩或节点
    highlight: true
  };
};

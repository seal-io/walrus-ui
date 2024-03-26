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
    // 是否允许边链接到节点
    allowNode: false,
    // // 是否允许边链接到另一个边
    // allowEdge: false,
    // // 是否允许边连接到连接桩，默认为 true
    // allowPort: true,
    // // 是否允许在相同的起始节点和终止之间创建多条边
    // allowMulti: false,

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
        padding: 5,
        // 忽略起始或终止节点，忽略后不参与障碍物计算。
        // excludeTerminals: ['source', 'target'], // 'target' source
        // 排除职能带 部门 描述
        excludeShapes: [],
        // excludeNodes() {
        //   return store.dutyCellIds;
        // },
        // 忽略隐藏的节点，忽略后不参与障碍物计算。
        excludeHiddenNodes: true
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

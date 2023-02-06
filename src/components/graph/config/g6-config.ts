import { graphColorConfig } from './index';

export default function useNodeData() {
  const defaultMode = [
    'click-select',
    'drag-combo',
    'zoom-canvas',
    'drag-canvas',
    {
      type: 'drag-node',
      updateEdge: true,
      enableDebounce: true,
    },
  ];
  const primaryColor = 'rgba(193,198,209,.8)'; // 'rgba(193,198,209,.6)'
  const defaultNode = {
    type: 'circle',
    // size: [30],
    // color: 'transparent',
    style: {
      fill: '#9EC9FF',
      lineWidth: 0,
      cursor: 'grabbing',
    },
    labelCfg: {
      position: 'top',
      show: false,
      style: {
        fill: `rgb(${graphColorConfig.label})`,
        fontSize: 11,
        autoRotate: true,
      },
    },
  };
  const defaultEdge = {
    style: {
      stroke: primaryColor,
      lineWidth: 1,
    },
  };
  return {
    modes: {
      default: defaultMode,
    },
    defaultNode,
    defaultEdge,
    primaryColor,
  };
}

import { MarkerType } from '@vue-flow/core';

/**
 * You can pass elements together as a v-model value
 * or split them up into nodes and edges and pass them to the `nodes` and `edges` props of Vue Flow (or useVueFlow composable)
 */
export const initialElements = [
  {
    id: '1',
    type: 'input',
    label: 'Node 1',
    position: { x: 250, y: 0 },
    class: 'light'
  },

  {
    id: '3',
    type: 'custom',
    label: 'custom 2',
    position: { x: 400, y: 100 },
    class: 'light',
    data: {
      status: {
        summaryStatus: 'Unready',
        transitioning: true,
        error: false
      }
    },
    toolbar: {
      isVisible: false
    }
  },
  {
    id: '4',
    type: 'custom',
    label: 'custom 3',
    position: { x: 150, y: 200 },
    class: 'light',
    toolbar: {
      isVisible: false
    }
  },
  {
    id: '2',
    type: 'custom',
    data: {
      status: {
        summaryStatus: 'Unready',
        error: true
      }
    },
    toolbar: {
      isVisible: false
    },
    label: 'custom 1',
    position: { x: 100, y: 100 },
    class: 'light',
    style: {}
  },
  // { id: '3', label: 'Node 3', position: { x: 400, y: 100 }, class: 'light' },
  // { id: '4', label: 'Node 4', position: { x: 150, y: 200 }, class: 'light' },
  {
    id: '5',
    type: 'output',
    label: 'Node 5',
    position: { x: 300, y: 300 },
    class: 'light'
  },
  { id: 'e1-2', source: '1', target: '2', animated: false },
  {
    id: 'e1-3',
    label: 'edge with arrowhead',
    source: '1',
    target: '3',
    markerEnd: MarkerType.ArrowClosed
  },
  {
    id: 'e4-5',
    type: 'step',
    label: 'step-edge',
    source: '4',
    target: '5',
    style: { stroke: 'orange' },
    labelBgStyle: { fill: 'orange' }
  },
  {
    id: 'e3-4',
    type: 'smoothstep',
    label: 'smoothstep-edge',
    source: '3',
    target: '4'
  }
];

export default {};

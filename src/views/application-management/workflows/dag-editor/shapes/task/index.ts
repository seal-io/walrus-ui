import { NodeShape, NODE_SIZE } from '../../config';
import Component from './component.vue';
import ports from '../../core/custom-shape-ports';

export default {
  shape: NodeShape.Task,
  inherit: 'vue-shape',
  component: Component,
  ports: ports(NODE_SIZE),
  // markup: [
  //   {
  //     tagName: 'rect',
  //     selector: 'body'
  //   },
  //   {
  //     tagName: 'rect',
  //     selector: 'name-rect'
  //   },
  //   {
  //     tagName: 'text',
  //     selector: 'name-text'
  //   }
  // ],
  attrs: {
    // 'body': {
    //   fill: '#FFF',
    //   stroke: '#5F95FF',
    //   strokeWidth: 1
    // },
    // 'name-rect': {
    //   width: 200,
    //   height: 30,
    //   fill: '#5F95FF',
    //   stroke: 'red',
    //   strokeWidth: 1,
    //   x: 0
    // },
    // 'name-text': {
    //   ref: 'name-rect',
    //   refY: 0.5,
    //   refX: 0.5,
    //   textAnchor: 'middle',
    //   fontWeight: 'bold',
    //   fill: '#fff',
    //   fontSize: 12
    // }
  }
};

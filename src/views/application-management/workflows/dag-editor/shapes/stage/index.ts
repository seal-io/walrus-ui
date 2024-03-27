import { NodeShape } from '../../config';
import Component from './component.vue';

export default {
  shape: NodeShape.Stage,
  inherit: 'vue-shape',
  component: Component,
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

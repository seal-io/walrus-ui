import G6, { ModelConfig, NodeConfig, ShapeOptions } from '@antv/g6';
import _ from 'lodash';
import { IGroup, IShape, GroupCfg } from '@antv/g-base';
import insertCss from 'insert-css';
import serviceImg from '@/assets/images/service.png';
import compositionImg from '@/assets/images/graph_nodes.png';
import moreButtonIcon from '@/assets/images/more.png';
import umlcompositionIcon from '@/assets/images/composition-03.png';

insertCss(`
  #contextMenu {
    position: absolute;
    list-style-type: none;
    padding: 10px 8px;
    left: -150px;
    background-color: rgba(255, 255, 255, 0.9);
    border: 1px solid #e2e2e2;
    border-radius:  var(--border-radius-small);;
    font-size: 12px;
    color: #545454;
  }
  #contextMenu li {
    cursor: pointer;
		list-style-type:none;
    list-style: none;
    margin-left: 0px;
  }
  #contextMenu li:hover {
    color: #aaa;
  }
`);
export const UMLIconSize = [16, 16];
export const globalFontSize = 12;
export const DefaultNodeSize = [185, 60];
export const GlobalColor = {
  text3: 'rgb(134,144,156)',
  text2: 'rgb(78,89,105)'
};

export const defineCustomNode = () => {
  G6.registerNode(
    'resource',
    {
      afterDraw(cfg: Node & NodeConfig, group: IGroup) {
        (this as any).drawCompositionIcon(cfg, group);
        (this as any).drawActionButton(cfg, group);
        (this as any).drawUMLIcon(cfg, group);
      },

      drawStateIconAnimate(cfg: Node & NodeConfig, group: IGroup) {
        const { stateIcon = {} } = cfg;
        if (!stateIcon.animate) return;
        const image = group['shapeMap']['rect-state-icon'];
        // image.animate(
        //   {
        //     opacity: 0.2
        //   },
        //   {
        //     duration: 2000,
        //     easing: 'easeCubic',
        //     repeat: true // repeat
        //   }
        // );
      },
      update(cfg: Node & NodeConfig, node: any) {
        const group = node?.getContainer();
        const umlCompositionIconImg = group['shapeMap']['uml-comp-icon'];
        const model = node?.getModel();
        if (model?.isCollapsed) {
          umlCompositionIconImg?.show();
        } else {
          umlCompositionIconImg?.hide();
        }
      },
      drawCompositionIcon(cfg: Node & NodeConfig, group: IGroup) {
        if (!cfg.hasComposition) return;
        const { compositionIcon, size } = cfg;
        const w: number = _.get(size, '0') || DefaultNodeSize[0];
        const h: number = _.get(size, '1') || DefaultNodeSize[1];
        const { width, height, img } = compositionIcon as any;
        group['shapeMap']['composition-icon'] = group.addShape('image', {
          attrs: {
            img,
            x: -w / 2 + 18,
            y: h / 2 - 12,
            width,
            height
          },
          className: 'composition-icon',
          name: 'composition-icon',
          draggable: true
        });
      },

      drawUMLIcon(cfg: Node & NodeConfig, group: IGroup) {
        const {
          UMLCompositionIcon,
          UMLDependencyIcon,
          UMLRealizationIcon,
          hasComposition,
          isCollapsed,
          size
        } = cfg;
        if (!UMLCompositionIcon && !UMLDependencyIcon && !UMLRealizationIcon)
          return;

        const w: number = _.get(size, '0') || DefaultNodeSize[0];
        const h: number = _.get(size, '1') || DefaultNodeSize[1];
        const { width, height, img } = UMLCompositionIcon as any;
        if (UMLCompositionIcon && hasComposition) {
          group['shapeMap']['uml-comp-icon'] = group.addShape('image', {
            attrs: {
              img,
              x: w / 2 - 1,
              y: -h / 2 + 24,
              width: 12,
              height: 12
            },
            className: hasComposition
              ? 'has-composition-icon uml-comp-icon'
              : 'uml-comp-icon',
            name: 'uml-comp-icon',
            draggable: true
          });
        }
        if (UMLRealizationIcon) {
          group['shapeMap']['uml-real-icon'] = group.addShape('image', {
            attrs: {
              img: UMLRealizationIcon,
              x: -w / 2 - 11,
              y: -h / 2 + 24,
              width: 12,
              height: 12
            },
            className: 'uml-real-icon',
            name: 'uml-real-icon',
            draggable: true
          });
        }
        if (UMLDependencyIcon) {
          group['shapeMap']['uml-dep-icon'] = group.addShape('image', {
            attrs: {
              img: UMLDependencyIcon,
              x: -w / 2 - 13,
              y: -h / 2 + 23,
              width: 14,
              height: 14
            },
            className: 'uml-dep-icon',
            name: 'uml-dep-icon',
            draggable: true
          });
        }
      },

      drawActionButton(cfg: Node & NodeConfig, group: IGroup) {
        if (
          _.get(cfg, 'loggableInfo.loggable') ||
          _.get(cfg, 'executableInfo?.executable') ||
          _.get(cfg, 'drifted')
        ) {
          const { size, moreButtonIcon } = cfg;
          const w: number = _.get(size, '0') || 16;
          const h: number = _.get(size, '1') || 16;
          const { width, height, img } = moreButtonIcon as any;
          group['shapeMap']['more-button-icon'] = group.addShape('image', {
            attrs: {
              img,
              x: _.get(cfg, 'drifted') ? w / 2 - 30 : w / 2 - 20,
              y: -h / 2,
              width,
              height,
              cursor: 'pointer'
            },

            className: 'more-button-icon',
            name: 'more-button-icon',
            draggable: true
          });
        }
      }
    },
    'modelRect'
  );
};

export const defaultNode = {
  shape: 'modelRect',
  size: DefaultNodeSize,
  style: {
    lineWidth: 1,
    stroke: 'transparent',
    cursor: 'grabbing',
    shadowColor: 'rgba(169,174,184,60%)',
    shadowOffsetY: 2,
    shadowBlur: 4
  },
  labelCfg: {
    style: {
      fill: '#1d2129',
      fontSize: 12,
      fontWeight: 500,
      width: 110
    },
    offset: 15
  },
  linkPoints: {
    top: false
  },
  descriptionCfg: {
    style: {
      fill: GlobalColor.text3,
      fontSize: 11,
      fontWeight: 500
    }
  },
  preRect: {
    show: false
  },
  stateIcon: {
    width: 12,
    height: 12
  },
  logoIcon: {
    width: 32,
    height: 32,
    offset: -25,
    img: serviceImg
  },
  compositionIcon: {
    width: 10,
    height: 10,
    offset: -10,
    img: compositionImg
  },
  UMLCompositionIcon: {
    width: 14,
    height: 14,
    img: umlcompositionIcon
  },
  moreButtonIcon: {
    width: 16,
    height: 16,
    img: moreButtonIcon
  }
};
export const defaultCombo = {
  type: 'rect',
  size: [40, 10],
  padding: [15, 10, 10, 15],
  style: {
    lineWidth: 1.2,
    fill: 'transparent',
    lineDash: [6, 6],
    shadowColor: '#fff'
  },
  labelCfg: {
    refY: -20,
    refX: 0,
    position: 'top',
    style: {
      fontWeight: 700,
      fontSize: 12
    }
  }
};

export default {};

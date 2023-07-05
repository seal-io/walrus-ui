import G6, { ModelConfig, NodeConfig, ShapeOptions } from '@antv/g6';
import _ from 'lodash';
import { IGroup, IShape, GroupCfg } from '@antv/g-base';
import insertCss from 'insert-css';
import serviceImg from '@/assets/images/service.png';
import compositionImg from '@/assets/images/graph_nodes.png';
import moreButtonIcon from '@/assets/images/more.png';

insertCss(`
  #contextMenu {
    position: absolute;
    list-style-type: none;
    padding: 10px 8px;
    left: -150px;
    background-color: rgba(255, 255, 255, 0.9);
    border: 1px solid #e2e2e2;
    border-radius: 4px;
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
export const globalFontSize = 12;

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
        // (this as any).drawStateIconAnimate(cfg, group);
      },
      drawStateIconAnimate(cfg: Node & NodeConfig, group: IGroup) {
        const { stateIcon = {} } = cfg;
        if (!stateIcon.animate) return;
        const image = group['shapeMap']['rect-state-icon'];
        image.animate(
          {
            // Magnifying and disappearing
            opacity: 0.2
          },
          {
            duration: 2000,
            easing: 'easeCubic',
            repeat: true // repeat
          }
        );
      },
      drawCompositionIcon(cfg: Node & NodeConfig, group: IGroup) {
        if (!cfg.hasComposition) return;
        const { compositionIcon, size } = cfg;
        const w: number = _.get(size, '0');
        const h: number = _.get(size, '1');
        const { width, height, img } = compositionIcon as any;
        group['shapeMap']['composition-icon'] = group.addShape('image', {
          attrs: {
            img,
            x: -w / 2 + 18,
            y: h / 2 - 16,
            width,
            height
          },
          className: 'composition-icon',
          name: 'composition-icon',
          draggable: true
        });
      },
      drawActionButton(cfg: Node & NodeConfig, group: IGroup) {
        if (
          !_.get(cfg, 'loggableInfo.loggable') &&
          !_.get(cfg, 'executableInfo?.executable')
        )
          return;
        const { size, moreButtonIcon } = cfg;
        const w: number = _.get(size, '0');
        const h: number = _.get(size, '1');
        const { width, height, img } = moreButtonIcon as any;
        group['shapeMap']['more-button-icon'] = group.addShape('image', {
          attrs: {
            img,
            x: w / 2 - 20,
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
    },
    'modelRect'
  );
};

const handClick = () => {
  console.log('custom node');
};
export const defineDomNode = () => {
  G6.registerNode(
    'resource',
    {
      draw: (cfg: ModelConfig, group: IGroup) => {
        const size = cfg.size || [120, 60];
        console.log('cfg===99=', cfg);
        return group.addShape('dom', {
          attrs: {
            width: size[0],
            height: size[1],
            // 传入 DOM 的 html
            html: `
          <div style="background-color: #fff; border: 2px solid #5B8FF9; border-radius: 5px; width: ${
            size[0] - 5
          }px; height: ${size[1] - 5}px; display: flex;">
            <div style="height: 100%; width: 33%; background-color: #CDDDFD" on-click="handClick">
              <img alt="img" style="line-height: 100%; padding-top: 6px; padding-left: 8px;" src="https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*Q_FQT6nwEC8AAAAAAAAAAABkARQnAQ" width="20" height="20" />  
            </div>
            <span style="margin:auto; padding:auto; color: #5B8FF9">${
              cfg.label
            }</span>
          </div>
            `
          },
          name: 'dom-node-keyShape', // 在 G6 3.3 及之后的版本中，必须指定 name，可以是任意字符串，但需要在同一个自定义元素类型中保持唯一性
          draggable: true
        });
      }
    },
    'single-node'
  );
};

export const defaultNode = {
  shape: 'modelRect',
  size: [185, 60],
  style: {
    lineWidth: 1,
    stroke: 'transparent',
    cursor: 'grabbing'
  },
  labelCfg: {
    style: {
      fill: '#1d2129',
      fontSize: 12,
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
      fontSize: 11
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

import G6 from '@antv/g6';
import insertCss from 'insert-css';

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
      draw(cfg, group) {
        const rect = group?.addShape('rect', {
          attrs: {
            x: -75,
            y: -30,
            width: 150,
            height: 60,
            radius: 4,
            stroke: '',
            fill: '#fff',
            lineWidth: 2
          },
          labelCfg: {
            style: {
              fill: 'red',
              fontSize: 14
            }
          },
          name: 'rect-shape'
        });
        if (cfg?.name) {
          group?.addShape('text', {
            attrs: {
              text: cfg.name,
              x: 0,
              y: 0,
              fill: '#4e5969',
              fontSize: 14,
              textAlign: 'center',
              textBaseline: 'middle',
              fontWeight: 'bold'
            }
          });
        }
        return rect;
      }
    },
    'modelRect'
  );
};

export const defaultNode = {
  shape: 'modelRect',
  size: [185, 60],
  style: {
    lineWidth: 0,
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
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0mS6x_Ro4JPjX5tNDpZGDA0_kAcfYLgm7Sg&usqp=CAU'
  }
};

export default {};

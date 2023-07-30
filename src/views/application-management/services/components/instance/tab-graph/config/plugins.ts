import G6, { GraphData } from '@antv/g6';
import _ from 'lodash';
import i18n from '@/locale';
import { INode } from './interface';
import { edgeType } from './index';

export const legend = new G6.Legend({
  data: {
    edges: [
      {
        id: edgeType.Composition,
        label: edgeType.Composition
      },
      {
        id: edgeType.Dependency,
        label: edgeType.Dependency
      },
      {
        id: edgeType.Realization,
        label: edgeType.Realization
      }
    ]
  },
  filter: {
    enable: false
  },
  containerStyle: {
    fill: '#fff',
    color: 'red',
    radius: 2,
    lineWidth: 0
  },
  padding: [0, 4, 0, 10],
  title: '',
  titleConfig: {
    position: 'center',
    offsetX: 0,
    offsetY: 120
  },
  vertiSep: 12,
  horiSep: 24,
  offsetY: 0,
  // padding: [8, 4],
  align: 'center',
  layout: 'horizontal', // vertical
  position: 'top-right'
});
export const createToolTip = (contextMenuNode) => {
  const toolTip = new G6.Tooltip({
    offsetX: 5,
    offsetY: 5,
    itemTypes: ['node'],
    shouldBegin(e) {
      if (
        e?.target.cfg.name === 'more-button-icon' ||
        e?.item === contextMenuNode?.value
      ) {
        return false;
      }
      return true;
    },
    getContent(e) {
      const model: INode = e?.item?.getModel();
      const box = document.createElement('div');
      box.style.width = 'max-content';

      let tips = `<span>${i18n.global.t(
        'applications.service.graph.menu'
      )}: </span>`;
      if (_.get(model, 'loggableInfo.loggable')) {
        tips += `<span> ${i18n.global.t(
          'applications.instance.tab.log'
        )}</span><span class="loggable-text"></span>`;
      }
      if (_.get(model, 'executableInfo.executable')) {
        tips += `<span> ${i18n.global.t(
          'applications.instance.tab.term'
        )}</span>`;
      }
      let runDiv = '';
      if (model?.loggableInfo?.loggable || model?.executableInfo?.executable) {
        runDiv = `<div class="t-run">${tips}</div>`;
      }
      // drift node
      let driftDiv = '';
      if (_.get(model, 'drifted')) {
        driftDiv = `<div class="t-info">
        <span  class="t-label">${i18n.global.t(
          'applications.service.resource.hasDrift'
        )}:</span> ${i18n.global.t('applications.service.resource.isDrifted')}
      </div>`;
      }
      box.innerHTML = `
        <div  class="inner-wrapper">
          <div class="t-info">
          <span  class="t-label">${i18n.global.t('common.table.name')}:</span>
          ${_.get(model, 'name')}
          </div>
          <div class="t-info">
          <span  class="t-label">${i18n.global.t('common.table.type')}:</span>
          ${_.get(model, 'descTips') || ''}
          </div>
          ${driftDiv}
          ${runDiv}
          </div>
      `;
      return box;
    }
  });
  return toolTip;
};

export const toolbar = new G6.ToolBar();
export default {};

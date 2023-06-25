import G6 from '@antv/g6';
import _ from 'lodash';
import i18n from '@/locale';
import { h } from 'vue';
import { Modal, Button, Link } from '@arco-design/web-vue';
import { INode } from './interface';
import LoggableModal from '../components/loggable-modal.vue';
import TerminalModal from '../components/terminal-modal.vue';

let ModalIns: any = null;

const ShowLogModal = (data) => {
  ModalIns = Modal.open({
    title: 'Logs',
    top: 0,
    width: 1000,
    alignCenter: false,
    closable: false,
    maskClosable: true,
    footer: () => {
      return h(
        'div',
        {
          style: {
            textAlign: 'center'
          }
        },
        [
          h(
            Button,
            {
              type: 'primary',
              onClick: () => {
                ModalIns?.close?.();
              }
            },
            i18n.global.t('common.button.close')
          )
        ]
      );
    },
    content: () => {
      return h(LoggableModal, {
        info: { key: data.key, id: data.id }
      });
    }
  });
};
const ShowTermModal = (data) => {
  ModalIns = Modal.open({
    title: '终端',
    top: 0,
    width: 1000,
    maskClosable: true,
    alignCenter: false,
    closable: false,
    modalStyle: {
      height: '1000px;'
    },
    // footer: () => {
    //   return h(
    //     'div',
    //     {
    //       style: {
    //         textAlign: 'center'
    //       }
    //     },
    //     [
    //       h(
    //         Button,
    //         {
    //           type: 'primary',
    //           onClick: () => {
    //             ModalIns?.close?.();
    //             ModalIns?.update?.();
    //           }
    //         },
    //         i18n.global.t('common.button.close')
    //       )
    //     ]
    //   );
    // },
    content: () => {
      return h(TerminalModal, {
        show: true,
        info: { key: data.key, id: data.id }
      });
    }
  });
};
export const contextMenu = new G6.Menu({
  // trigger: 'click',
  shouldBegin(e) {
    const node = e?.item;
    const model: INode = node?.getModel();
    const logabble = model?.loggableInfo?.loggable;
    const executable = model?.executableInfo?.executable;
    if (!logabble && !executable) {
      return false;
    }
    return true;
  },
  getContent(evt) {
    const node = evt?.item;
    const model: INode = node?.getModel();
    const logabble = model?.loggableInfo?.loggable;
    const executable = model?.executableInfo?.executable;
    let logHtml = '';
    let execHtml = '';
    if (!logabble && !executable) {
      return '';
    }
    if (logabble) {
      logHtml = `<li code="log" class="iconfont icon-xiangqing-">
      ${i18n.global.t('applications.instance.tab.log')}
    </li>`;
    }
    if (executable) {
      execHtml = `<li code="exec" class="iconfont icon-code">
      ${i18n.global.t('applications.instance.tab.term')}
      </i>
      </li>`;
    }
    console.log('menu===', model);
    return `
    <div id="contextMenu-wrapper">
    <div class="res-name">${model?.name}</div>
    <ul >
      ${logHtml}${execHtml}
    </ul>
    </div>
    `;
  },
  handleMenuClick: (target, item) => {
    const code = target.getAttribute('code');
    const model = item.getModel();
    console.log(code, model);
    ModalIns?.close();
    if (code === 'log') {
      ShowLogModal(model?.loggableInfo?.data);
      return;
    }
    if (code === 'exec') {
      ShowTermModal(model?.executableInfo?.data);
    }
  },
  // offsetX and offsetY include the padding of the parent container
  // 需要加上父级容器的 padding-left 16 与自身偏移量 10
  offsetX: 16 + 10,
  // 需要加上父级容器的 padding-top 24 、画布兄弟元素高度、与自身偏移量 10
  offsetY: 0,
  // the types of items that allow the menu show up
  // 在哪些类型的元素上响应
  itemTypes: ['node']
});

export const createToolTip = () => {
  const toolTip = new G6.Tooltip({
    offsetX: 5,
    offsetY: 5,
    itemTypes: ['node'],
    getContent(e) {
      const model: INode = e?.item?.getModel();
      const box = document.createElement('div');
      box.style.width = 'max-content';
      let tips = '<span>右键菜单可执行：</span>';
      if (_.get(model, 'loggableInfo.loggable')) {
        tips += `<span> ${i18n.global.t(
          'applications.instance.tab.log'
        )}</span>`;
      }
      if (_.get(model, 'executableInfo.executable')) {
        tips += `<span> ${i18n.global.t(
          'applications.instance.tab.term'
        )}</span>`;
      }

      box.innerHTML = `
        <div style="line-height:20px">
          <div>
          <span style="display: inline-block;width: 40px;font-weight:700">Name: </span>
          ${_.get(model, 'name')}
          </div>
          <div>
          <span style="display: inline-block;width: 40px;font-weight:700">Type: </span>
          ${_.get(model, 'description')}
          </div>
          <div style="font-weight:500;margin-top:10px">${
            model?.loggableInfo?.loggable || model?.executableInfo?.executable
              ? tips
              : ''
          }</div>
          </div>
      `;
      return box;
    }
  });
  return toolTip;
};

export const toolbar = new G6.ToolBar();
export default {};

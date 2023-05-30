import G6 from '@antv/g6';
import _ from 'lodash';

export const contextMenu = new G6.Menu({
  getContent(evt) {
    console.log('menu===', evt?.item);
    const node = evt?.item;
    const model = node?.getModel();
    let header;
    if (evt?.target && evt.target.isCanvas && evt.target.isCanvas()) {
      header = 'Canvas ContextMenu';
    } else if (evt?.item) {
      const itemType = evt.item.getType();
      header = `${itemType.toUpperCase()} ContextMenu`;
    }
    return `
    <div>${model?.name}</div>
    <ul class="box">
      <li class="item">dsd</li>
      <li class="item">sdsd</li>
    </ul>`;
  },
  handleMenuClick: (target, item) => {
    console.log(target, item);
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
      const model = e?.item?.getModel();
      const box = document.createElement('div');
      box.style.width = 'max-content';
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
          </div>
      `;
      return box;
    }
  });
  return toolTip;
};

export const toolbar = new G6.ToolBar();
export default {};

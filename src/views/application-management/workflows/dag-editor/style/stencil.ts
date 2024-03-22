import insertCss from 'insert-css';

export default function setStencilStyle() {
  insertCss(`
    .stencil {
      border-rigth: 1px solid var(--color-border-2);
      color: var(--color-text-2);
      .x6-widget-stencil-title {
        background-color: var(--color-fill-2);
      }
      .x6-widget-stencil-group-title {
        background-color: var(--color-fill-2);
      }
      .x6-widget-stencil {
        color: var(--color-text-2);
        background-color: var(--color-white-1);;
      }
    }
  `);
}

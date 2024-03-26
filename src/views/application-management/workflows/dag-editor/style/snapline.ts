import insertCss from 'insert-css';

export default function setSnaplineStyle() {
  insertCss(`
    .x6-plugin-snapline.snapline {
      &-vertical,
      &-horizontal {
        stroke: rgba(var(--arcoblue-5),.5) !important;
      }   
    }
  `);
}

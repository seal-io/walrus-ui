import insertCss from 'insert-css';

export default function setSelectionStyle() {
  insertCss(`
    .x6-cell {
      &.x6-node-selected {
        .task {
          border: 2px dashed rgb(var(--arcoblue-5));
        }
      }
      
    }
    .x6-widget-selection-selected {
      .x6-widget-selection-box.x6-widget-selection-box-edge {
        margin-left:0;
        margin-right:0;
        border-color: rgb(var(--arcoblue-5));
        pointer-events: none;
      }
    }
  `);
}

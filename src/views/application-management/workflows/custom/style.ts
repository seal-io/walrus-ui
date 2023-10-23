import insertCss from 'insert-css';

export const setPipelineNodeStyle = (size) => {
  insertCss(`
  .separator-line {
    position: relative;
    width: 1px;
    overflow: visible;
    .line {
      position: absolute;
      top: -10000px;
      bottom: -10000px;
      width: 1px;
      height: auto;
      border-left: 1px dashed rgba(var(--arcoblue-5),.5);
    }
  }
    .pipeline-node {
      position: relative;
      font-size: 14px;
      color: var(--color-text-2);
      padding: 12px;
      width: ${size.width}px;
      height: ${size.height}px;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0px 2px 4px 0px rgba(var(--gray-5), 60%);
      &:hover {
        box-shadow: 0px 6px 6px rgba(var(--gray-5), 80%);
      }
      .stage-name {
        font-weight: 500;
        position: absolute;
        top: -40px;
        left: 20px;
      }
      .pipeline-node-title {
        margin-bottom: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title {
          font-weight: 500;
        }
      }
      .operation-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .arco-link {
          font-size: 12px;
        }
        .btn {
          padding: 12px 0;
        }
        .status {
          .success {
            color: var(--seal-color-success);
          }
        }
      }
      .more-action {
        font-size: 14px;
        color: var(--sealblue-6);
        padding: 4px 0;
        border-radius: 2px;
        &:hover {
          color: rgb(var(--arcoblue-5));
          background-color: var(--color-fill-2);
        }
      }
    }
  `);
};

export default {};

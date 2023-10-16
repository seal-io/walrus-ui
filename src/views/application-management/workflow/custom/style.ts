import insertCss from 'insert-css';

export const setStyle = (size) => {
  insertCss(`
  .data-processing-dag-node {
    display: flex;
    flex-direction: row;
    align-items: center;

  .main-area {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 12px;
    width: ${size.width}px;
    height: ${size.height}px;
    color: var(--color-text-2);
    font-size: 12px;
    font-family: PingFangSC;
    line-height: 24px;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid transparent;
    box-shadow: 0px 2px 4px 0px rgba(var(--gray-5), 60%);
    .del-btn {
      display: none;
      position: absolute;
      top: -8px;
      right: -8px;
      cursor: pointer;
      color: var(--seal-color-error);
      background-color: rgb(245,63,63,0.3);
      border-radius: 50%;
      &:hover {
        color: rgb(245,63,63,0.8);
        background-color: rgb(245,63,63,0.3);
      }
    }
    &:hover {
      .del-btn {
        display: inline;
      }
    }
  }
  .main-area:hover {
    box-shadow: 0px 6px 6px rgba(var(--gray-5), 80%);
  }

  .node-logo {
    display: inline-block;
    width: 24px;
    height: 24px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
  }

  .node-name {
    overflow: hidden;
    display: inline-block;
    width: 70px;
    margin-left: 6px;
    color: var(--color-text-2);
    font-size: 12px;
    font-family: PingFangSC;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: top;
  }

  .status-action {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .status-icon {
    font-size: 14px;
    &.icon-status-correct {
      color: var(--seal-color-success);
    }
    &.icon-status-error {
      color: var(--seal-color-error);
    }
  }

  .more-action-container {
    font-size: 0;
    margin-left: 10px;
    width: 15px;
    height: 15px;
    text-align: center;
    cursor: pointer;
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

  .plus-dag {
    position: absolute;
    z-index: 1;
    top: ${size.height / 2 - 8}px;
    left:  ${size.width - 8}px;
    background-color: rgba(var(--arcoblue-1), 8);
    font-size: 0;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0px 0px 4px rgba(var(--arcoblue-5), 0.8);
    .icon-plus-circle-fill {
      font-size: 16px;
      color: rgb(var(--arcoblue-5));
    }
    &.bottom {
      top: ${size.height - 6}px;
      left: ${size.width / 2 - 8}px;
    }
    &:hover {
      box-shadow: 0px 0px 4px rgba(var(--arcoblue-5), 1);
    }
  }

  .x6-node-selected .main-area {
    border-color: #3471f9;
  }

  .x6-node-selected .plus-dag {
    visibility: visible;
  }
  .each-disabled-sub-menu a {
    cursor: not-allowed;
      color: rgba(0, 0, 0, 35%);
  }
  }
  .processing-node-menu {
    width: 120px;
    .arco-dropdown-option-content {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: var(--color-text-3);
      .node-item-name {
        margin-left: 8px;
      }
    }
  }

  .node-mini-logo {
    display: inline-block;
    width: 16px;
    height: 16px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
    vertical-align: top;
  }

  @keyframes running-line {
    to {
      stroke-dashoffset: -1000;
    }
  }
`);
};

export const setPlusButtonStyle = (size) => {
  insertCss(`
    .stage-wrapper {
      position: relative;
      padding-bottom: 60px;
      &:hover {
        .arco-btn-dashed.task-btn {
          display: inline-block;
        }
      }
      .arco-btn-dashed {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 0;
        font-size: 14px;
       
        &.task-btn {
          display:none;
          background-color: #fff;
          border: 1px dashed rgb(var(--arcoblue-6));
          &:hover {
            background-color: rgba(var(--arcoblue-5), 0.2);
            border: 1px dashed rgba(var(--arcoblue-5), 0.5);
            color: rgba(var(--arcoblue-5), .8);
          }
        }
      }
      .stage {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        background-color: #fff;
        border-radius: 16px;
        padding-right: 10px;
        .more-action {
          position:relative;
          z-index: 1;
          cursor: pointer;
          color: var(--sealblue-6);
        }
        .arco-input-wrapper {
          border-radius: 16px;
          border:none;
        }
        &:hover {
          .plus-dag {
            display: block;
          }
        }
        &:before {
          content: '';
          position: absolute;
          top: 0;
          left: -32px;
          right: -32px;
          bottom: 0;
          z-index: -1'
        }
      }
  
      .plus-dag {
        position: absolute;
        display:none;
        z-index: 1;
        background-color: rgba(var(--arcoblue-1), 8);
        font-size: 0;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0px 0px 4px rgba(var(--arcoblue-5), 0.8);
        .icon-plus-circle-fill {
          font-size: 16px;
          color: rgb(var(--arcoblue-5));
        }
        &.prev {
          top: 10px;
          left:  -32px;
        }
        &.next {
          top: 10px;
          right:  -32px;
        }
      }
    }
  `);
};

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
      cursor: pointer;
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

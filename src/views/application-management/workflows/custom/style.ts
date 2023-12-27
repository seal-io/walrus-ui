import insertCss from 'insert-css';

export const setPipelineNodeStyle = (size) => {
  insertCss(`
  .approval-user-tooltip {
    box-shadow: 0px 0px 4px 0px rgba(var(--gray-5), 60%);
    .user-group {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .wp {
        display: flex;
        width:  24px;
        height: 24px;
        padding: 1px;
        background-color: #fff;
        border-radius: 50%;
      }
      .user {
        position: relative;
        display: flex;
        width:  22px;
        height: 22px;
        border-radius: 50%;
        box-shadow: 0px 0px 4px 0px rgba(var(--gray-5), 60%);
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 12px;
        .text {
          transform: scale(0.85);
        }
      }
      .iconfont.approval{
        position: absolute;
        top: 13px;
        right: -9px;
        background-color: #fff;
        border-radius: 50%;
        font-size: 10px;
        &.icon-correct {
          color: var(--seal-color-success);
        }
        &.icon-error-f {
          color: var(--seal-color-error);
        }
      }
    }
  }
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
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      position: relative;
      font-size: var(--font-size-small);
      color: var(--color-text-2);
      padding: 12px;
      width: ${size.width}px;
      height: ${size.height}px;
      background-color: #fff;
      border-radius:  var(--border-radius-small);;
      box-shadow: 0px 2px 4px 0px rgba(var(--gray-5), 60%);
      &:hover {
        box-shadow: 0px 6px 6px rgba(var(--gray-5), 80%);
      }
      .node-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background-color: #fff;
        box-shadow: 0px 0px 4px 0px rgba(var(--gray-5), 60%);
        position: absolute;
        right: 8px;
        top: -6px;
        font-weight: 700;
        color: rgb(var(--arcoblue-5));
      }
      .stage-name {
        max-width: 200px;
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
      .info {
        height: 45px;
        margin-top: 8px;
        padding-top:6px;
        margin-bottom: 0px; 
        width: 100%;
        font-size: 12px;
        display: flex;
        justify-content: space-between;
        border-top: 1px solid var(--color-border-2);
        .item {
          margin-right: 6px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          max-width: 90px;
          .title {
            font-weight: 500;
          }
          &.avatar {
            max-width: max-content;
          }
          .iconfont.approval{
            position: absolute;
            bottom: -12px;
            right: -4px;
            background-color: #fff;
            border-radius: 50%;
            font-size: 12px;
            &.icon-correct {
              color: var(--seal-color-success);
            }
            &.icon-error-f {
              color: var(--seal-color-error);
            }
          }
          .user-group {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            .wp {
              display: flex;
              width:  24px;
              height: 24px;
              padding: 1px;
              background-color: #fff;
              margin-left: -4px;
              border-radius: 50%;
            }
            .user {
              position: relative;
              display: flex;
              width:  22px;
              height: 22px;
              border-radius: 50%;
              box-shadow: 0px 0px 4px 0px rgba(var(--gray-5), 60%);
              align-items: center;
              justify-content: center;
              color: #fff;
              font-size: 12px;
              .text {
                transform: scale(0.85);
              }
            }
          }
          .arco-avatar-circle.arco-avatar-group-max-count-avatar {
            margin-left: -5px !important;
            width: 26px;
            height: 26px;
            font-size: 12px;
          }
          .link {
            cursor: pointer;
            color: rgb(var(--arcoblue-5));
            transition: all 0.3s;
            font-weight: 500;
            padding: 0 2px;
            border-radius: 2px;
            &:hover {
              color: rgb(var(--arcoblue-6));
              background-color: var(--color-fill-2);
              text-decoration: none;
              transition: all 0.3s;
            }
          }
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
          padding: 0;
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

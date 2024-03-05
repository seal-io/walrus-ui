<script lang="tsx">
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {
      topGap: {
        type: Boolean,
        default() {
          return false;
        }
      },
      info: {
        type: Object,
        default() {
          return {};
        }
      },
      iconType: {
        type: String,
        default() {
          return '';
        }
      },
      showImgIcon: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    setup(props, { slots }) {
      const renderIcon = () => {
        if (props.iconType === 'line') {
          return <span class="line-icon">{slots.icon?.()}</span>;
        }
        if (slots.icon) {
          return slots.icon();
        }
        return null;
      };

      const renderImgIcon = () => {
        if (props.showImgIcon) {
          return <span class="custom-icon">{slots.img?.()}</span>;
        }
        return null;
      };

      const renderTitle = () => {
        if (slots.title) {
          return <div class="title">{slots.title()}</div>;
        }
        return <div class="title">{props.info?.name}</div>;
      };
      return () => (
        <div>
          <div class={['header-info', { 'top-gap': props.topGap }]}>
            <div class="left">
              <div class="img">
                {renderIcon()}
                {renderImgIcon()}
              </div>
            </div>
            <div class="right">
              {renderTitle()}
              {slots.status?.()}
              {slots.description?.()}
            </div>
            <div class="extra">{slots.extra?.()}</div>
          </div>
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .header-info {
    position: relative;
    display: flex;
    align-items: center;
    min-height: 112px;
    padding: 16px var(--card-content-padding);
    background-color: var(--color-white);
    border-radius: var(--border-radius-small);

    &.top-gap {
      margin-top: 10px;
    }

    .left {
      width: 80px;

      .img {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 80px;
        background-color: transparent;

        :deep(.iconfont) {
          color: var(--color-header-icon);
          font-size: 42px;
          background-color: transparent;
          // box-shadow: 0 0 16px 2px rgb(var(--arcoblue-4));
          border-radius: 50%;
        }

        .line-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          background-color: rgb(var(--arcoblue-5));
          border-radius: 50%;

          :deep(.iconfont) {
            color: var(--color-white-2);
            font-size: 22px;
          }
        }

        .custom-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          color: var(--color-white);
          background-color: rgb(var(--arcoblue-5));
          border-radius: 50%;

          :deep(.arco-icon) {
            font-size: 32px;
          }
        }
      }
    }

    .right {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: center;
      padding: 8px 16px;
      line-height: 32px;

      :deep(.title) {
        display: flex;
        min-width: 400px;
        max-width: max-content;
        font-weight: var(--font-weight-medium);
        font-size: 20px;
        line-height: 2.5;

        .normal {
          margin-left: 40px;
          font-weight: var(--font-weight-regular);
          font-size: 14px;
        }
      }

      :deep(.description) {
        display: flex;
        display: -webkit-box;
        max-width: 940px;
        overflow: hidden;
        line-height: 26px;
        text-overflow: ellipsis;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }

    .extra {
      position: absolute;
      right: 16px;
      bottom: 16px;
    }
  }
</style>

<script lang="tsx">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'ModuleCard',
    props: {
      title: {
        type: String,
        default() {
          return '';
        }
      },
      showIcon: {
        type: Boolean,
        default() {
          return true;
        }
      },
      icon: {
        type: String,
        default() {
          return '';
        }
      },
      titleStyle: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    setup(props, { slots }) {
      return () => (
        <div class="module-card-wrap">
          <div
            class={[
              'title',
              {
                iconed: props.showIcon
              }
            ]}
            style={{
              ...props.titleStyle
            }}
          >
            {/* {props.icon ? (
              <i class={['iconfont size-16 m-r-5', props.icon]}></i>
            ) : (
              slots.icon?.()
            )} */}
            {props.title}
          </div>
          {slots.default?.()}
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .module-card-wrap {
    .title {
      position: relative;
      display: flex;
      align-items: center;
      margin-top: @title-top-gap;
      margin-bottom: @title-bottom-gap;
      color: var(--color-text-2);
      font-weight: 500;
      font-size: 16px;

      .iconfont {
        color: var(--color-text-2);
      }

      &.iconed {
        margin-top: 30px;
        padding-bottom: 10px;
        padding-left: 8px;
      }

      &.iconed::before {
        position: absolute;
        top: 0;
        bottom: 10px;
        left: 0;
        display: inline-block;
        width: 3px;
        background-color: rgba(var(--arcoblue-6), 0.8);
        border-radius: 0 4px 4px 0;
        content: '';
      }

      :deep(.arco-icon) {
        margin-right: 2px;
        font-size: 13px;
      }
    }
  }
</style>

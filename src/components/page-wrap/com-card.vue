<script lang="tsx">
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {
      padding: {
        type: String,
        default() {
          return '20px var(--card-content-padding) 20px';
        }
      },
      title: {
        type: String,
        default() {
          return '';
        }
      },
      bordered: {
        type: Boolean,
        default() {
          return false;
        }
      },
      bodyStyle: {
        type: Object,
        default() {
          return {};
        }
      },
      contentStyle: {
        type: Object,
        default() {
          return {};
        }
      },
      topGap: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    setup(props, { attrs, slots }) {
      return () => (
        <div class={['com-card', { 'top-gap': props.topGap }]}>
          <a-card
            title={props.title}
            {...attrs}
            body-style={{ padding: props.padding, ...props.bodyStyle }}
            bordered={props.bordered}
            v-slots={{
              title: !props.title
                ? null
                : () => {
                    return (
                      <>{slots.title ? slots.title() : props.title ?? null}</>
                    );
                  }
            }}
          >
            <div style={props.contentStyle} class="spin-card-content">
              {slots.default?.()}
            </div>
          </a-card>
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  @paddingSize: 20px;

  .spin-card-content {
    // background: var(--color-fill-1);
    // border-radius:  var(--border-radius-small);;
  }

  .com-card {
    :deep(.arco-card) {
      overflow: hidden;
      border-radius: var(--border-radius-small);
    }

    &.top-gap {
      margin-top: 10px;
    }
  }

  :deep(.arco-card-header) {
    height: auto;
    padding: @paddingSize var(--card-content-padding) 0;
    overflow: visible;
    border: none;

    .arco-card-header-title {
      overflow: visible;
      // font-weight: var(--font-weight-regular);
      line-height: 1;
    }
  }
</style>

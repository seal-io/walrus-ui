<script lang="tsx">
  import { PropType, Prop, withModifiers, defineComponent } from 'vue';

  export default defineComponent({
    emits: ['click'],
    props: {
      type: {
        type: String,
        default: 'outline'
      },
      title: {
        type: String,
        default: ''
      },
      action: {
        type: String as PropType<'add' | 'delete'>,
        default() {
          return 'add';
        }
      },
      size: {
        type: Number,
        default: 24
      },
      tooltip: {
        type: Boolean,
        default: true
      },
      hoverable: {
        type: Boolean,
        default: true
      }
    },
    setup(props, { slots, attrs, emit }) {
      const renderBtn = () => {
        return (
          <>
            <a-link
              hoverable={props.hoverable}
              type={props.type || 'primary'}
              onClick={() => emit('click')}
            >
              {props.action === 'add' ? (
                <icon-plus-circle-fill
                  style="stroke-width: 3;"
                  class={[`size-${props.size}`]}
                />
              ) : (
                <icon-minus-circle
                  style="stroke-width: 3"
                  class={[`size-${props.size}`]}
                />
              )}
            </a-link>
          </>
        );
      };
      return () => (
        <span class="common-button">
          {props.tooltip ? (
            <a-tooltip content={props.title}>{renderBtn()}</a-tooltip>
          ) : (
            renderBtn()
          )}
        </span>
      );
    }
  });
</script>

<style lang="less" scoped>
  .common-button {
    display: flex;
    // margin-top: 10px;
    // margin-bottom: 10px;
  }
</style>

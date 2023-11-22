<script lang="tsx">
  import { PropType, Prop, withModifiers, defineComponent } from 'vue';
  import ThumbButton from '@/components/buttons/thumb-button.vue';

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
      }
    },
    setup(props, { slots, attrs, emit }) {
      return () => (
        <span class="common-button">
          <a-tooltip content={props.title}>
            <a-link
              type={props.type || 'primary'}
              onClick={() => emit('click')}
            >
              {props.action === 'add' ? (
                <icon-plus-circle-fill
                  style="stroke-width: 3;"
                  class="size-24"
                />
              ) : (
                <icon-minus-circle style="stroke-width: 3" class="size-24" />
              )}
            </a-link>
          </a-tooltip>
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

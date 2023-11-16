<script lang="tsx">
  import { withModifiers, defineComponent } from 'vue';

  export default defineComponent({
    props: {
      type: {
        type: String,
        default: 'primary'
      }
    },
    emits: ['click'],
    setup(props, { slots, attrs, emit }) {
      return () => (
        <div class="common-button">
          <a-button
            type={props.type || 'primary'}
            {...attrs}
            onClick={withModifiers(() => emit('click'), ['stop'])}
          >
            {slots.default?.()}
          </a-button>
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .common-button {
    // margin-top: 10px;
    // margin-bottom: 10px;
  }
</style>

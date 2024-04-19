<script lang="tsx">
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {
      text: {
        type: String,
        default() {
          return '';
        }
      },
      margin: {
        type: Number,
        default: 20
      }
    },
    setup(props, ctx) {
      return () => (
        <div class="seal-divider" style={{ margin: `${props.margin}px 0` }}>
          <div class="seal-divider__line"></div>
          <div class="seal-divider__text">{ctx.slots.default?.()}</div>
          <div class="seal-divider__line"></div>
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .seal-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;

    &__line {
      flex: 1;
      height: 1px;
      background-color: var(--color-border-2);
    }

    &__text {
      margin: 0 10px;
      color: var(--color-text-3);
    }
  }
</style>

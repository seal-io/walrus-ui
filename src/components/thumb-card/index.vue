<script lang="tsx">
  import { defineComponent, PropType } from 'vue';

  export default defineComponent({
    props: {
      active: {
        type: Boolean as PropType<boolean>,
        default: false
      }
    },
    setup(props, { slots }) {
      return () => (
        <div class={['wrapper', { active: props.active }]}>
          {slots.default?.()}
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .wrapper {
    .thumbCard();

    &:hover {
      .thumbCardHover();

      color: inherit;
    }

    &.active {
      .thumbCardActive();
    }
  }
</style>

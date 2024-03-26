<script lang="tsx">
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {
      node: {
        type: Object,
        default: () => ({})
      },
      graph: {
        type: Object,
        default: () => ({})
      }
    },
    setup(props, ctx) {
      return () => (
        <div class="stage">
          <div class="title">{props.node.store?.data?.label}</div>
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .stage {
    height: 1000px;
    background-color: rgba(153, 153, 153, 0.2);
    border-right: 1px dashed rgba(var(--arcoblue-5), 0.5);

    .title {
      width: 100px;
      font-weight: var(--font-weight-medium);
      font-size: var(--font-size-normal);
      text-align: center;
    }
  }
</style>

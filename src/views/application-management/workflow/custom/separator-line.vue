<script lang="tsx">
  import { defineComponent, inject, toRefs, ref } from 'vue';

  export default defineComponent({
    name: 'SeparatorLine',
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
    setup(props, { emit }) {
      const { node, graph } = toRefs(props);

      return () => (
        <div class="separator-line">
          <div class="line"></div>
        </div>
      );
    }
  });
</script>

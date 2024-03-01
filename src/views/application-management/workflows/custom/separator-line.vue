<script lang="tsx">
  import { useAppStore } from '@/store';
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
      const appStore = useAppStore();
      const { node, graph } = toRefs(props);

      return () => (
        <div class={['separator-line', { dark: appStore.isDark }]}>
          <div class="line"></div>
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .separator-line {
    &.dark {
      .line {
        border-left-color: rgba(255, 255, 255, 0.1);
      }
    }
  }
</style>

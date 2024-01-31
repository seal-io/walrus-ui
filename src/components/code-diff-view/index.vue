<script lang="tsx">
  import { defineComponent, ref, watch, computed } from 'vue';
  import useCodeView from '@/hooks/use-code-view';
  import CodeChunk from './code-chunk.vue';

  export default defineComponent({
    props: {
      content: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    setup(props, ctx) {
      const { addChunks, removeChunks, clearDiffLines, getDiffCodeResult } =
        useCodeView();

      const init = () => {};
      watch(
        () => props.content,
        () => {
          getDiffCodeResult(props.content);
          console.log('codeview=========', {
            addChunks: addChunks.value,
            removeChunks: removeChunks.value
          });
        },
        {
          immediate: true
        }
      );
      return () => (
        <div class="box">
          <CodeChunk
            class="left chunks"
            chunks={removeChunks.value}
          ></CodeChunk>
          <div class="line"></div>
          <CodeChunk class="right chunks" chunks={addChunks.value}></CodeChunk>
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .box {
    position: relative;
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    font-size: var(--font-size-small);
    border: 1px solid var(--color-border-2);
    border-radius: var(--border-radius-small);

    .line {
      width: 1px;
      border-left: 1px solid var(--color-border-2);
    }

    .chunks {
      flex: 1;
    }
  }
</style>

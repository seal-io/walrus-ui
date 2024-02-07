<script lang="tsx">
  import { defineComponent, ref, watch, computed, PropType } from 'vue';
  import useCodeView from '@/hooks/use-code-view';
  import CodeChunk from './code-chunk.vue';

  export default defineComponent({
    props: {
      content: {
        type: Object as PropType<{ old: string; new: string }>,
        default() {
          return {};
        }
      },
      leftTitle: {
        type: String,
        default: ''
      },
      rightTitle: {
        type: String,
        default: ''
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
        <>
          {addChunks.value.length || removeChunks.value.length ? (
            <div class="chunk-box">
              <CodeChunk
                class="left chunks"
                chunks={removeChunks.value}
                title={props.leftTitle}
                v-slots={{
                  title: ctx.slots.leftTitle
                    ? () => ctx.slots.leftTitle?.()
                    : null
                }}
              ></CodeChunk>
              {ctx.slots.sperator ? (
                () => ctx.slots.sperator?.()
              ) : (
                <div class="line"></div>
              )}
              <CodeChunk
                class="right chunks"
                chunks={addChunks.value}
                title={props.leftTitle}
                v-slots={{
                  title: ctx.slots.rightTitle
                    ? () => ctx.slots.rightTitle?.()
                    : null
                }}
              ></CodeChunk>
            </div>
          ) : null}
        </>
      );
    }
  });
</script>

<style lang="less" scoped>
  .chunk-box {
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
      flex: 0 0 50%;
    }
  }
</style>

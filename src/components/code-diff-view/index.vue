<script lang="tsx">
  import _ from 'lodash';
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
      bordered: {
        type: Boolean,
        default() {
          return true;
        }
      },
      maxHeight: {
        type: [Number, String],
        default() {
          return '300px';
        }
      },
      leftTitle: {
        type: String,
        default: ''
      },
      rightTitle: {
        type: String,
        default() {
          return '';
        }
      }
    },
    setup(props, ctx) {
      const { leftChunks, rightChunks, getDiffCodeResult } = useCodeView();

      watch(
        () => props.content,
        () => {
          getDiffCodeResult(props.content);
        },
        {
          immediate: true
        }
      );
      const renderTitle = () => {
        return (
          <div class="title-box">
            <div class="left">{ctx.slots.leftTitle?.()}</div>
            <div class="right">{ctx.slots.rightTitle?.()}</div>
          </div>
        );
      };
      return () => (
        <>
          {rightChunks.value.length || leftChunks.value.length ? (
            <div
              style={{
                maxHeight: _.isString(props.maxHeight)
                  ? props.maxHeight
                  : `${props.maxHeight}px`
              }}
              class={[
                'chunk-box',
                {
                  bordered: props.bordered
                }
              ]}
            >
              <div class="main">
                <CodeChunk
                  class="left chunks"
                  chunks={leftChunks.value}
                  title={props.leftTitle}
                  onCollapse={(item) => {
                    leftChunks.value[item.leftIndex].collapsed = false;
                    rightChunks.value[item.rightIndex].collapsed = false;
                  }}
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
                  chunks={rightChunks.value}
                  title={props.leftTitle}
                  onCollapse={(item) => {
                    leftChunks.value[item.leftIndex].collapsed = false;
                    rightChunks.value[item.rightIndex].collapsed = false;
                  }}
                  v-slots={{
                    title: ctx.slots.rightTitle
                      ? () => ctx.slots.rightTitle?.()
                      : null
                  }}
                ></CodeChunk>
              </div>
            </div>
          ) : null}
        </>
      );
    }
  });
</script>

<style lang="less" scoped>
  .title-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    font-weight: bold;
    font-size: var(--font-size-small);
    border-bottom: 1px solid var(--color-border-2);

    .left,
    .right {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: space-between;
    }
  }

  .chunk-box {
    position: relative;
    overflow: hidden;
    overflow-y: auto;
    font-size: var(--font-size-small);
    border-radius: var(--border-radius-small);

    &.bordered {
      border: 1px solid var(--color-border-2);
    }

    .main {
      display: flex;
      justify-content: space-between;
      height: max-content;
    }

    .line {
      width: 1px;
      border-left: 1px solid var(--color-border-2);
    }

    .chunks {
      flex: 0 0 50%;
    }
  }
</style>

<script lang="tsx">
  import _ from 'lodash';
  import { defineComponent, PropType, ref, watch, computed } from 'vue';
  import HLBlock from '@/components/highlight-block/index.vue';

  interface DiffCodeItem {
    type?: string;
    chunks: string[];
    lineCounts: number;
    startLine: number;
    collapsed?: boolean;
  }

  export default defineComponent({
    props: {
      chunks: {
        type: Array as PropType<DiffCodeItem[]>,
        default() {
          return [];
        }
      },
      title: {
        type: String,
        default: ''
      }
    },
    setup(props, ctx) {
      return () => (
        <div class="wrap">
          <div class="title">
            {ctx.slots.title?.(props.chunks) ?? props.title}
          </div>
          {_.map(props.chunks, (item) => {
            return (
              <div class={['chunk-content', { collapse: item.collapsed }]}>
                {_.map(item.chunks, (sItem, sIndex) => {
                  return (
                    <div class={['chunk', item.type]}>
                      <span class="line-num">{item.startLine + sIndex}</span>
                      <div class="code">
                        <HLBlock code={sItem} lang="json"></HLBlock>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .wrap {
    .title {
      padding: 8px 12px;
    }

    .chunk-content {
      text-align: left;
    }

    .collapse {
      background-color: var(--color-fill-2);
    }

    .chunk {
      display: flex;

      &.remove {
        background-color: var(--code-remove-text-line);
      }

      &.remove .line-num {
        color: var(--color-text-2);
        background-color: var(--code-remove-number-line);
      }

      &.add {
        background-color: var(--code-add-text-line);
      }

      &.add .line-num {
        color: var(--color-text-2);
        background-color: var(--code-add-number-line);
      }

      .line-num {
        width: 44px;
        color: var(--color-text-3);
        line-height: 20px;
        text-align: center;
      }

      .code {
        position: relative;
        flex: 1;
        min-height: 20px;
        margin: 0;
        padding-right: 10px;
        line-height: 20px;
        white-space: pre-wrap;
        word-break: break-all;

        &::before {
          position: absolute;
          top: 0;
          left: 6px;
          content: '';
        }
      }

      &.remove .code {
        padding-left: 20px;

        &::before {
          content: '-';
        }
      }

      &.add .code {
        padding-left: 20px;

        &::before {
          content: '+';
        }
      }
    }

    :deep(.high-light-wrapper) {
      .hljs {
        padding: 0;
        background-color: transparent;
      }

      pre {
        margin: 0;
        white-space: pre-wrap;
        word-break: break-word;
      }

      .code.hljs {
        padding: 0;
      }
    }
  }
</style>

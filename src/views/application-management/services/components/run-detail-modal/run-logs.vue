<script lang="tsx">
  import { get } from 'lodash';
  import { defineComponent, computed, ref } from 'vue';
  import RevisionLogs from '../revision-logs.vue';
  import { RevisionWatchStatus } from '../../config';

  export default defineComponent({
    name: 'RunLogs',
    props: {
      runData: {
        type: Object,
        default() {
          return {};
        }
      },
      show: {
        type: Boolean,
        default: false
      },
      fullscreen: {
        type: Boolean,
        default: false
      }
    },
    setup(props, { emit }) {
      const maxHeight = computed(() => {
        return props.fullscreen ? 'calc(100vh - 310px)' : '310px';
      });

      return () => (
        <div class="logs-content">
          {RevisionWatchStatus.includes(
            props.runData?.status?.summaryStatus
          ) ? (
            <RevisionLogs
              maxHeight={maxHeight.value}
              show={props.show}
              fullscreen={props.fullscreen}
              revision-id={props.runData?.id}
            ></RevisionLogs>
          ) : (
            <div
              class={[{ fullscreen: props.fullscreen }, 'content-wrap']}
              style={{ maxHeight: maxHeight.value }}
            >
              {props.runData?.record || ''}
            </div>
          )}
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .logs-content {
    text-align: left;

    .content-wrap {
      min-height: 200px;
      max-height: 360px;
      padding: 0 10px;
      overflow-y: auto;
      color: #ddd;
      font-size: var(--font-size-small);
      white-space: pre-wrap;
      word-wrap: break-word;
      background-color: #181d28;
      border: 1px solid var(--color-border-2);
      border-radius: var(--border-radius-small);

      &.fullscreen {
        max-height: calc(100vh - 270px);
      }
    }

    .label {
      margin-top: 10px;
      margin-bottom: 10px;
      color: var(--color-text-3);
      font-size: var(--font-size-small);
    }
  }
</style>

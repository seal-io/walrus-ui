<script lang="tsx">
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {
      fullscreen: {
        type: Boolean,
        default: false
      },
      maxHeight: {
        type: String,
        default: '310px'
      },
      record: {
        type: String,
        default: ''
      }
    },
    setup(props, ctx) {
      return () => (
        <div class="logs-content static">
          <div
            class={[{ fullscreen: props.fullscreen }, 'content-wrap']}
            style={{ maxHeight: props.maxHeight }}
          >
            {props.record || ''}
          </div>
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
      padding: 0 10px;
      overflow-y: auto;
      color: var(--color-logs-text);
      font-size: var(--font-size-small);
      white-space: pre-wrap;
      word-wrap: break-word;
      background-color: var(--color-logs-bg);
      border: 1px solid var(--color-border-2);
      border-radius: var(--border-radius-small);

      &.fullscreen {
        max-height: calc(100vh - 270px);
      }
    }
  }
</style>

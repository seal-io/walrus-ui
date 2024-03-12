<script lang="tsx">
  import { defineComponent, PropType } from 'vue';

  export default defineComponent({
    props: {
      type: {
        type: String as PropType<
          'success' | 'error' | 'warning' | 'inactive' | 'transitioning'
        >,
        default() {
          return '';
        }
      },
      size: {
        type: Number,
        default() {
          return 14;
        }
      },
      percent: {
        type: Number,
        default() {
          return 0.2;
        }
      },
      strokeWidth: {
        type: Number,
        default() {
          return 2;
        }
      }
    },
    setup(props, ctx) {
      const renderProgress = () => {
        if (props.type === 'warning') {
          return (
            <icon-bulb
              style={{
                color: 'rgba(var(--warning-3))',
                fontSize: `${props.size}px`,
                strokeWidth: props.strokeWidth
              }}
            />
          );
        }
        return null;
      };

      const renderError = () => {
        if (props.type === 'error') {
          return (
            <i
              class={[`iconfont icon-warning-filling-copy`]}
              style={{
                color: 'var(--seal-color-error)',
                fontSize: `${props.size}px`
              }}
            ></i>
          );
        }
        return null;
      };

      const renderSuccess = () => {
        if (props.type === 'success') {
          return (
            <icon-check-circle
              style={{
                color: 'var(--seal-color-success)',
                fontSize: `${props.size}px`,
                strokeWidth: props.strokeWidth
              }}
            />
          );
        }
        return null;
      };

      const renderTransitioning = () => {
        if (props.type === 'transitioning') {
          return (
            <a-progress
              class="arco-icon-loading progress"
              size="mini"
              status="normal"
              color="rgba(var(--arcoblue-5),1)"
              width={props.size}
              stroke-width={props.strokeWidth}
              percent={props.percent}
            />
          );
        }
        return null;
      };

      const renderInactive = () => {
        if (props.type === 'inactive') {
          return (
            <icon-stop
              style={{
                color: 'rgb(var(--gray-5))',
                fontSize: `${props.size}px`,
                strokeWidth: props.strokeWidth
              }}
            />
          );
        }
        return null;
      };
      return () => (
        <span>
          {renderProgress()}
          {renderError()}
          {renderSuccess()}
          {renderInactive()}
          {renderTransitioning()}
        </span>
      );
    }
  });
</script>

<style lang="less" scoped>
  .arco-icon-loading.progress {
    animation: arco-loading-circle 1.5s infinite cubic-bezier(0, 0, 1, 1);
  }
</style>

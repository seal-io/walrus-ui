<script lang="tsx">
  import _ from 'lodash';
  import { PropType, defineComponent, toRefs } from 'vue';

  interface Step {
    title: string;
    info: string;
    status: string; // 'Ready' | 'Error' | 'Running' | 'Pending'
  }

  export default defineComponent({
    props: {
      steps: {
        type: Array as PropType<Step[]>,
        default() {
          return [];
        }
      }
    },
    setup(props) {
      const { steps } = toRefs(props);

      return () => (
        <a-space class="steps-box">
          {_.map(steps.value, (item, index) => {
            return (
              <a-tooltip key={index} content={`${item.title}: ${item.status}`}>
                <span class={['item', item.status]}></span>
              </a-tooltip>
            );
          })}
        </a-space>
      );
    }
  });
</script>

<style lang="less" scoped>
  .steps-box {
    font-size: 0;

    .item {
      display: flex;
      width: 14px;
      height: 14px;
      background-color: var(--color-fill-3);
      border-radius: var(--border-radius-small);

      &.Ready {
        color: #fff;
        background-color: var(--seal-color-success);

        &::after {
          background-color: var(--seal-color-success);
        }
      }

      &.Error {
        color: #fff;
        background-color: var(--seal-color-error);

        &::after {
          background-color: var(--seal-color-error);
        }
      }

      &.Running {
        color: #fff;
        background-color: var(--seal-color-warning);

        &::after {
          background-color: var(--seal-color-warning);
        }
      }

      &.Pending {
        color: #fff;
        background-color: var(--color-fill-3);

        &::after {
          background-color: var(--color-border-2);
        }
      }
    }
  }
</style>

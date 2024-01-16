<script lang="tsx">
  import _ from 'lodash';
  import { PropType, defineComponent, toRefs } from 'vue';
  import { StatusColorBgMap } from '@/views/config';

  interface Step {
    title: string;
    info: string;
    colorStatus: string; // 'ready' | 'error' | 'transitioning' | 'inactive
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
                <span
                  class={['item', item.status]}
                  style={{
                    backgroundColor: _.get(StatusColorBgMap, item.colorStatus)
                  }}
                ></span>
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
      border-radius: var(--border-radius-mini);

      &.Ready {
        color: #fff;
        // background-color: rgba(var(--green-6), 0.7);

        // &::after {
        //   background-color: rgba(var(--green-6), 0.7);
        // }
      }

      &.Error {
        color: #fff;
        // background-color: rgba(var(--red-6), 0.7);

        // &::after {
        //   background-color: rgba(var(--red-6), 0.7);
        // }
      }

      &.Running {
        color: #fff;
        // background-color: rgb(251, 222, 55);

        // &::after {
        //   background-color: rgb(251, 222, 55);
        // }
      }

      &.Pending {
        color: #fff;
        // background-color: rgba(var(--gray-4), 0.9);

        // &::after {
        //   background-color: rgba(var(--gray-4), 0.9);
        // }
      }
    }
  }
</style>

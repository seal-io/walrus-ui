<script lang="tsx">
  import _ from 'lodash';
  import { useAppStore } from '@/store';
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
      const appStore = useAppStore();

      return () => (
        <a-space class="steps-box">
          {_.map(steps.value, (item, index) => {
            return (
              <a-tooltip key={index} content={`${item.title}: ${item.status}`}>
                <span
                  class={['item', item.status]}
                  style={{
                    backgroundColor: appStore.isDark
                      ? `rgba(var(${_.get(
                          StatusColorBgMap,
                          item.colorStatus
                        )}),0.6)`
                      : `rgba(var(${_.get(
                          StatusColorBgMap,
                          item.colorStatus
                        )}),0.7)`
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
      color: var(--color-white);
      background-color: var(--color-fill-3);
      border-radius: var(--border-radius-mini);
    }
  }
</style>

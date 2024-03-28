<script lang="tsx">
  import _, { find } from 'lodash';
  import { defineComponent, ref, computed, inject } from 'vue';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import { APPROVAL_NODE_SIZE, PHASES } from '../../config';

  export default defineComponent({
    props: {
      node: {
        type: Object,
        default: () => ({})
      },
      graph: {
        type: Object,
        default: () => ({})
      }
    },
    setup(props, ctx) {
      const nodeData = ref(props.node.store?.data);

      const status = computed(() => {
        const nodesStatus = props.node.store?.data?.data?.nodesStatus || {};
        const list = _.map(_.keys(nodesStatus), (key) => {
          return nodesStatus[key];
        });

        const res =
          _.find(list, (item) => {
            return item.displayName === props.node.store?.data?.label;
          }) || {};
        return res;
      });

      const initEvent = () => {
        props.node?.on('change:data', ({ cell, current }) => {
          nodeData.value = cell.getData();
          console.log('change:data=======', cell, cell.getData());
        });
      };

      initEvent();

      return () => (
        <div
          class="task task-node"
          style={{
            width: `${APPROVAL_NODE_SIZE.width}px`,
            height: `${APPROVAL_NODE_SIZE.height}px`
          }}
        >
          <div class="inner">
            <span class="status">
              <StatusLabel
                status={{
                  summaryStatus: status.value.phase,
                  summaryStatusMessage: status.value.message,
                  transitioning: _.includes(
                    [PHASES.Pending, PHASES.Running],
                    status.value.phase
                  ),
                  error: _.includes(
                    [PHASES.Failed, PHASES.Error],
                    status.value.phase
                  ),
                  inactive: _.includes([PHASES.Omitted], status.value.phase)
                }}
              ></StatusLabel>
            </span>
            <div class="title">
              {' '}
              {nodeData.value?.label || nodeData.value?.name || 'taskName'}
            </div>
          </div>
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .task {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    background-color: var(--color-white);
    border-right: 1px solid var(--color-border-2);
    border-radius: var(--border-radius-small);
    box-shadow: 0 2px 4px 0 rgba(var(--gray-5), 60%);
    transform: rotate(45deg) skew(-10deg, -10deg);
    transform-origin: center center;

    .inner {
      transform: skew(10deg, 10deg) rotate(-45deg);
    }

    .status {
      position: absolute;
      top: 10px;
      left: 10px;
    }

    &.dark {
      color: rgba(255, 255, 255, 0.7);
      background-color: var(--color-card-bg);
      border: 1px solid transparent;
      box-shadow: 1px 1px 0 rgba(255, 255, 255, 0.2);

      &:hover {
        border: 1px solid rgba(169, 174, 184, 0.6);
      }
    }

    .title {
      width: 100px;
      font-weight: var(--font-weight-medium);
      font-size: var(--font-size-normal);
      text-align: center;
    }
  }
</style>

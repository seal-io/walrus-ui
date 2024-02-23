<script lang="tsx">
  import { PropType, defineComponent } from 'vue';
  import DropButtonGroup from '@/components/drop-button-group/index.vue';
  import ADescriptionsItem from '@arco-design/web-vue/es/descriptions/descriptions-item';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import _, { get } from 'lodash';
  import { MoreAction } from '@/views/config/interface';
  import LabelsList from './labels-list.vue';

  export default defineComponent({
    emits: ['groupSelect', 'groupClick'],
    props: {
      dataInfo: {
        type: Array as PropType<
          { label: string; value: any; key: string; span?: number }[]
        >,
        default() {
          return [];
        }
      },
      cols: {
        type: Number,
        default: 2
      },
      actions: {
        type: Array as PropType<MoreAction[]>,
        default() {
          return [];
        }
      },
      layout: {
        type: String,
        default: 'inline-vertical'
      },
      tableLayout: {
        type: String,
        default: 'auto'
      }
    },
    setup(props, { slots, emit }) {
      const handleSelect = (val) => {
        emit('groupSelect', val);
      };
      const handleClick = (data) => {
        emit('groupClick', data);
      };
      const renderValue = (item) => {
        if (item.key === 'status') {
          return (
            <>
              <StatusLabel
                zoom={0.9}
                status={{
                  status: get(item, 'value.summaryStatus') || '',
                  text: get(item, 'value.summaryStatus'),
                  inactive: get(item, 'value.inactive'),
                  message: get(item, 'value.summaryStatusMessage') || '',
                  transitioning: get(item, 'value.transitioning'),
                  error: get(item, 'value.error')
                }}
              ></StatusLabel>
            </>
          );
        }
        if (item.key === 'labels') {
          return (
            <>
              <LabelsList labels={item.value}></LabelsList>
            </>
          );
        }
        return <div class="val-content">{get(item, 'value')}</div>;
      };
      return () => (
        <div>
          <div class="basic-info">
            <a-descriptions
              data={props.dataInfo}
              column={props.cols}
              layout={props.layout}
              table-layout={props.tableLayout}
            >
              {_.map(props.dataInfo, (item, index) => {
                return (
                  <ADescriptionsItem
                    key={index}
                    label={item.label}
                    span={item.span}
                  >
                    {slots.value
                      ? slots.value({ data: item, value: renderValue(item) })
                      : renderValue(item)}
                  </ADescriptionsItem>
                );
              })}
            </a-descriptions>
            {props.actions.length ? (
              <div class="dropdown">
                <DropButtonGroup
                  actions={props.actions}
                  onClick={(val) => handleClick(val)}
                  onSelect={(val) => handleSelect(val)}
                ></DropButtonGroup>
              </div>
            ) : null}
          </div>
          {slots.default?.()}
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .basic-info {
    position: relative;

    .dropdown {
      position: absolute;
      top: 5px;
      right: -10px;
    }

    :deep(.arco-descriptions-row) {
      .arco-descriptions-item-label-block {
        font-weight: var(--font-weight-medium);
        font-size: var(--font-size-small);
      }

      .arco-descriptions-item-value-block {
        min-width: 60px;
      }

      .arco-descriptions-item,
      .arco-descriptions-item-label,
      .arco-descriptions-item-value {
        min-height: 30px;
        font-weight: var(--font-weight-medium);
        font-size: var(--font-size-small);
        line-height: 2.5;
      }

      .val-content {
        width: max-content;
        max-width: 600px;
        max-height: 80px;
        overflow-y: auto;
      }
    }
  }
</style>

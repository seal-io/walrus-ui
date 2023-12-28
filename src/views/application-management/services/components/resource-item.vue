<script lang="tsx">
  import _ from 'lodash';
  import dayjs from 'dayjs';
  import i18n from '@/locale';
  import {
    defineComponent,
    ref,
    provide,
    withModifiers,
    toRef,
    watch
  } from 'vue';
  import Autotip from '@arco-design/web-vue/es/_components/auto-tooltip/auto-tooltip';
  import { ProvideServiceIDKey, ServiceStatus } from '../config';
  import ResourceComponents from './resource-components/index.vue';

  export default defineComponent({
    props: {
      selectedRowKeys: {
        type: Array,
        default: () => []
      },
      rowData: {
        type: Object,
        default: () => ({})
      },
      checked: {
        type: Boolean,
        default: false
      },
      rowkey: {
        type: String,
        default: 'id'
      },
      index: {
        type: Number,
        default: 0
      },
      showCheckbox: {
        type: Boolean,
        default: true
      }
    },
    emits: ['selectionChange', 'logs', 'terminal'],
    setup(props, { slots, emit }) {
      const resourceID = ref(props.rowData.id);
      provide(ProvideServiceIDKey, resourceID);

      const collapse = ref(false);
      const handleCheckboxChange = (checked, id) => {
        if (checked) {
          emit('selectionChange', _.uniq([...props.selectedRowKeys, id]));
        } else {
          emit(
            'selectionChange',
            _.filter(props.selectedRowKeys, (item) => item !== id)
          );
        }
      };
      const handleToggle = () => {
        if (props.rowData?.status?.summaryStatus === ServiceStatus.Undeployed)
          return;
        collapse.value = !collapse.value;
      };

      const handleLogClick = (data) => {
        emit('logs', data);
      };

      const handleTerminalClick = (data) => {
        emit('terminal', data);
      };

      const renderComponents = () => {
        if (!collapse.value) return null;
        return (
          <div class="components-container">
            <ResourceComponents
              onLogs={(data) => handleLogClick(data)}
              onTerminal={(data) => handleTerminalClick(data)}
            ></ResourceComponents>
          </div>
        );
      };
      return () => (
        <div
          onClick={withModifiers(handleToggle, ['stop'])}
          class={[
            'box',
            {
              active: collapse.value,
              clickable:
                props.rowData?.status?.summaryStatus !==
                ServiceStatus.Undeployed
            }
          ]}
        >
          <div class="item-wrap">
            <a-checkbox
              onClick={withModifiers(() => {}, ['stop'])}
              model-value={_.includes(props.selectedRowKeys, props.rowData.id)}
              disabled={props.rowData.disabled}
              onChange={(val) => {
                handleCheckboxChange(val, props.rowData.id);
              }}
            />
            <a-grid cols={24} style={{ width: '100%' }}>
              <a-grid-item span={4}>
                <Autotip>
                  <span>
                    {slots.name
                      ? slots.name?.({ record: props.rowData })
                      : props.rowData.name}
                  </span>
                </Autotip>
              </a-grid-item>
              <a-grid-item span={4}>
                <Autotip>
                  <>
                    {_.get(props.rowData, 'type') ? (
                      <span class="type">{_.get(props.rowData, 'type')}</span>
                    ) : (
                      <span class="type">
                        <span>{`${props.rowData.template?.name}@${
                          props.rowData.template?.version || ''
                        }`}</span>
                        <span
                          v-if="!record.template.project?.id"
                          style="color: var(--color-text-3)"
                          class="font-12 m-l-2"
                        >{`(${i18n.global.t(
                          'applications.variable.scope.global'
                        )})`}</span>
                      </span>
                    )}
                  </>
                </Autotip>
              </a-grid-item>
              <a-grid-item span={4}>
                <Autotip>
                  <span>{slots?.status?.({ record: props.rowData })}</span>
                </Autotip>
              </a-grid-item>
              <a-grid-item span={4}>
                <Autotip>
                  <span>
                    {dayjs(_.get(props.rowData, 'createTime')).format(
                      'YYYY-MM-DD HH:mm:ss'
                    )}
                  </span>
                </Autotip>
              </a-grid-item>
              <a-grid-item span={4}>
                <Autotip>
                  <span></span>
                </Autotip>
              </a-grid-item>
              <a-grid-item span={4} class="actions">
                <span
                  class="actions"
                  onClick={withModifiers(() => {}, ['stop'])}
                >
                  {slots?.actions?.({
                    record: props.rowData,
                    rowIndex: props.index
                  })}
                </span>
              </a-grid-item>
            </a-grid>
          </div>
          {renderComponents()}
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .box {
    overflow: hidden;
    border: 1px solid var(--color-border-2);
    border-radius: var(--border-radius-small);

    &:hover {
      border-color: var(--color-fill-1);
    }

    &.active {
      .item-wrap {
        background-color: var(--color-fill-1);
        border-color: var(--color-fill-1);
        // border-bottom: 1px dotted var(--color-border-3);
      }
    }

    &.clickable {
      cursor: pointer;
    }

    .components-container {
      margin: 10px 15px 10px;
    }
  }

  .item-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 15px;
    font-size: var(--font-size-small);
    line-height: 3;

    &:hover {
      background-color: var(--color-fill-1);
      border-color: var(--color-fill-1);
    }

    :deep(.arco-grid-item) {
      display: flex;
      align-items: center;
      padding: 0 16px;
    }

    .arco-checkbox {
      margin-right: 20px;
      padding-left: 0;
    }

    .type {
      display: flex;
      align-items: center;
      justify-content: center;
      width: fit-content;
      min-width: 40px;
      padding: 0 8px;
      line-height: 22px;
      border: 1px solid var(--color-border-2);
      border-radius: 22px;
    }

    .actions {
      display: flex;
      justify-content: center;
    }

    :deep(.arco-link) {
      padding: 1px 0;
      font-size: var(--font-size-small);
    }
  }
</style>

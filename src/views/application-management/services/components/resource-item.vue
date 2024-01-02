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
              showCheckbox={props.showCheckbox}
              onLogs={(data) => handleLogClick(data)}
              onTerminal={(data) => handleTerminalClick(data)}
            ></ResourceComponents>
          </div>
        );
      };
      const renderCollapseButton = () => {
        if (props.rowData?.status?.summaryStatus === ServiceStatus.Undeployed) {
          return <span class="empty-holder"></span>;
        }
        return (
          <a-link
            onClick={withModifiers(handleToggle, ['stop'])}
            class="collapse-btn p-0"
            style={{ color: 'var(--color-text-4)' }}
          >
            <>
              {collapse.value ? (
                <icon-down style={{ 'store-width': 3 }} class="font-12" />
              ) : (
                <icon-right style={{ 'store-width': 3 }} class="font-12" />
              )}
            </>
          </a-link>
        );
      };

      const renderCheckbox = () => {
        if (!props.showCheckbox) return null;
        return (
          <a-checkbox
            clas="checkbox-wrap"
            onClick={withModifiers(() => {}, ['stop'])}
            model-value={_.includes(props.selectedRowKeys, props.rowData.id)}
            disabled={props.rowData.disabled}
            onChange={(val) => {
              handleCheckboxChange(val, props.rowData.id);
            }}
          />
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
            <span class="check-box">
              {renderCheckbox()}
              {renderCollapseButton()}
            </span>
            <a-grid cols={24} style={{ width: '100%' }}>
              <a-grid-item span={4}>
                <span class="name-box">
                  <Autotip>
                    <span>
                      {slots.name
                        ? slots.name?.({ record: props.rowData })
                        : props.rowData.name}
                    </span>
                  </Autotip>
                </span>
              </a-grid-item>
              <a-grid-item span={6}>
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
              <a-grid-item span={3}>
                <Autotip>
                  <span>{slots?.status?.({ record: props.rowData })}</span>
                </Autotip>
              </a-grid-item>
              <a-grid-item span={3}>
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
      }

      // .check-box {
      //   .collapse-btn {
      //     background-color: var(--color-fill-4);
      //   }
      // }
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

    .check-box {
      display: flex;
      align-items: center;

      .collapse-btn {
        width: 14px;
        height: 14px;
        color: var(--color-text-3);

        &:hover {
          background-color: var(--color-fill-4);

          .arco-icon {
            color: var(--color-text-3);
          }
        }
      }
    }

    .empty-holder {
      width: 14px;
      height: 14px;
    }

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
      margin-right: 12px;
      padding-left: 0;
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

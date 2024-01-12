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
    watch,
    computed
  } from 'vue';
  import Autotip from '@arco-design/web-vue/es/_components/auto-tooltip/auto-tooltip';
  import PrimaryButtonGroup from '@/components/drop-button-group/primary-button-group.vue';
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

      const linkList = computed(() => {
        const list = _.map(props.rowData.endpoints || [], (item) => {
          return {
            label: item.name,
            value: item.url,
            icon: ''
          };
        }).filter(
          (item) =>
            _.startsWith(item.label, 'http') ||
            _.startsWith(item.label, 'https')
        );
        return list;
      });

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

      const renderLinkButton = () => {
        if (linkList.value.length === 0) {
          return null;
        }
        if (linkList.value.length === 1) {
          return (
            <a-link
              href={_.get(linkList.value, '0.value')}
              target="_blank"
              size="mini"
              class="m-l-10"
              style={{
                backgroundColor: 'var(--color-fill-1)',
                padding: '2px 4px'
              }}
            >
              <a-tooltip
                content={i18n.global.t(
                  'applications.applications.instance.accessUrl'
                )}
              >
                <icon-share-internal style="stroke-width: 4" class="font-14" />
              </a-tooltip>
            </a-link>
          );
        }
        return (
          <>
            <PrimaryButtonGroup
              actions={linkList.value}
              position="br"
              trigger="hover"
              v-slots={{
                item: (item) => {
                  return (
                    <a-link href={item.value} target="_blank">
                      {item.label}
                    </a-link>
                  );
                }
              }}
            >
              <a-link
                size="mini"
                class="m-l-10"
                style={{
                  backgroundColor: 'var(--color-fill-1)',
                  padding: '2px 4px'
                }}
              >
                <a-tooltip
                  content={i18n.global.t(
                    'applications.applications.instance.accessUrl'
                  )}
                >
                  <icon-share-internal
                    style="stroke-width: 4"
                    class="font-14"
                  />
                </a-tooltip>
              </a-link>
            </PrimaryButtonGroup>
          </>
        );
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
              <a-grid-item span={5} style="justify-content: space-between;">
                <Autotip>
                  <span class="name-box">
                    <span>
                      {slots.name
                        ? slots.name?.({ record: props.rowData })
                        : props.rowData.name}
                    </span>
                  </span>
                </Autotip>
                {renderLinkButton()}
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
              <a-grid-item span={5}>
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

    // &.clickable {
    //   cursor: pointer;
    // }
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
      justify-content: flex-start;
    }

    :deep(.arco-link) {
      padding: 1px 0;
      font-size: var(--font-size-small);
    }
  }
</style>

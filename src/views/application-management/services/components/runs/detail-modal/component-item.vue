<script lang="tsx">
  import _ from 'lodash';
  import i18n from '@/locale';
  import { defineComponent, ref, withModifiers } from 'vue';
  import Autotip from '@arco-design/web-vue/es/_components/auto-tooltip/auto-tooltip';
  import CodeDiffView from '@/components/code-diff-view/index.vue';
  import { StatusColor } from '@/views/config';
  import Copy from '@/components/copy/copy-command.vue';
  import ModuleWrapper from '@/components/module-wrapper/index.vue';
  import testData from './config/test-data.json';

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
        default: false
      }
    },
    emits: ['selectionChange'],
    setup(props, { slots, emit }) {
      const ChangeTypeMap = {
        'update': 'update',
        'delete': 'delete',
        'create': 'create',
        'no-change': 'no-change'
      };
      const collapse = ref(false);
      const isOpened = ref(false);
      const diffContent = ref({
        old: '',
        new: ''
      });

      const setDiffContent = () => {
        diffContent.value = {
          old: props.rowData.change?.before
            ? JSON.stringify(props.rowData.change?.before, null, 2)
            : '',
          new: JSON.stringify(props.rowData.change?.after, null, 2)
        };
      };

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
        collapse.value = !collapse.value;
        if (collapse.value && !isOpened.value) {
          setDiffContent();
          isOpened.value = true;
        }
      };

      const renderCopyButton = (text, data) => {
        return (
          <div class="title">
            <span>{text}</span>
            <Copy content={data}></Copy>
          </div>
        );
      };

      const renderComponents = () => {
        return (
          <ModuleWrapper
            status={collapse.value}
            showArrow={false}
            showDelete={false}
            innerWrap={true}
            showTitle={false}
            style={{ border: 'none' }}
          >
            <div class={['components-container']}>
              <CodeDiffView
                bordered={false}
                content={diffContent.value}
                isLeftEmpty={!diffContent.value.old}
                isRightEmpty={!diffContent.value.new}
                v-slots={{
                  leftTitle: diffContent.value.old
                    ? () => {
                        return renderCopyButton(
                          i18n.global.t(
                            'resource.revisons.components.beforeChange'
                          ),
                          diffContent.value.old
                        );
                      }
                    : null,
                  rightTitle: diffContent.value.new
                    ? () => {
                        return renderCopyButton(
                          i18n.global.t(
                            'resource.revisons.components.afterChange'
                          ),
                          diffContent.value.new
                        );
                      }
                    : null
                }}
              ></CodeDiffView>
            </div>
          </ModuleWrapper>
        );
      };
      const renderCollapseButton = () => {
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

      const renderChangeType = () => {
        const changeType = props.rowData.change?.type as string;
        if (changeType === ChangeTypeMap.update) {
          return (
            <a-tag
              type="outline"
              size="small"
              class="change-type"
              status="warning"
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--border-radius-small)',
                backgroundColor: StatusColor.warning.bg,
                color: StatusColor.warning.text
              }}
            >
              {i18n.global.t('resource.revisons.components.change.update')}
            </a-tag>
          );
        }
        if (changeType === ChangeTypeMap.delete) {
          return (
            <a-tag
              type="outline"
              size="small"
              class="change-type"
              status="danger"
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--border-radius-small)',
                backgroundColor: StatusColor.error.bg,
                color: StatusColor.error.text
              }}
            >
              {i18n.global.t('resource.revisons.components.change.delete')}
            </a-tag>
          );
        }
        if (changeType === ChangeTypeMap.create) {
          return (
            <a-tag
              type="outline"
              size="small"
              class="change-type"
              status="success"
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--border-radius-small)',
                backgroundColor: StatusColor.success.bg,
                color: StatusColor.success.text
              }}
            >
              {i18n.global.t('resource.revisons.components.change.create')}
            </a-tag>
          );
        }
        // no-change
        return (
          <a-tag
            type="outline"
            size="small"
            class="change-type"
            status="success"
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--border-radius-small)',
              backgroundColor: StatusColor.inactive.bg,
              color: StatusColor.inactive.text
            }}
          >
            {i18n.global.t('resource.revisons.components.change.nochange')}
          </a-tag>
        );
      };
      return () => (
        <div
          class={[
            'box',
            {
              active: collapse.value,
              clickable: true
            }
          ]}
        >
          <div class="item-wrap">
            <span class="check-box">
              {renderCheckbox()}
              {renderCollapseButton()}
            </span>
            <a-grid cols={24} style={{ width: '100%' }}>
              <a-grid-item span={9} style="justify-content: space-between;">
                <Autotip>
                  <span class="name-box">
                    <span>
                      {slots.name
                        ? slots.name?.({ record: props.rowData })
                        : props.rowData.name}
                    </span>
                  </span>
                </Autotip>
              </a-grid-item>
              <a-grid-item span={9}>
                <Autotip>
                  <span>{_.get(props.rowData, 'type')}</span>
                </Autotip>
              </a-grid-item>
              <a-grid-item span={6}>
                <Autotip>{renderChangeType()}</Autotip>
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
    }

    .components-container {
      margin: 0;

      &.show {
        display: none;
      }

      .chunk-box {
        border: none;
        border-radius: 0;
      }
    }

    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
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
        width: 20px;
        height: 20px;
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

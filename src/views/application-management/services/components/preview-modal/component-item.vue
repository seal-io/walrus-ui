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
  import CodeDiffView from '@/components/code-diff-view/index.vue';
  import { StatusColor } from '@/views/config';
  import diffValue from './config/diff-content.json';

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
    emits: ['selectionChange', 'logs', 'terminal'],
    setup(props, { slots, emit }) {
      const collapse = ref(false);
      const diffContent = ref({
        old: '',
        new: ''
      });

      const setDiffContent = () => {
        diffContent.value = {
          old: diffValue.old?.computedAttributes
            ? JSON.stringify(diffValue.old?.computedAttributes, null, 2)
            : '',
          new: JSON.stringify(diffValue.new?.computedAttributes, null, 2)
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
        setDiffContent();
      };

      const renderComponents = () => {
        if (!collapse.value) return null;
        return (
          <div class="components-container">
            <CodeDiffView content={diffContent.value}></CodeDiffView>
          </div>
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
        const changeType = props.rowData.changeType as string;
        if (changeType === 'update') {
          return (
            <a-link
              type="outline"
              size="small"
              class="change-type"
              status="warning"
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--border-radius-small)',
                backgroundColor: StatusColor.warning.color1,
                color: StatusColor.warning.color5
              }}
            >
              <i class="iconfont icon-wave-sine m-r-5"></i>Update
            </a-link>
          );
        }
        if (changeType === 'remove') {
          return (
            <a-link
              type="outline"
              size="small"
              class="change-type"
              status="danger"
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--border-radius-small)',
                backgroundColor: StatusColor.error.color1,
                color: StatusColor.error.color5
              }}
            >
              <icon-minus class="m-r-5" />
              Delete
            </a-link>
          );
        }
        return (
          <a-link
            type="outline"
            size="small"
            class="change-type"
            status="success"
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--border-radius-small)',
              backgroundColor: StatusColor.success.color1,
              color: StatusColor.success.color5
            }}
          >
            <icon-plus class="m-r-5" />
            Add
          </a-link>
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

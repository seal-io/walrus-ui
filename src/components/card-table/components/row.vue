<script lang="tsx">
  import _ from 'lodash';
  import dayjs from 'dayjs';
  import i18n from '@/locale';
  import {
    defineComponent,
    ref,
    provide,
    PropType,
    withModifiers,
    toRef,
    watch,
    computed
  } from 'vue';
  import Autotip from '@arco-design/web-vue/es/_components/auto-tooltip/auto-tooltip';
  import Cell from './cell.vue';

  export default defineComponent({
    props: {
      showCollapse: {
        type: Boolean,
        default: false
      },
      selectedRowKeys: {
        type: Array,
        default: () => []
      },
      rowData: {
        type: Object as PropType<any>,
        default() {
          return {};
        }
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
      },
      columns: {
        type: Array,
        default: () => []
      }
    },
    emits: ['selectionChange', 'toggle'],
    setup(props, { slots, emit }) {
      const resourceID = ref(props.rowData.id);

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
        collapse.value = !collapse.value;
        emit('toggle', collapse.value);
      };

      const renderComponents = () => {
        if (!collapse.value) return null;
        return <div class="components-container">{slots?.expand?.()}</div>;
      };
      const renderCollapseButton = () => {
        if (!props.showCollapse) {
          return null;
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
              {slots?.default?.()}
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

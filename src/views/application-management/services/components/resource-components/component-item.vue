<script lang="tsx">
  import _ from 'lodash';
  import dayjs from 'dayjs';
  import i18n from '@/locale';
  import { defineComponent, ref, watch, withModifiers } from 'vue';
  import Autotip from '@arco-design/web-vue/es/_components/auto-tooltip/auto-tooltip';

  export default defineComponent({
    props: {
      rowData: {
        type: Object,
        default: () => ({})
      },
      isChildren: {
        type: Boolean,
        default: false
      },
      treeLine: {
        type: Boolean,
        default: false
      },
      index: {
        type: Number,
        default: 0
      }
    },
    emits: ['selectionChange'],
    setup(props, { slots, emit }) {
      return () => (
        <>
          <div
            class={['box', { 'is-child': props.isChildren }]}
            onClick={withModifiers(() => {}, ['stop'])}
          >
            <div class="item-wrap">
              <span class="holder"></span>
              <a-grid
                cols={24}
                style={{ width: '100%' }}
                class={[
                  {
                    'child-grid-wrap': props.isChildren,
                    'tree-line': props.treeLine
                  }
                ]}
              >
                <a-grid-item span={4}>
                  <Autotip>
                    <span>
                      {slots.name
                        ? slots.name({ record: props.rowData })
                        : props.rowData.name}
                    </span>
                  </Autotip>
                </a-grid-item>
                <a-grid-item span={4}>
                  <Autotip>
                    <span>{props.rowData.type}</span>
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
                  <span class="actions">
                    {slots?.actions?.({
                      record: props.rowData,
                      rowIndex: props.index
                    })}
                  </span>
                </a-grid-item>
              </a-grid>
            </div>
          </div>
        </>
      );
    }
  });
</script>

<style lang="less" scoped>
  .box {
    border-radius: var(--border-radius-small);
    cursor: default;

    &:hover {
      background-color: var(--color-fill-1);
    }

    &.is-child {
      .item-wrap {
        .arco-grid-item:first-child {
          padding-left: 30px;
        }
      }
    }

    .tree-line {
      position: relative;

      &::before {
        position: absolute;
        top: -26px;
        left: 18px;
        display: inline-block;
        height: 44px;
        border-left: 1px dotted var(--color-border-3);
        content: '';
      }

      &::after {
        position: absolute;
        bottom: 18px;
        left: 18px;
        display: inline-block;
        width: 12px;
        border-bottom: 1px dotted var(--color-border-3);
        content: '';
      }
    }
  }

  .item-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    font-size: var(--font-size-small);
    line-height: 3;

    &:hover {
      background-color: var(--color-fill-1);
      border-radius: var(--border-radius-small);
    }

    :deep(.arco-grid-item) {
      display: flex;
      align-items: center;
      padding: 0 16px;
    }

    .holder {
      display: flex;
      width: 14px;
      height: 14px;
      margin-right: 20px;
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

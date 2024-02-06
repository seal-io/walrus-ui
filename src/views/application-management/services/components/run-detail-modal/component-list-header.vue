<script lang="tsx">
  import { defineComponent, PropType, ref } from 'vue';
  import Autotip from '@arco-design/web-vue/es/_components/auto-tooltip/auto-tooltip';
  import _ from 'lodash';

  interface Column {
    title: string;
    span: number;
    sortable: boolean;
    key: string;
  }

  export default defineComponent({
    emits: ['sort'],
    props: {
      dataList: {
        type: Array as PropType<Column[]>,
        default: () => []
      }
    },
    setup(props, ctx) {
      const sort = ref<'descend' | 'ascend'>();
      const sortDataIndex = ref('');

      const handleSort = (col: Column) => {
        if (!col.sortable) return;
        if (sort.value === 'descend') {
          sort.value = 'ascend';
        } else {
          sort.value = 'descend';
        }
        sortDataIndex.value = col.key;

        ctx.emit('sort', { col, sort: sort.value });
      };

      return () => (
        <div class="header">
          <span
            class="empty-holder"
            style={{ width: '20px', height: '20px' }}
          ></span>
          <a-grid cols={24} style={{ width: '100%' }}>
            {_.map(props.dataList, (col, index) => {
              return col.sortable ? (
                <a-grid-item
                  span={col.span}
                  class="sort-item"
                  key={index}
                  onClick={() => handleSort(col)}
                >
                  <Autotip>
                    <div class="sort-col">
                      {col.title}
                      <div class="sort-icon">
                        <a-icon
                          type="caret-up"
                          class={{
                            sorted:
                              sortDataIndex.value === col.key &&
                              sort.value === 'ascend'
                          }}
                        />
                        <a-icon
                          type="caret-down"
                          class={{
                            sorted:
                              sortDataIndex.value === col.key &&
                              sort.value === 'descend'
                          }}
                        />
                      </div>
                    </div>
                  </Autotip>
                </a-grid-item>
              ) : (
                <a-grid-item span={col.span} key={index}>
                  <Autotip>
                    <span>{col.title}</span>
                  </Autotip>
                </a-grid-item>
              );
            })}
          </a-grid>
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .header {
    display: flex;
    align-items: center;
    padding: 0 15px;

    :deep(.arco-grid-item) {
      display: flex;
      align-items: center;
      padding: 15px 16px;
    }

    .sort-item {
      cursor: pointer;

      &:hover {
        background-color: var(--color-fill-1);
      }
    }

    .sort-col {
      display: flex;
      align-items: center;
    }

    .sort-icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-left: 8px;
      color: var(--color-neutral-6);

      .arco-icon {
        font-size: var(--font-size-small);

        &.sorted {
          color: rgb(var(--primary-6));
        }
      }

      .arco-icon-caret-up {
        position: relative;
        top: 2px;
      }

      .arco-icon-caret-down {
        position: relative;
        top: -3px;
      }
    }

    .arco-checkbox {
      margin-right: 12px;
      padding: 0;

      :deep(.arco-checkbox-icon) {
        border: 1px solid var(--color-border-3);
      }
    }
  }
</style>

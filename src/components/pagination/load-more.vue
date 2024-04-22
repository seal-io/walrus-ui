<script lang="tsx">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'Pagination',
    props: {
      total: {
        type: Number,
        default() {
          return 0;
        }
      },
      pageSize: {
        type: Number,
        default() {
          return 10;
        }
      },
      continue: {
        type: Boolean,
        default: false
      },
      current: {
        type: Number,
        default() {
          return 1;
        }
      }
    },
    emits: [
      'change',
      'pageSizeChange',
      'update:pageSize',
      'update:current',
      'loadMore'
    ],
    setup(props, { slots, attrs, emit }) {
      const pageSizeOptions = [10, 20, 50, 100];

      const handlePageSizeChange = (value: number) => {
        emit('pageSizeChange', value);
        emit('update:pageSize', value);
        emit('update:current', 1);
      };

      const handleToNext = () => {
        if (!props.continue) return;
        emit('loadMore');
      };

      return () => (
        <div class="pg-pagination">
          <div class="pg-pagination-pages">
            <a-button
              class="button"
              disabled={!props.continue}
              onClick={() => handleToNext()}
            >
              下一页
            </a-button>
            <a-select
              onChange={(val) => {
                handlePageSizeChange(val);
              }}
              model-value={props.pageSize}
              style={{ width: '120px', marginLeft: '12px' }}
              options={pageSizeOptions}
              size="large"
              format-label={({ value }) => {
                return `${value} 条/页`;
              }}
            ></a-select>
          </div>
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .pg-pagination {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    &-total {
      margin-right: 12px;
    }

    &-pages {
      display: flex;
      align-items: center;

      .button {
        margin-left: 12px;
      }
    }
  }
</style>

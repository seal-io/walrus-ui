<script lang="tsx">
  import _ from 'lodash';
  import { defineComponent } from 'vue';
  import Row from './components/row.vue';
  import Cell from './components/cell.vue';
  import Header from './components/header.vue';
  import { ColumnType } from './config/interface';

  export default defineComponent({
    name: 'CardTable',
    components: {
      Row,
      Cell,
      Header
    },
    props: {
      dataList: {
        type: Array,
        default() {
          return [];
        }
      },
      bordered: {
        type: Boolean,
        default: true
      }
    },

    setup(props, { slots }) {
      const columns: any[] = slots.columns ? slots.columns() : [];
      const renderHeader = () => {
        return columns.map((column, index) => {
          const columnProps: ColumnType = column.props || {};
          console.log('columns==========', column.ctx, column.title);
          return (
            <Header
              title={columnProps.title}
              key={index}
              span={columnProps.span}
            >
              {slots.header?.(columnProps) ?? columnProps.title}
            </Header>
          );
        });
      };

      const renderCell = (record: any, rowIndex: number) => {
        return columns.map((column, index) => {
          const { ctx } = column;
          return (
            <Cell
              title={column.title}
              rowData={record}
              dataIndex={column.dataIndex}
              rowIndex={rowIndex}
              span={column.span}
              key={index}
              v-slots={{
                default: ctx.slots.cell
                  ? (data) => ctx.slots.cell?.(data)
                  : null
              }}
            ></Cell>
          );
        });
      };
      return () => (
        <div>
          <div class="card-table-header">
            <a-grid cols={24} style={{ width: '100%' }}>
              {renderHeader()}
            </a-grid>
          </div>
          {props.dataList.map((rowData: any, rowIndex) => (
            <Row key={rowIndex} rowData={rowData} columns={columns}>
              {slots.columns ? renderCell(rowData, rowIndex) : null}
            </Row>
          ))}
        </div>
      );
    }
  });
</script>

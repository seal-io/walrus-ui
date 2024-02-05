<script lang="tsx">
  import _ from 'lodash';
  import { defineComponent } from 'vue';
  import Autotip from '@arco-design/web-vue/es/_components/auto-tooltip/auto-tooltip';

  export default defineComponent({
    props: {
      title: {
        type: String,
        default: ''
      },
      rowData: {
        type: Object,
        default() {
          return {};
        }
      },
      dataIndex: {
        type: String,
        default: ''
      },
      rowIndex: {
        type: Number,
        default: 0
      },
      span: {
        type: Number,
        default: 5
      }
    },
    setup(props, { slots }) {
      return () => <span>{slots.cell?.()}</span>;
    }
  });
</script>

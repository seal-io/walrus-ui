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
      console.log('cell==========', slots.default?.());
      return () => (
        <a-grid-item span={props.span}>
          <Autotip>
            <span class="name-box">
              <span>
                {slots.default
                  ? slots.default?.()
                  : props.rowData[props.dataIndex]}
              </span>
            </span>
          </Autotip>
        </a-grid-item>
      );
    }
  });
</script>

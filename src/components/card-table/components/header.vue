<script lang="tsx">
  import { defineComponent } from 'vue';
  import Autotip from '@arco-design/web-vue/es/_components/auto-tooltip/auto-tooltip';

  export default defineComponent({
    name: 'Head',
    props: {
      title: {
        type: String,
        default: ''
      },
      span: {
        type: Number,
        default: 6
      }
    },
    setup(props, { slots }) {
      return () => (
        <a-grid-item span={props.span}>
          <Autotip>
            <span>{slots.title ? slots.title() : props.title}</span>
          </Autotip>
        </a-grid-item>
      );
    }
  });
</script>

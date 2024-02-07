<script lang="tsx">
  import { defineComponent, PropType } from 'vue';
  import ComponentItem from './component-item.vue';
  import { headerConfigs } from './config';
  import ComponentListHeader from './component-list-header.vue';

  export default defineComponent({
    props: {
      dataList: {
        type: Array as PropType<any[]>,
        default: () => []
      }
    },
    setup(props, ctx) {
      return () => (
        <div>
          <ComponentListHeader dataList={headerConfigs} />
          <a-space direction="vertical" size={20} fill>
            {props.dataList.length
              ? props.dataList.map((item) => <ComponentItem rowData={item} />)
              : ctx.slots.empty?.()}
          </a-space>
        </div>
      );
    }
  });
</script>

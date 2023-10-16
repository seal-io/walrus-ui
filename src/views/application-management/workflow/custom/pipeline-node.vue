<script lang="tsx">
  import { defineComponent, inject, toRefs, ref } from 'vue';
  import i18n from '@/locale';
  import MoreAction from './more-action.vue';

  export default defineComponent({
    name: 'PipelineNode',
    props: {
      node: {
        type: Object,
        default: () => ({})
      },
      graph: {
        type: Object,
        default: () => ({})
      }
    },
    setup(props, { emit }) {
      const { t } = i18n.global;
      const getGraph = inject('getGraph');
      const getNode = inject('getNode');
      const { node, graph } = toRefs(props);

      const renderStageName = () => {
        const data = node.value.getData();
        console.log('data', data);
        return data.stepPosition === 0 ? (
          <div class="stage-name">{data.stageName}</div>
        ) : null;
      };
      return () => (
        <div class="pipeline-node">
          {renderStageName()}
          <div class="pipeline-node-title">
            <div class="title">Javascript代码扫描</div>
            <div class="more">{/* <MoreAction></MoreAction> */}</div>
          </div>
          <div class="operation-box">
            <span class="status">
              <i class={['iconfont icon-success-fill success']}></i>
            </span>
            <a-space class="btn">
              <a-link hoverable={false}>日志</a-link>
            </a-space>
          </div>
        </div>
      );
    }
  });
</script>

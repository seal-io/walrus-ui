<script lang="tsx">
  import _ from 'lodash';
  import { defineComponent, inject, toRefs, ref } from 'vue';
  import i18n from '@/locale';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import { TaskTypes } from '../task-types/config';
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
            <div class="title">{node.value.data.name}</div>
            <div class="more">{/* <MoreAction></MoreAction> */}</div>
          </div>
          <div class="operation-box">
            <span class="status">
              {/* <i class={['iconfont icon-success-fill success']}></i> */}
              <StatusLabel
                zoom={0.9}
                status={{
                  status: _.get(node.value.data, 'status.summaryStatus'),
                  text: _.get(node.value.data, 'status.summaryStatus'),
                  message: _.get(
                    node.value.data,
                    'status.summaryStatusMessage'
                  ),
                  transitioning: _.get(node.value.data, 'status.transitioning'),
                  error: _.get(node.value.data, 'status.error')
                }}
              ></StatusLabel>
            </span>
            <a-space class="btn">
              {node.value.type === TaskTypes.APPROVAL ? (
                <a-link hoverable={false} data-event="node:approve">
                  {t('workflow.stage.approve')}
                </a-link>
              ) : null}
              <a-link hoverable={false} data-event="node:logs">
                {t('applications.applications.instance.log')}
              </a-link>
            </a-space>
          </div>
        </div>
      );
    }
  });
</script>

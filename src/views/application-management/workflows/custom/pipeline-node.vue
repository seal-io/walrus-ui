<script lang="tsx">
  import _ from 'lodash';
  import { defineComponent, inject, toRefs, ref } from 'vue';
  import i18n from '@/locale';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import Autotip from '@arco-design/web-vue/es/_components/auto-tooltip/auto-tooltip';
  import { setDurationValue } from '@/views/config/utils';
  import ClockTimer from '@/components/clock-timer/index.vue';
  import { TaskTypes } from '../task-types/config';
  import { WorkflowStatus } from '../config';
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
          <span class="node-icon">
            <i
              class={[
                'iconfont',
                {
                  'icon-fuwu': node.value.data?.type === TaskTypes.SERVICE,
                  'icon-jiaoseshouquan':
                    node.value.data?.type === TaskTypes.APPROVAL,
                  'size-12': node.value.data?.type === TaskTypes.APPROVAL
                }
              ]}
            ></i>
          </span>
          <div class="pipeline-node-title">
            <Autotip tooltip-props={{ content: node.value.data?.name }}>
              <span class="title">{node.value.data?.name}</span>
            </Autotip>
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
              {node.value.data?.type === TaskTypes.APPROVAL ? (
                <a-link hoverable={false} data-event="node:approve">
                  {t('workflow.stage.approve')}
                </a-link>
              ) : null}
              {node.value.data?.type === TaskTypes.SERVICE &&
              _.get(node.value.data, 'status.summaryStatus') !==
                WorkflowStatus.Pending ? (
                <a-link hoverable={false} data-event="node:logs">
                  {t('applications.applications.instance.log')}
                </a-link>
              ) : null}
            </a-space>
          </div>
          <div class="info">
            <span class="time item">
              <span class="title">{t('common.time.label')}</span>
              {_.get(node.value.data, 'status.summaryStatus') ===
              WorkflowStatus.Running ? (
                <ClockTimer
                  start-time={node.value.data.createTime}
                  show={true}
                ></ClockTimer>
              ) : (
                <span>{setDurationValue(node.value.data?.duration)}</span>
              )}
            </span>
            {node.value.data?.type === TaskTypes.SERVICE ? (
              <>
                <span class="item">
                  <span class="title">
                    {t('operation.environments.table.env')}
                  </span>
                  <Autotip>{node.value.data?.spec?.environment?.name}</Autotip>
                </span>
                <span class="item">
                  <span class="title">
                    {t('applications.applications.table.service')}
                  </span>
                  <Autotip>
                    {_.get(node.value.data, 'status.summaryStatus') ===
                    WorkflowStatus.Completed ? (
                      <a class="link" data-event="node:view-service">
                        {node.value.data?.spec?.name}
                      </a>
                    ) : (
                      node.value.data?.spec?.name
                    )}
                  </Autotip>
                </span>
              </>
            ) : null}
          </div>
        </div>
      );
    }
  });
</script>

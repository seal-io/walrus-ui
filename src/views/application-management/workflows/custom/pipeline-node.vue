<script lang="tsx">
  import _ from 'lodash';
  import { defineComponent, inject, toRefs, ref } from 'vue';
  import i18n from '@/locale';
  import { useUserStore } from '@/store';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import Autotip from '@arco-design/web-vue/es/_components/auto-tooltip/auto-tooltip';
  import { setDurationValue } from '@/views/config/utils';
  import ClockTimer from '@/components/clock-timer/index.vue';
  import { querySubjects } from '@/views/system/api/users';
  import { TaskTypes } from '../task-types/config';
  import { WorkflowStatus, ApprovalTypeMap, colors } from '../config';
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
      const userStore = useUserStore();

      const getGraph = inject('getGraph');
      const getNode = inject('getNode');
      const { node, graph } = toRefs(props);
      const subjectList = ref<{ id: string; name: string }[]>([]);
      const approvalUsers = ref<
        { name: string; approvaled: boolean; id: string }[]
      >([]);

      const renderStageName = () => {
        const data = node.value.getData();
        console.log('data', data);
        return data.stepPosition === 0 ? (
          <div class="stage-name">{data.stageName}</div>
        ) : null;
      };
      const getSubjects = async () => {
        if (node.value.data?.type !== TaskTypes.APPROVAL) return;
        try {
          const params = {
            page: -1
          };
          const { data } = await querySubjects(params);
          subjectList.value = data.items || [];
          approvalUsers.value = _.filter(data.items, (item) => {
            return _.includes(
              node.value.data.attributes.approvalUsers,
              item.id
            );
          })
            .map((sItem) => {
              return {
                name: sItem.name,
                id: sItem.id,
                order: userStore.userInfo.id === sItem.id ? 0 : 1,
                approvaled: _.includes(
                  node.value.data.attributes.approvedUsers,
                  sItem.id
                )
              };
            })
            .sort((a, b) => a.order - b.order);
        } catch (error) {
          subjectList.value = [];
        }
      };
      const renderApprovalInfo = () => {
        if (node.value.data?.type === TaskTypes.APPROVAL) {
          return (
            <span class="item avatar">
              <span class="title">
                {t('workflow.stage.add.approvalUser')}
                {node.value.data.attributes?.approvalType === ApprovalTypeMap.OR
                  ? `(${t('workflow.task.approval.or')})`
                  : `(${t('workflow.task.approval.and')})`}
              </span>
              <a-avatar-group max-count={5} class="m-t-2">
                {_.map(approvalUsers.value, (user, index) => {
                  return (
                    <a-avatar
                      size={24}
                      style={{
                        backgroundColor: colors[index],
                        marginLeft: '-3px'
                      }}
                    >
                      <span>
                        {user.approvaled ? (
                          <i class="iconfont icon-success-fill"></i>
                        ) : null}
                        <a-tooltip content={user.name}>
                          <span>{user.name.slice(0, 3)}</span>
                        </a-tooltip>
                      </span>
                    </a-avatar>
                  );
                })}
              </a-avatar-group>
            </span>
          );
        }
        return null;
      };
      const renderServiceInfo = () => {
        if (node.value.data?.type === TaskTypes.SERVICE) {
          return (
            <>
              <span class="time item">
                <span class="title">{t('common.time.label')}</span>
                {_.get(node.value.data, 'status.summaryStatus') ===
                WorkflowStatus.Running ? (
                  <ClockTimer
                    start-time={node.value.data.executeTime}
                    show={true}
                  ></ClockTimer>
                ) : (
                  <span>{setDurationValue(node.value.data?.duration)}</span>
                )}
              </span>
              <span class="item">
                <span class="title">
                  {t('operation.environments.table.env')}
                </span>
                <Autotip>
                  {node.value.data?.attributes?.environment?.name}
                </Autotip>
              </span>
              <span class="item">
                <span class="title">
                  {t('applications.applications.table.service')}
                </span>
                <Autotip>
                  {_.get(node.value.data, 'status.summaryStatus') ===
                  WorkflowStatus.Completed ? (
                    <a class="link" data-event="node:view-service">
                      {node.value.data?.attributes?.name}
                    </a>
                  ) : (
                    node.value.data?.attributes?.name
                  )}
                </Autotip>
              </span>
            </>
          );
        }
        return null;
      };

      const setApprovalButton = () => {
        const user = _.find(
          approvalUsers.value,
          (item) => item.id === userStore.userInfo.id
        );
        if (
          !user ||
          user.approvaled ||
          node.value.data?.type !== TaskTypes.APPROVAL
        ) {
          return false;
        }

        return (
          !!user &&
          _.get(node.value.data, 'status.summaryStatus') ===
            WorkflowStatus.Running
        );
      };
      getSubjects();
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
              {setApprovalButton() ? (
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
            {renderApprovalInfo()}
            {renderServiceInfo()}
          </div>
        </div>
      );
    }
  });
</script>

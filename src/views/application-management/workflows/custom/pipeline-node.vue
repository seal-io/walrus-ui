<script lang="tsx">
  import _ from 'lodash';
  import { defineComponent, inject, toRefs, ref, watch, onMounted } from 'vue';
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
      const getNode = inject('getNode', () => ({}));
      const { node, graph } = toRefs(props);
      const nodeData = ref(node.value.data);
      const rejectedUsers = ref<string[]>([]);
      const subjectList = ref<{ id: string; name: string }[]>([]);
      const approvalUsers = ref<
        { name: string; approvaled: boolean; rejected: boolean; id: string }[]
      >([]);

      const listenDataChange = () => {
        const nodeIns = getNode() as any;
        nodeIns?.on('change:data', (current) => {
          nodeData.value = current.current;
        });
      };
      const renderStageName = () => {
        return nodeData.value.stepPosition === 0 ? (
          <div class="stage-name">{nodeData.value.stageName}</div>
        ) : null;
      };
      const updateApproverStatus = () => {
        rejectedUsers.value = nodeData.value.attributes.rejectedUsers || [];
        approvalUsers.value = _.filter(subjectList.value, (item) => {
          return _.includes(nodeData.value.attributes.approvalUsers, item.id);
        })
          .map((sItem) => {
            return {
              name: sItem.name,
              id: sItem.id,
              order: userStore.userInfo.id === sItem.id ? 0 : 1,
              rejected: _.includes(rejectedUsers.value, sItem.id),
              approvaled: _.includes(
                nodeData.value.attributes.approvedUsers,
                sItem.id
              )
            };
          })
          .sort((a, b) => a.order - b.order);
      };
      const getSubjects = async () => {
        if (nodeData.value?.type !== TaskTypes.APPROVAL) return;
        try {
          const params = {
            page: -1
          };
          const { data } = await querySubjects(params);
          subjectList.value = data.items || [];
          updateApproverStatus();
        } catch (error) {
          subjectList.value = [];
        }
      };
      const renderApprovalIcon = (user) => {
        if (user.approvaled) {
          return (
            <i
              class="iconfont approval icon-success-fill"
              style="font-size: 12px;"
            ></i>
          );
        }
        if (user.rejected) {
          return (
            <i
              class="iconfont approval icon-status-error"
              style="font-size: 12px;transform: scale(0.75);"
            ></i>
          );
        }
        return null;
      };
      const renderApprovalInfo = () => {
        if (nodeData.value?.type === TaskTypes.APPROVAL) {
          return (
            <span class="item avatar">
              <span class="title">
                {t('workflow.stage.add.approvalUser')}
                {nodeData.value.attributes?.approvalType === ApprovalTypeMap.OR
                  ? `(${t('workflow.task.approval.or')})`
                  : `(${t('workflow.task.approval.and')})`}
              </span>
              <a-avatar-group max-count={9} class="m-t-2">
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
                        {renderApprovalIcon(user)}
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
        if (nodeData.value?.type === TaskTypes.SERVICE) {
          return (
            <>
              <span class="time item">
                <span class="title">{t('common.time.label')}</span>
                {_.get(nodeData.value, 'status.summaryStatus') ===
                WorkflowStatus.Running ? (
                  <ClockTimer
                    start-time={nodeData.value.executeTime}
                    show={true}
                  ></ClockTimer>
                ) : (
                  <span>{setDurationValue(nodeData.value?.duration)}</span>
                )}
              </span>
              <span class="item">
                <span class="title">
                  {t('operation.environments.table.env')}
                </span>
                <Autotip>
                  {nodeData.value?.attributes?.environment?.name}
                </Autotip>
              </span>
              <span class="item">
                <span class="title">
                  {t('applications.applications.table.service')}
                </span>
                <Autotip>
                  {_.get(nodeData.value, 'status.summaryStatus') ===
                  WorkflowStatus.Completed ? (
                    <a class="link" data-event="node:view-service">
                      {nodeData.value?.attributes?.name}
                    </a>
                  ) : (
                    nodeData.value?.attributes?.name
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
          user.rejected ||
          nodeData.value?.type !== TaskTypes.APPROVAL
        ) {
          return false;
        }

        return (
          !!user &&
          _.get(nodeData.value, 'status.summaryStatus') ===
            WorkflowStatus.Running
        );
      };
      watch(
        () => nodeData.value.attributes,
        () => {
          updateApproverStatus();
        },
        {
          deep: true
        }
      );
      onMounted(() => {
        listenDataChange();
      });
      getSubjects();
      return () => (
        <div class="pipeline-node">
          {renderStageName()}
          <span class="node-icon">
            <i
              class={[
                'iconfont',
                {
                  'icon-fuwu': nodeData.value?.type === TaskTypes.SERVICE,
                  'icon-jiaoseshouquan':
                    nodeData.value?.type === TaskTypes.APPROVAL,
                  'size-12': nodeData.value?.type === TaskTypes.APPROVAL
                }
              ]}
            ></i>
          </span>
          <div class="pipeline-node-title">
            <Autotip tooltip-props={{ content: nodeData.value?.name }}>
              <span class="title">{nodeData.value?.name}</span>
            </Autotip>
            <div class="more">{/* <MoreAction></MoreAction> */}</div>
          </div>
          <div class="operation-box">
            <span class="status">
              <StatusLabel
                zoom={0.9}
                status={{
                  status: _.get(nodeData.value, 'status.summaryStatus'),
                  text: _.get(nodeData.value, 'status.summaryStatus'),
                  message: _.get(nodeData.value, 'status.summaryStatusMessage'),
                  transitioning: _.get(nodeData.value, 'status.transitioning'),
                  error: _.get(nodeData.value, 'status.error')
                }}
              ></StatusLabel>
            </span>
            <a-space class="btn">
              {setApprovalButton() ? (
                <a-link hoverable={false} data-event="node:approve">
                  {t('workflow.stage.approve')}
                </a-link>
              ) : null}
              {nodeData.value?.type === TaskTypes.SERVICE &&
              _.get(nodeData.value, 'status.summaryStatus') !==
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

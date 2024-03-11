<script lang="tsx">
  import _ from 'lodash';
  import { defineComponent, inject, toRefs, ref, watch, onMounted } from 'vue';
  import i18n from '@/locale';
  import { useUserStore, useAppStore } from '@/store';
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
      const appStore = useAppStore();

      const MAX_COUNT = 9;
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
          <div class="stage-name">
            <Autotip>{nodeData.value.stageName}</Autotip>
          </div>
        ) : null;
      };
      const setOrder = (id) => {
        if (userStore.userInfo.id === id) {
          return 0;
        }
        if (_.includes(nodeData.value.attributes.approvedUsers, id)) {
          return 1;
        }
        return _.includes(rejectedUsers.value, id) ? 2 : 3;
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
              order: setOrder(sItem.id),
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
              key={user.id}
              class="iconfont approval icon-correct"
              style="font-size: 10px;"
            ></i>
          );
        }
        if (user.rejected) {
          return (
            <i
              key={user.id}
              class="iconfont approval icon-error-f"
              style="font-size: 10px;"
            ></i>
          );
        }
        return null;
      };
      const renderUser = (user, index, position?) => {
        return (
          <span class="wp">
            <span
              class="user"
              key={user.id}
              style={{
                backgroundColor: colors[index]
              }}
            >
              <span class="text">
                {renderApprovalIcon(user)}
                <a-tooltip content={user.name} position={position}>
                  <span>{user.name.slice(0, 3)}</span>
                </a-tooltip>
              </span>
            </span>
          </span>
        );
      };
      const renderRestUsers = () => {
        const list = approvalUsers.value.slice(MAX_COUNT);
        if (list.length > 0) {
          return (
            <span class="wp">
              <span class="user" style={{ backgroundColor: '#f5f5f5' }}>
                <span class="text">
                  <a-tooltip
                    position="rt"
                    backgroundColor="var(--color-white)"
                    content-class="approval-user-tooltip"
                    v-slots={{
                      content: () => (
                        <div>
                          {_.map(list, (user, index) => {
                            return (
                              <div class="user-group">
                                {renderUser(user, index, 'rt')}
                              </div>
                            );
                          })}
                        </div>
                      )
                    }}
                  >
                    <span
                      style={{ color: 'var(--color-text-2)', fontWeight: 500 }}
                    >
                      +{list.length}
                    </span>
                  </a-tooltip>
                </span>
              </span>
            </span>
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
              <span class="m-t-2 user-group">
                {_.map(
                  _.slice(approvalUsers.value, 0, MAX_COUNT),
                  (user, index) => {
                    return <>{renderUser(user, index)}</>;
                  }
                )}
                {renderRestUsers()}
              </span>
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
                  {t('applications.applications.table.resource')}
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
        <div class={['pipeline-node', { dark: appStore.theme === 'dark' }]}>
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
                  error: _.get(nodeData.value, 'status.error'),
                  inactive: _.get(nodeData.value, 'status.inactive')
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

<style lang="less" scoped>
  .pipeline-node {
    background-color: var(--color-white);

    .arco-link {
      padding: 0 6px;
    }

    &.dark {
      color: rgba(255, 255, 255, 0.7);
      background-color: var(--color-card-bg);
      border: 1px solid transparent;
      box-shadow: 1px 1px 0 rgba(255, 255, 255, 0.2);

      &:hover {
        border: 1px solid rgba(169, 174, 184, 0.6);
      }

      .arco-link {
        height: 22px;
        padding: 0 6px;
        color: rgba(66, 106, 208, 1);
        line-height: 22px;
        background-color: rgba(33, 36, 39, 0.5);
        border-radius: 12px;

        &:hover {
          color: rgba(66, 106, 208, 1);
          background-color: rgba(33, 36, 39, 0.7);
        }
      }

      .node-icon {
        color: rgba(255, 255, 255, 0.5);
        background-color: var(--color-card-bg);
        box-shadow: none;
      }

      .info {
        border-top: 1px solid rgba(255, 255, 255, 0.05);
      }

      .item .user-group {
        .wp {
          background-color: rgba(0, 0, 0, 0.2);
        }

        .user {
          color: rgba(255, 255, 255, 0.7);
          color: rgba(255, 255, 255, 0.7);
          background-color: transparent !important;
          box-shadow: none;
        }
      }
    }
  }
</style>

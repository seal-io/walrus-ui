<script lang="tsx">
  import _ from 'lodash';
  import i18n from '@/locale';
  import { useUserStore } from '@/store';
  import { Resources, Actions } from '@/permissions/config';
  import useCallCommon from '@/hooks/use-call-common';
  import { defineComponent, toRef, computed, ref } from 'vue';
  import { StatusColor } from '@/views/config';
  import useBasicInfoData from '@/views/application-management/projects/hooks/use-basicInfo-data';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import ClockTimer from '@/components/clock-timer/index.vue';
  import Copy from '@/components/copy/copy-command.vue';
  import Autotip from '@arco-design/web-vue/es/_components/auto-tooltip/auto-tooltip';
  import BasicInfo from '@/views/application-management/services/components/basic-info.vue';
  import {
    runBasicConfig,
    ApplicableStatus,
    RevisionWatchStatus,
    RevisionStatus
  } from '@/views/application-management/services/config';
  import ProgressLoading from '@/components/progress-loading/index.vue';

  export default defineComponent({
    props: {
      runData: {
        type: Object,
        default() {
          return {};
        }
      },
      layout: {
        type: String,
        default: 'horizontal'
      }
    },
    emits: ['apply', 'cancel'],
    setup(props, { slots, emit }) {
      const info = toRef(props, 'runData');
      const userStore = useUserStore();
      const { route } = useCallCommon();
      const basicDataList = useBasicInfoData(runBasicConfig, info);
      const showTimer = ref(true);

      const isStopped = computed(() => {
        const status = _.get(props.runData, 'status.summaryStatus', '');
        return !RevisionWatchStatus.includes(status);
      });
      const hasPermission = computed(() => {
        return userStore.hasProjectResourceActions({
          projectID: route.params.projectId,
          environmentID: route.params.environmentId as string,
          resource: Resources.ResourceRuns,
          actions: [Actions.PUT]
        });
      });
      const renderStatusIcon = () => {
        let type: any = '';
        if (_.get(props.runData, 'status.warning')) {
          type = 'warning';
        } else if (_.get(props.runData, 'status.transitioning')) {
          type = 'transitioning';
        } else if (_.get(props.runData, 'status.error')) {
          type = 'error';
        } else if (_.get(props.runData, 'status.inactive')) {
          type = 'inactive';
        } else if (_.get(props.runData, 'status.summaryStatus')) {
          type = 'success';
        }
        return (
          <ProgressLoading
            type={type}
            size={32}
            strokeWidth={3}
            percent={0.6}
            style={{ marginRight: '12px' }}
          ></ProgressLoading>
        );
      };
      const renderStatus = () => {
        return (
          <>
            <StatusLabel
              zoom={0.9}
              status={_.get(props.runData, 'status', {})}
            ></StatusLabel>
          </>
        );
      };

      const renderActions = () => {
        if (
          ApplicableStatus.includes(props.runData?.status?.summaryStatus) &&
          hasPermission.value
        ) {
          return (
            <a-space
              direction="vertical"
              size={20}
              style={{ width: '100px', alignItems: 'flex-end' }}
            >
              <a-button
                status="success"
                type="primary"
                style={{ width: '96px' }}
                onClick={() => {
                  emit('apply', true);
                }}
              >
                <i class={['iconfont icon-sendfasong m-r-5']}></i>
                <span>{i18n.global.t('common.button.apply')}</span>
              </a-button>
              <a-button
                type="outline"
                style={{ width: '96px' }}
                onClick={() => {
                  emit('apply', false);
                }}
              >
                <icon-stop class="m-r-5" />
                <span>{i18n.global.t('common.button.discardChange')}</span>
              </a-button>
            </a-space>
          );
        }
        return null;
      };
      const renderChanges = () => {
        return (
          <div class="data">
            <span class="add" style={{ color: StatusColor.success.text }}>
              <icon-plus class="m-r-5" />
              <span>{props.runData.componentChangeSummary?.created}</span>
            </span>
            <span class="update" style={{ color: StatusColor.warning.text }}>
              <i class={['icon-wave-sine iconfont m-r-5']}></i>
              <span>{props.runData.componentChangeSummary?.updated}</span>
            </span>
            <span class="delete" style={{ color: StatusColor.error.text }}>
              <icon-minus class="m-r-5" />
              <span>{props.runData.componentChangeSummary?.deleted}</span>
            </span>
          </div>
        );
      };
      const renderMessage = () => {
        if (!_.get(props.runData, 'status.error')) return null;
        return (
          <div
            class="message"
            style={{
              backgroundColor: StatusColor.error.bg,
              color: StatusColor.error.text
            }}
          >
            {props.runData.status?.summaryStatusMessage}
          </div>
        );
      };
      return () => (
        <div class="box">
          <div class="wrap">
            <div class="title-box">
              {renderStatusIcon()}
              <span class="title">
                <Autotip style={{ maxWidth: '130px' }}>
                  <span class="text">{props.runData.resource?.name}</span>
                </Autotip>
                <span class="status">{renderStatus()}</span>
              </span>
            </div>
            <BasicInfo
              class="basic-info"
              data-info={basicDataList.value}
              cols={2}
              layout={props.layout}
              align="right"
              v-slots={{
                value: ({ data, value }) => {
                  if (data.key === 'componentChangeSummary') {
                    return renderChanges();
                  }
                  if (data.key === 'duration') {
                    return (
                      <ClockTimer
                        start-time={_.get(props.runData, 'createTime')}
                        show={showTimer.value}
                        value={data.value}
                        stopped={isStopped.value}
                        class="flex"
                      ></ClockTimer>
                    );
                  }
                  if (data.key === 'id') {
                    return (
                      <span class="id-val">
                        <span class="m-r-5">{value}</span>
                        <Copy content={props.runData.id}></Copy>
                      </span>
                    );
                  }
                  return value;
                }
              }}
            ></BasicInfo>
            {renderActions()}
          </div>
          {renderMessage()}
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .data {
    display: flex;
    align-items: center;

    .add,
    .update,
    .delete {
      margin-right: 10px;
    }
  }

  .box {
    padding: 10px 16px;
    font-size: var(--font-size-small);
    border: 1px solid var(--color-border-2);
    border-radius: var(--border-radius-small);

    .message {
      padding: 10px;
      border-radius: var(--border-radius-small);
    }
  }

  .wrap {
    display: flex;

    .title-box {
      display: flex;
      align-items: center;
      height: max-content;
    }

    .title {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-right: 30px;

      .text {
        padding: 0 8px;
        font-size: var(--font-size-large);
      }

      .status {
        margin-top: 10px;
      }
    }

    .basic-info {
      flex: 1;
    }

    .id-val {
      display: flex;
      align-items: center;
    }

    :deep(.arco-descriptions-row) {
      .arco-descriptions-item,
      .arco-descriptions-item-label,
      .arco-descriptions-item-value {
        line-height: 2;
      }
    }
  }
</style>

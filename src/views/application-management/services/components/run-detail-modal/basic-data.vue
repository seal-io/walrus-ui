<script lang="tsx">
  import _ from 'lodash';
  import i18n from '@/locale';
  import { defineComponent, toRef, computed, ref } from 'vue';
  import { StatusColor } from '@/views/config';
  import useBasicInfoData from '@/views/application-management/projects/hooks/use-basicInfo-data';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import ClockTimer from '@/components/clock-timer/index.vue';
  import Copy from '@/components/copy/copy-command.vue';
  import BasicInfo from '../basic-info.vue';
  import {
    runBasicConfig,
    ApplicableStatus,
    RevisionWatchStatus,
    RevisionStatus
  } from '../../config';

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
      const basicDataList = useBasicInfoData(runBasicConfig, info);
      const showTimer = ref(true);

      const isStopped = computed(() => {
        const status = _.get(props.runData, 'status.summaryStatus', '');
        return !RevisionWatchStatus.includes(status);
      });
      const renderStatus = () => {
        return (
          <>
            <StatusLabel
              zoom={0.9}
              status={{
                status: _.get(props.runData, 'status.summaryStatus') || '',
                inactive: _.get(props.runData, 'status.inactive'),
                text: _.get(props.runData, 'status.summaryStatus'),
                message:
                  _.get(props.runData, 'status.summaryStatusMessage') || '',
                transitioning: _.get(props.runData, 'status.transitioning'),
                error: _.get(props.runData, 'status.error')
              }}
            ></StatusLabel>
          </>
        );
      };

      const renderActions = () => {
        if (ApplicableStatus.includes(props.runData?.status?.summaryStatus)) {
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
            <span class="add" style={{ color: StatusColor.success.color5 }}>
              <icon-plus class="m-r-5" />
              <span>{props.runData.componentChangeSummary?.created}</span>
            </span>
            <span class="update" style={{ color: StatusColor.warning.color5 }}>
              <i class={['icon-wave-sine iconfont m-r-5']}></i>
              <span>{props.runData.componentChangeSummary?.updated}</span>
            </span>
            <span class="delete" style={{ color: StatusColor.error.color5 }}>
              <icon-minus class="m-r-5" />
              <span>{props.runData.componentChangeSummary?.deleted}</span>
            </span>
          </div>
        );
      };
      return () => (
        <div class="wrap">
          <div class="title">
            <span>{props.runData.resource?.name}</span>
            <span class="status">{renderStatus()}</span>
          </div>
          <BasicInfo
            class="basic-info"
            data-info={basicDataList.value}
            cols={2}
            layout={props.layout}
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
                    ></ClockTimer>
                  );
                }
                if (data.key === 'id') {
                  return (
                    <span class="id-val">
                      <span class="m-r-5">{value}</span>
                      <Copy content={value}></Copy>
                    </span>
                  );
                }
                return value;
              }
            }}
          ></BasicInfo>
          {renderActions()}
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

  .wrap {
    display: flex;
    padding: 10px 16px;
    border: 1px solid var(--color-border-2);
    border-radius: var(--border-radius-small);

    .title {
      display: flex;
      flex-basis: 150px;
      flex-direction: column;
      align-items: flex-start;
      margin-right: 20px;

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

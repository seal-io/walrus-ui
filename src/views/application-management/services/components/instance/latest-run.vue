<script lang="tsx">
  import i18n from '@/locale';
  import _ from 'lodash';
  import {
    ref,
    provide,
    PropType,
    watch,
    defineComponent,
    computed
  } from 'vue';
  import useBasicInfoData from '@/views/application-management/projects/hooks/use-basicInfo-data';
  import { StatusColor } from '@/views/config';
  import {
    latestRunConfig,
    ProvideServiceInfoKey,
    ServiceStatus
  } from '../../config';
  import BasicInfo from '../basic-info.vue';
  import useViewLatestLogs from '../../hooks/use-view-latest-logs';
  import RunDetailModal from '../runs/detail-modal/index.vue';

  export default defineComponent({
    props: {
      serviceInfo: {
        type: Object as PropType<any>,
        default: () => ({})
      }
    },
    setup(props, { expose }) {
      const {
        revisionDetailId,
        revisionData,
        showDetailModal,
        initialStatus,
        currentServiceInfo,
        loading,
        handleViewServiceLatestLogs
      } = useViewLatestLogs(false);

      const basicDataList = useBasicInfoData(latestRunConfig, revisionData);
      const runFlag = ref(true);

      // logs
      provide(ProvideServiceInfoKey, currentServiceInfo);

      const viewLogs = () => {
        showDetailModal.value = true;
      };
      const debounceViewLatestLogs = _.debounce(
        handleViewServiceLatestLogs,
        200
      );

      const runData = computed(() => {
        return {
          runId: revisionData.value.id,
          serviceId: revisionData.value.resource?.id,
          projectId: revisionData.value.project?.id,
          environmentId: revisionData.value.environment?.id
        };
      });

      watch(
        () => props.serviceInfo,
        (data) => {
          if (data.id) {
            debounceViewLatestLogs(props.serviceInfo);
          }
        },
        {
          immediate: true
        }
      );

      watch(
        () => showDetailModal.value,
        () => {
          if (props.serviceInfo.id && showDetailModal.value) {
            handleViewServiceLatestLogs(props.serviceInfo);
          }
        },
        {
          immediate: true
        }
      );
      expose({
        viewLogs
      });
      const renderNoRunData = () => {
        return (
          <result-view
            title={i18n.global.t('resource.runs.result.title')}
            subtitle={i18n.global.t('resource.runs.result.subTitle')}
            v-slots={{
              icon: () => {
                return <i class="iconfont icon-sendfasong"></i>;
              }
            }}
          ></result-view>
        );
      };
      const renderChanges = () => {
        const value = revisionData.value.componentChangeSummary || {};

        return (
          <div class="data">
            <span class="add" style={{ color: StatusColor.success.text }}>
              <icon-plus class="m-r-5" />
              <span>{value?.created}</span>
            </span>
            <span class="update" style={{ color: StatusColor.warning.text }}>
              <i class={['icon-wave-sine iconfont m-r-5']}></i>
              <span>{value?.updated}</span>
            </span>
            <span class="delete" style={{ color: StatusColor.error.text }}>
              <icon-minus class="m-r-5" />
              <span>{value?.deleted}</span>
            </span>
          </div>
        );
      };
      const renderLatestRun = () => {
        return (
          <div>
            <BasicInfo
              data-info={basicDataList.value}
              tableLayout="fixed"
              cols={3}
              v-slots={{
                value: ({ data, value }) => {
                  if (data.key === 'componentChangeSummary') {
                    return renderChanges();
                  }
                  return value;
                }
              }}
            ></BasicInfo>
            <RunDetailModal
              title={i18n.global.t('applications.applications.history.latest')}
              v-model:show={showDetailModal.value}
              data={runData.value}
            ></RunDetailModal>
          </div>
        );
      };
      return () => (
        <a-spin style={{ width: '100%' }}>
          {props.serviceInfo?.status?.summaryStatus === ServiceStatus.Undeployed
            ? renderNoRunData()
            : renderLatestRun()}
        </a-spin>
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
</style>

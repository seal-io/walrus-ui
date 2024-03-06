<script lang="tsx">
  import i18n from '@/locale';
  import _ from 'lodash';
  import {
    ref,
    provide,
    PropType,
    watch,
    defineComponent,
    computed,
    onBeforeUnmount
  } from 'vue';
  import useBasicInfoData from '@/views/application-management/projects/hooks/use-basicInfo-data';
  import ComCard from '@/components/page-wrap/com-card.vue';
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
        axiosToken,
        initialStatus,
        currentServiceInfo,
        loading,
        handleViewServiceLatestLogs
      } = useViewLatestLogs(false);

      const basicDataList = useBasicInfoData(latestRunConfig, revisionData);

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
        () => props.serviceInfo.id,
        (data) => {
          if (data) {
            handleViewServiceLatestLogs(props.serviceInfo);
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
            // handleViewServiceLatestLogs(props.serviceInfo);
          }
        },
        {
          immediate: true
        }
      );
      onBeforeUnmount(() => {
        axiosToken?.cancel?.();
      });
      const renderNoRunData = () => {
        return (
          <result-view
            style={{ paddingTop: '48px' }}
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
        <ComCard
          title={i18n.global.t('applications.applications.table.latestRun')}
          header-style={{ padding: '20px', height: 'auto' }}
          style={{ 'height': '100%', 'border-radius': '16px' }}
          padding="0 20px 20px"
          bordered={true}
          v-slots={{
            title: () => {
              return (
                <div class="flex flex-justify-between flex-align-center">
                  <span>
                    {i18n.global.t('applications.applications.table.latestRun')}
                  </span>
                  {_.keys(revisionData.value).length && !loading.value ? (
                    <a-link
                      size="small"
                      class="font-13"
                      onClick={() => {
                        viewLogs();
                      }}
                    >
                      <i class="size-14 m-r-5 iconfont icon-details bold-400"></i>
                      {i18n.global.t('common.button.detail')}
                    </a-link>
                  ) : null}
                </div>
              );
            }
          }}
        >
          <a-spin style={{ width: '100%' }}>
            {!_.keys(revisionData.value).length && !loading.value
              ? renderNoRunData()
              : renderLatestRun()}
          </a-spin>
        </ComCard>
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

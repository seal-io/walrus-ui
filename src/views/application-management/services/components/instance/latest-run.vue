<script lang="tsx">
  import i18n from '@/locale';
  import _ from 'lodash';
  import { ref, provide, PropType, watch, defineComponent } from 'vue';
  import useBasicInfoData from '@/views/application-management/projects/hooks/use-basicInfo-data';
  import {
    latestRunConfig,
    ProvideServiceInfoKey,
    ServiceStatus
  } from '../../config';
  import BasicInfo from '../basic-info.vue';
  import useViewLatestLogs from '../../hooks/use-view-latest-logs';
  import RevisionDetail from '../revision-detail.vue';

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
        500
      );

      watch(
        () => props.serviceInfo,
        (data) => {
          if (data.id) {
            debounceViewLatestLogs(data);
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
      const renderLatestRun = () => {
        return (
          <div>
            <BasicInfo data-info={basicDataList.value} cols={2}></BasicInfo>
            <RevisionDetail
              v-model:show={showDetailModal.value}
              data-info={revisionData.value}
              revision-id={revisionDetailId.value}
              initial-status={initialStatus.value}
            ></RevisionDetail>
          </div>
        );
      };
      return () => (
        <>
          {props.serviceInfo?.status?.summaryStatus === ServiceStatus.Undeployed
            ? renderNoRunData()
            : renderLatestRun()}
        </>
      );
    }
  });
</script>

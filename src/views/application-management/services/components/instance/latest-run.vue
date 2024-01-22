<script lang="tsx">
  import { ref, provide, PropType, watch, defineComponent } from 'vue';
  import useBasicInfoData from '@/views/application-management/projects/hooks/use-basicInfo-data';
  import { latestRunConfig, ProvideServiceInfoKey } from '../../config';
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
      watch(
        () => props.serviceInfo,
        (data) => {
          if (data.id && runFlag) {
            handleViewServiceLatestLogs(data);
          }
        },
        {
          immediate: true,
          deep: true
        }
      );
      watch(
        () => showDetailModal.value,
        () => {
          runFlag.value = !showDetailModal.value;
        },
        {
          immediate: true
        }
      );
      expose({
        viewLogs
      });

      return () => (
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
    }
  });
</script>

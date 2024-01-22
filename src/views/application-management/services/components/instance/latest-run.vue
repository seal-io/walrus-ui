<template>
  <div>
    <BasicInfo
      :data-info="basicDataList"
      style="max-width: 800px"
      :cols="2"
    ></BasicInfo>
    <revisionDetail
      v-model:show="showDetailModal"
      :data-info="revisionData"
      :revision-id="revisionDetailId"
      :initial-status="initialStatus"
    ></revisionDetail>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, provide, PropType, watch, defineExpose } from 'vue';
  import useBasicInfoData from '@/views/application-management/projects/hooks/use-basicInfo-data';
  import { latestRunConfig, ProvideServiceInfoKey } from '../../config';
  import BasicInfo from '../basic-info.vue';
  import useViewLatestLogs from '../../hooks/use-view-latest-logs';
  import revisionDetail from '../revision-detail.vue';

  const props = defineProps({
    serviceInfo: {
      type: Object as PropType<any>,
      default: () => ({})
    }
  });
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
        console.log('data===========', data);
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
  defineExpose({
    viewLogs
  });
</script>

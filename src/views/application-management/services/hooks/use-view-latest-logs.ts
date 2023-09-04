import { nextTick, ref } from 'vue';
import _ from 'lodash';
import { websocketEventType } from '@/views/config';
import { useSetChunkRequest } from '@/api/axios-chunk-request';
import { queryServiceRevisions, SERVICE_API_PREFIX, SERVICE_API } from '../api';

export default function useViewLatestLogs() {
  const { setChunkRequest } = useSetChunkRequest();
  const revisionDetailId = ref('');
  const revisionData = ref({});
  const showDetailModal = ref(false);
  const initialStatus = ref('');
  const currentServiceInfo = ref<any>({});
  let axiosToken: any = null;

  const updateRevisions = (data) => {
    if (data?.type !== websocketEventType.UPDATE) return;
    const collections = _.filter(
      data.collection || [],
      (sItem) => sItem?.service?.id === currentServiceInfo.value.id
    );
    const openRevisionData = _.find(
      collections,
      (item) => item.id === _.get(revisionData.value, 'id')
    );
    if (openRevisionData) {
      revisionData.value = openRevisionData;
    }
  };
  const updateHandler = (list) => {
    _.each(list, (data) => {
      updateRevisions(data);
    });
  };
  const createServiceRevisionChunkRequest = () => {
    axiosToken?.cancel?.();
    try {
      axiosToken = setChunkRequest({
        url: `${SERVICE_API_PREFIX()}${SERVICE_API}/${
          currentServiceInfo.value.id
        }/revisions`,
        handler: updateHandler
      });
    } catch (error) {
      // ingore
    }
  };

  const handleViewServiceLatestLogs = async (row) => {
    try {
      const params = {
        page: 1,
        perPage: 1,
        sort: ['-createTime'],
        serviceID: row.id
      };
      const { data } = await queryServiceRevisions(params);
      revisionData.value = _.get(data, 'items.0') || {};
      revisionDetailId.value = _.get(revisionData.value, 'id') || '';
      initialStatus.value = _.get(revisionData.value, 'status') || '';
      currentServiceInfo.value = row;
      showDetailModal.value = true;
      nextTick(() => {
        createServiceRevisionChunkRequest();
      });
    } catch (error) {
      // ignore
      revisionData.value = {};
    }
  };

  return {
    revisionDetailId,
    revisionData,
    showDetailModal,
    initialStatus,
    currentServiceInfo,
    handleViewServiceLatestLogs
  };
}

import { watch, nextTick, ref } from 'vue';
import _ from 'lodash';
import { websocketEventType } from '@/views/config';
import { SILENCEAPI } from '@/api/config';
import {
  useSetChunkRequest,
  createAxiosToken
} from '@/api/axios-chunk-request';
import { queryServiceRevisions, SERVICE_API_PREFIX, SERVICE_API } from '../api';

export default function useViewLatestLogs(defaultShow?: boolean) {
  const { setChunkRequest } = useSetChunkRequest();
  const revisionDetailId = ref('');
  const revisionData = ref<any>({});
  const showDetailModal = ref(false);
  const initialStatus = ref({});
  const currentServiceInfo = ref<any>({});
  const isShow = ref(defaultShow ?? true);
  let axiosToken: any = null;
  let revisionAxiosToken: any = null;

  const updateRevisions = (data) => {
    if (data?.type !== websocketEventType.UPDATE) return;
    const collections = _.filter(
      data.collection || [],
      (sItem) => sItem?.resource?.id === currentServiceInfo.value.id
    );
    const openRevisionData = _.find(
      collections,
      (item) => item.id === _.get(revisionData.value, 'id')
    );
    if (openRevisionData) {
      revisionData.value = openRevisionData;
      initialStatus.value = _.get(revisionData.value, 'status') || {};
    }
  };
  const updateHandler = (list) => {
    _.each(list, (data) => {
      updateRevisions(data);
    });
  };
  const createServiceRevisionChunkRequest = () => {
    axiosToken?.cancel?.();
    if (!currentServiceInfo.value?.id) return;
    try {
      axiosToken = setChunkRequest({
        url: `${SERVICE_API_PREFIX()}${SERVICE_API}/${
          currentServiceInfo.value.id
        }/runs`,
        handler: updateHandler
      });
    } catch (error) {
      // ingore
    }
  };

  const handleViewServiceLatestLogs = async (row) => {
    revisionAxiosToken?.cancel?.();
    if (!row?.id) return;
    revisionAxiosToken = createAxiosToken();
    try {
      const params = {
        page: 1,
        perPage: 1,
        sort: ['-createTime'],
        _action: SILENCEAPI,
        serviceID: row.id
      };
      const { data } = await queryServiceRevisions(
        params,
        revisionAxiosToken.token
      );
      revisionData.value = _.get(data, 'items.0') || {};
      revisionDetailId.value = _.get(revisionData.value, 'id') || '';
      initialStatus.value = _.get(revisionData.value, 'status') || {};
      currentServiceInfo.value = row;

      nextTick(() => {
        createServiceRevisionChunkRequest();
      });
    } catch (error) {
      // ignore
      revisionData.value = {};
    }
  };
  watch(
    () => showDetailModal.value,
    (val) => {
      if (!val) {
        axiosToken?.cancel?.();
      }
    },
    {
      immediate: true
    }
  );
  return {
    revisionDetailId,
    revisionData,
    showDetailModal,
    initialStatus,
    currentServiceInfo,
    handleViewServiceLatestLogs
  };
}

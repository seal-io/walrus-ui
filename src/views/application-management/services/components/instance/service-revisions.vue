<template>
  <div class="history-wrap">
    <a-table
      :loading="loading"
      column-resizable
      style="margin-bottom: 10px"
      :bordered="false"
      :data="dataList"
      :pagination="false"
      @sorter-change="handleSortChange"
    >
      <template #columns>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          :sortable="{
            sortDirections: ['ascend', 'descend'],
            defaultSortOrder: 'descend',
            sorter: true,
            sortOrder: sortOrder
          }"
          data-index="createTime"
          :title="$t('applications.applications.history.deploymentTime')"
        >
          <template #cell="{ record }">
            <span>{{
              dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')
            }}</span>
          </template>
        </a-table-column>

        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="createdBy"
          align="left"
          :title="$t('common.table.createdBy')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="changeComment"
          align="left"
          :title="$t('common.table.mark')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="duration"
          align="left"
          :title="$t('dashboard.table.duration')"
        >
          <template #cell="{ record }">
            <span>{{ setDurationValue(record.duration) }}</span>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="status"
          align="left"
          :title="$t('dashboard.table.status')"
        >
          <template #cell="{ record }">
            <StatusLabel
              :status="{
                status: record.status?.summaryStatus,
                text: record.status?.summaryStatus,
                message: record.status?.summaryStatusMessage,
                transitioning: record.status?.transitioning,
                error: record.status?.error
              }"
            ></StatusLabel>
          </template>
        </a-table-column>
        <a-table-column align="left" :title="$t('common.table.operation')">
          <template #cell="{ record }">
            <a-space :size="20">
              <a-tooltip :content="$t('common.button.logs')">
                <a-link
                  type="text"
                  size="small"
                  @click="handleViewDetail(record)"
                >
                  <icon-font type="icon-rizhi" style="font-size: 16px" />
                </a-link>
              </a-tooltip>
              <a-tooltip
                :content="$t('applications.applications.history.changeList')"
              >
                <a-link
                  type="text"
                  size="small"
                  @click="handleViewHistoryChange(record)"
                >
                  <icon-clock-circle class="size-16" />
                </a-link>
              </a-tooltip>
              <a-tooltip
                v-if="
                  userStore.hasProjectResourceActions({
                    projectID,
                    environmentID,
                    resource: Resources.ResourceRevisions,
                    actions: ['DELETE']
                  })
                "
                :content="$t('common.button.delete')"
              >
                <a-link
                  type="text"
                  size="small"
                  status="danger"
                  @click="handleDelete(record)"
                >
                  <template #icon
                    ><icon-delete style="font-size: 16px"
                  /></template>
                </a-link>
              </a-tooltip>
            </a-space>
          </template>
        </a-table-column>
      </template>
      <template #empty>
        <result-view
          :loading="loading"
          :title="$t('resource.revisions.result.title')"
          :subtitle="$t('resource.revisions.result.subTitle')"
        >
          <template #icon>
            <i class="iconfont icon-rizhi"></i>
          </template>
        </result-view>
      </template>
    </a-table>
    <a-pagination
      size="small"
      :total="total"
      :page-size="queryParams.perPage"
      :current="queryParams.page"
      show-total
      show-page-size
      :hide-on-single-page="total <= 10"
      @change="handlePageChange"
      @page-size-change="handlePageSizeChange"
    />
    <revisionDetail
      v-model:show="showDetailModal"
      :data-info="revisionData"
      :revision-id="revisionDetailId"
      :initial-status="initialStatus"
    ></revisionDetail>
    <serviceSpecDiff
      v-model:show="showDiffModal"
      :title="title"
      :content="computedDiffContent"
      :options="compareOptions"
      :service-info="rollbackData"
      active-type="computedAttributes"
      @compare="handleCompareChange"
      @confirm="handleConfirmDiff"
    ></serviceSpecDiff>
  </div>
</template>

<script lang="ts" setup>
  import { Resources } from '@/permissions/config';
  import { useUserStore } from '@/store';
  import dayjs from 'dayjs';
  import _, {
    map,
    get,
    find,
    each,
    findIndex,
    cloneDeep,
    concat,
    filter,
    pick
  } from 'lodash';
  import {
    onMounted,
    ref,
    reactive,
    inject,
    watch,
    nextTick,
    onBeforeUnmount,
    computed
  } from 'vue';
  import {
    createAxiosToken,
    useSetChunkRequest
  } from '@/api/axios-chunk-request';
  import useCallCommon from '@/hooks/use-call-common';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import { UseSortDirection } from '@/utils/common';
  import { websocketEventType } from '@/views/config';
  import { setDurationValue } from '@/views/config/utils';
  import { HistoryData } from '../../config/interface';
  import revisionDetail from '../revision-detail.vue';
  import serviceSpecDiff from '../service-spec-diff.vue';
  import { RevisionStatus, ProvideServiceIDKey } from '../../config';
  import {
    queryServiceRevisions,
    deleteApplicationRevisions,
    rollbackService,
    queryRevisionChange,
    SERVICE_RESOURCE_API_PREFIX
  } from '../../api';

  let axiosListInstance = createAxiosToken();
  const userStore = useUserStore();
  const { t, route } = useCallCommon();
  const { setChunkRequest } = useSetChunkRequest();
  const { sort, sortOrder, setSortDirection } = UseSortDirection({
    defaultSortField: '-createTime',
    defaultOrder: 'descend'
  });
  const compareOptions = [
    {
      label: 'applications.service.revision.runtime',
      value: 'computedAttributes'
    },
    { label: 'applications.service.revision.custom', value: 'attributes' }
  ];
  const projectID = route.params.projectId || '';
  const environmentID = route.params.environmentId as string;
  const title = ref('');
  const serviceId = inject(ProvideServiceIDKey, ref(''));
  const revisionDetailId = ref('');
  const revisionData = ref({});
  const total = ref(0);
  const loading = ref(false);
  const showDetailModal = ref(false);
  const showDiffModal = ref(false);
  const initialStatus = ref({});
  const diffContent = ref({});
  const attributesDiffContent = ref({});
  const computedDiffContent = ref({});
  const rollbackData = ref<any>({});
  const ids = ref<{ id: string }[]>([]);
  const dataList = ref<HistoryData[]>([]);
  const queryParams = reactive({
    page: 1,
    perPage: 10
  });

  const handleCompareChange = (val) => {
    if (val === 'attributes') {
      diffContent.value = attributesDiffContent.value;
    } else {
      diffContent.value = computedDiffContent.value;
    }
  };
  const handleRollbackService = async (comment) => {
    try {
      await rollbackService({
        revisionID: rollbackData.value.id,
        serviceID: serviceId.value,
        changeComment: comment
      });
      execSucceed();
    } catch (error) {
      //
    }
  };

  const handleConfirmDiff = async (comment) => {
    handleRollbackService(comment);
  };
  const handleViewHistoryChange = async (row) => {
    rollbackData.value = row;
    try {
      const params = {
        serviceID: serviceId.value,
        id: row.id
      };
      const { data } = await queryRevisionChange(params);
      attributesDiffContent.value = {
        old: data.old?.attributes
          ? JSON.stringify(_.omit(data.old, 'computedAttributes'), null, 2)
          : '',
        new: JSON.stringify(_.omit(data.new, 'computedAttributes'), null, 2)
      };
      computedDiffContent.value = {
        old: data.old?.computedAttributes
          ? JSON.stringify(data.old?.computedAttributes, null, 2)
          : '',
        new: JSON.stringify(data.new?.computedAttributes, null, 2)
      };
      diffContent.value = attributesDiffContent.value;
      showDiffModal.value = true;
      title.value = t('applications.applications.history.change.title');
    } catch (error) {
      //
    }
  };
  const fetchData = async () => {
    if (!serviceId.value) return;
    axiosListInstance.cancel?.();
    axiosListInstance = createAxiosToken();
    try {
      loading.value = true;
      const { data } = await queryServiceRevisions(
        {
          ...queryParams,
          serviceID: serviceId.value,
          sort: [sort.value]
        },
        axiosListInstance.token
      );
      dataList.value = data?.items || [];
      loading.value = false;
      total.value = data?.pagination?.total || 0;
    } catch (error) {
      dataList.value = [];
      loading.value = false;
    }
  };
  const handleFilter = () => {
    fetchData();
  };
  const handleSortChange = (dataIndex: string, direction: string) => {
    setSortDirection(dataIndex, direction);
    fetchData();
  };
  const handlePageChange = (page: number) => {
    queryParams.page = page;
    handleFilter();
  };
  const handlePageSizeChange = (pageSize: number) => {
    queryParams.page = 1;
    queryParams.perPage = pageSize;
    handleFilter();
  };
  const handleDeleteConfirm = async () => {
    try {
      const params = map(ids.value, (val) => {
        return {
          id: val.id
        };
      });
      await deleteApplicationRevisions({ items: params });
      queryParams.page = 1;
      handleFilter();
    } catch (error) {
      //
    }
  };
  const handleDelete = async (row) => {
    ids.value = [{ id: row.id }];
    deleteModal({ onOk: handleDeleteConfirm });
  };
  const handleViewDetail = (row) => {
    revisionDetailId.value = row.id;
    revisionData.value = row;
    initialStatus.value = row.status;
    setTimeout(() => {
      showDetailModal.value = true;
    }, 100);
  };
  const updateRevisions = (data) => {
    if (data?.type !== websocketEventType.UPDATE) return;
    const collections = filter(
      data.collection || [],
      (sItem) => sItem?.resource?.id === serviceId.value
    );
    // const collections = data?.collection || [];
    const openRevisionData = find(
      collections,
      (item) => item.id === get(revisionData.value, 'id')
    );
    if (openRevisionData) {
      revisionData.value = openRevisionData;
      initialStatus.value = openRevisionData.status;
    }
    each(collections, (item) => {
      const updateIndex = findIndex(
        dataList.value,
        (sItem) => sItem.id === item.id
      );
      if (updateIndex > -1) {
        const updateItem = cloneDeep(item);
        dataList.value[updateIndex] = updateItem;
      } else {
        dataList.value = concat(cloneDeep(item), dataList.value);
      }
    });
  };
  const updateHandler = (list) => {
    each(list, (data) => {
      updateRevisions(data);
    });
  };
  const createServiceRevisionChunkRequest = () => {
    try {
      setChunkRequest({
        url: `${SERVICE_RESOURCE_API_PREFIX()}/runs`,
        handler: updateHandler,
        beforeReconnect: fetchData
      });
    } catch (error) {
      //
    }
  };
  watch(
    () => serviceId.value,
    () => {
      queryParams.page = 1;
      fetchData();
      nextTick(() => {
        createServiceRevisionChunkRequest();
      });
    },
    {
      immediate: true
    }
  );
  onBeforeUnmount(() => {
    axiosListInstance.cancel?.();
  });
</script>

<style></style>

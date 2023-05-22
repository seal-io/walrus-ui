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
        <!-- <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="instance.id"
          :title="$t('applications.applications.history.version')"
        >
        </a-table-column> -->
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
          data-index="tags"
          align="center"
          :title="$t('applications.applications.tags.title')"
        >
          <template #cell="{ record }">
            <Autotip
              :tooltip-props="{
                content: _.join(record.tags, ',')
              }"
            >
              <a-space :margin="8">
                <a-tag
                  v-for="tag in record.tags"
                  :key="tag"
                  color="rgb(232, 242, 255)"
                  style="color: inherit"
                  >{{ tag }}</a-tag
                >
              </a-space>
            </Autotip>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="duration"
          align="center"
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
          align="center"
          :title="$t('dashboard.table.status')"
        >
          <template #cell="{ record }">
            <StatusLabel
              :status="{
                status: record.status,
                text: record.status,
                message: '',
                transitioning: record.status === RevisionStatus.Running,
                error: record.status === RevisionStatus.Failed
              }"
            ></StatusLabel>
          </template>
        </a-table-column>
        <a-table-column align="center" :title="$t('common.table.operation')">
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
              <!-- <a-tooltip :content="rollbackTips">
                <a-dropdown @select="(value) => handleRollback(value, record)">
                  <a-link
                    :disabled="
                      includes(
                        [
                          AppInstanceStatus.Deleting,
                          AppInstanceStatus.Deploying
                        ],
                        instanceInfo.status
                      )
                    "
                    @mouseover="handlehoverButton('button')"
                  >
                    <icon-font type="icon-rollback" style="font-size: 16px" />
                  </a-link>
                  <template #content>
                    <div>
                      <a-doption value="app"
                        ><a-link @mouseover="handlehoverButton('app')"
                          ><icon-apps></icon-apps></a-link
                      ></a-doption>
                      <a-doption value="instance"
                        ><a-link @mouseover="handlehoverButton('instance')"
                          ><icon-cloud /></a-link
                      ></a-doption>
                    </div>
                  </template>
                </a-dropdown>
              </a-tooltip> -->
              <a-tooltip :content="$t('common.button.delete')">
                <a-link type="text" size="small" @click="handleDelete(record)">
                  <template #icon
                    ><icon-delete style="font-size: 16px"
                  /></template>
                </a-link>
              </a-tooltip>
            </a-space>
          </template>
        </a-table-column>
      </template>
    </a-table>
    <a-pagination
      size="small"
      :total="total"
      :page-size="queryParams.perPage"
      :current="queryParams.page"
      show-total
      show-page-size
      :hide-on-single-page="queryParams.perPage === 10"
      @change="handlePageChange"
      @page-size-change="handlePageSizeChange"
    />
    <revisionDetail
      v-model:show="showDetailModal"
      :data-info="revisionData"
      :revision-id="revisionDetailId"
      :initial-status="initialStatus"
    ></revisionDetail>
    <instanceSpecDiff
      v-model:show="showDiffModal"
      :title="title"
      :content="diffContent"
      @confirm="handleConfirmDiff"
    ></instanceSpecDiff>
  </div>
</template>

<script lang="ts" setup>
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
  import { HistoryData } from '../../config/interface';
  import revisionDetail from '../revision-detail.vue';
  import instanceSpecDiff from '../instance-spec-diff.vue';
  import {
    setDurationValue,
    websocketEventType,
    AppInstanceStatus,
    RevisionStatus
  } from '../../config';
  import {
    queryApplicationRevisions,
    deleteApplicationRevisions,
    diffRevisionSpec,
    rollbackApplication,
    rollbackInstance,
    queryRevisionChange
  } from '../../api';
  import { updateApplicationEmitter } from '../../hooks/update-application-listener';

  let axiosListInstance = createAxiosToken();
  const { t } = useCallCommon();
  const { setChunkRequest } = useSetChunkRequest();
  const { sort, sortOrder, setSortDirection } = UseSortDirection({
    defaultSortField: '-createTime',
    defaultOrder: 'descend'
  });
  const title = ref('');
  const instanceId = inject('instanceId', ref(''));
  const instanceInfo = inject('instanceInfo', ref<any>({}));
  const revisionDetailId = ref('');
  const revisionData = ref({});
  const total = ref(0);
  const loading = ref(false);
  const showDetailModal = ref(false);
  const showDiffModal = ref(false);
  const initialStatus = ref('');
  const rollbackType = ref('');
  const diffContent = ref({});
  const rollbackData = ref<any>({});
  const ids = ref<{ id: string }[]>([]);
  const dataList = ref<HistoryData[]>([]);
  const queryParams = reactive({
    page: 1,
    perPage: 10
  });

  const rollbackTips = computed(() => {
    if (rollbackType.value === 'app') {
      return t('applications.applications.history.rollbackapp');
    }
    if (rollbackType.value === 'instance') {
      return t('applications.applications.history.rollbackinstance');
    }
    return t('applications.applications.history.rollback');
  });
  const handleClone = (row) => {
    console.log(row);
  };
  const handleDiffRevisionSpec = async (row) => {
    try {
      const params = {
        id: row.id,
        instanceID: instanceId.value
      };
      const { data } = await diffRevisionSpec(params);
      const variables =
        rollbackType.value === 'app' ? 'variables' : 'inputVariables';
      diffContent.value = {
        old: JSON.stringify(pick(data.old, [variables, 'modules']), null, 2),
        new: JSON.stringify(pick(data.new, [variables, 'modules']), null, 2)
      };
      showDiffModal.value = true;
      title.value = t('applications.applications.history.diff.title');
    } catch (error) {
      console.log(error);
    }
  };
  const handleRollbackApplication = async () => {
    try {
      await rollbackApplication({ id: rollbackData.value.id });
      execSucceed();
      updateApplicationEmitter();
    } catch (error) {
      console.log(error);
    }
  };
  const handleRollbackInstance = async () => {
    try {
      await rollbackInstance({ id: rollbackData.value.id });
      execSucceed();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRollback = async (value, row) => {
    rollbackType.value = value;
    rollbackData.value = row;
    handleDiffRevisionSpec(row);
  };

  const handlehoverButton = (type) => {
    rollbackType.value = type;
  };
  const handleConfirmDiff = async () => {
    if (rollbackType.value === 'app') {
      handleRollbackApplication();
    }
    if (rollbackType.value === 'instance') {
      handleRollbackInstance();
    }
  };
  const handleViewHistoryChange = async (row) => {
    try {
      const params = {
        instanceID: instanceId.value,
        id: row.id
      };
      const { data } = await queryRevisionChange(params);
      diffContent.value = {
        old: JSON.stringify(pick(data.old, ['variables', 'modules']), null, 2),
        new: JSON.stringify(pick(data.new, ['variables', 'modules']), null, 2)
      };
      showDiffModal.value = true;
      title.value = t('applications.applications.history.change.title');
    } catch (error) {
      console.log(error);
    }
  };
  const fetchData = async () => {
    if (!instanceId.value) return;
    axiosListInstance.cancel?.();
    axiosListInstance = createAxiosToken();
    try {
      loading.value = true;
      const { data } = await queryApplicationRevisions(
        {
          ...queryParams,
          instanceID: instanceId.value,
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
      console.log(error);
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
      await deleteApplicationRevisions(params);
      queryParams.page = 1;
      handleFilter();
    } catch (error) {
      console.log(error);
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
    if (data?.type !== websocketEventType.update) return;
    const collections = filter(
      data.collection || [],
      (sItem) => sItem?.instance?.id === instanceId.value
    );
    // const collections = data?.collection || [];
    const openRevisionData = find(
      collections,
      (item) => item.id === get(revisionData.value, 'id')
    );
    if (openRevisionData) {
      revisionData.value = openRevisionData;
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
  const createInstanceListWebsocket = () => {
    try {
      setChunkRequest({
        url: `/application-revisions`,
        params: {
          instanceID: instanceId.value
        },
        handler: updateHandler
      });
    } catch (error) {
      console.log(error);
    }
  };
  watch(
    () => instanceId.value,
    () => {
      queryParams.page = 1;
      fetchData();
      nextTick(() => {
        createInstanceListWebsocket();
      });
    },
    {
      immediate: true
    }
  );
  onBeforeUnmount(() => {
    console.log('wss unmounted');
    axiosListInstance.cancel?.();
  });
  onMounted(() => {
    console.log('resource');
  });
</script>

<style></style>

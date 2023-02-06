<template>
  <div class="sbom-list container">
    <a-card class="general-card q-s-w-card">
      <GroupTitle
        :title="$t('projects.history.title')"
        :bordered="false"
      ></GroupTitle>
      <a-space :size="20" fill direction="vertical">
        <a-table
          column-resizable
          :bordered="true"
          :loading="loading"
          :data="dataList"
          :pagination="false"
          @sorter-change="handleSortChange"
        >
          <template #columns>
            <a-table-column
              :width="180"
              data-index="createTime"
              :title="$t('projects.history.table.updateTime')"
              :sortable="{
                sortDirections: ['ascend', 'descend'],
                defaultSortOrder: '',
                sorter: true,
                sortOrder,
              }"
            >
              <template #cell="{ record }">
                <span>{{
                  dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')
                }}</span>
              </template>
            </a-table-column>
            <!-- <a-table-column
              align="center"
              data-index="version"
              :title="$t('projects.history.table.id')"
            >
              <template #cell="{ record }">
                <a-link
                  class="link-btn"
                  target="_blank"
                  :href="resolvePath(record)"
                  >{{ record.version.slice(0, 7) }}</a-link
                >
                <span>{{ record.version.slice(0, 7) }}</span>
              </template>
            </a-table-column> -->
            <a-table-column
              :title="$t('logs.list.status')"
              data-index="status"
              ellipsis
              tooltip
              :cell-style="{ minWidth: '40px' }"
            >
              <template #cell="{ record }">
                <span class="status" :class="[record.status]">{{
                  $t(getStatus(record.status))
                }}</span>
              </template>
            </a-table-column>
            <a-table-column :title="$t('logs.list.events')" data-index="type">
              <template #cell="{ record }">
                <span>{{ $t(getEventType(record.type)) }}</span>
              </template>
            </a-table-column>
            <a-table-column
              align="center"
              :width="200"
              data-index="vulnerabilityCount"
              :title="$t('projects.table.scanTime')"
            >
              <template #cell="{ record }">
                <severityBar
                  :layout="['H', 'M', 'L']"
                  :severity="record.violationSummary"
                ></severityBar>
              </template>
            </a-table-column>
            <a-table-column
              align="center"
              data-index="dependencyCount"
              ellipsis
              tooltip
              :cell-style="{ minWidth: '40px' }"
              :title="$t('projects.history.table.components')"
            >
              <template #cell="{ record }">
                <a-button
                  v-if="!!record.dependencyCount"
                  type="text"
                  @click="handleToDetail(record)"
                  >{{ record.dependencyCount }}</a-button
                >
              </template>
            </a-table-column>
            <a-table-column
              align="center"
              :title="$t('sbom.table.operation')"
              :width="120"
            >
              <template #cell="{ record }">
                <a-link
                  type="text"
                  :href="resolvePath(record)"
                  target="_blank"
                  >{{ $t('logs.list.viewReport') }}</a-link
                >
              </template>
            </a-table-column>
          </template>
        </a-table>
        <a-pagination
          size="small"
          :total="total"
          :page-size="pagination.perPage"
          :current="pagination.page"
          show-total
          show-page-size
          :hide-on-single-page="pagination.perPage === 10"
          @change="handlePageChange"
          @page-size-change="handlePageSizeChange"
        />
      </a-space>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { pickBy, get } from 'lodash';
  import dayjs from 'dayjs';
  import { useRoute, useRouter } from 'vue-router';
  import GroupTitle from '@/components/group-title/index.vue';
  import { ref, reactive, PropType, defineExpose, onMounted } from 'vue';
  import useLoading from '@/hooks/loading';
  import { statusList, eventType } from '@/views/logs/config';
  import severityBar from '@/components/severity-bar/index.vue';
  import { UseSortDirection } from '@/utils/common';
  import { TableRowData } from '../config/interface';
  import { queryHistoryDependencies, listParams } from '../api/sbom';

  interface queryType {
    query: string;
    withIssues: string;
  }
  const route = useRoute();
  const router = useRouter();
  const { sort, sortOrder, setSortDirection } = UseSortDirection({
    defaultOrder: 'descend',
    defaultSortField: '-createTime',
  });
  const total = ref(0);
  const { loading, setLoading } = useLoading(true);
  const pagination = reactive({
    page: 1,
    perPage: 10,
  });
  const query = reactive({
    sort: '-createTime',
  });
  const dataList = ref<TableRowData[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let params = {
        resourceID: route.query.id,
        ...pagination,
        ...query,
      } as listParams;
      params = pickBy(params, (val) => !!val) as listParams;
      const { data } = await queryHistoryDependencies(params);
      const list: any = data?.items || [];
      dataList.value = [].concat(list);
      total.value = data?.pagination?.total || 0;
      console.log('data===', data);
    } catch (error) {
      dataList.value = [];
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchData();
  };
  const handlePageChange = (page: number) => {
    pagination.page = page;
    handleFilter();
  };
  const handlePageSizeChange = (pageSize: number) => {
    pagination.page = 1;
    pagination.perPage = pageSize;
    handleFilter();
  };
  const resolvePath = (row: any) => {
    const path = router.resolve({
      name: 'eventReport',
      query: {
        id: row.version,
      },
    });
    return path.href;
  };
  const handleToDetail = (row) => {
    router.push({
      name: 'projectSBom',
      query: {
        id: route.query.id,
        versionId: row.version,
        lastEvaluationTime: row.createTime,
      },
    });
  };
  const handleSortChange = (dataIndex: string, direction: string) => {
    console.log('dataIndex===', dataIndex, direction);
    setSortDirection(dataIndex, direction);
    query.sort = sort.value;
    pagination.page = 1;
    fetchData();
  };
  const getStatus = (val: string | number) => {
    const obj = statusList.find((item) => item.value === val);
    return obj ? obj.label : '';
  };
  const getEventType = (val: string | number) => {
    const obj = eventType.find((item) => item.value === val);
    return obj ? obj.label : '';
  };
  const initData = () => {
    pagination.page = 1;
    handleFilter();
  };
  onMounted(() => {
    initData();
  });
  defineExpose({
    handleFilter,
  });
</script>

<style lang="less" scoped>
  .sbom-list {
    :deep(.group-title) {
      margin-bottom: 10px;
    }

    .general-card {
      :deep(.arco-card-body) {
        padding: 20px;
      }
    }

    .status {
      &::before {
        display: inline-block;
        width: 5px;
        height: 5px;
        margin-right: 5px;
        vertical-align: middle;
        border-radius: 50%;
        content: '';
      }

      &.permit::before {
        background-color: rgb(var(--success-6));
      }

      &.warn::before {
        background-color: rgb(var(--warning-6));
      }

      &.block::before {
        background-color: rgb(var(--danger-6));
      }

      &.error::before {
        background-color: rgb(var(--danger-6));
      }

      &.running::before {
        background-color: rgb(var(--primary-6));
      }
    }

    :deep(.arco-pagination) {
      justify-content: end;

      .arco-pagination-jumper-input {
        background-color: var(--color-fill-2);
      }
    }
  }
</style>

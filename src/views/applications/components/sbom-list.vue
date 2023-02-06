<template>
  <div class="sbom-list">
    <com-card padding="0 0 20px">
      <a-table
        column-resizable
        style="padding-bottom: 20px"
        :bordered="true"
        :loading="loading"
        :data="dataList"
        :pagination="false"
        @sorter-change="handleSortChange"
      >
        <template #columns>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            data-index="name"
            :title="$t('sbom.table.name')"
          >
            <template #cell="{ record }">
              <span>{{
                record.namespace
                  ? `${record.namespace}/${record.name}`
                  : record.name
              }}</span>
            </template>
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            align="center"
            data-index="version"
            :title="$t('sbom.table.version')"
          >
            <template #cell="{ record }">
              <span>{{ record.version }}</span>
              <icon-font
                v-if="
                  record.latestVersion &&
                  record.latestVersion !== record.version
                "
                :size="14"
                type="icon-shengji"
                class="warn-icon"
              />
            </template>
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            align="center"
            data-index="latestVersion"
            :title="$t('sbom.table.lastversion')"
          >
            <template #cell="{ record }">
              <span>{{ record.latestVersion }}</span>
            </template>
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '80px' }"
            align="center"
            data-index="openSSFScore"
            :title="$t('sbom.table.openssf')"
            :sortable="{
              sortDirections: ['ascend', 'descend'],
              defaultSortOrder: '',
              sorter: true,
              sortOrder: sortOrder,
            }"
          >
            <template #cell="{ record }">
              <span>{{
                get(record, 'projectScorecardScore') > 0
                  ? get(record, 'projectScorecardScore')
                  : '-'
              }}</span>
            </template>
          </a-table-column>
          <a-table-column
            align="center"
            :width="320"
            data-index="vulnTotal"
            :title="$t('sbom.table.vulner.cvss')"
            :sortable="{
              sortDirections: ['descend'],
              defaultSortOrder: 'descend',
              sorter: true,
              sortOrder: 'descend',
            }"
          >
            <template #cell="{ record }">
              <a-space :size="4">
                <severityBar
                  :severity="{
                    critical: get(record, 'vulnerabilitySummary.critical'),
                    high: get(record, 'vulnerabilitySummary.high'),
                    medium: get(record, 'vulnerabilitySummary.medium'),
                    low: get(record, 'vulnerabilitySummary.low'),
                    none: get(record, 'vulnerabilitySummary.none'),
                  }"
                ></severityBar>
              </a-space>
            </template>
          </a-table-column>
          <!-- <a-table-column
            align="center"
            data-index="relationShip"
            :title="$t('sbom.table.relationship')"
          >
        </a-table-column> -->
          <!-- <a-table-column
            align="center"
            data-index="licenses"
            :title="$t('sbom.table.license')"
          ></a-table-column> -->
          <!-- <a-table-column
            data-index="purl"
            :title="$t('sbom.table.purl')"
            align="left"
          >
            <template #cell="{ record }">
              <span>{{ decodeURIComponent(record.purl) }}</span>
            </template>
          </a-table-column> -->
          <!-- <a-table-column
            align="center"
            data-index="packageSystem"
            :title="$t('sbom.table.pkgtool')"
          ></a-table-column> -->
          <!-- <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            align="center"
            data-index="direct"
            :title="$t('resource.detail.components.relation')"
          >
            <template #cell="{ record }">
              <span>{{
                record.direct
                  ? $t('resource.detail.components.relationdirect')
                  : $t('resource.detail.components.relationindirect')
              }}</span>
            </template>
          </a-table-column> -->
          <a-table-column
            align="center"
            :title="$t('sbom.table.operation')"
            :width="120"
          >
            <template #cell="{ record }">
              <!-- <a-link type="text" :href="resolvePath(record)" target="_blank">{{
                $t('common.button.detail')
              }}</a-link> -->
              <a-button type="text" @click="handleToComponentDetail(record)">
                {{ $t('common.button.detail') }}
              </a-button>
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
    </com-card>
  </div>
</template>

<script lang="ts" setup>
  import { pickBy, get } from 'lodash';
  import { useRoute, useRouter } from 'vue-router';
  import { ref, reactive, PropType, defineExpose, watch, onMounted } from 'vue';
  import useLoading from '@/hooks/loading';
  import severityBar from '@/components/severity-bar/index.vue';
  import comCard from '@/components/page-wrap/com-card.vue';
  import { TableRowData } from '@/views/projects/config/interface';
  import { UseSortDirection } from '@/utils/common';
  import { queryAppsDependencies, ComponentsParams } from '../api/applications';

  interface queryType {
    query: string;
    direct: string;
  }
  const props = defineProps({
    query: {
      type: Object as PropType<queryType>,
      default() {
        return {};
      },
    },
  });
  const route = useRoute();
  const router = useRouter();
  const { sort, sortOrder, setSortDirection } = UseSortDirection({
    defaultSortField: '-vulnTotal',
    defaultOrder: '',
  });
  let timer: any = null;
  const total = ref(0);
  const id = route.query.id as string;
  const { loading, setLoading } = useLoading(true);
  const pagination = reactive({
    page: 1,
    perPage: 10,
  });
  const dataList = ref<TableRowData[]>([
    // {
    //   id: '121',
    //   name: 'node',
    //   namespace: 'mtisme',
    //   version: 'v1.2',
    //   purl: '',
    //   language: 'go',
    //   packageSystem: 'npm',
    //   licenses: 'MIT',
    //   repositoryIDs: [],
    // },
  ]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let params = {
        id,
        ...pagination,
        ...props.query,
        sort: sort.value,
      } as ComponentsParams;
      params = pickBy(params, (val) => !!val) as ComponentsParams;
      const { data } = await queryAppsDependencies(params);
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
  const handleSortChange = (dataIndex: string, direction: string) => {
    setSortDirection(dataIndex, direction);
    if (dataIndex === 'vulnTotal') {
      sort.value = '-vulnTotal';
      sortOrder.value = '';
    }
    console.log('sort===', sort.value);
    pagination.page = 1;
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
  const initData = () => {
    pagination.page = 1;
    handleFilter();
  };
  watch(
    () => props.query,
    () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        pagination.page = 1;
        handleFilter();
      }, 200);
    },
    { immediate: false, deep: true }
  );
  const resolvePath = (row: any) => {
    const path = router.resolve({
      name: 'componentDetail',
      query: {
        id: row.id,
        repositoryID: get(row, 'resourceIDs.0') || '',
        version: route.query.versionId,
      },
    });
    return path.href;
  };
  const handleToComponentDetail = (row) => {
    router.push({
      name: 'componentDetail',
      query: {
        id: row.id,
        repositoryID: get(row, 'resourceIDs.0') || '',
        version: route.query.versionId,
      },
    });
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
    margin-top: 2px;
    padding: 0;
    background: var(--color-fill-2);

    .general-card {
      :deep(.arco-card-body) {
        padding: 0;
      }
    }

    .warn-icon {
      margin-left: 4px;
      color: #f7ba1e;
      font-weight: 500;
      font-size: 16px;
    }

    :deep(.arco-pagination) {
      padding: 0;
      background: #fff;
      border-radius: 0 0 var(--border-radius-medium) var(--border-radius-medium);
    }
  }
</style>

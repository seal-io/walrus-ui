<template>
  <div class="sbom-list">
    <a-card class="general-card q-s-w-card">
      <a-table
        column-resizable
        style="margin-bottom: 20px"
        :bordered="true"
        :loading="loading"
        :data="dataList"
        :pagination="false"
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
            data-index="ComType"
            :title="$t('reosurce.detail.versiontable.type')"
          >
            <!-- <template #cell="{ record }">
              <span></span>
            </template> -->
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            align="center"
            data-index="versionCount"
            :title="$t('reosurce.detail.versiontable.count')"
          >
            <!-- <template #cell="{ record }">
              <span></span>
            </template> -->
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
              <span>{{ record.latestVersion || '-' }}</span>
            </template>
          </a-table-column>
          <a-table-column align="center" :title="$t('sbom.table.operation')">
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
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { pickBy, get } from 'lodash';
  import { useRoute, useRouter } from 'vue-router';
  import { ref, reactive, PropType, defineExpose, watch, onMounted } from 'vue';
  import useLoading from '@/hooks/loading';
  import { TableRowData } from '../../config/interface';
  import { queryVersionDependenciesList, listParams } from '../../api/sbom';

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

  let timer: any = null;
  const total = ref(0);
  const { loading, setLoading } = useLoading(true);
  const pagination = reactive({
    page: 1,
    perPage: 10,
  });
  const dataList = ref<TableRowData[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let params = {
        resourceID: route.query.id,
        versionId: route.query.versionId || 'latest',
        ...pagination,
        ...props.query,
      } as listParams;
      params = pickBy(params, (val) => !!val) as listParams;
      const { data } = await queryVersionDependenciesList(params);
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
        repositoryID: route.query.id,
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
        repositoryID: route.query.id,
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
    padding: 0;
    padding-top: 2px;
    // background: var(--color-fill-2);
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

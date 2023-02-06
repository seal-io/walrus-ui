<template>
  <div class="s-bom-list container">
    <a-space class="filter-wrap">
      <!-- <a-select
        v-model="query.packageSystem"
        allow-clear
        :placeholder="$t('sbom.filter.pkgtool')"
        @change="handlerSearch"
      >
        <a-option
          v-for="item in packagesSysList"
          :key="item.value"
          :value="item.value"
          >{{ item.label }}</a-option
        >
      </a-select> -->
      <a-select
        v-model="query.resourceID"
        style="width: 200px"
        allow-clear
        allow-search
        :options="projectList"
        :trigger-props="{ contentClass: 'component-select-drop' }"
        :virtual-list-props="{ height: 200, fixedSize: true, threshold: 20 }"
        :placeholder="$t('sbom.filter.project')"
        @change="handlerSearch"
      >
        <template #option="{ data }">
          <a-tooltip :content="data.label" position="top">
            <span
              ><ProviderIcon :provider="data.provider" /><span
                style="margin-left: 5px"
                >{{ data.label }}</span
              ></span
            >
          </a-tooltip>
        </template>
        <!-- <a-option
          v-for="item in projectList"
          :key="item.value"
          style="line-height: 32px"
          :value="item.value"
        >
          <a-tooltip :content="item.label" position="top">
            <span
              ><ProviderIcon :provider="item.provider" /><span
                style="margin-left: 5px"
                >{{ item.label }}</span
              ></span
            >
          </a-tooltip>
        </a-option> -->
        <template #empty><span></span></template>
      </a-select>
      <!-- <a-select
        v-model="query.withIssues"
        :placeholder="$t('sbom.filter.issues')"
        @change="handlerSearch"
      >
        <a-option
          v-for="item in withVulnerConfig"
          :key="item.value"
          :value="item.value"
          >{{ $t(item.label) }}</a-option
        >
      </a-select> -->
      <a-input
        v-model="query.query"
        allow-clear
        :placeholder="$t('sbom.filter.name')"
        @clear="handlerSearch"
        @change="handlerSearch"
        @press-enter="handlerSearch"
      >
        <template #prefix>
          <icon-search />
        </template>
      </a-input>
      <a-button type="primary" style="margin-left: 15px" @click="handleReset">{{
        $t('common.button.reset')
      }}</a-button>
    </a-space>
    <a-card class="general-card q-s-w-card">
      <a-space direction="vertical" :size="20" fill>
        <a-table
          column-resizable
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
              :title="$t('sbom.table.project')"
            >
              <template #cell="{ record }">
                <a-dropdown-button
                  v-if="setProjectName(record.repositoryIDs).length > 1"
                  class="repo-down"
                  style="background: #fff"
                  size="small"
                >
                  <span style="font-weight: 500">{{
                    get(setProjectName(record.repositoryIDs || []), '0')
                  }}</span>
                  <template #content>
                    <ul class="used-pro-list">
                      <li
                        v-for="(item, index) in tail(
                          setProjectName(record.repositoryIDs)
                        )"
                        :key="index"
                        class="repo"
                        >{{ item }}</li
                      >
                    </ul>
                  </template>
                </a-dropdown-button>
                <span v-else style="font-weight: 500">{{
                  get(setProjectName(record.resourceIDs || []), '0')
                }}</span>
                <!-- <a-tooltip :content="setProjectName(record.repositoryIDs)">
                  <span>{{ setProjectName(record.repositoryIDs) }}</span>
                </a-tooltip> -->
              </template>
            </a-table-column>
            <a-table-column
              ellipsis
              tooltip
              :cell-style="{ minWidth: '40px' }"
              align="center"
              data-index="version"
              :title="$t('sbom.table.version')"
            ></a-table-column>
            <a-table-column
              align="center"
              ellipsis
              tooltip
              :cell-style="{ minWidth: '60px' }"
              data-index="openSSFScore"
              :title="$t('sbom.table.openssf')"
              :sortable="{
                sortDirections: ['ascend', 'descend'],
                defaultSortOrder: 'ascend',
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
              :title="$t('sbom.table.vulner')"
              :sortable="{
                sortDirections: ['descend'],
                defaultSortOrder: '',
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
      </a-space>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { pickBy, get, map, filter, join, tail, each } from 'lodash';
  import { onMounted, reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import useLoading from '@/hooks/loading';
  import severityBar from '@/components/severity-bar/index.vue';
  import ProviderIcon from '@/components/provider-icon/index.vue';
  import ADropdownButton from '@arco-design/web-vue/es/dropdown/dropdown-button';
  import { tableListRow, queryDataList } from '@/api/projects';
  import { queryDependencyList, listParams } from '@/views/projects/api/sbom';
  import { TableRowData } from '@/views/projects/config/interface';
  import { UseSortDirection } from '@/utils/common';
  import { columns, withVulnerConfig, pkgToolConfig } from '../config';

  const { loading, setLoading } = useLoading(true);
  const total = ref<number>(0);
  const router = useRouter();
  const { sort, sortOrder, setSortDirection } = UseSortDirection({
    defaultSortField: '-vulnTotal',
    defaultOrder: '',
  });
  const packagesSysList = ref<{ label: string; value: string }[]>([]);
  const projectList = ref<{ label: string; value: string; provider: string }[]>(
    []
  );
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
  const pagination = reactive({
    page: 1,
    perPage: 10,
  });
  const query = reactive({
    query: '',
    withIssues: '',
    resourceID: '',
    packageSystem: '',
  });
  const setProjectName = (ids) => {
    if (!ids) return [];
    const list = filter(projectList.value, (item) => {
      return ids.includes(item.value);
    }) as { label: string; value: string; provider: string }[];
    const res: string[] = map(list, (sItem) => sItem.label);
    console.log('porject===', ids, res, list);
    return res;
  };
  const getProjectList = async () => {
    try {
      const params = {
        page: 1,
        perPage: 15000,
      };
      const { data } = await queryDataList(params);
      const list = data?.items || [];
      projectList.value = [];
      each(list, (item) => {
        projectList.value.push({
          label: item.fullName || '',
          value: item.id,
          provider: item.provider || '',
        });
        const children = get(item, 'edges.children') || [];
        each(children, (sItem) => {
          projectList.value.push({
            label: sItem.fullName || '',
            value: sItem.id,
            provider: sItem.provider || '',
          });
        });
      });
    } catch (error) {
      console.log(error);
    }
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      let params = {
        ...pagination,
        ...query,
        sort: sort.value,
      } as listParams;
      params = pickBy(params, (val) => !!val) as listParams;
      const { data } = await queryDependencyList(params);
      const list: any = data?.items || [];
      const toolList = get(data, 'filters.packageSystem.options') || [];
      dataList.value = [].concat(list);
      total.value = data?.pagination?.total || 0;
      packagesSysList.value = map(toolList, (val) => {
        return {
          label: val,
          value: val,
        };
      });
    } catch (error) {
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

  const handlerSearch = () => {
    console.log('search');
    pagination.page = 1;
    handleFilter();
  };
  const handleReset = () => {
    query.query = '';
    query.packageSystem = '';
    query.withIssues = '';
    query.resourceID = '';
    pagination.page = 1;
    handleFilter();
  };
  const handleSortChange = (dataIndex: string, direction: string) => {
    setSortDirection(dataIndex, direction);
    if (dataIndex === 'vulnTotal') {
      sort.value = '-vulnTotal';
      sortOrder.value = '';
    }
    pagination.page = 1;
    fetchData();
  };
  const handleToComponentDetail = (row) => {
    router.push({
      name: 'componentDetail',
      query: {
        id: row.id,
      },
    });
  };
  const initData = async () => {
    await getProjectList();
    pagination.page = 1;
    handleFilter();
  };
  onMounted(() => {
    initData();
  });
</script>

<style lang="less">
  .arco-trigger-popup {
    .arco-trigger-content.component-select-drop {
      .arco-select-dropdown .arco-select-option {
        line-height: 30px !important;
      }
    }
  }

  .used-pro-list {
    max-height: 160px;
    padding: 0;
    overflow-y: auto;
    list-style: none;

    .repo {
      padding: 5px 10px;
      font-weight: 500;
      cursor: pointer;

      &:hover {
        background: var(--color-fill-2);
      }
    }
  }
</style>

<style lang="less" scoped>
  .container {
    :deep(.arco-card-body) {
      padding: 16px 20px 20px 20px;
    }

    :deep(.arco-btn-group) {
      &.repo-down {
        .arco-btn-secondary {
          padding: 0 6px;
        }
      }
    }

    :deep(.arco-table) {
      .arco-table-tr {
        .arco-table-th:nth-child(1),
        .arco-table-td:nth-child(1) {
          .arco-table-cell {
            padding-left: 16px;
          }
        }
      }
    }
  }
</style>

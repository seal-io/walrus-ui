<template>
  <ComCard top-gap class="applications-list">
    <FilterBox style="margin-bottom: 10px">
      <template #params>
        <a-select
          v-model="queryParams.projectId"
          allow-clear
          allow-search
          :options="projectList"
          style="width: 220px"
          :placeholder="$t('applications.applications.project.holder')"
          @clear="handleSearch"
          @change="handleSearch"
        >
        </a-select>
        <a-input
          v-model="queryParams.name"
          allow-clear
          style="width: 220px"
          :placeholder="$t('applications.applications.table.holder')"
          @clear="handleSearch"
          @change="handleSearch"
          @press-enter="handleSearch"
        >
          <template #prefix>
            <icon-search />
          </template>
        </a-input>
        <a-space style="margin-left: 10px">
          <a-button type="primary" @click="handleSearch">{{
            $t('common.button.search')
          }}</a-button>
          <a-button type="outline" @click="handleReset">{{
            $t('common.button.clear')
          }}</a-button>
        </a-space>
      </template>
      <template #button-group>
        <a-dropdown @select="handleCreate">
          <a-button type="primary"
            >{{ $t('applications.applications.create')
            }}<icon-down style="margin-left: 5px"
          /></a-button>
          <template #content>
            <a-doption value="system">{{
              $t('applications.applications.create')
            }}</a-doption>
            <a-doption value="template">从模板创建</a-doption>
          </template>
        </a-dropdown>

        <a-button
          type="primary"
          status="warning"
          :disabled="!selectedKeys.length"
          @click="handleDelete"
          >{{ $t('common.button.delete') }}</a-button
        >
      </template>
    </FilterBox>
    <a-table
      column-resizable
      style="margin-bottom: 20px"
      :bordered="false"
      :loading="loading"
      :data="dataList"
      :pagination="false"
      row-key="id"
      :row-selection="rowSelection"
      @selection-change="handleSelectChange"
    >
      <template #columns>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="name"
          :title="$t('applications.applications.table.name')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="instances"
          :title="$t('applications.applications.table.instance')"
        >
          <template #cell>
            <a-space :size="4" wrap>
              <InstanceStatus
                status="running"
                label="development"
              ></InstanceStatus>
              <InstanceStatus status="warning" label="test"></InstanceStatus>
              <InstanceStatus status="error" label="prod"></InstanceStatus>
            </a-space>
          </template>
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          align="center"
          data-index="createTime"
          :title="$t('common.table.createTime')"
        >
          <template #cell="{ record }">
            <span>{{ dayjs(record.createTime).locale(locale).fromNow() }}</span>
          </template>
        </a-table-column>
        <a-table-column
          align="center"
          :width="210"
          :title="$t('common.table.operation')"
        >
          <template #cell="{ record }">
            <a-space :size="10">
              <a-tooltip :content="$t('common.button.edit')">
                <a-link
                  type="text"
                  size="small"
                  @click="handleClickEdite(record)"
                >
                  <template #icon><icon-edit class="size-16" /></template>
                </a-link>
              </a-tooltip>
              <a-tooltip
                :content="$t('applications.applications.history.clone')"
              >
                <a-link type="text" size="small" @click="handleClone(record)">
                  <template #icon
                    ><icon-font type="icon-Clone-Cloud" class="size-16"
                  /></template>
                </a-link>
              </a-tooltip>
              <a-tooltip
                :content="$t('applications.applications.table.template')"
              >
                <a-link
                  type="text"
                  size="small"
                  @click="handleGenerateTemplate(record)"
                >
                  <template #icon
                    ><icon-font type="icon-Template" class="size-16"
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
    <createApplication
      v-model:show="showAppModal"
      :title="$t('applications.applications.create')"
      @save="handleSaveAppInfo"
    ></createApplication>
  </ComCard>
</template>

<script lang="ts" setup>
  import { map, get } from 'lodash';
  import dayjs from 'dayjs';
  import { reactive, ref, onMounted } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import useRowSelect from '@/hooks/use-row-select';
  import FilterBox from '@/components/filter-box/index.vue';
  import { queryProjects } from '../../projects/api';
  import { AppRowData } from '../config/interface';
  import createApplication from '../components/create-application.vue';
  import { queryApplications } from '../api';
  import InstanceStatus from '../components/instance-status.vue';

  const { rowSelection, selectedKeys, handleSelectChange } = useRowSelect();
  const { router, locale } = useCallCommon();
  let timer: any = null;
  const loading = ref(false);
  const showAppModal = ref(false);
  const total = ref(0);
  const queryParams = reactive({
    projectId: '',
    name: '',
    page: 1,
    perPage: 10
  });
  const dataList = ref<AppRowData[]>([]);
  const projectList = ref<{ label: string; value: string }[]>([]);

  const getProjectList = async () => {
    try {
      const params = {
        page: 1,
        perPage: 1000
      };
      const { data } = await queryProjects(params);
      projectList.value = map(data?.items || [], (item) => {
        item.label = item.name;
        item.value = item.id;
        return item;
      }) as Array<{ label: string; value: string }>;
      queryParams.projectId = get(projectList.value, '0.value') || '';
    } catch (error) {
      projectList.value = [];
      console.log(error);
    }
  };
  const fetchData = async () => {
    try {
      loading.value = true;
      const { data } = await queryApplications(queryParams);
      dataList.value = data?.items || [];
      total.value = data?.pagination?.total || 0;
      loading.value = false;
    } catch (error) {
      loading.value = false;
      console.log(error);
    }
  };
  const handleFilter = () => {
    fetchData();
  };
  const handleSearch = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      queryParams.page = 1;
      handleFilter();
    }, 100);
  };
  const handleReset = () => {
    queryParams.projectId = '';
    queryParams.page = 1;
    handleFilter();
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
  const handleCreate = (type) => {
    if (type === 'system') {
      router.push({
        name: 'applicationsDetail',
        params: {
          projectId: queryParams.projectId
        }
      });
    }
  };
  const handleDeleteConfirm = async () => {
    try {
      loading.value = true;
      const ids = map(selectedKeys.value, (val) => {
        return {
          id: val
        };
      });
      // await deleteRepos(ids);
      loading.value = false;
      execSucceed();
      queryParams.page = 1;
      selectedKeys.value = [];
      rowSelection.selectedKeys = [];
      handleFilter();
    } catch (error) {
      console.log(error);
      loading.value = false;
    }
  };
  const handleClickEdite = (row) => {
    router.push({
      name: 'applicationsDetail',
      query: { id: row.id }
    });
  };
  const handleGenerateTemplate = async (row) => {};
  const handleClone = async (row) => {};

  const handleDelete = async () => {
    deleteModal({ onOk: handleDeleteConfirm });
  };
  const handleSaveAppInfo = () => {
    queryParams.page = 1;
    handleFilter();
  };
  const init = async () => {
    await getProjectList();
    fetchData();
  };
  onMounted(() => {
    init();
  });
</script>

<style lang="less" scoped>
  .applications-list {
  }
</style>

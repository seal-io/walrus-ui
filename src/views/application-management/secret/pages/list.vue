<template>
  <comCard borderless top-gap>
    <div class="connectors-list">
      <FilterBox style="margin-bottom: 10px">
        <template #params>
          <a-select
            v-model="queryParams.projectID"
            style="width: 200px"
            allow-clear
            :options="projectList"
            placeholder="请选择项目"
            @change="handleSearch"
          ></a-select>
          <a-input
            v-model="queryParams.query"
            allow-clear
            style="width: 200px"
            :placeholder="$t('applications.applications.secret.holder')"
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
          <a-button type="primary" @click="handleCreate">{{
            $t('applications.secret.create')
          }}</a-button>
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
            :title="$t('operation.connectors.table.name')"
          >
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            align="center"
            :cell-style="{ minWidth: '40px' }"
            data-index="scope"
            title="项目"
          >
            <template #cell="{ record }">
              <span>{{ setSecretScope(get(record, 'project.id')) }}</span>
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
              <span>{{
                dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')
              }}</span>
            </template>
          </a-table-column>
          <a-table-column
            align="center"
            :title="$t('common.table.operation')"
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
          >
            <template #cell="{ record }">
              <a-space :size="10">
                <a-tooltip :content="$t('common.button.edit')">
                  <a-link
                    type="text"
                    size="small"
                    @click="handleClickEdit(record)"
                  >
                    <template #icon><icon-edit class="size-16" /></template>
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
    </div>
    <createSecret
      v-model:show="showModal"
      :title="modalTitle"
      :action="action"
      :info="itemInfo"
      :project-list="projectList"
      :project-i-d="queryParams.projectID"
      @save="handleSaveItem"
    ></createSecret>
  </comCard>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { cloneDeep, find, get, map, pickBy } from 'lodash';
  import { reactive, ref, onMounted, computed } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { Message } from '@arco-design/web-vue';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import useRowSelect from '@/hooks/use-row-select';
  import FilterBox from '@/components/filter-box/index.vue';
  import { queryProjects } from '../../projects/api';
  import { SecretRow } from '../config/interface';
  import { querySecrets, deleteSecret } from '../api';
  import createSecret from '../components/create-secret.vue';

  const { rowSelection, selectedKeys, handleSelectChange } = useRowSelect();
  const { router, t, route } = useCallCommon();
  let timer: any = null;
  const projectList = ref<{ label: string; value: string }[]>([]);
  const loading = ref(false);
  const showModal = ref(false);
  const itemInfo = ref<any>({});
  const action = ref<'create' | 'edit'>('create');
  const total = ref(100);
  const queryParams = reactive({
    query: '',
    projectID: '',
    page: 1,
    perPage: 10
  });
  const dataList = ref<SecretRow[]>([]);

  const modalTitle = computed(() => {
    if (action.value === 'create') {
      return t('applications.secret.create');
    }
    return t('applications.secret.edit');
  });
  const setSecretScope = (val) => {
    const itemData = find(projectList.value, (item) => item.value === val);
    return itemData?.label || '';
  };
  const getProjectList = async () => {
    try {
      const params = {
        page: 1,
        perPage: -1
      };
      const { data } = await queryProjects(params);
      projectList.value = map(data.items || [], (item) => {
        return {
          label: item.name,
          value: item.id
        };
      });
      queryParams.projectID = get(projectList.value, '0.value') || '';
    } catch (error) {
      projectList.value = [];
      console.log(error);
    }
  };
  const fetchData = async () => {
    if (!queryParams.projectID) return;
    try {
      loading.value = true;
      const params: any = {
        ...pickBy(queryParams, (val) => !!val)
      };
      const { data } = await querySecrets(params);
      dataList.value = data?.items || [];
      total.value = data?.pagination?.total || 0;
      loading.value = false;
    } catch (error) {
      console.log(error);
      loading.value = false;
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
    queryParams.query = '';
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
  const handleCreate = () => {
    itemInfo.value = {};
    action.value = 'create';
    setTimeout(() => {
      showModal.value = true;
    }, 100);
    // router.push({
    //   name: 'secretDetail'
    // });
  };
  const handleDeleteConfirm = async () => {
    try {
      loading.value = true;
      const ids = map(selectedKeys.value, (val) => {
        return {
          id: val
        };
      });
      await deleteSecret(ids);
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

  const handleClickEdit = (row) => {
    itemInfo.value = cloneDeep(row);
    action.value = 'edit';
    setTimeout(() => {
      showModal.value = true;
    }, 100);
    // router.push({
    //   name: 'secretDetail',
    //   query: { id: row.id }
    // });
  };

  const handleDelete = async () => {
    deleteModal({ onOk: handleDeleteConfirm });
  };
  const handleSaveItem = () => {
    queryParams.page = 1;
    handleFilter();
  };
  onMounted(async () => {
    await getProjectList();
    fetchData();
    console.log('application list');
  });
</script>

<style lang="less" scoped></style>

<template>
  <div>
    <FilterBox style="margin-bottom: var(--filter-box-margin)">
      <template #params>
        <a-input
          v-model.trim="queryParams.query"
          allow-clear
          style="width: 220px"
          :placeholder="$t('common.search.name.placeholder')"
          @clear="handleSearch"
          @press-enter="handleSearch"
        >
          <template #prefix>
            <icon-search />
          </template>
        </a-input>
        <a-space style="margin-left: 0" :size="10">
          <a-button type="primary" @click="handleSearch">{{
            $t('common.button.search')
          }}</a-button>
          <a-button type="outline" @click="handleReset">{{
            $t('common.button.clear')
          }}</a-button>
        </a-space>
      </template>
      <template #button-group>
        <a-button
          v-if="
            userStore.hasRolesActionsPermission({
              resource: Resources.Subjects,
              actions: [Actions.POST]
            })
          "
          type="primary"
          @click="handleCreate"
          >{{ $t('propfile.provider.user.source') }}</a-button
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
    >
      <template #columns>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="metadata.name"
          :title="$t('profile.account.type.user')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="spec.displayName"
          :title="$t('settings.user.nickName')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
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
          v-if="
            userStore.hasRolesActionsPermission({
              resource: Resources.Subjects,
              actions: [Actions.PUT, Actions.DELETE]
            })
          "
          align="left"
          :width="210"
          :title="$t('common.table.operation')"
        >
          <template #cell="{ record }">
            <DropButtonGroup
              :actions="actionList"
              @select="(value) => handleClickAction(value, record)"
            ></DropButtonGroup>
          </template>
        </a-table-column>
      </template>
    </a-table>
    <CreateSubjectProvider
      v-model:show="showModal"
      v-model:action="action"
      :data-info="dataInfo"
      @save="handleSave"
    >
    </CreateSubjectProvider>
  </div>
</template>

<script lang="ts" setup>
  import { Resources, Actions } from '@/permissions/config';
  import _ from 'lodash';
  import dayjs from 'dayjs';
  import { useUserStore, useAppStore } from '@/store';
  import { ref, reactive, onMounted } from 'vue';
  import FilterBox from '@/components/filter-box/index.vue';
  import DropButtonGroup from '@/components/drop-button-group/index.vue';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import { getListLabel } from '@/utils/func';
  import { DataListItem, FormData } from '../config/interface';
  import { actionList } from '../config';
  import { querySubjectProviders, deleteSubjectProvider } from '../api';
  import CreateSubjectProvider from './create-subject-provider.vue';

  const appStore = useAppStore();
  const userStore = useUserStore();
  const dataList = ref<DataListItem[]>([]);
  const loading = ref(false);
  const total = ref(0);
  const dataInfo = ref<any>({});
  const showModal = ref(false);
  const action = ref('create');
  const queryParams = reactive({
    page: '',
    perPage: '',
    query: ''
  });

  const fetchData = async () => {
    try {
      loading.value = true;
      const params: any = {
        ..._.pickBy(queryParams, (val) => !!val)
      };
      const { data } = await querySubjectProviders(params);
      dataList.value = data?.items || [];
      total.value = data?.pagination?.total || 0;
      loading.value = false;
    } catch (error) {
      loading.value = false;
      dataList.value = [];
    }
  };
  const handleFilter = () => {
    fetchData();
  };
  const handlePageChange = (page: number) => {
    queryParams.page = page;
    handleFilter();
  };
  const handlePageSizeChange = (pageSize: number) => {
    queryParams.page = 1;
    queryParams.perPage = pageSize;
    appStore.updateSettings({ perPage: pageSize });
    handleFilter();
  };
  const debounceFunc = _.debounce(() => {
    queryParams.page = 1;
    handleFilter();
  }, 100);
  const handleSearch = () => {
    debounceFunc();
  };
  const handleReset = () => {
    queryParams.query = '';
    handleSearch();
  };
  const handleCreate = () => {
    showModal.value = true;
    action.value = 'create';
  };
  const handleClickEdit = (row) => {
    dataInfo.value = row;
    setTimeout(() => {
      showModal.value = true;
      action.value = 'edit';
    });
  };
  const handleDeleteConfirm = async (row) => {
    try {
      loading.value = true;
      await deleteSubjectProvider({
        name: row.metadata?.name,
        namespace: row.metadata?.namespace
      });
      loading.value = false;
      execSucceed();
      queryParams.page = 1;
      handleFilter();
    } catch (error) {
      loading.value = false;
    }
  };
  const handleSave = () => {
    queryParams.page = 1;
    fetchData();
  };
  const handleDelete = async (row) => {
    deleteModal({
      onOk: () => {
        handleDeleteConfirm(row);
      }
    });
  };
  const handleClickAction = (value, row) => {
    if (value === 'edit') {
      handleClickEdit(row);
    } else if (value === 'delete') {
      handleDelete(row);
    }
  };

  onMounted(() => {
    fetchData();
  });
</script>

<style lang="less" scoped></style>

<template>
  <div>
    <FilterBox style="margin-bottom: var(--filter-box-margin)">
      <template #params>
        <a-input
          v-model.trim="queryParams.fieldSelector"
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
          >{{ $t('propfile.provider.user.create') }}</a-button
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
          :title="$t('common.table.name')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="type"
          :title="$t('propfile.provider.source')"
        >
          <template #cell="{ record }">
            <ProviderIcon
              :size="18"
              :provider="
                record.spec.type === 'Internal' ? 'walrus' : record.spec.type
              "
            ></ProviderIcon>
          </template>
        </a-table-column>
        <!-- <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="spec.displayName"
          :title="$t('settings.user.nickName')"
        >
        </a-table-column> -->

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
    <LoadMore
      v-if="dataList.length > 0"
      v-model:page-size="queryParams.limit"
      :continue="!!queryParams.continue"
      @loadMore="handleFilter"
      @page-size-change="handlePageSizeChange"
    ></LoadMore>
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
  import LoadMore from '@/components/pagination/load-more.vue';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import ProviderIcon from '@/components/provider-icon/index.vue';
  import { DataListItem } from '../config/interface';
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
    limit: 20,
    fieldSelector: '',
    continue: ''
  });

  const fetchData = async () => {
    try {
      loading.value = true;
      const params: any = {
        ..._.pickBy(queryParams, (val) => !!val)
      };
      const { data } = await querySubjectProviders(params);
      dataList.value = data?.items || [];
      queryParams.continue = data?.metadata?.continue || '';
      loading.value = false;
    } catch (error) {
      loading.value = false;
      dataList.value = [];
    }
  };
  const handleFilter = () => {
    fetchData();
  };

  const handlePageSizeChange = (pageSize: number) => {
    queryParams.continue = '';
    appStore.updateSettings({ perPage: pageSize });
    handleFilter();
  };
  const debounceFunc = _.debounce(() => {
    handleFilter();
  }, 100);
  const handleSearch = () => {
    debounceFunc();
  };
  const handleReset = () => {
    queryParams.fieldSelector = '';
    queryParams.continue = '';
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
      queryParams.continue = '';
      handleFilter();
    } catch (error) {
      loading.value = false;
    }
  };
  const handleSave = () => {
    queryParams.continue = '';
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

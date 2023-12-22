<template>
  <div>
    <FilterBox style="margin-bottom: var(--filter-box-margin)">
      <template #params>
        <a-input
          v-model="queryParams.query"
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
        <a-button
          v-permission="{
            resource: `roles.${Resources.Subjects}`,
            actions: [Actions.POST]
          }"
          type="primary"
          @click="handleCreate"
          >{{ $t('profile.account.create') }}</a-button
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
    >
      <template #columns>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="name"
          :title="$t('profile.account.type.user')"
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
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="roles"
          :title="$t('profile.account.role')"
        >
          <template #cell="{ record }">
            <i
              style="color: var(--sealblue-6)"
              class="iconfont mright-5 size-14"
              :class="[
                _.get(
                  _.find(
                    roleTypeList,
                    (item) => item.value === _.get(record, 'roles.0.role.id')
                  ),
                  'icon'
                ) || 'icon-user'
              ]"
            ></i>
            <span>{{
              $t(
                getListLabel(
                  _.get(record, 'roles.0.role.id') || '0',
                  roleTypeList
                )
              )
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
    <CreateAccountModal
      v-model:show="showModal"
      v-model:action="action"
      :data-info="dataInfo"
      :role-list="roleList"
      @save="handleSave"
    >
    </CreateAccountModal>
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
  import { RowData, RoleItem } from '../config/interface';
  import { roleTypeList, actionList } from '../config/users';
  import { querySubjects, deleteSubjects, queryRoles } from '../api/users';
  import CreateAccountModal from '../components/create-account-modal.vue';

  const appStore = useAppStore();
  const userStore = useUserStore();
  const dataList = ref<RowData[]>([]);
  const loading = ref(false);
  const total = ref(0);
  const dataInfo = ref({});
  const showModal = ref(false);
  const action = ref('create');
  const roleList = ref<RoleItem[]>(_.cloneDeep(roleTypeList));
  const queryParams = reactive({
    page: 1,
    perPage: appStore.perPage || 10,
    query: ''
  });

  const fetchData = async () => {
    try {
      loading.value = true;
      const params: any = {
        ..._.pickBy(queryParams, (val) => !!val)
      };
      const { data } = await querySubjects(params);
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
      await deleteSubjects({ id: row.id });
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
  const getRolesList = async () => {
    try {
      const params = {
        page: -1,
        kind: 'system'
      };
      const { data } = await queryRoles(params);
      roleList.value = _.map(data.items || [], (item) => {
        return {
          ..._.cloneDeep(item),
          label: item.id,
          value: item.id
        };
      });
    } catch (error) {
      roleList.value = [];
    }
  };
  onMounted(() => {
    fetchData();
  });
</script>

<style></style>

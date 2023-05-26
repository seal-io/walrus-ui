<template>
  <ComCard class="container">
    <FilterBox style="margin-bottom: 10px">
      <template #params>
        <a-input
          v-model="queryParams.query"
          allow-clear
          style="width: 220px"
          :placeholder="$t('propfile.account.settings.holder')"
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
        <a-button
          v-permission="{
            resource: `roles.${Resources.Subjects}`,
            actions: [Actions.POST]
          }"
          type="primary"
          @click="handleCreate"
          >{{ $t('profile.account.create') }}</a-button
        >
        <a-button
          v-permission="{
            resource: `roles.${Resources.Subjects}`,
            actions: [Actions.DELETE]
          }"
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
    >
      <template #columns>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="name"
          :title="$t('profile.account.name')"
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
        <!-- <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="kind"
          :title="$t('profile.account.kind')"
        >
          <template #cell="{ record }">
            <span>{{ $t(getListLabel(record.kind, accountTypeList)) }}</span>
          </template>
        </a-table-column> -->
        <!-- <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="domain"
          :title="$t('profile.account.domain')"
        >
        </a-table-column> -->
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
          align="center"
          :width="210"
          :title="$t('common.table.operation')"
        >
          <template #cell="{ record }">
            <a-space>
              <a-tooltip :content="$t('common.button.edit')">
                <a-link
                  v-permission="{
                    resource: `roles.${Resources.Subjects}`,
                    actions: [Actions.PUT]
                  }"
                  @click="handleClickEdit(record)"
                >
                  <template #icon>
                    <icon-edit></icon-edit>
                  </template>
                </a-link>
              </a-tooltip>
              <a-tooltip :content="$t('common.button.delete')">
                <a-link
                  v-permission="{
                    resource: `roles.${Resources.Subjects}`,
                    actions: [Actions.DELETE]
                  }"
                  @click="handleDelete(record)"
                >
                  <template #icon>
                    <icon-delete></icon-delete>
                  </template>
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
    <CreateAccountModal
      v-model:show="showModal"
      v-model:action="action"
      :data-info="dataInfo"
      :role-list="roleList"
      @save="handleSave"
    >
    </CreateAccountModal>
  </ComCard>
</template>

<script lang="ts" setup>
  import { Resources, Actions } from '@/permissions/resources';
  import _ from 'lodash';
  import dayjs from 'dayjs';
  import { ref, reactive, onMounted } from 'vue';
  import FilterBox from '@/components/filter-box/index.vue';
  import useRowSelect from '@/hooks/use-row-select';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import { getListLabel } from '@/utils/func';
  import { RowData, RoleItem } from '../config/interface';
  import { accountTypeList, roleTypeList } from '../config/users';
  import { querySubjects, deleteSubjects, queryRoles } from '../api/users';
  import CreateAccountModal from '../components/create-account-modal.vue';

  const { rowSelection, selectedKeys, handleSelectChange } = useRowSelect();
  const dataList = ref<RowData[]>([]);
  const loading = ref(false);
  const total = ref(0);
  const dataInfo = ref({});
  const showModal = ref(false);
  const action = ref('create');
  const roleList = ref<RoleItem[]>(_.cloneDeep(roleTypeList));
  const queryParams = reactive({
    page: 1,
    perPage: 10,
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
      console.log(error);
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
    handleFilter();
  };
  const debounceFunc = _.debounce(() => {
    queryParams.page = 1;
    handleFilter();
  }, 100);
  const handleSearch = () => {
    debounceFunc();
  };
  const handleReset = () => {};
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
  const handleClickView = (row) => {};
  const handleDeleteConfirm = async (row) => {
    try {
      loading.value = true;
      // const ids = _.map(selectedKeys.value, (val) => {
      //   return {
      //     id: val
      //   };
      // });
      await deleteSubjects({ id: row.id });
      loading.value = false;
      execSucceed();
      queryParams.page = 1;
      selectedKeys.value = [];
      rowSelection.selectedRowKeys = [];
      handleFilter();
    } catch (error) {
      console.log(error);
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
      console.log(error);
    }
  };
  onMounted(() => {
    fetchData();
    // getRolesList();
  });
</script>

<style></style>

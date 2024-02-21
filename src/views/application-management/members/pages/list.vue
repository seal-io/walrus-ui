<template>
  <div>
    <FilterBox style="margin-bottom: var(--filter-box-margin)">
      <template #params>
        <a-input
          v-model.trim="queryParams.query"
          allow-clear
          style="width: 240px"
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
        <a-button v-if="hasPutPermission" type="primary" @click="handleAdd">{{
          $t('applications.applications.add.member')
        }}</a-button>
        <a-button
          v-permission-app="{
            projectID: route.params.projectId,
            resource: Resources.ProjectSubjects,
            actions: [Actions.DELETE]
          }"
          type="primary"
          status="warning"
          :disabled="!selectedKeys.length"
          @click="() => handleDelete()"
          >{{ $t('common.button.delete')
          }}<span v-if="selectedKeys.length">{{
            `(${selectedKeys.length})`
          }}</span></a-button
        >
      </template>
    </FilterBox>
    <a-table
      column-resizable
      style="margin-bottom: 20px"
      :loading="loading"
      :bordered="false"
      :data="projectVisitors"
      :pagination="false"
      row-key="id"
      :row-selection="
        userStore.hasProjectResourceActions({
          resource: Resources.ProjectSubjects,
          projectID: route.params.projectId,
          actions: [Actions.DELETE]
        })
          ? rowSelection
          : null
      "
      @selection-change="handleSelectChange"
    >
      <template #columns>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="subject.name"
          :title="$t('applications.member.table.name')"
        >
        </a-table-column>
        <a-table-column
          ellipsis
          tooltip
          :cell-style="{ minWidth: '40px' }"
          data-index="role"
          :title="$t('profile.account.role')"
        >
          <template #cell="{ record }">
            <!-- <a-select
              v-if="hasPutPermission && record.subject?.id !== userStore?.id"
              :model-value="record?.role?.id"
              :style="{
                width: '200px'
              }"
              @change="(val) => handleChangeRole(val, record)"
            >
              <a-option
                v-for="item in projectRoles"
                :value="item.value"
                :key="item.value"
                :label="$t(item.label)"
              ></a-option>
            </a-select> -->
            <span>{{
              $t(getListLabel(_.get(record, 'role.id'), projectRoles))
            }}</span>
          </template>
        </a-table-column>
        <a-table-column
          v-if="
            userStore.hasProjectResourceActions({
              resource: Resources.ProjectSubjects,
              projectID: route.params.projectId,
              actions: [Actions.DELETE]
            })
          "
          align="left"
          :title="$t('common.table.operation')"
          ellipsis
          tooltip
          :width="210"
          :cell-style="{ minWidth: '40px' }"
        >
          <template #cell="{ record }">
            <DropButtonGroup
              :layout="
                setActionList(record).length === 1 ? 'horizontal' : 'vertical'
              "
              :actions="setActionList(record)"
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
    <AssignRoles
      v-model:show="showModal"
      :project-i-d="projectID"
      @save="fetchData"
    ></AssignRoles>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { CommonButtonValue } from '@/views/config';
  import { Resources, Actions } from '@/permissions/config';
  import DropButtonGroup from '@/components/drop-button-group/index.vue';
  import { ref, reactive, computed, PropType } from 'vue';
  import { useUserStore, useAppStore } from '@/store';
  import useCallCommon from '@/hooks/use-call-common';
  import FilterBox from '@/components/filter-box/index.vue';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import useRowSelect from '@/hooks/use-row-select';
  import { getListLabel } from '@/utils/func';
  import {
    queryProjectSubjects,
    deleteProjectSubjects,
    addProjectSubjects
  } from '../../projects/api';
  import { projectRoles } from '../../projects/config';
  import { ProjectRolesRowData } from '../../projects/config/interface';
  import AssignRoles from '../components/assign-roles.vue';
  import { actionList } from '../config';

  const appStore = useAppStore();
  const { route } = useCallCommon();
  const userStore = useUserStore();
  const { rowSelection, selectedKeys, handleSelectChange } = useRowSelect();
  const loading = ref(false);
  const showModal = ref(false);
  const total = ref(0);
  let timer: any = null;
  const projectID = route.params.projectId as string;
  const projectVisitors = ref<ProjectRolesRowData[]>([]);

  const formData = reactive({
    project: { id: route.params.projectId as string },
    subject: { id: '' },
    role: { id: '' }
  });
  const queryParams = reactive({
    page: 1,
    perPage: appStore.perPage || 10,
    query: ''
  });

  const hasPutPermission = computed(() => {
    return (
      userStore.hasProjectResourceActions({
        resource: Resources.ProjectSubjects,
        projectID: route.params.projectId,
        actions: [Actions.POST]
      }) &&
      userStore.hasRolesActionsPermission({
        resource: Resources.Subjects,
        actions: [Actions.GET]
      })
    );
  });
  const handleChangeRole = async (val, record) => {
    try {
      const data = [
        {
          project: { id: projectID },
          subject: { id: record.subject.id },
          role: { id: val }
        }
      ];
      await addProjectSubjects({ items: data });
      execSucceed();
    } catch (error) {
      //
    }
  };
  const setActionList = (row) => {
    const list = _.filter(actionList, (item) => {
      return item.filterFun ? item.filterFun({ row }) : true;
    });
    const res = _.map(list, (o) => {
      const item = _.cloneDeep(o);
      item.disabled = _.isFunction(item.disabled)
        ? item.disabled?.({ row })
        : item.disabled;
      return item;
    });
    return res;
  };

  const fetchData = async () => {
    try {
      loading.value = true;
      const params: any = {
        ..._.pickBy(queryParams, (val) => !!val)
      };
      const { data } = await queryProjectSubjects(params);
      projectVisitors.value = data.items || [];
      total.value = data?.pagination?.total || 0;
      loading.value = false;
    } catch (error) {
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
    appStore.updateSettings({ perPage: pageSize });
    handleFilter();
  };
  const handleAdd = () => {
    showModal.value = true;
  };

  const handleDeleteConfirm = async (delIds?: string[]) => {
    try {
      const ids = _.map(delIds || selectedKeys.value, (val) => {
        return {
          id: val
        };
      });
      await deleteProjectSubjects({ items: ids });
      execSucceed();
      selectedKeys.value = [];
      rowSelection.selectedRowKeys = [];
      fetchData();
    } catch (error) {
      //
    }
  };

  const handleDelete = async (ids?: string[]) => {
    deleteModal({ onOk: () => handleDeleteConfirm(ids) });
  };

  const handleClickAction = (val, row) => {
    if (CommonButtonValue.Delete === val) {
      handleDelete([row.id]);
    }
  };
  fetchData();
</script>

<template>
  <a-modal
    top="10%"
    :closable="false"
    :align-center="false"
    :width="900"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    :body-style="{
      'max-height': '500px',
      'min-height': '300px',
      'overflow': 'auto',
      'line-height': 1
    }"
    modal-class="oci-modal"
    unmount-on-close
    :title="$t('applications.projects.authorize.title')"
    @cancel="handleCancel"
    @ok="handleOk"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <div>
      <FilterBox style="margin-bottom: 15px">
        <template #params>
          <a-select
            v-model="formData.subject.id"
            allow-search
            style="width: 220px"
            :placeholder="$t('applications.projects.authorize.account')"
          >
            <a-optgroup
              :label="$t(getListLabel(AccountKind.USER, accountTypeList))"
            >
              <a-option
                v-for="item in userSubjectList"
                :key="item.id"
                :value="item.id"
                :disabled="
                  getListLabel(item.id, projectRoles, {
                    label: 'name',
                    value: 'id'
                  })
                "
              >
                <span>{{ item.name }}</span>
              </a-option>
            </a-optgroup>
            <a-optgroup
              :label="$t(getListLabel(AccountKind.GROUP, accountTypeList))"
            >
              <a-option
                v-for="item in groupSubjectList"
                :key="item.id"
                :value="item.id"
                :disabled="
                  getListLabel(item.id, projectRoles, {
                    label: 'name',
                    value: 'id'
                  })
                "
              >
                <span>{{ item.name }}</span>
              </a-option>
            </a-optgroup>
          </a-select>
          <a-select
            v-model="formData.role.id"
            allow-search
            :options="roleList"
            :placeholder="$t('applications.projects.authorize.role')"
          >
          </a-select>
          <a-space style="margin-left: 10px">
            <a-button
              type="primary"
              :disabled="!formData.role.id || !formData.subject.id"
              @click="handleOk"
              >{{ $t('common.button.add') }}</a-button
            >
          </a-space>
        </template>
      </FilterBox>
      <a-table
        column-resizable
        style="margin-bottom: 20px"
        :loading="loading"
        :bordered="false"
        :data="projectRoles"
        :pagination="false"
        row-key="id"
        @selection-change="handleSelectChange"
      >
        <template #columns>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            data-index="subject.name"
            :title="$t('profile.account.name')"
          >
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            data-index="subject.kind"
            :title="$t('profile.account.kind')"
          >
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            data-index="subject.domain"
            :title="$t('profile.account.domain')"
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
              <span>{{ _.get(record, 'role.id') }}</span>
            </template>
          </a-table-column>
          <a-table-column
            align="center"
            :width="210"
            :title="$t('common.table.operation')"
          >
            <template #cell="{ record }">
              <a-tooltip :content="$t('common.button.delete')">
                <a-link @click="handleDelete(record)">
                  <template #icon>
                    <icon-delete></icon-delete>
                  </template>
                </a-link>
              </a-tooltip>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </div>
    <template #footer>
      <EditPageFooter style="margin-top: 0">
        <template #save>
          <a-button
            :loading="submitLoading"
            type="primary"
            class="cap-title cancel-btn"
            @click="handleCancel"
            >{{ $t('common.button.close') }}</a-button
          >
        </template>
        <!-- <template #cancel>
          <a-button
            :type="'outline'"
            class="cap-title cancel-btn"
            @click="handleCancel"
            >{{ $t('common.button.cancel') }}</a-button
          >
        </template> -->
      </EditPageFooter>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { ref, reactive, PropType } from 'vue';
  import FilterBox from '@/components/filter-box/index.vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import useRowSelect from '@/hooks/use-row-select';
  import { accountTypeList, AccountKind } from '@/views/profile/config';
  import { getListLabel } from '@/utils/func';
  import { RoleItem, RowData } from '@/views/profile/config/interface';
  import { queryRoles, querySubjects } from '@/views/profile/api';
  import {
    querySubjectRoles,
    addSubjectRoles,
    deleteSubjectRoles
  } from '../api';
  import { ProjectRolesRowData } from '../config/interface';

  const props = defineProps({
    action: {
      type: String,
      default() {
        return 'create'; // create, edit
      }
    },
    show: {
      type: Boolean,
      default() {
        return false;
      }
    },
    projectID: {
      type: String,
      default() {
        return '';
      }
    }
  });
  const { rowSelection, selectedKeys, handleSelectChange } = useRowSelect();
  const emits = defineEmits(['update:show', 'update:action', 'save']);
  const submitLoading = ref(false);
  const loading = ref(false);
  const projectRoles = ref<ProjectRolesRowData[]>([]);
  const roleList = ref<{ label: string; value: string }[]>([]);
  const userSubjectList = ref<RowData[]>([]);
  const groupSubjectList = ref<RowData[]>([]);
  const formData = reactive({
    project: { id: '' },
    subject: { id: '' },
    role: { id: '' }
  });
  const queryParams = reactive({
    page: 1,
    perPage: 10
  });

  const getProjectSubjectRoles = async () => {
    try {
      loading.value = true;
      const params = {
        page: -1,
        projectID: props.projectID
      };
      const { data } = await querySubjectRoles(params);
      projectRoles.value = data.items || [];

      loading.value = false;
    } catch (error) {
      loading.value = false;
      console.log(error);
    }
  };
  const getSubjectList = async () => {
    try {
      const params = {
        page: -1
      };
      const { data } = await querySubjects(params);
      userSubjectList.value = _.filter(data.items, (item) => {
        return item.kind === AccountKind.USER;
      });
      groupSubjectList.value = _.filter(data.items, (item) => {
        return item.kind === AccountKind.GROUP;
      });
    } catch (error) {
      userSubjectList.value = [];
      groupSubjectList.value = [];
      console.log(error);
    }
  };
  const getRoleList = async () => {
    try {
      const params = {
        kind: 'project'
      };
      const { data } = await queryRoles(params);
      roleList.value = _.map(data?.items || [], (item) => {
        return {
          label: item.id,
          value: item.id
        };
      });
    } catch (error) {
      roleList.value = [];
      console.log(error);
    }
  };
  const handleOk = async () => {
    try {
      if (formData.subject.id && formData.role.id) {
        formData.project.id = props.projectID;
        await addSubjectRoles(formData);
        getProjectSubjectRoles();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteConfirm = async () => {
    try {
      const ids = _.map(selectedKeys.value, (val) => {
        return {
          id: val
        };
      });
      await deleteSubjectRoles(ids);
      execSucceed();
      selectedKeys.value = [];
      rowSelection.selectedRowKeys = [];
      getProjectSubjectRoles();
    } catch (error) {
      console.log(error);
    }
  };
  // const handleDelete = async () => {
  //   deleteModal({ onOk: handleDeleteConfirm });
  // };
  const handleDelete = async (row) => {
    deleteModal({
      onOk: async () => {
        await deleteSubjectRoles(row);
        execSucceed();
        getProjectSubjectRoles();
      }
    });
  };
  const init = async () => {
    await Promise.all([
      getProjectSubjectRoles(),
      getSubjectList(),
      getRoleList()
    ]);
  };
  const handleCancel = () => {
    emits('update:show', false);
  };
  const handleBeforeOpen = () => {
    init();
  };
  const handleBeforeClose = () => {
    formData.subject.id = '';
    formData.role.id = '';
  };
</script>

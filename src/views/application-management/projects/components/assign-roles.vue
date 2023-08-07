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
    :title="$t('applications.applications.add.member')"
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
              v-if="userSubjectList.length"
              :label="$t(getListLabel(AccountKind.USER, accountTypeList))"
            >
              <template #label>
                <a-divider orientation="left" :margin="10">{{
                  $t(getListLabel(AccountKind.USER, accountTypeList))
                }}</a-divider>
              </template>
              <a-option
                v-for="item in userSubjectList"
                :key="item.id"
                :value="item.id"
                :disabled="
                  _.some(
                    projectVisitors,
                    (sItem) => _.get(sItem, 'subject.id') === item.id
                  )
                "
              >
                <i
                  v-if="
                    _.some(
                      projectVisitors,
                      (sItem) => _.get(sItem, 'subject.id') === item.id
                    )
                  "
                  class="iconfont icon-tianjiahaoyouchenggong_huaban1 mright-5"
                  style="color: var(--seal-color-success)"
                ></i>
                <span>{{ item.name }}</span>
              </a-option>
            </a-optgroup>
            <a-optgroup
              v-if="groupSubjectList.length"
              :label="$t(getListLabel(AccountKind.GROUP, accountTypeList))"
            >
              <template #label>
                <a-divider orientation="left" :margin="10">{{
                  $t(getListLabel(AccountKind.GROUP, accountTypeList))
                }}</a-divider>
              </template>
              <a-option
                v-for="item in groupSubjectList"
                :key="item.id"
                :value="item.id"
                :disabled="
                  _.some(
                    projectVisitors,
                    (sItem) => _.get(sItem, 'subject.id') === item.id
                  )
                "
              >
                <span>{{ item.name }}</span>
              </a-option>
            </a-optgroup>
          </a-select>
          <a-select
            v-model="formData.role.id"
            allow-search
            style="width: 220px"
            :placeholder="$t('applications.projects.authorize.role')"
          >
            <a-option
              v-for="item in roleList"
              :key="item.value"
              :value="item.value"
            >
              <span>{{ $t(item.label) }}</span>
            </a-option>
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
        :data="projectVisitors"
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
            data-index="role"
            :title="$t('profile.account.role')"
          >
            <template #cell="{ record }">
              <span>{{
                $t(getListLabel(_.get(record, 'role.id'), projectRoles))
              }}</span>
            </template>
          </a-table-column>
          <a-table-column
            align="center"
            :width="210"
            :title="$t('common.table.operation')"
          >
            <template #cell="{ record }">
              <a-tooltip :content="$t('common.button.delete')">
                <a-link status="danger" @click="handleDelete(record)">
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
            @click="handleClose"
            >{{ $t('common.button.close') }}</a-button
          >
        </template>
      </EditPageFooter>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { ref, reactive, PropType } from 'vue';
  import AOptgroup from '@arco-design/web-vue/es/select/optgroup';
  import FilterBox from '@/components/filter-box/index.vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import useRowSelect from '@/hooks/use-row-select';
  import {
    accountTypeList,
    AccountKind,
    RoleType
  } from '@/views/system/config/users';
  import { getListLabel } from '@/utils/func';
  import { RowData } from '@/views/system/config/interface';
  import { queryRoles, querySubjects } from '@/views/system/api/users';
  import {
    querySubjectRoles,
    addSubjectRoles,
    deleteSubjectRoles
  } from '../api';
  import { projectRoles } from '../config';
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
  const projectVisitors = ref<ProjectRolesRowData[]>([]);
  const roleList = ref<{ label: string; value: string }[]>(
    _.cloneDeep(projectRoles)
  );
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
      projectVisitors.value = data.items || [];

      loading.value = false;
    } catch (error) {
      loading.value = false;
    }
  };
  const getSubjectList = async () => {
    try {
      const params = {
        page: -1,
        projectID: props.projectID
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
      //
    }
  };
  const handleClose = () => {
    emits('save');
    emits('update:show', false);
  };

  const handleDelete = async (row) => {
    deleteModal({
      onOk: async () => {
        await deleteSubjectRoles({ ...row, projectID: props.projectID });
        execSucceed();
        getProjectSubjectRoles();
      }
    });
  };
  const init = async () => {
    await Promise.all([getProjectSubjectRoles(), getSubjectList()]);
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

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
            v-model="subjectIds"
            allow-search
            multiple
            :max-tag-count="2"
            style="width: 300px; height: 36px"
            :placeholder="$t('applications.projects.authorize.account')"
          >
            <a-option
              v-for="item in userSubjectList"
              :key="item.id"
              :value="item.id"
              :disabled="userAssignChecked(item)"
            >
              <i
                v-if="userAssignChecked(item)"
                class="iconfont icon-tianjiahaoyouchenggong_huaban1 mright-5"
                style="color: var(--seal-color-success)"
              ></i>
              <span>{{ item.name }}</span>
            </a-option>
          </a-select>
          <a-select
            v-model="roleId"
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
          <a-space style="margin-left: 0">
            <a-button
              type="primary"
              :disabled="!subjectIds.length || !roleId"
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
        :data="selectedList"
        :pagination="false"
        row-key="id"
      >
        <template #empty>
          <a-empty
            :description="$t('applications.projects.role.select')"
          ></a-empty>
        </template>
        <template #columns>
          <a-table-column
            ellipsis
            tooltip
            :cell-style="{ minWidth: '40px' }"
            data-index="subject.name"
            :title="$t('profile.account.type.user')"
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
            align="left"
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
            :disabled="!selectedList.length"
            type="primary"
            class="cap-title cancel-btn"
            @click="handleSubmit"
            >{{ $t('common.button.save') }}</a-button
          >
          <a-button
            type="outline"
            class="cap-title cancel-btn"
            @click="handleCancel"
            >{{ $t('common.button.cancel') }}</a-button
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
  import { accountTypeList, AccountKind } from '@/views/system/config/users';
  import { useUserStore } from '@/store';
  import { getListLabel } from '@/utils/func';
  import { RowData } from '@/views/system/config/interface';
  import { querySubjects } from '@/views/system/api/users';
  import { queryProjectSubjects, addProjectSubjects } from '../../projects/api';
  import { projectRoles } from '../../projects/config';
  import { ProjectRolesRowData } from '../../projects/config/interface';

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
  interface SelectedMember {
    project: { id: string };
    subject: { id: string; name: string };
    role: { id: string };
  }
  const emits = defineEmits(['update:show', 'update:action', 'save']);
  const userStore = useUserStore();
  const loading = ref(false);
  const projectVisitors = ref<ProjectRolesRowData[]>([]);
  const roleList = ref<{ label: string; value: string }[]>(
    _.cloneDeep(projectRoles)
  );
  const subjectList = ref<RowData[]>([]);
  const userSubjectList = ref<RowData[]>([]);
  const groupSubjectList = ref<RowData[]>([]);
  const selectedList = ref<SelectedMember[]>([]);
  const subjectIds = ref<string[]>([]);
  const roleId = ref('');

  const userAssignChecked = (subject) => {
    return (
      _.some(
        projectVisitors.value,
        (sItem) => _.get(sItem, 'subject.id') === subject.id
      ) ||
      _.some(
        selectedList.value,
        (sItem) => _.get(sItem, 'subject.id') === subject.id
      )
    );
  };

  const getProjectSubjects = async () => {
    try {
      loading.value = true;
      const params = {
        page: -1
      };
      const { data } = await queryProjectSubjects(params);
      projectVisitors.value = data.items || [];

      loading.value = false;
    } catch (error) {
      loading.value = false;
    }
  };
  const getSubjectList = async () => {
    try {
      const params = {
        page: -1
      };
      const { data } = await querySubjects(params);
      subjectList.value = data.items || [];
      userSubjectList.value = _.filter(data.items, (item) => {
        return item.kind === AccountKind.USER && item.name !== userStore.name;
      });
      groupSubjectList.value = _.filter(data.items, (item) => {
        return item.kind === AccountKind.GROUP;
      });
    } catch (error) {
      userSubjectList.value = [];
      groupSubjectList.value = [];
      subjectList.value = [];
    }
  };

  const setSelectedList = () => {
    const list = _.map(subjectIds.value, (subjectId) => {
      const subject = _.find(subjectList.value, (item) => {
        return item.id === subjectId;
      });
      return {
        project: { id: props.projectID },
        subject: { id: subjectId, name: subject?.name || '' },
        role: { id: roleId.value }
      };
    });
    selectedList.value = _.concat(list, selectedList.value);
  };
  const resetForm = () => {
    subjectIds.value = [];
    roleId.value = '';
  };
  const handleOk = async () => {
    try {
      if (subjectIds.value.length && roleId.value) {
        setSelectedList();
        // reset form
        resetForm();
      }
    } catch (error) {
      //
    }
  };
  const handleSubmit = async () => {
    try {
      await addProjectSubjects({ items: selectedList.value });
      emits('save');
      emits('update:show', false);
    } catch (error) {
      // ignore
    }
  };

  const handleDelete = async (row) => {
    const index = _.findIndex(selectedList.value, (item) => {
      return item.subject.id === row.subject.id;
    });
    selectedList.value.splice(index, 1);
  };
  const init = async () => {
    await Promise.all([getProjectSubjects(), getSubjectList()]);
  };
  const handleCancel = () => {
    emits('update:show', false);
  };
  const handleBeforeOpen = () => {
    init();
  };
  const handleBeforeClose = () => {
    resetForm();
    selectedList.value = [];
  };
</script>

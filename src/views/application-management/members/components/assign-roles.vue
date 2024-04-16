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
            v-model="subjectNames"
            allow-search
            multiple
            :max-tag-count="2"
            style="width: 300px; height: 36px"
            :placeholder="$t('applications.projects.authorize.account')"
          >
            <a-option
              v-for="item in userSubjectList"
              :key="item.metadata?.name"
              :value="item.metadata?.name"
              :disabled="userAssignChecked(item)"
            >
              <i
                v-if="userAssignChecked(item)"
                class="iconfont icon-tianjiahaoyouchenggong_huaban1 mright-5"
                style="color: var(--seal-color-success)"
              ></i>
              <span>{{ item.metadata?.name }}</span>
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
              :disabled="!subjectNames.length || !roleId"
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
            data-index="name"
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
                $t(getListLabel(_.get(record, 'role'), projectRoles))
              }}</span>
            </template>
          </a-table-column>
          <a-table-column
            align="left"
            :width="210"
            :title="$t('common.table.operation')"
          >
            <template #cell="{ rowIndex }">
              <a-tooltip :content="$t('common.button.delete')">
                <a-link status="danger" @click="handleDelete(rowIndex)">
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
  import FilterBox from '@/components/filter-box/index.vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { accountTypeList, AccountKind } from '@/views/system/config/users';
  import { useUserStore } from '@/store';
  import { getListLabel } from '@/utils/func';
  import { DataListItem } from '@/views/system/config/interface';
  import {
    querySubjects,
    ResourceKinds,
    apiVersion
  } from '@/views/system/api/users';
  import {
    queryProjectSubjects,
    addProjectSubjects,
    GlobalNamespace
  } from '../../projects/api';
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
    projectName: {
      type: String,
      default() {
        return '';
      }
    }
  });

  const emits = defineEmits(['update:show', 'update:action', 'save']);
  const userStore = useUserStore();
  const loading = ref(false);
  const projectVisitors = ref<ProjectRolesRowData[]>([]);
  const roleList = ref<{ label: string; value: string }[]>(
    _.cloneDeep(projectRoles)
  );
  const subjectList = ref<DataListItem[]>([]);
  const userSubjectList = ref<DataListItem[]>([]);
  const selectedList = ref<ProjectRolesRowData[]>([]);
  const subjectNames = ref<string[]>([]);
  const roleId = ref('');

  const userAssignChecked = (subject) => {
    return (
      _.some(
        selectedList.value,
        (sItem) => _.get(sItem, 'name') === subject.metadata?.name
      ) ||
      _.some(
        projectVisitors.value,
        (sItem) => _.get(sItem, 'name') === subject.metadata?.name
      )
    );
  };

  const getProjectSubjects = async () => {
    try {
      loading.value = true;
      const params = {
        namespace: GlobalNamespace,
        projectName: props.projectName
      };
      const { data } = await queryProjectSubjects(params);
      projectVisitors.value = data.items || [];
      selectedList.value = _.cloneDeep(data.items || []);
      loading.value = false;
    } catch (error) {
      loading.value = false;
      console.log('error', error);
    }
  };
  const getSubjectList = async () => {
    try {
      const params = {
        namespace: GlobalNamespace
      };
      const { data } = await querySubjects(params);
      subjectList.value = data.items || [];
      userSubjectList.value = _.filter(data.items, (item) => {
        return item.metadata?.name !== userStore.name;
      });
    } catch (error) {
      userSubjectList.value = [];
      subjectList.value = [];
    }
  };

  const setSelectedList = () => {
    const list = _.map(subjectNames.value, (subjectName) => {
      const subject = _.find(subjectList.value, (item) => {
        return item.metadata.name === subjectName;
      });
      return {
        namespace: subject?.metadata?.namespace,
        name: subject?.metadata?.name,
        role: roleId.value
      } as ProjectRolesRowData;
    });
    selectedList.value = _.concat(list, selectedList.value);
  };
  const resetForm = () => {
    subjectNames.value = [];
    roleId.value = '';
  };
  const handleOk = async () => {
    try {
      if (subjectNames.value.length && roleId.value) {
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
      await addProjectSubjects({
        projectName: props.projectName,
        namespace: GlobalNamespace,
        data: {
          apiVersion,
          kind: ResourceKinds.ProjectSubjects,
          items: selectedList.value,
          metadata: {
            namespace: GlobalNamespace,
            name: props.projectName
          }
        }
      });
      emits('save');
      emits('update:show', false);
    } catch (error) {
      // ignore
    }
  };

  const handleDelete = async (index) => {
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

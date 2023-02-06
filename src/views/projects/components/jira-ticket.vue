<template>
  <div class="container">
    <a-modal
      top="10%"
      :align-center="false"
      :ok-text="$t('common.button.confirm')"
      :visible="show"
      :mask-closable="false"
      :title="`${$t('projects.list.jira.title')}(${projectName})`"
      :body-style="{ 'max-height': '500px', 'overflow': 'auto' }"
      @cancel="handleCancel"
      @ok="handleOk"
      @before-open="handleBeforeOpen"
      @before-close="handleBeforeClose"
    >
      <template #title>
        <div
          style="
            width: 450px;
            overflow: hidden;
            white-space: nowrap;
            text-align: center;
            text-overflow: ellipsis;
          "
          >{{ `${$t('projects.list.jira.title')}(${projectName})` }}</div
        >
      </template>
      <a-spin :loading="loading" style="width: 100%; text-align: center">
        <a-form ref="formref" :model="formData" auto-label-width>
          <a-form-item
            v-if="showSeverity"
            style="text-align: left"
            field="severity"
            :label="$t('projects.modal.jira.serverity')"
            validate-trigger="change"
            :rules="[
              { required: true, message: $t('projects.form.rules.serverity') },
            ]"
          >
            <a-select v-model="formData.severity" multiple>
              <a-option
                v-for="(item, index) in serverityList"
                :key="index"
                :value="item.value"
                >{{ $t(item.label) }}</a-option
              >
            </a-select>
            <template #extra>
              <span>{{ $t('projects.modal.serverity.desc') }}</span>
            </template>
          </a-form-item>
          <a-form-item
            :label="
              isPrivate
                ? $t('intergration.jiraurl.url')
                : $t('intergration.createApp.jiraurl')
            "
            disabled
          >
            <a-input :model-value="jiraSpace"></a-input>
          </a-form-item>
          <a-form-item
            field="fields.project.id"
            :label="$t('projects.list.jira.ticket')"
            validate-trigger="change"
            :rules="[
              { required: true, message: $t('projects.form.rules.name') },
            ]"
          >
            <a-select
              v-model="formData.fields.project.id"
              @change="handleProjectChange"
            >
              <a-option
                v-for="(item, index) in optionList"
                :key="index"
                :value="item.value"
                >{{ item.label }}</a-option
              >
            </a-select>
          </a-form-item>
          <a-form-item
            field="fields.issuetype.id"
            :label="$t('projects.form.issueType')"
            validate-trigger="change"
            :rules="[
              { required: true, message: $t('projects.form.rules.issueType') },
            ]"
          >
            <a-select
              v-model="formData.fields.issuetype.id"
              :loading="typeLoading"
              @change="handleIssueTypeChnage"
            >
              <template #empty><span></span></template>
              <a-option
                v-for="(item, index) in issueTypeList"
                :key="index"
                :value="item.id"
                >{{ item.name }}</a-option
              >
            </a-select>
            <template #extra>
              <span>{{ $t('projects.modal.issueType.desc') }}</span>
            </template>
          </a-form-item>
          <a-form-item
            field="fields.assignee.accountId"
            :label="$t('projects.list.jira.user')"
            validate-trigger="change"
            :rules="[
              { required: true, message: $t('projects.form.rules.user') },
            ]"
          >
            <a-select
              v-model="formData.fields.assignee.accountId"
              @change="handleAssigneeChange"
            >
              <template #empty><span></span></template>
              <a-option
                v-for="(item, index) in userList"
                :key="index"
                :value="item.accountId ?? item.name"
              >
                <span
                  class="user-opts"
                  style="display: flex; align-items: center"
                >
                  <img
                    v-if="get(item, 'avatarUrls.16x16')"
                    :src="get(item, 'avatarUrls.16x16')"
                    alt=""
                    style="width: 16px; height: 16px; margin-right: 5px"
                  /><span>{{ item.name }}</span>
                </span>
              </a-option>
            </a-select>
          </a-form-item>
          <template v-for="item in customFieldsList" :key="item.key">
            <a-form-item
              v-if="
                isObject(formData.fields[item.key]) &&
                !isArray(formData.fields[item.key])
              "
              :field="`fields.${item.key}.${get(
                keys(formData.fields[item.key]),
                '0'
              )}`"
              :label="item.name"
              validate-trigger="change"
              :rules="[
                {
                  required: true,
                  message: $t('resource.sbom.rule.customKey', {
                    key: item.name,
                  }),
                },
              ]"
            >
              <formComponent
                v-model="
                  formData.fields[item.key][
                    get(keys(formData.fields[item.key]), '0')
                  ]
                "
                :data-info="item"
                :com-type="item.comType"
                :show="show"
                :allowed-values="get(item, 'allowedValues') || []"
                @user-change="(val) => handleUserChange(val, item.key)"
              ></formComponent>
            </a-form-item>
            <a-form-item
              v-else-if="item.key"
              :field="`fields.${item.key}`"
              :label="item.name"
              validate-trigger="change"
              :rules="[
                {
                  required: true,
                  message: $t('resource.sbom.rule.customKey', {
                    key: item.name,
                  }),
                },
              ]"
            >
              <formComponent
                v-model="formData.fields[item.key]"
                :com-type="item.comType"
                :data-info="item"
                :show="show"
                :allowed-values="get(item, 'allowedValues') || []"
                @user-change="(val) => handleUserChange(val, item.key)"
              ></formComponent>
            </a-form-item>
          </template>
        </a-form>
      </a-spin>
      <template #footer>
        <EditPageFooter :style="{ 'margin-top': 0 }">
          <template #save>
            <a-button
              type="primary"
              :loading="submitLoading"
              class="cap-title cancel-btn"
              @click="handleOk"
              >{{ $t('common.button.save') }}</a-button
            >
          </template>
          <template #cancel>
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
  </div>
</template>

<script lang="ts" setup>
  import {
    map,
    filter,
    get,
    find,
    hasIn,
    join,
    keys,
    each,
    split,
    includes,
    cloneDeep,
    pick,
    assignIn,
    isObject,
    omit,
    isArray,
    pickBy,
  } from 'lodash';
  import { Message } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import {
    queryJiraDataList,
    submitRepoTicket,
    submitViolationTicket,
    queryJiraIssueType,
    RepoTicket,
  } from '@/api/projects';
  import { queryUserList } from '@/views/intergration/api/project-management';
  import { reactive, ref } from 'vue';
  import { serverityList } from '@/config/global';
  import { CustomField, UserItem } from '../config/interface';
  import formComponent from './jira/form-component.vue';
  import {
    comTypeList,
    systemFieldsMap,
    systemComTypeMap,
  } from '../config/jira-fields-config';

  const props = defineProps({
    show: {
      type: Boolean,
      default() {
        return false;
      },
    },
    jiraSpace: {
      type: String,
      default() {
        return '';
      },
    },
    isPrivate: {
      type: Boolean,
      default() {
        return true;
      },
    },
    projectName: {
      type: String,
      default() {
        return '';
      },
    },
    projectId: {
      type: String,
      default() {
        return '';
      },
    },
    integrationId: {
      type: String,
      default() {
        return '';
      },
    },
    violationId: {
      type: String,
      default() {
        return '';
      },
    },
    showSeverity: {
      type: Boolean,
      default() {
        return true;
      },
    },
    violationSeverity: {
      type: String,
      default() {
        return '';
      },
    },
    ticketType: {
      type: String,
      default() {
        return 'batch'; // single、batch
      },
    },
  });
  const emit = defineEmits(['confirm', 'update:show']);
  const { t } = useI18n();
  const formref = ref();
  const submitLoading = ref(false);
  const loading = ref(false);
  const typeLoading = ref(false);
  const optionList = ref<{ label: string; value: string; key: string }[]>([]);
  const userList = ref<UserItem[]>([]);
  const issueTypeList = ref<{ id: string; name: string }[]>([]);
  const customFieldsList = ref<CustomField[]>([]);
  const staticFields = ['project', 'assignee', 'issuetype'];
  const filterFields = ['summary', 'description'];
  const requiredFields: string[] = [];
  const fields = {
    project: {
      id: '',
    },
    assignee: {
      accountId: '',
      name: '',
    },
    issuetype: {
      id: '',
    },
  };
  const formData: any = reactive({
    resourceID: props.projectId,
    id: props.integrationId,
    violationID: props.violationId,
    // projectID: '',
    // userID: '',
    // userName: '',
    // issueTypeID: '',
    severity: [],
    fields: {
      project: {
        id: '',
      },
      assignee: {
        accountId: '',
        name: '',
      },
      issuetype: {
        id: '',
      },
    },
  });

  const handleCancel = () => {
    emit('update:show', false);
    setTimeout(() => {
      formref.value.resetFields();
    }, 200);
  };
  const handleAssigneeChange = (val) => {
    formData.fields.assignee.name = val;
    console.log('accountId:', val, formData.fields.assignee.name);
  };
  const handleUserChange = (val, key) => {
    formData.fields[key].name = val;
  };
  const submitFormData = async () => {
    const data = {
      resourceID: props.projectId,
      id: props.integrationId,
      violationID: props.violationId,
    };
    const params: any = pickBy({ ...formData, ...data }, (val) => !!val);
    let res = {};
    if (props.ticketType === 'batch') {
      res = await submitRepoTicket(params);
    } else {
      const query: any = omit(params, ['resourceID']);
      res = await submitViolationTicket(query);
    }
    return res as { data: any };
  };
  const handleOk = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        console.log('formdata====', formData);
        submitLoading.value = true;
        formData.severity =
          props.violationSeverity || (join(formData.severity, ',') as any);
        const { data } = await submitFormData();
        submitLoading.value = false;
        emit('confirm');
        emit('update:show', false);
        if (data?.status === 0) {
          Message.error({
            content: get(data, 'message'),
            duration: 3000,
          });
        } else if (data?.status === 2) {
          Message.info({
            content: t('projects.modal.jira.repeat'),
            duration: 3000,
          });
        } else if (data?.status === 3) {
          Message.info({
            content: t('projects.modal.jira.dismissed'),
            duration: 3000,
          });
        } else if (data?.status === 1 && props.ticketType === 'batch') {
          Message.success({
            content: t('projects.modal.jira.success', {
              count: get(data, 'data.reportNum'),
            }),
            duration: 3000,
          });
        } else {
          Message.success({
            content: t('projects.modal.jira.done'),
            duration: 3000,
          });
        }
      } catch (error) {
        submitLoading.value = false;
        console.log(error);
      }
    }
  };

  const getUserList = async () => {
    const params = {
      id: props.integrationId,
    };
    const { data } = await queryUserList(params);
    userList.value = filter(data, (item) => {
      return hasIn(item, 'accountType')
        ? item.accountType === 'atlassian'
        : true;
    }).map((sItem) => {
      sItem.id = sItem.accountId;
      sItem.value = sItem.accountId;
      sItem.name = sItem.name || sItem.displayName;
      return sItem;
    });
  };
  const getJiraOptions = async () => {
    try {
      const params = {
        id: props.integrationId,
      };
      const { data } = await queryJiraDataList(params);
      optionList.value = map(data, (item) => {
        return {
          label: item.name,
          value: item.id,
          key: item.key,
          // value: item.id,
        };
      });
    } catch (error) {
      optionList.value = [];
      console.log(error);
    }
  };
  // set the field form component
  const getFieldType = (schema) => {
    const isSystem = hasIn(schema, 'system');
    const result = {
      fieldType: '',
      comType: '',
    };
    if (isSystem) {
      result.fieldType = 'system';
      result.comType = systemComTypeMap[schema.system] || get(schema, 'type');
    } else {
      const custom = split(get(schema, 'custom'), ':') || [];
      result.fieldType = 'custom';
      result.comType = custom.pop() || get(schema, 'type');
    }
    const data = find(comTypeList, (item) => item.type === result.comType);
    result.comType = data?.comType || 'text';
    return result;
  };
  // set form fields value format
  const setFormFields = () => {
    const fieldsObj: Record<string, any> = {};
    if (customFieldsList.value.length) {
      each(customFieldsList.value, (item) => {
        if (systemFieldsMap[item.key]) {
          fieldsObj[item.key] = systemFieldsMap[item.key];
        } else if (item.allowedValues?.length) {
          fieldsObj[item.key] =
            get(item, 'schema.type') === 'array' ? { id: [] } : { id: '' };
        } else {
          fieldsObj[item.key] = get(item, 'schema.type') === 'array' ? [] : '';
        }
      });
    }
    formData.fields = pick(formData.fields, [
      'project',
      'assignee',
      'issuetype',
    ]);
    formData.fields = { ...formData.fields, ...cloneDeep(fieldsObj) };
  };
  // get custom fields
  const handleIssueTypeChnage = (value) => {
    const issueTypeData = find(
      issueTypeList.value,
      (item) => item.id === value
    );
    const fieldsData = get(issueTypeData, 'fields') || ({} as CustomField);
    const list: CustomField[] = [];
    each(keys(fieldsData), (key) => {
      if (get(fieldsData, `${key}.required`) || requiredFields.includes(key)) {
        list.push(fieldsData[key]);
      }
    });
    const arr = map(list, (sItem) => {
      return {
        ...sItem,
        key: sItem.key || sItem.fieldId,
        allowedValues:
          getFieldType(sItem.schema).comType === 'userSelect'
            ? userList
            : sItem.allowedValues,
        ...getFieldType(sItem.schema),
      };
    }).filter((item) => {
      return (
        !includes(staticFields, item.key) && !includes(filterFields, item.key)
      );
    });
    customFieldsList.value = [].concat(arr as never[]);
    setFormFields();
    console.log('customFieldsList===', customFieldsList.value, formData);
  };
  const handleProjectChange = async (val) => {
    try {
      const project = find(optionList.value, (item) => item.value === val);
      formData.fields.project.key = project?.key;
      formData.fields.issuetype.id = '';
      const params = {
        id: props.integrationId,
        projectID: formData.fields.project.id,
        extract: 'issueTypes',
      };
      typeLoading.value = true;
      const { data } = await queryJiraIssueType(params);
      const list = get(data, 'projects') || [];
      const projectData = find(
        list,
        (item) => item.id === formData.fields.project.id
      );
      issueTypeList.value =
        get(projectData, 'issuetypes') ||
        ([] as Array<{ id: string; name: string }>);
      typeLoading.value = false;
      handleIssueTypeChnage('');
    } catch (error) {
      console.log(error);
      typeLoading.value = false;
    }
  };
  const fetchData = () => {
    try {
      loading.value = true;
      Promise.all([getJiraOptions(), getUserList()])
        .then((res) => {
          loading.value = false;
        })
        .finally(() => {
          loading.value = false;
        });
    } catch (error) {
      loading.value = false;
      console.log(error);
    }
  };
  const handleBeforeClose = () => {
    formref.value.resetFields();
    formref.value.clearValidate();
    submitLoading.value = false;
    customFieldsList.value = [];
    emit('confirm');
  };
  const handleBeforeOpen = () => {
    fetchData();
  };
</script>

<style lang="less" scoped></style>

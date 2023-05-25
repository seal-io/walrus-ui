<template>
  <div class="detail-info">
    <a-spin :loading="loading" style="width: 100%">
      <GroupTitle
        iconed
        :title="$t('applications.applications.detail.basic')"
        style="margin-top: 20px"
      >
      </GroupTitle>
      <BasicView
        v-if="pageAction === 'view'"
        ref="basicform"
        v-model:data-info="defaultBasicInfo"
      ></BasicView>
      <BasicInfo
        v-else
        ref="basicform"
        :data-info="appInfo"
        :default-value="defaultBasicInfo"
      ></BasicInfo>
      <GroupTitle
        iconed
        :title="$t('applications.applications.detail.configuration')"
        style="margin-top: 20px"
      ></GroupTitle>
      <div>
        <div style="margin-bottom: 20px; color: var(--color-text-2)">
          <span>{{ $t('applications.applications.modules.title') }}</span>
        </div>
        <div class="content">
          <instanceThumb
            v-for="(item, index) in appInfo.modules"
            :key="item?.module?.id"
            :active="item?.module?.id === active"
            :data-info="item"
            :size="[200, 100]"
            :actions="pageAction === 'edit' ? moduleActions : []"
            @edit="handleEditModule(item)"
            @delete="handleDeleteModule(index)"
            @click="handleClickModule(item)"
          >
            <template #description>
              <div
                style="
                  overflow: hidden;
                  font-weight: 700;
                  white-space: nowrap;
                  text-align: center;
                  text-overflow: ellipsis;
                "
                >{{ item?.module?.id }}</div
              >
            </template>
          </instanceThumb>
          <a-tooltip
            v-if="pageAction === 'edit'"
            :content="$t('applications.applications.modules.button')"
          >
            <thumbButton :size="60" @click="handleAddModule"></thumbButton>
          </a-tooltip>
        </div>
      </div>
      <div class="variable-wrapper">
        <div class="var-title">
          <span>{{ $t('applications.applications.variables.title') }}</span>
        </div>
        <div
          v-if="variableList.length && pageAction === 'edit'"
          class="var-item var-item-title"
        >
          <span
            class="label"
            :style="setPropertyStyle({ 'flex-basis': '200px' })"
            >{{ $t('common.input.key') }}</span
          >
          <span
            class="label"
            :style="setPropertyStyle({ 'flex-basis': '150px' })"
          >
            <span class="holder"></span>
            <span>{{ $t('common.input.type') }}</span>
          </span>
          <span class="label">
            <span class="holder"></span>
            <span>{{ $t('common.input.value') }}</span>
          </span>
          <span class="btn"></span>
        </div>
        <div v-if="pageAction === 'edit'">
          <div
            v-for="(sItem, sIndex) in variableList"
            :key="sIndex"
            class="var-item"
          >
            <xInputGroup
              v-model:dataKey="sItem.key"
              v-model:dataValue="sItem.type"
              v-model:dataDesc="sItem.value"
              :data-item="sItem"
              :data-default="sItem.default"
              :trigger-validate="triggerValidate"
              show-description
              always-delete
              width="100%"
              class="group-item"
              :label-list="variableList"
              :position="sIndex"
              token="variable"
              :wrap-align="
                sItem.type === unknowType.dynamic ? 'flex-start' : 'center'
              "
              separator=""
              :placeholder="{
                value: $t('common.input.type'),
                description: $t('common.input.value'),
                key: $t('common.input.key')
              }"
              lang="yaml"
              :show-gutter="true"
              :components="{
                string: 'Input',
                number: 'InputNumber',
                bool: 'Checkbox',
                dynamic: 'AceEditor'
              }"
              :value-options="variableTypeList"
              @keyChange="handleKeyChange"
              @add="handleAddVariables"
              @delete="handleDeleteVariable(sIndex)"
            >
              <template #descExtra>
                <div v-if="sItem.error" class="error-msg">{{
                  sItem.error
                }}</div>
              </template>
            </xInputGroup>
          </div>
        </div>

        <a-tooltip
          v-if="!variableList.length && pageAction === 'edit'"
          :content="$t('applications.applications.variables.button')"
        >
          <thumbButton
            :size="30"
            font-size="16px"
            @click="handleAddVariables"
          ></thumbButton>
        </a-tooltip>
        <DescriptionTable
          v-if="variableList.length && pageAction === 'view'"
          style="width: 625px"
          :data-list="variableList"
        >
          <template #value="{ row, value }">
            <a-textarea
              v-if="_.get(row, 'type') === unknowType.dynamic && row.value"
              readonly
              :auto-size="{ maxRows: 10 }"
              :model-value="row.value"
            ></a-textarea>
            <AutoTip
              v-else
              style="width: 350px"
              :tooltip-props="{
                content: value
              }"
            >
              <span>{{ value }}</span>
            </AutoTip>
          </template>
        </DescriptionTable>
      </div>
    </a-spin>
    <EditPageFooter v-if="pageAction === 'edit'">
      <template #save>
        <a-button
          v-if="
            userStore.hasProjectResourceActions({
              projectID,
              resource: Resources.Applications,
              actions: ['PUT']
            }) ||
            userStore.hasProjectResourceActions({
              projectID,
              resource: Resources.Applications,
              actions: ['POST']
            })
          "
          type="primary"
          class="cap-title cancel-btn"
          :loading="submitLoading"
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
    <editModule
      v-model:show="showEditModal"
      v-model:action="moduleAction"
      :data-info="moduleInfo"
      :templates="moduleTemplates"
      :modules="appInfo.modules"
      :all-module-versions="allModuleVersions"
      @reset="handleResetModuleInfo"
      @save="handleSaveModule"
    ></editModule>
    <viewModule
      v-model:show="showViewModal"
      action="edit"
      :data-info="viewModuleInfo"
      :templates="moduleTemplates"
      :all-module-versions="allModuleVersions"
    ></viewModule>
  </div>
</template>

<script lang="ts" setup>
  import { Resources } from '@/permissions/resources';
  import { useUserStore, useTabBarStore } from '@/store';
  import { reactive, ref, computed, provide, inject, toRaw } from 'vue';
  import { onBeforeRouteLeave } from 'vue-router';
  import GroupTitle from '@/components/group-title/index.vue';
  import _ from 'lodash';
  import useCallCommon from '@/hooks/use-call-common';
  import thumbButton from '@/components/buttons/thumb-button.vue';
  import { execSucceed, deleteModal } from '@/utils/monitor';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import {
    queryModules,
    queryModulesAllVersions
  } from '@/views/operation-hub/templates/api';
  import DescriptionTable from '@/components/description-table/index.vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import xInputGroup from '@/components/form-create/custom-components/x-input-group.vue';
  import {
    yaml2Json,
    json2Yaml,
    unknowType,
    validateYaml
  } from '@/components/form-create/config/yaml-parse';
  import { CustomAttrbute } from '@/views/operation-hub/connectors/config/interface';
  import {
    TemplateRowData,
    ModuleVersionData
  } from '@/views/operation-hub/templates/config/interface';
  import { querySecrets } from '@/views/application-management/secret/api';
  import instanceThumb from '../instance-thumb.vue';
  import editModule from './edit-module.vue';
  import viewModule from './view-module.vue';
  import BasicInfo from './basic-info.vue';
  import BasicView from './basic-view.vue';
  import { AppFormData, AppModule } from '../../config/interface';
  import { moduleActions, variableTypeList } from '../../config';
  import {
    createApplication,
    queryItemApplication,
    updateApplication,
    queryProjectSecrets
  } from '../../api';

  const tabBarStore = useTabBarStore();
  const { router, route } = useCallCommon();
  const basicform = ref();
  const triggerValidate = ref(false);
  const loading = ref(false);
  const appInfo = reactive({
    name: '',
    description: '',
    labels: {},
    variables: [],
    project: {
      id: route.params.projectId
    },
    environment: {
      id: 'test'
    },
    modules: []
  }) as AppFormData;
  const userStore = useUserStore();
  const pageAction = inject('pageAction', ref('edit'));
  const emits = defineEmits(['save', 'cancelEdit']);
  const submitLoading = ref(false);
  const id = route.query.id as string;
  const projectID = route.params.projectId;
  const cloneId = route.query.cloneId as string;
  const moduleTemplates = ref<TemplateRowData[]>([]);
  const active = ref('');
  const moduleInfo = ref({}); // item module
  const viewModuleInfo = ref({});
  const defaultBasicInfo = ref({});
  const moduleAction = ref('create');
  const showViewModal = ref(false);
  const showEditModal = ref(false);
  const projectSecretList = ref<{ name: string }[]>([]);
  const appModuleVersions = ref<any>({});
  const allModuleVersions = ref<ModuleVersionData[]>([]);
  const appModules = ref<AppModule[]>([]);
  const completeData = ref<Record<string, any>>({});
  const triggerModule = ref(false);
  const variableList = ref<CustomAttrbute[]>([]);
  let completeDataSetter: any = {};
  let copyFormData: any = {};

  provide('completeData', completeData);

  const setPropertyStyle = (style) => {
    return {
      'display': 'flex',
      'align-items': 'center',
      ...style
    };
  };
  const setVariableList = () => {
    variableList.value = _.map(appInfo.variables || [], (item) => {
      let val = item.default;
      if (item.type === 'dynamic') {
        val = json2Yaml(val);
      }
      return {
        key: item.name,
        value: val,
        type: item.type,
        default: val,
        style: {
          key: setPropertyStyle({ 'flex-basis': '200px' }),
          value: setPropertyStyle({ 'flex-basis': '150px' })
        }
      };
    });
  };
  const setAppInfoVariables = () => {
    appInfo.variables = _.map(variableList.value, (item) => {
      let val = item.value;
      if (item.type === 'dynamic') {
        val = yaml2Json(val);
      }
      if (item.type === 'bool') {
        val = !!val;
      }
      if (item.type === 'number') {
        val = _.isNumber(val) ? val : '';
      }
      return {
        name: item.key,
        type: item.type,
        default: val
      };
    });
  };
  const handleEditModule = (item) => {
    moduleAction.value = 'edit';
    moduleInfo.value = item;
    setTimeout(() => {
      showEditModal.value = true;
    }, 100);
  };

  const handleAddModule = () => {
    moduleAction.value = 'create';
    setTimeout(() => {
      showEditModal.value = true;
    }, 150);
  };
  const handleClickModule = (data) => {
    if (pageAction.value === 'edit') {
      handleEditModule(data);
      return;
    }
    viewModuleInfo.value = data;
    setTimeout(() => {
      showViewModal.value = true;
    }, 150);
  };

  // modules options
  const getModules = async () => {
    try {
      const params = {
        page: -1
      };
      const { data } = await queryModules(params);
      moduleTemplates.value = data?.items || [];
    } catch (error) {
      moduleTemplates.value = [];
      console.log(error);
    }
  };

  const handleAddVariables = () => {
    console.log('adad');
    variableList.value.push({
      key: '',
      value: '',
      default: '',
      type: 'string',
      style: {
        key: setPropertyStyle({ 'flex-basis': '200px' }),
        value: setPropertyStyle({ 'flex-basis': '150px' })
      }
    });
  };
  // apply for edit module config
  const getProjectSecrets = async () => {
    try {
      const params = {
        page: -1,
        projectID: route.params.projectId as string,
        withGlobal: true
      };
      const { data } = await querySecrets(params);
      projectSecretList.value = data.items || [];
    } catch (error) {
      projectSecretList.value = [];
      console.log(error);
    }
  };
  // app module version has added; it's map to a {name: <moduleName>, type: <moduleType>, version: <moduleVersion>}
  const getAppModulesVersionMap = () => {
    appModules.value = _.get(appInfo, 'modules') || [];
    const list = _.map(appModules.value, (item) => {
      return {
        name: item.name,
        type: item.module.id,
        version: item.version
      };
    });
    return list;
  };

  // apply for edit module config
  const getModulesVersions = async () => {
    try {
      const params = {
        moduleID: _.uniq(
          _.map(moduleTemplates.value, (item) => {
            return item.id;
          })
        )
      };
      if (!params.moduleID.length) {
        return;
      }
      const { data } = await queryModulesAllVersions(params);
      allModuleVersions.value = data?.items || [];
      console.log('allModuleVersions======', allModuleVersions.value);
    } catch (error) {
      allModuleVersions.value = [];
      console.log(error);
    }
  };

  const setAddedMoudleCompleteData = () => {
    const addedVersionMap = getAppModulesVersionMap();
    appModuleVersions.value = _.reduce(
      addedVersionMap,
      (obj, item) => {
        // The version corresponding to the module that has been added
        const addedModule = _.find(allModuleVersions.value || [], (s) => {
          return item.type === s.module.id && s.version === item.version;
        });
        const k = item.name;
        obj[k] = [
          ..._.map(_.get(addedModule, 'schema.outputs') || [], (o) => {
            return {
              label: o.description,
              value: o.name
            };
          })
        ];
        return obj;
      },
      {}
    );
  };
  const getApplicationDetail = async () => {
    if (!id && !cloneId) return;
    const queryId = id || cloneId;
    try {
      const params = {
        id: queryId
      };
      const { data } = await queryItemApplication(params);
      if (cloneId) {
        data.name = `${data.name}-clone`;
      }
      _.assignIn(appInfo, data);
      appModules.value = _.get(appInfo, 'modules') || [];
      appInfo.modules = data.modules || [];
      appInfo.variables = data.variables || [];
      appInfo.labels = data.labels || {};
      defaultBasicInfo.value = _.pick(appInfo, [
        'name',
        'description',
        'labels',
        'createTime',
        'updateTime'
      ]);
      copyFormData = _.cloneDeep(appInfo);
      setVariableList();
      console.log('appInfo==11=', appInfo);
    } catch (error) {
      console.log(error);
    }
  };
  const setVariablesCompleteData = () => {
    const variables = _.reduce(
      variableList.value || [],
      (obj, item) => {
        if (item.key) {
          obj[item.key] = '';
        }
        return obj;
      },
      {}
    );
    return variables;
  };
  const setSecretCompleteData = () => {
    const secrets = _.reduce(
      projectSecretList.value,
      (obj, item) => {
        obj[item.name] = '';
        return obj;
      },
      {}
    );
    return secrets;
  };
  const setCompleteData = () => {
    completeDataSetter = {
      updateSecretCompleteData() {
        const secrets = setSecretCompleteData();
        completeData.value.secret = { ...secrets };
      },
      updateModuleCompleteData() {
        setAddedMoudleCompleteData();
        completeData.value.module = { ...appModuleVersions.value };
      },
      updateVariablesCompleteData() {
        const variables = setVariablesCompleteData();
        completeData.value.var = { ...variables };
      }
    };
    completeDataSetter?.updateSecretCompleteData?.();
    completeDataSetter?.updateModuleCompleteData?.();
    completeDataSetter?.updateVariablesCompleteData?.();
  };
  const handleKeyChange = () => {
    completeDataSetter?.updateVariablesCompleteData?.();
  };
  const handleDeleteVariable = (index) => {
    variableList.value.splice(index, 1);
    completeDataSetter?.updateVariablesCompleteData?.();
  };
  const validateVariabels = () => {
    _.each(variableList.value, (item) => {
      if (item.type === unknowType.dynamic) {
        const result = validateYaml(item.value);
        if (!result.empty && result.error) {
          item.error = result.error.message;
        } else {
          item.error = '';
        }
      } else {
        item.error = '';
      }
    });
    triggerValidate.value = _.some(
      variableList.value,
      (item) => !item.key || item.error
    );
    return triggerValidate.value;
  };
  const handleOk = async () => {
    const validateVarRes = validateVariabels();
    const result = await basicform.value.getFormData();
    triggerModule.value = true;

    if (!result || validateVarRes) {
      return;
    }
    try {
      setAppInfoVariables();
      const params = {
        ...appInfo,
        ...result,
        variables: _.filter(variableList.value, (item) => item.key).map(
          (sItem: any) => {
            let val = sItem.value;
            if (sItem.type === 'dynamic') {
              val = yaml2Json(val);
            }
            if (sItem.type === 'bool') {
              val = !!val;
            }
            if (sItem.type === 'number') {
              val = _.isNumber(val) ? val : '';
            }
            return {
              name: sItem.key,
              type: sItem.type,
              default: val
            };
          }
        )
      };
      defaultBasicInfo.value = _.pick(params, [
        'name',
        'description',
        'labels',
        'createTime',
        'updateTime'
      ]);
      console.log('submit:', appInfo, result);
      submitLoading.value = true;
      const res = { id: '' };
      copyFormData = _.cloneDeep(params);
      if (id) {
        await updateApplication(params);
      } else {
        console.log('submit:', params);
        const { data } = await createApplication(params);
        res.id = data.id;
        tabBarStore.deleteTag(0, {
          title: '',
          name: 'ApplicationsList',
          fullPath: ''
        });
      }
      submitLoading.value = false;
      setVariableList();
      execSucceed();
      emits('save', res.id);
    } catch (error) {
      submitLoading.value = false;
      console.log(error);
    }
  };
  const cancelCallback = () => {
    if (pageAction.value === 'edit' && route.params.action === 'view') {
      emits('cancelEdit');
      // reset the editing data
      triggerValidate.value = false;
      getApplicationDetail();
      return;
    }
    router.back();
  };
  const handleCancel = async () => {
    // setAppInfoVariables();
    const appInfoData = {
      ...appInfo,
      ...(await basicform.value.getFormData())
    };
    if (!_.isEqual(copyFormData, appInfoData)) {
      beforeLeaveCallback({
        isCancel: true,
        onOk: () => {
          copyFormData = _.cloneDeep(appInfoData);
          cancelCallback();
        }
      });
    } else {
      cancelCallback();
    }
  };
  const handleDeleteModule = (index) => {
    deleteModal({
      onOk() {
        appInfo.modules.splice(index, 1);
        completeDataSetter?.updateModuleCompleteData?.();
      },
      content: `applications.applications.module.delete`
    });
  };
  const handleResetModuleInfo = () => {
    moduleInfo.value = {};
  };
  const handleSaveModule = async (data) => {
    console.log('saveModule===', data, moduleAction.value);
    if (moduleAction.value === 'create') {
      appInfo.modules.push({
        ..._.cloneDeep(data)
      });
      completeDataSetter?.updateModuleCompleteData?.();
    } else {
      _.assignIn(moduleInfo.value, data);
    }
  };
  onBeforeRouteLeave(async (to, from) => {
    setAppInfoVariables();
    const appInfoData = {
      ...appInfo,
      ...(await basicform.value.getFormData())
    };

    if (!_.isEqual(copyFormData, appInfoData)) {
      beforeLeaveCallback({
        to,
        from,
        onOk: () => {
          copyFormData = _.cloneDeep(appInfoData);
          router.push({
            name: to.name as string
          });
        }
      });
      return false;
    }
    return true;
  });
  const init = async () => {
    try {
      loading.value = true;
      await Promise.all([getModules(), getApplicationDetail()]);
      await Promise.all([getModulesVersions(), getProjectSecrets()]);
      loading.value = false;
      setCompleteData();
      setTimeout(() => {
        copyFormData = _.cloneDeep(appInfo);
      }, 100);
    } catch (error) {
      loading.value = false;
    }
  };
  init();
</script>

<style lang="less" scoped>
  @import url('../style/app.less');

  .detail-info {
    .content {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      min-height: 110px;
      max-height: 300px;
      padding-top: 2px;
      padding-left: 2px;
      overflow-y: auto;

      .thumb-item {
        margin-right: 12px;
        margin-bottom: 12px;
      }
    }

    .var-title {
      margin-top: 10px;
      margin-bottom: 20px;
      color: var(--color-text-2);
    }

    .var-item {
      width: 70%;

      &:last-child {
        margin-bottom: 0;
      }

      &.var-item-title {
        display: flex;
        margin-bottom: 10px;

        .label {
          font-weight: 500;
        }

        .holder {
          padding: 0 4px;
        }

        .btn {
          flex-basis: 54px;
        }
      }
    }
  }
</style>

<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :menu="{ icon: 'icon-apps-fill', iconfont: true, label: title }"
      ></Breadcrumb>
    </BreadWrapper>
    <ComCard top-gap>
      <a-form ref="formref" :model="formData" auto-label-width>
        <a-form-item
          :label="$t('common.table.name')"
          field="name"
          :disabled="pageAction === 'edit' && !!id"
          :rules="[
            {
              required: true,
              message: $t('applications.module.rule.name.tips')
            },
            {
              match: validateAppNameRegx,
              message: $t('applications.module.rule.name.tips')
            },
            {
              validator: validateNameuniq,
              message: $t('applications.applications.rule.modules.name')
            }
          ]"
        >
          <a-input
            v-model="formData.name"
            :max-length="30"
            show-word-limit
          ></a-input>
          <template #extra>
            <span class="tips">{{
              $t('applications.module.rule.name.tips')
            }}</span>
          </template>
        </a-form-item>
        <a-form-item
          id="moduleId"
          :label="$t('applications.applications.table.module')"
          field="template.id"
          :disabled="pageAction === 'edit' && !!id"
          :rules="[
            {
              required: true,
              message: $t('applications.applications.rules.modules')
            }
          ]"
        >
          <div>
            <a-select
              v-model="formData.template.id"
              allow-search
              @change="handleModuleChange"
            >
              <a-option
                v-for="item in templateList"
                :key="item.id"
                :value="item.id"
                >{{ item.id }}</a-option
              >
            </a-select>
          </div>
        </a-form-item>
        <a-form-item
          :label="$t('applications.applications.history.version')"
          field="templateVersion"
          :rules="[
            {
              required: true,
              message: $t('applications.applications.rules.versions')
            }
          ]"
        >
          <div>
            <a-select
              v-model="formData.templateVersion"
              @change="handleVersionChange"
            >
              <a-option
                v-for="item in templateVersionList"
                :key="item.id"
                :value="item.value"
                >{{ item.label }}</a-option
              >
            </a-select>
          </div>
        </a-form-item>
      </a-form>
    </ComCard>
    <a-divider style="margin: 0; border-radius: 1px" :size="4"></a-divider>
    <ComCard>
      <div
        style="display: flex; justify-content: flex-start; margin-bottom: 10px"
      >
        <GroupTitle
          iconed
          :bordered="false"
          style="margin-bottom: 0"
          :title="$t('applications.applications.detail.configuration')"
        >
        </GroupTitle>
        <div>
          <a-tooltip style="width: 500px">
            <template #content>
              <div>
                <div>{{
                  $t('applications.applications.modules.params.title')
                }}</div>
                <div>{{
                  $t('applications.applications.modules.params.tips2')
                }}</div>
                <div>{{
                  $t('applications.applications.modules.params.tips3')
                }}</div>
              </div>
            </template>
            <icon-question-circle class="mleft-5" />
          </a-tooltip>
        </div>
      </div>
      <div class="variables">
        <a-tabs
          v-if="formTabs.length > 1"
          class="page-line-tabs"
          :active-key="activeKey"
          @change="handleTabChange"
        >
          <a-tab-pane
            v-for="(group, index) in formTabs"
            :key="`schemaForm${index}`"
            :title="variablesGroup[group]?.label"
          >
            <formCreate
              :ref="(el: refItem) => setRefMap(el, `schemaForm${index}`)"
              :form-id="`schemaForm${index}`"
              layout="vertical"
              action="post"
              api=""
              :show-footer="false"
              :submit="() => {}"
              :model="variablesGroupForm[group]?.attributes"
              :form-schema="variablesGroup[group]?.variables"
            >
            </formCreate>
          </a-tab-pane>
        </a-tabs>
        <formCreate
          v-if="formTabs.length < 2"
          ref="schemaForm"
          form-id="schemaForm"
          layout="vertical"
          action="post"
          api=""
          :show-footer="false"
          :submit="() => {}"
          :model="variablesGroupForm[defaultGroupKey]?.attributes"
          :form-schema="variablesGroup[defaultGroupKey]?.variables"
        >
        </formCreate>
      </div>
      <EditPageFooter v-if="pageAction === 'edit'">
        <template #save>
          <a-button
            :loading="submitLoading"
            type="primary"
            class="cap-title cancel-btn"
            @click="handleOk"
            >{{ $t('common.button.save') }}</a-button
          >
        </template>
        <template #cancel>
          <a-button
            :type="'outline'"
            class="cap-title cancel-btn"
            @click="handleCancel"
            >{{ $t('common.button.cancel') }}</a-button
          >
        </template>
      </EditPageFooter>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import _, {
    get,
    find,
    cloneDeep,
    each,
    assignIn,
    pull,
    set,
    keys,
    reduce,
    map,
    includes,
    pickBy,
    toString,
    filter,
    split
  } from 'lodash';
  import {
    ref,
    reactive,
    PropType,
    ComponentPublicInstance,
    computed,
    provide,
    watch,
    nextTick
  } from 'vue';
  import { onBeforeRouteLeave } from 'vue-router';
  import useCallCommon from '@/hooks/use-call-common';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import formCreate from '@/components/form-create/index.vue';
  import GroupTitle from '@/components/group-title/index.vue';
  import {
    TemplateRowData,
    ModuleVersionData
  } from '@/views/operation-hub/templates/config/interface';
  import { validateAppNameRegx } from '@/views/config';
  import usePageAction from '@/hooks/use-page-action';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import {
    createApplication,
    upgradeApplicationInstance,
    queryItemApplicationInstances
  } from '../api';
  import useTemplatesData from '../hooks/use-templates-data';

  interface Group {
    variables: object[];
    label: string;
  }
  type refItem = Element | ComponentPublicInstance | null;
  interface ModuleVersion extends ModuleVersionData {
    label: string;
    value: string;
  }
  const {
    completeData,
    initCompleteData,
    completeDataSetter,
    serviceDataList,
    templateList,
    allTemplateVersions
  } = useTemplatesData();
  const { pageAction, handleEdit } = usePageAction();
  const defaultGroupKey = '_default_default_';
  const { route, router, t } = useCallCommon();
  const formref = ref();
  const loading = ref(false);
  const activeKey = ref('schemaForm0');
  const schemaForm = ref();
  const submitLoading = ref(false);
  const moduleInfo = ref<any>({});
  const serviceInfo = ref<any>({});
  const variablesGroup = ref<any>({});
  const variablesGroupForm = ref<any>({});
  const templateVersionList = ref<ModuleVersion[]>([]);
  const moduleVersionFormCache = ref({});

  const id = route.query.id as string;
  let refMap: Record<string, refItem> = {};
  let copyFormData: any = {};
  const versionMap = ref({ nv: '', ov: '' });
  const formData = reactive({
    projectID: route.params.projectId,
    environment: {
      id: route.params.environmentId
    },
    name: '',
    template: { id: '' },
    templateVersion: '',
    application: {
      id: route.query.id || ''
    },
    attributes: {}
  });

  provide('showHintInput', true);
  provide('completeData', completeData);

  const formTabs = computed(() => {
    const list = keys(variablesGroup.value);
    if (includes(list, defaultGroupKey)) {
      const res = [defaultGroupKey, ...pull(list, defaultGroupKey)];
      return res;
    }
    return list;
  });
  const title = computed(() => {
    if (!id) {
      return t('applications.applications.create');
    }
    if (id && pageAction.value === 'edit') {
      return t('applications.applications.edit');
    }
    return t('applications.applications.detail');
  });
  const getContainer = (id) => {
    return document.getElementById(id);
  };
  const cancelCallback = () => {
    if (pageAction.value === 'edit' && route.params.action === 'view') {
      pageAction.value = 'view';
      // get detail
      return;
    }
    router.back();
  };
  const handleCancel = () => {
    if (!_.isEqual(copyFormData, formData)) {
      beforeLeaveCallback({
        isCancel: true,
        onOk: () => {
          copyFormData = cloneDeep(formData);
          cancelCallback();
        }
      });
    } else {
      cancelCallback();
    }
  };

  const validateNameuniq = (val, callback) => {
    if (pageAction.value === 'edit') {
      callback();
      return;
    }
    const data = find(
      serviceDataList.value,
      (item) => get(item, 'name') === val
    );
    if (data) {
      callback(t('applications.applications.rule.modules.name'));
      return;
    }
    callback();
  };
  const setRefMap = (el: refItem, name) => {
    if (el) {
      refMap[`${name}`] = el;
    }
  };
  const getServiceItemInfo = async () => {
    if (!route.query.id) return;
    try {
      const params = {
        id: route.query.id,
        projectID: route.params.projectId
      };
      const { data } = await queryItemApplicationInstances(params);
      serviceInfo.value = data;
    } catch (error) {
      serviceInfo.value = {};
      console.log(error);
    }
  };
  const handleTabChange = (val) => {
    activeKey.value = val;
  };
  const getInitialValue = (item, sourceData, action) => {
    let initialValue = item.default;
    if (
      get(moduleVersionFormCache.value, formData.templateVersion) ||
      action === 'edit'
    ) {
      initialValue = get(sourceData, `attributes.${item.name}`);
    }
    return initialValue;
  };
  // get set: edit create
  const generateVariablesGroup = (type) => {
    refMap = {};
    variablesGroup.value = {};
    variablesGroupForm.value = {};
    const sourceData = {
      attributes: {
        ...cloneDeep(get(serviceInfo.value, 'attributes')),
        ...get(moduleVersionFormCache.value, formData.templateVersion)
      }
    };
    console.log('sourceData===', sourceData);
    const variablesList = filter(
      get(moduleInfo.value, 'variables'),
      (v) => !v.hidden
    );
    each(variablesList, (item) => {
      const initialValue = getInitialValue(item, sourceData, type);
      const group = get(split(item.group, '/'), '0');
      if (group) {
        if (!variablesGroup.value[group]) {
          variablesGroup.value[group] = {
            variables: [],
            label: group
          };
          variablesGroup.value[group].variables.push(item);
        } else {
          variablesGroup.value[group].variables.push(item);
        }

        set(
          variablesGroupForm.value,
          `${group}.attributes.${item.name}`,
          initialValue
        );
      } else {
        if (!variablesGroup.value[defaultGroupKey]) {
          variablesGroup.value[defaultGroupKey] = {
            variables: [],
            label: 'Basic'
          };
        }
        variablesGroup.value[defaultGroupKey].variables.push(item);
        set(
          variablesGroupForm.value,
          `${defaultGroupKey}.attributes.${item.name}`,
          initialValue
        );
      }
    });
    console.log(
      'variablesGroupForm===',
      variablesGroup.value,
      variablesGroupForm.value
    );
  };
  const setFormData = (schemas) => {
    const variablesList = filter(get(schemas, 'variables'), (v) => {
      return !v.hidden;
    });
    each(variablesList, (item) => {
      formData.attributes[item.name] = item.default;
    });
  };
  //  change module ...
  const getModuleSchemaById = () => {
    const moduleTemplate = find(
      templateVersionList.value,
      (item) => item.template.id === formData.template.id
    );
    return moduleTemplate;
  };
  // change version ...
  const getModuleSchemaByVersion = () => {
    const moduleTemplate = find(
      templateVersionList.value,
      (item) => item.value === formData.templateVersion
    );
    return moduleTemplate;
  };
  const getModuleVersionList = async () => {
    try {
      const list = filter(
        allTemplateVersions.value,
        (item) => item.template.id === formData.template.id
      );
      templateVersionList.value = map(list, (item) => {
        return {
          ...cloneDeep(item),
          label: item.version,
          value: item.version
        };
      });
    } catch (error) {
      console.log(error);
    }
  };
  const clearFormValidStatus = () => {
    keys(refMap).map(async (key) => {
      const refEL = refMap[key];
      refEL?.clearFormValidStatus?.();
    });
  };
  // get group form data
  const getRefFormData = async () => {
    const resultList: any[] = [];
    console.log('refMap==1212====', keys(refMap));
    await Promise.all(
      keys(refMap).map(async (key) => {
        const refEL = refMap[key];
        const moduleForm = await refEL?.getFormData?.();
        resultList.push({
          tab: key,
          formData: moduleForm
        });
      })
    );
    return resultList;
  };
  // cache the user inputs when change the module version
  const setModuleVersionFormCache = async () => {
    console.log('versionMap==3=', versionMap.value);
    if (!versionMap.value.ov) return;
    const moduleFormList = await getRefFormData();
    const inputs = reduce(
      moduleFormList,
      (obj, s) => {
        obj = {
          ...obj,
          ...s.formData
        };
        return obj;
      },
      {}
    );
    moduleVersionFormCache.value[versionMap.value.ov] = {
      ...pickBy(inputs, (val) => toString(val))
    };
    console.log('moduleVersionFormCache===', moduleVersionFormCache.value);
  };
  const execVersionChangeCallback = async () => {
    await setModuleVersionFormCache();
    const moduleData = getModuleSchemaByVersion();
    moduleInfo.value = cloneDeep(get(moduleData, 'schema')) || {};
    formData.application = { id: '' };
    formData.attributes = {};
    console.log('version args...', moduleVersionFormCache.value);

    clearFormValidStatus();
    generateVariablesGroup(pageAction.value);
  };
  const handleVersionChange = () => {
    setTimeout(() => {
      execVersionChangeCallback();
    }, 100);
  };
  // module change: exec version change
  const handleModuleChange = async (val) => {
    await getModuleVersionList();
    formData.templateVersion = get(templateVersionList.value, '0.version');
    moduleVersionFormCache.value = {};
    versionMap.value = { ov: '', nv: '' };
    handleVersionChange();
    nextTick(() => {
      handleTabChange('schemaForm0');
    });
  };

  const handleOk = async () => {
    const res = await formref.value?.validate();
    let moduleFormList: any[] = [];
    if (keys(variablesGroup.value).length > 1) {
      moduleFormList = await getRefFormData();
    } else {
      const result = await schemaForm.value?.getFormData();
      moduleFormList = [{ formData: result }];
    }
    console.log('moduleFormList===', refMap, moduleFormList, variablesGroup);
    const validFailedForm = find(moduleFormList, (item) => !item.formData);
    if (validFailedForm && validFailedForm.tab) {
      activeKey.value = validFailedForm.tab;
    }
    if (!res && !validFailedForm) {
      try {
        submitLoading.value = true;
        formData.attributes = {
          ...reduce(
            moduleFormList,
            (obj, s) => {
              obj = {
                ...obj,
                ...s.formData
              };
              return obj;
            },
            {}
          )
        };
        if (id) {
          await upgradeApplicationInstance(formData);
        } else {
          await createApplication(formData);
        }
        copyFormData = _.cloneDeep(formData);
        router.back();
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
      }
    }
  };

  const initFormData = async () => {
    if (!id) {
      // webservice
      const webservice = find(
        templateList.value,
        (item) => item.id === 'webservice'
      );
      formData.template.id = webservice
        ? webservice.id
        : get(templateList.value, '0.id') || '';
      await getModuleVersionList();
      const moduleTemplate = getModuleSchemaById();
      formData.templateVersion = get(moduleTemplate, 'version') || '';
      moduleInfo.value = cloneDeep(get(moduleTemplate, 'schema')) || {};
      // setFormData(moduleInfo.value);
    } else {
      assignIn(formData, serviceInfo.value);
      // 1. get the template meta data 2.set the default value
      await getModuleVersionList();
      const moduleTemplate = getModuleSchemaByVersion();
      moduleInfo.value = cloneDeep(get(moduleTemplate, 'schema'));
      const variablesList = filter(
        get(moduleInfo.value, 'variables'),
        (v) => !v.hidden
      );
      each(variablesList || [], (item) => {
        item.default = get(serviceInfo.value, `attributes.${item.name}`);
      });
    }

    generateVariablesGroup(pageAction.value);
    copyFormData = _.cloneDeep(formData);
    console.log('moduleVersionList===', allTemplateVersions.value);
  };
  onBeforeRouteLeave(async (to, from) => {
    if (!_.isEqual(copyFormData, formData)) {
      beforeLeaveCallback({
        to,
        from,
        onOk: () => {
          copyFormData = cloneDeep(formData);
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
    await Promise.all([getServiceItemInfo(), initCompleteData()]);
    initFormData();
  };
  init();
</script>

<style lang="less">
  .app-module-modal.arco-modal {
    .arco-tabs-tab {
      margin-right: 30px;
      margin-left: 0;
    }
  }
</style>

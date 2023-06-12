<template>
  <a-modal
    top="10%"
    :closable="false"
    :align-center="false"
    :width="1000"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    :esc-to-close="false"
    unmount-on-close
    :body-style="{
      'max-height': '500px',
      'min-height': '400px',
      'overflow': 'auto',
      'line-height': 1
    }"
    modal-class="app-module-modal"
    :title="
      action === 'edit'
        ? $t('applications.applications.edit')
        : $t('applications.applications.create')
    "
    @cancel="handleCancel"
    @ok="handleOk"
    @before-open="handleBeforeOpen"
    @open="handleOpened"
    @before-close="handleBeforeClose"
  >
    <div>
      <a-form
        ref="formref"
        :model="formData"
        auto-label-width
        layout="vertical"
      >
        <a-grid :cols="24">
          <a-grid-item :span="24">
            <a-form-item
              :label="$t('common.table.name')"
              field="name"
              :disabled="action === 'edit'"
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
          </a-grid-item>
          <a-grid-item :span="12">
            <a-form-item
              id="moduleId"
              :label="$t('applications.applications.table.module')"
              field="template.id"
              :disabled="action === 'edit'"
              :rules="[
                {
                  required: true,
                  message: $t('applications.applications.rules.modules')
                }
              ]"
            >
              <div id="moduleIdWrapper" style="position: relative">
                <a-select
                  v-model="formData.template.id"
                  :popup-container="getContainer('moduleIdWrapper')"
                  allow-search
                  @change="handleModuleChange"
                >
                  <a-option
                    v-for="item in templates"
                    :key="item.id"
                    :value="item.id"
                    >{{ item.id }}</a-option
                  >
                </a-select>
              </div>
            </a-form-item>
          </a-grid-item>
          <a-grid-item :span="12">
            <a-form-item
              :label="$t('applications.applications.history.version')"
              field="version"
              :rules="[
                {
                  required: true,
                  message: $t('applications.applications.rules.versions')
                }
              ]"
            >
              <div id="moduleVerionWrapper" style="position: relative">
                <a-select
                  v-model="formData.version"
                  :popup-container="getContainer('moduleVerionWrapper')"
                  @change="handleVersionChange"
                >
                  <a-option
                    v-for="item in moduleVersionList"
                    :key="item.id"
                    :value="item.value"
                    >{{ item.label }}</a-option
                  >
                </a-select>
              </div>
            </a-form-item>
          </a-grid-item>
        </a-grid>
      </a-form>
      <div class="variables">
        <div
          style="
            display: flex;
            justify-content: flex-start;
            margin-bottom: 10px;
            border-bottom: 1px solid var(--color-border-2);
          "
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
                    $t('applications.applications.modules.params.tips1')
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
        <a-tabs
          v-if="show && formTabs.length > 1"
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
          v-if="show && formTabs.length < 2"
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
    </div>
    <template #footer>
      <EditPageFooter style="margin-top: 0">
        <template #save>
          <a-button
            :loading="submitLoading"
            type="primary"
            class="cap-title cancel-btn"
            @click="handleOk"
            >{{ $t('common.button.confirm') }}</a-button
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
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import {
    get,
    find,
    cloneDeep,
    each,
    assignIn,
    pull,
    set,
    keys,
    every,
    reduce,
    map,
    includes,
    pickBy,
    toString,
    clone,
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
  import useCallCommon from '@/hooks/use-call-common';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import formCreate from '@/components/form-create/index.vue';
  import GroupTitle from '@/components/group-title/index.vue';
  import {
    TemplateRowData,
    ModuleVersionData
  } from '@/views/operation-hub/templates/config/interface';
  import { validateAppNameRegx } from '@/views/config';
  import { createApplication, updateApplication } from '../../api';

  interface Group {
    variables: object[];
    label: string;
  }
  const props = defineProps({
    show: {
      type: Boolean,
      default() {
        return false;
      }
    },
    action: {
      type: String,
      default() {
        return 'create';
      }
    },
    dataInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    templates: {
      type: Array as PropType<TemplateRowData[]>,
      default() {
        return [];
      }
    },
    allModuleVersions: {
      type: Array as PropType<ModuleVersionData[]>,
      default() {
        return [];
      }
    },
    modules: {
      type: Array,
      default() {
        return [];
      }
    }
  });

  type refItem = Element | ComponentPublicInstance | null;
  interface ModuleVersion extends ModuleVersionData {
    label: string;
    value: string;
  }
  provide('showHintInput', true);
  const defaultGroupKey = '_default_default_';
  const emit = defineEmits(['save', 'update:show', 'reset', 'update:action']);
  const { route, t } = useCallCommon();
  const formref = ref();
  const loading = ref(false);
  const activeKey = ref('schemaForm0');
  const schemaForm = ref();
  const submitLoading = ref(false);
  const moduleInfo = ref<any>({});
  const variablesGroup = ref<any>({});
  const variablesGroupForm = ref<any>({});
  const moduleVersionList = ref<ModuleVersion[]>([]);
  const moduleVersionFormCache = ref({});
  let refMap: Record<string, refItem> = {};
  const versionMap = ref({ nv: '', ov: '' });
  const formData = reactive({
    projectID: route.params.projectId,
    environment: {
      id: route.params.environmentId
    },
    name: '',
    template: { id: '' },
    version: '',
    application: {
      id: route.query.id || ''
    },
    attributes: {}
  });

  const formTabs = computed(() => {
    const list = keys(variablesGroup.value);
    if (includes(list, defaultGroupKey)) {
      const res = [defaultGroupKey, ...pull(list, defaultGroupKey)];
      return res;
    }
    return list;
  });
  const getContainer = (id): HTMLElement => {
    return document.getElementById(id) as HTMLElement;
  };
  const handleCancel = () => {
    emit('update:show', false);
  };
  const resetForm = () => {
    refMap = {};
    formData.name = '';
    formData.template = { id: '' };
    formData.version = '';
    formData.application = { id: '' };
    formData.attributes = {};
    moduleVersionFormCache.value = {};
    activeKey.value = 'schemaForm0';
    formref.value?.clearValidate?.();
  };
  const validateNameuniq = (val, callback) => {
    if (props.action === 'edit') {
      callback();
      return;
    }
    const data = find(props.modules, (item) => get(item, 'name') === val);
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
  const handleTabChange = (val) => {
    activeKey.value = val;
  };
  const getInitialValue = (item, sourceData, action) => {
    let initialValue = item.default;
    if (
      get(moduleVersionFormCache.value, formData.version) ||
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
        ...cloneDeep(get(props.dataInfo, 'attributes')),
        ...get(moduleVersionFormCache.value, formData.version)
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
      moduleVersionList.value,
      (item) => item.template.id === formData.template.id
    );
    return moduleTemplate;
  };
  // change version ...
  const getModuleSchemaByVersion = () => {
    const moduleTemplate = find(
      moduleVersionList.value,
      (item) => item.value === formData.version
    );
    return moduleTemplate;
  };
  const getModuleVersionList = async () => {
    console.log('moduleVersionList===', props.allModuleVersions);
    try {
      const list = filter(
        props.allModuleVersions,
        (item) => item.template.id === formData.template.id
      );
      moduleVersionList.value = map(list, (item) => {
        return {
          ...item,
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
    // setFormData(moduleInfo.value);
    clearFormValidStatus();
    generateVariablesGroup(props.action);
  };
  const handleVersionChange = () => {
    setTimeout(() => {
      execVersionChangeCallback();
    }, 100);
  };
  // module change: exec version change
  const handleModuleChange = async (val) => {
    await getModuleVersionList();
    formData.version = get(moduleVersionList.value, '0.version');
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
        if (props.action === 'create') {
          await createApplication(formData);
        } else {
          await updateApplication(formData);
        }
        emit('save');
        setTimeout(() => {
          emit('update:show', false);
        }, 100);
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
      }
    }
  };

  const handleBeforeOpen = async () => {
    if (props.action === 'create') {
      // webservice
      const webservice = find(
        props.templates,
        (item) => item.id === 'webservice'
      );
      formData.template.id = webservice
        ? webservice.id
        : get(props.templates, '0.id') || '';
      await getModuleVersionList();
      const moduleTemplate = getModuleSchemaById();
      formData.version = get(moduleTemplate, 'version') || '';
      moduleInfo.value = cloneDeep(get(moduleTemplate, 'schema')) || {};
      // setFormData(moduleInfo.value);
    } else {
      assignIn(formData, props.dataInfo);
      // 1. get the template meta data 2.set the default value
      await getModuleVersionList();
      const moduleTemplate = getModuleSchemaByVersion();
      moduleInfo.value = cloneDeep(get(moduleTemplate, 'schema'));
      const variablesList = filter(
        get(moduleInfo.value, 'variables'),
        (v) => !v.hidden
      );
      each(variablesList || [], (item) => {
        item.default = get(props.dataInfo, `attributes.${item.name}`);
      });
    }

    generateVariablesGroup(props.action);
    console.log('moduleVersionList===', moduleVersionList.value);
  };
  const handleOpened = () => {};
  const handleBeforeClose = () => {
    resetForm();
    clearFormValidStatus();
    emit('update:action', 'create');
    emit('reset');
  };
  watch(
    () => formData.version,
    (nv, ov) => {
      versionMap.value = {
        nv,
        ov: ov || ''
      };
      console.log('versionMap===', versionMap.value);
    },
    {
      immediate: true
    }
  );
</script>

<style lang="less">
  .app-module-modal.arco-modal {
    .arco-tabs-tab {
      margin-right: 30px;
      margin-left: 0;
    }
  }
</style>

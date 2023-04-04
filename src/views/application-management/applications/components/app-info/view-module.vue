<template>
  <a-modal
    top="10%"
    mask-animation-name="fadeOut"
    modal-animation-name="fadeIn"
    :closable="false"
    :align-center="false"
    :width="900"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    :body-style="{
      'max-height': '500px',
      'overflow': 'auto'
    }"
    modal-class="oci-modal"
    :title="$t('applications.module.title.view')"
    @cancel="handleCancel"
    @ok="handleOk"
    @before-open="handleBeforeOpen"
    @open="handleOpened"
    @before-close="handleBeforeClose"
  >
    <div>
      <a-form ref="formref" :model="formData" auto-label-width>
        <a-grid :cols="24">
          <a-grid-item :span="8">
            <a-form-item :label="$t('common.table.name')" field="name">
              <span class="readonly-view-label">{{ formData.name }}</span>
            </a-form-item>
          </a-grid-item>
          <a-grid-item :span="8">
            <a-form-item
              :label="$t('applications.applications.table.module')"
              field="module.id"
            >
              <span class="readonly-view-label">{{
                getListValue(formData.module.id, templates, 'id')
              }}</span>
            </a-form-item>
          </a-grid-item>
          <a-grid-item :span="8">
            <a-form-item
              :label="$t('applications.applications.history.version')"
              field="version"
            >
              <span class="readonly-view-label">{{
                getListValue(formData.version, moduleVersionList, 'value')
              }}</span>
            </a-form-item>
          </a-grid-item>
        </a-grid>
      </a-form>
      <div class="variables">
        <GroupTitle
          :title="$t('applications.applications.detail.configuration')"
        ></GroupTitle>
        <a-tabs
          v-if="show && formTabs.length > 1"
          lazy-load
          :active-key="activeKey"
          @change="handleTabChange"
        >
          <a-tab-pane
            v-for="(group, index) in formTabs"
            :key="`schemaForm${index}`"
            :title="variablesGroup[group]?.label"
          >
            <a-descriptions
              :column="2"
              :data="variablesGroup[group]?.Variables"
            >
              <template #value="{ data }">
                <span v-if="data.Type === 'list(number)'">{{
                  join(
                    get(variablesGroupForm, `${group}.attributes.${data.Name}`),
                    ','
                  )
                }}</span>
                <span v-else-if="data.Type === 'map(string)'">
                  <LabelsList
                    :labels="
                      get(
                        variablesGroupForm,
                        `${group}.attributes.${data.Name}`
                      )
                    "
                  ></LabelsList>
                </span>
                <span v-else>{{
                  get(variablesGroupForm, `${group}.attributes.${data.Name}`)
                }}</span>
              </template>
              <template #label="{ data }">
                <span style="font-weight: 400">{{ data.Label }}</span>
              </template>
            </a-descriptions>
          </a-tab-pane>
        </a-tabs>
        <a-descriptions
          v-if="show && formTabs.length < 2"
          :column="2"
          :data="variablesGroup[defaultGroupKey]?.Variables"
        >
          <template #value="{ data }">
            <span style="font-weight: 400">{{
              get(
                variablesGroupForm[defaultGroupKey]?.attributes,
                `${data.Name}`
              )
            }}</span>
          </template>
          <template #label="{ data }">
            <span style="font-weight: 400">{{ data.Name }}</span>
          </template>
        </a-descriptions>
      </div>
    </div>
    <template #footer>
      <EditPageFooter style="margin-top: 0">
        <template #cancel>
          <a-button
            type="primary"
            class="cap-title cancel-btn"
            @click="handleCancel"
            >{{ $t('common.button.confirm') }}</a-button
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
    join,
    filter
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
  import ADescriptionsItem from '@arco-design/web-vue/es/descriptions/descriptions-item';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import formCreate from '@/components/form-create/index.vue';
  import GroupTitle from '@/components/group-title/index.vue';
  import {
    TemplateRowData,
    ModuleVersionData
  } from '@/views/operation-hub/templates/config/interface';
  import { queryModulesVersions } from '@/views/operation-hub/templates/api';
  import LabelsList from './labels-list.vue';

  interface Group {
    Variables: object[];
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
    pageAction: {
      type: String,
      default() {
        return 'edit';
      }
    },
    allModuleVersions: {
      type: Array as PropType<ModuleVersionData[]>,
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
  const defaultGroupKey = '_default_default_';
  const emit = defineEmits(['save', 'update:show', 'reset', 'update:action']);
  const { route } = useCallCommon();
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
    name: '',
    module: { id: '' },
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
  const handleQueryInput = () => {};
  const handleCancel = () => {
    emit('update:show', false);
  };
  const resetForm = () => {
    formData.name = '';
    formData.module = { id: '' };
    formData.version = '';
    formData.application = { id: '' };
    formData.attributes = {};
    moduleVersionFormCache.value = {};
    activeKey.value = 'schemaForm0';
  };
  const setRefMap = (el: refItem, name) => {
    if (el) {
      refMap[`${name}`] = el;
    }
  };
  const getListValue = (value, list, k) => {
    const d = find(list, (item) => {
      return item[k] === value;
    });
    return d?.label || d?.id;
  };
  const handleTabChange = (val) => {
    activeKey.value = val;
  };
  const getInitialValue = (item, sourceData, action) => {
    let initialValue = item.Default;
    if (
      get(moduleVersionFormCache.value, formData.version) ||
      action === 'edit'
    ) {
      initialValue = get(sourceData, `attributes.${item.Name}`);
    }
    return initialValue;
  };
  // get set: edit create
  const generateVariablesGroup = (type) => {
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
      get(moduleInfo.value, 'Variables'),
      (v) => !v.Hidden
    );
    each(variablesList, (item) => {
      // set initial value
      // const initialValue =
      //   type === 'create'
      //     ? item.Default
      //     : get(sourceData, `attributes.${item.Name}`);
      const initialValue = getInitialValue(item, sourceData, type);
      if (item.Group) {
        if (!variablesGroup.value[item.Group]) {
          variablesGroup.value[item.Group] = {
            Variables: [],
            label: item.Group
          };
          variablesGroup.value[item.Group].Variables.push(item);
        } else {
          variablesGroup.value[item.Group].Variables.push(item);
        }

        set(
          variablesGroupForm.value,
          `${item.Group}.attributes.${item.Name}`,
          initialValue
        );
      } else {
        if (!variablesGroup.value[defaultGroupKey]) {
          variablesGroup.value[defaultGroupKey] = {
            Variables: [],
            label: 'Basic'
          };
        }
        variablesGroup.value[defaultGroupKey].Variables.push(item);
        set(
          variablesGroupForm.value,
          `${defaultGroupKey}.attributes.${item.Name}`,
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
    const variablesList = filter(get(schemas, 'Variables'), (v) => !v.Hidden);
    each(variablesList, (item) => {
      formData.attributes[item.Name] = item.Default;
    });
  };
  //  change module ...
  const getModuleSchemaById = () => {
    const moduleTemplate = find(
      moduleVersionList.value,
      (item) => item.module.id === formData.module.id
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
    try {
      // const { data } = await queryModulesVersions({
      //   moduleID: formData.module.id
      // });
      const list = filter(
        props.allModuleVersions,
        (item) => item.module.id === formData.module.id
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
    refMap = {};
    console.log('version args...', moduleVersionFormCache.value);
    // setFormData(moduleInfo.value);
    generateVariablesGroup(props.action);
    nextTick(() => {
      clearFormValidStatus();
    });
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
    console.log('moduleFormList===', moduleFormList, variablesGroup);
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
        emit('save', cloneDeep(formData));
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
      formData.module.id = get(props.templates, '0.id') || '';
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
        get(moduleInfo.value, 'Variables'),
        (v) => !v.Hidden
      );
      each(variablesList || [], (item) => {
        item.Default = get(props.dataInfo, `attributes.${item.Name}`);
      });
      console.log('dataInfo===', props.dataInfo);
    }

    generateVariablesGroup(props.action);
  };
  const handleOpened = () => {};
  const handleBeforeClose = () => {
    resetForm();
    emit('update:action', 'create');
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

<style lang="less" scoped></style>

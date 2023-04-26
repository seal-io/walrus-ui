<template>
  <a-modal
    top="10%"
    mask-animation-name="fadeOut"
    modal-animation-name="fadeIn"
    :closable="false"
    :align-center="false"
    :width="1000"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    :body-style="{
      'max-height': '500px',
      'min-height': '400px',
      'overflow': 'auto'
    }"
    modal-class="app-module-modal"
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
            v-for="group in formTabs"
            :key="group"
            :title="variablesGroup[group]?.label"
          >
            <div class="content-wrap">
              <div v-if="subGroupList.length" class="side-menu">
                <div
                  v-for="k in subGroupList"
                  :key="k"
                  class="menu-item"
                  :class="{ active: activeSubGroup === k }"
                  @click.stop="handleClickSubGroup(k)"
                  >{{ k }}</div
                >
              </div>
              <a-descriptions
                :column="2"
                style="flex: 1"
                :data="variablesDataList"
              >
                <template #value="{ data }">
                  <div>
                    <span
                      v-if="
                        schemaType.isListNumber(data.type) ||
                        schemaType.isListString(data.type)
                      "
                      >{{
                        join(
                          get(
                            variablesGroupForm,
                            `${group}.attributes.${data.name}`
                          ),
                          ','
                        )
                      }}</span
                    >
                    <span v-else-if="schemaType.isMapString(data.type)">
                      <LabelsList
                        :labels="
                          get(
                            variablesGroupForm,
                            `${group}.attributes.${data.name}`
                          )
                        "
                      ></LabelsList>
                    </span>
                    <span v-else>{{
                      get(
                        variablesGroupForm,
                        `${group}.attributes.${data.name}`
                      )
                    }}</span>
                  </div>
                </template>
                <template #label="{ data }">
                  <span style="font-weight: 400">{{ data.label }}</span>
                </template>
              </a-descriptions>
            </div>
          </a-tab-pane>
        </a-tabs>
        <a-descriptions
          v-if="show && formTabs.length < 2"
          :column="2"
          :data="variablesGroup[defaultGroupKey]?.variables"
        >
          <template #value="{ data }">
            <span style="font-weight: 400">{{
              get(
                variablesGroupForm[defaultGroupKey]?.attributes,
                `${data.name}`
              )
            }}</span>
          </template>
          <template #label="{ data }">
            <span style="font-weight: 400">{{ data.name }}</span>
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
  import { schemaType } from '@/components/form-create/config/interface';
  import GroupTitle from '@/components/group-title/index.vue';
  import {
    TemplateRowData,
    ModuleVersionData
  } from '@/views/operation-hub/templates/config/interface';
  import { queryModulesVersions } from '@/views/operation-hub/templates/api';
  import LabelsList from './labels-list.vue';

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
  const activeKey = ref('');
  const schemaForm = ref();
  const submitLoading = ref(false);
  const moduleInfo = ref<any>({});
  const variablesGroup = ref<any>({});
  const variablesGroupForm = ref<any>({});
  const moduleVersionList = ref<ModuleVersion[]>([]);
  const moduleVersionFormCache = ref({});
  const OTHER_SUB_GROUP = 'Other';
  const subGroupList = ref<string[]>([]);
  const activeSubGroup = ref('');
  let refMap: Record<string, refItem> = {};
  const versionMap = ref({ nv: '', ov: '' });
  const subGroupCache = ref({});
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
  const variablesDataList = computed(() => {
    const list =
      get(variablesGroup.value, `${activeKey.value}.variables`) || [];
    return filter(list, (item) => {
      return !item.subGroup || item.subGroup === activeSubGroup.value;
    });
  });
  const handleCancel = () => {
    emit('update:show', false);
  };
  const handleClickSubGroup = (k) => {
    activeSubGroup.value = k;
  };
  const resetForm = () => {
    formData.name = '';
    formData.module = { id: '' };
    formData.version = '';
    formData.application = { id: '' };
    formData.attributes = {};
    moduleVersionFormCache.value = {};
    activeKey.value = '';
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
  const setSubGroupList = () => {
    const groupData = get(variablesGroup.value, activeKey.value);
    subGroupList.value = [...groupData?.subGroup];
    activeSubGroup.value = get(subGroupList.value, '0');
  };
  const handleTabChange = (val) => {
    activeKey.value = val;
    setSubGroupList();
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
    subGroupCache.value = {};
    subGroupList.value = [];

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
    each(variablesList, (item, i) => {
      // set initial value
      // const initialValue =
      //   type === 'create'
      //     ? item.default
      //     : get(sourceData, `attributes.${item.name}`);
      const initialValue = getInitialValue(item, sourceData, type);
      const groupConfig = split(item.group, '/') || [];
      const group = get(groupConfig, '0');
      const subGroup = get(groupConfig, '1');
      if (group && subGroup) {
        subGroupCache.value[group] = 1;
      }
      item.order = item.required ? 0 : 10 * (i + 1);
      item.subGroup = subGroup || '';
      item.mainGroup = group;
      if (group) {
        if (!variablesGroup.value[group]) {
          variablesGroup.value[group] = {
            variables: [],
            label: group,
            subGroup: new Set()
          };
        }

        variablesGroup.value[group].variables.push(item);
        if (subGroup) {
          variablesGroup.value[group].subGroup.add(subGroup);
        }

        set(
          variablesGroupForm.value,
          `${group}.attributes.${item.name}`,
          initialValue
        );
      } else {
        if (variablesGroup.value && !variablesGroup.value[defaultGroupKey]) {
          variablesGroup.value[defaultGroupKey] = {
            variables: [],
            label: 'Basic',
            subGroup: []
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
    // set 'other' sub group
    each(variablesList, (pItem) => {
      if (pItem.mainGroup) {
        each(variablesGroup.value[pItem.mainGroup].variables, (sItem) => {
          if (
            variablesGroup.value[pItem.mainGroup].subGroup.size &&
            !sItem.subGroup
          ) {
            sItem.subGroup = OTHER_SUB_GROUP;
          }
        });
      }
    });
    nextTick(() => {
      handleTabChange(get(formTabs.value, '0'));
    });
    console.log(
      'variablesGroupForm===',
      variablesGroup.value,
      variablesGroupForm.value
    );
  };
  const setFormData = (schemas) => {
    const variablesList = filter(get(schemas, 'variables'), (v) => !v.hidden);
    each(variablesList, (item) => {
      formData.attributes[item.name] = item.default;
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
      console.log('formTabs.value===', formTabs.value);
      handleTabChange(get(formTabs.value, '0'));
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
        get(moduleInfo.value, 'variables'),
        (v) => !v.hidden
      );
      each(variablesList || [], (item) => {
        item.default = get(props.dataInfo, `attributes.${item.name}`);
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

<style lang="less">
  .app-module-modal.arco-modal {
    .arco-tabs-tab {
      margin-right: 30px;
      margin-left: 0;
    }

    .arco-modal-body {
      padding-bottom: 0;
    }

    .arco-modal-footer {
      border-top: 1px solid var(--color-neutral-3);
    }
  }
</style>

<style lang="less" scoped>
  @import url('@/components/form-create/style/side-menu.less');
</style>

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
      'overflow': 'auto'
    }"
    modal-class="oci-modal"
    :title="action === 'edit' ? '编辑Module' : '添加Module'"
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
              label="名称"
              field="name"
              :disabled="action === 'edit'"
              :rules="[{ required: true, message: '名称必填' }]"
            >
              <a-input
                v-model="formData.name"
                :max-length="50"
                show-word-limit
              ></a-input>
            </a-form-item>
          </a-grid-item>
          <a-grid-item :span="12">
            <a-form-item
              label="模块"
              field="module.id"
              :disabled="action === 'edit'"
              :rules="[{ required: true, message: '类型必选' }]"
            >
              <a-select
                v-model="formData.module.id"
                @change="handleModuleChange"
              >
                <a-option
                  v-for="item in templates"
                  :key="item.id"
                  :value="item.id"
                  >{{ item.id }}</a-option
                >
              </a-select>
            </a-form-item>
          </a-grid-item>
          <a-grid-item :span="12">
            <a-form-item
              label="版本"
              field="version"
              :disabled="action === 'edit'"
              :rules="[{ required: true, message: '类型必选' }]"
            >
              <a-select
                v-model="formData.version"
                @change="handleVersionChange"
              >
                <a-option
                  v-for="item in moduleVersionList"
                  :key="item.id"
                  :value="item.value"
                  >{{ item.label }}</a-option
                >
              </a-select>
            </a-form-item>
          </a-grid-item>
        </a-grid>
      </a-form>
      <div class="variables">
        <GroupTitle title="属性"></GroupTitle>
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
              layout="vertical"
              action="post"
              api=""
              :show-footer="false"
              :submit="() => {}"
              :model="variablesGroupForm[group]?.attributes"
              :form-schema="variablesGroup[group]?.Variables"
            >
            </formCreate>
          </a-tab-pane>
        </a-tabs>
        <formCreate
          v-if="show && formTabs.length < 2"
          ref="schemaForm"
          layout="vertical"
          action="post"
          api=""
          :show-footer="false"
          :submit="() => {}"
          :model="variablesGroupForm[defaultGroupKey]?.attributes"
          :form-schema="variablesGroup[defaultGroupKey]?.Variables"
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
    includes
  } from 'lodash';
  import {
    ref,
    reactive,
    PropType,
    ComponentPublicInstance,
    computed
  } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import formCreate from '@/components/form-create/index.vue';
  import GroupTitle from '@/components/group-title/index.vue';
  import paramsEditor from '@/components/graph/components/params-editor.vue';
  import {
    TemplateRowData,
    ModuleVersionData
  } from '@/views/operation-hub/templates/config/interface';
  import { queryModulesVersions } from '@/views/operation-hub/templates/api';

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
  let refMap: Record<string, refItem> = {};
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
  const handleCancel = () => {
    emit('update:show', false);
  };
  const resetForm = () => {
    formData.name = '';
    formData.module = { id: '' };
    formData.version = '';
    formData.application = { id: '' };
    formData.attributes = {};

    activeKey.value = 'schemaForm0';
  };
  const setRefMap = (el: refItem, name) => {
    if (el) {
      refMap[`${name}`] = el;
    }
  };
  const handleTabChange = (val) => {
    activeKey.value = val;
  };
  // get set: edit create
  const generateVariablesGroup = (type) => {
    variablesGroup.value = {};
    variablesGroupForm.value = {};
    each(get(moduleInfo.value, 'Variables'), (item) => {
      // set initial value
      const initialValue =
        type === 'create'
          ? item.Default
          : get(props.dataInfo, `attributes.${item.Name}`);
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
  };
  const setFormData = (schemas) => {
    each(get(schemas, 'Variables'), (item) => {
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
      const { data } = await queryModulesVersions({
        moduleID: formData.module.id
      });
      const list = data.items || [];
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
  const handleVersionChange = async () => {
    const moduleData = getModuleSchemaByVersion();
    moduleInfo.value = cloneDeep(get(moduleData, 'schema')) || {};
    formData.application = { id: '' };
    formData.attributes = {};
    refMap = {};

    // setFormData(moduleInfo.value);
    generateVariablesGroup(props.action);
  };
  const handleModuleChange = async (val) => {
    await getModuleVersionList();
    formData.version = get(moduleVersionList.value, '0.version');
    handleVersionChange();
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
      each(get(moduleInfo.value, 'Variables') || [], (item) => {
        item.Default = get(props.dataInfo, `attributes.${item.Name}`);
      });
    }

    generateVariablesGroup(props.action);
  };
  const handleOpened = () => {};
  const handleBeforeClose = () => {
    resetForm();
    emit('update:action', 'create');
  };
</script>

<style lang="less" scoped></style>

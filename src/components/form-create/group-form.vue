<template>
  <div class="group-form">
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
        <SingleForm
          :ref="(el: refItem) => setRefMap(el, `schemaForm${index}`)"
          :form-id="`schemaForm${index}`"
          layout="vertical"
          :show-footer="false"
          :show-filter="showFilter"
          :attributes="variableData"
          :model="variablesGroupForm[group]"
          :form-schema="variablesGroup[group]?.variables"
        >
        </SingleForm>
      </a-tab-pane>
    </a-tabs>
    <SingleForm
      v-if="formTabs.length === 1"
      ref="schemaForm"
      form-id="schemaForm"
      layout="vertical"
      :show-footer="false"
      :show-filter="showFilter"
      :model="variablesGroupForm[formTabs[0]]"
      :form-schema="variablesGroup[formTabs[0]]?.variables"
    >
    </SingleForm>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import {
    ref,
    watch,
    computed,
    PropType,
    nextTick,
    ComponentPublicInstance
  } from 'vue';
  import SingleForm from './single-form.vue';
  import { FieldSchema } from '../dynamic-form/config/interface';

  type refItem = Element | ComponentPublicInstance | null;
  const props = defineProps({
    fieldList: {
      type: Array as PropType<FieldSchema[]>,
      default() {
        return [];
      }
    },
    originalFormData: {
      type: Object as PropType<any>,
      default() {
        return {};
      }
    },
    showFilter: {
      type: Boolean,
      default() {
        return true;
      }
    },
    action: {
      type: String as PropType<'edit' | 'view'>,
      default() {
        return 'edit';
      }
    }
  });

  const defaultGroupKey = '_default_default_';
  const defaultGroupLabel = 'Basic';
  const activeKey = ref('schemaForm0');
  const schemaForm = ref();
  const refMap = ref<Record<string, any>>({});
  const variablesGroup = ref<any>({});
  const variablesGroupForm = ref<any>({});
  const variableData = ref<any>({});
  const formData = ref<any>({});

  const formTabs = computed(() => {
    const list = _.keys(variablesGroup.value);
    if (_.includes(list, defaultGroupKey)) {
      const res = [defaultGroupKey, ..._.pull(list, defaultGroupKey)];
      return res;
    }
    return list;
  });

  const setRefMap = (el: refItem, name) => {
    if (el) {
      refMap.value[`${name}`] = el;
    }
  };

  // get group form data
  const getRefFormData = async (noValidate?: boolean) => {
    const resultList: any[] = [];
    await Promise.all(
      _.keys(refMap.value).map(async (key) => {
        const refEL = refMap.value[key];
        const moduleForm = await refEL?.getFormData?.(noValidate);
        resultList.push({
          tab: key,
          formData: moduleForm
        });
      })
    );
    return resultList;
  };

  const initFieldDefaultValue = (item) => {
    if (item.default) {
      return item.default;
    }
    const { type } = item;
    if (type === 'array') {
      return [];
    }
    if (type === 'object') {
      return {};
    }
    if (type === 'boolean') {
      return false;
    }
    if (type === 'number' || type === 'integer') {
      return null;
    }
    return '';
  };
  const getHiddenFormData = () => {
    const hiddenFormData = {};
    _.each(props.fieldList, (item) => {
      if (item.uiSchema.hidden) {
        _.set(hiddenFormData, item.fieldPath, initFieldDefaultValue(item));
      }
    });
    console.log('hiddenFormData:', hiddenFormData);
    return hiddenFormData;
  };
  const getFormData = async (noValidate?: boolean) => {
    let moduleFormList: any[] = [];
    const hiddenFormData = getHiddenFormData();
    if (_.keys(variablesGroup.value).length > 1) {
      moduleFormList = await getRefFormData(noValidate);
      moduleFormList.push({
        tab: `_schemaform_xx_cc_${formTabs.value.length}`,
        formData: hiddenFormData
      });
    } else {
      const result = await schemaForm.value?.getFormData(noValidate);
      moduleFormList = [{ formData: _.merge(result, hiddenFormData) }];
    }
    return moduleFormList;
  };

  // update all the form data
  const setVariableAttributes = async () => {
    const moduleFormList = await getFormData(true);
    variableData.value = _.reduce(
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
  };

  const handleTabChange = (val) => {
    activeKey.value = val;
    setVariableAttributes();
  };

  const getData = async () => {
    const moduleFormList = await getFormData();
    const validFailedForm = _.find(moduleFormList, (item) => !item.formData);
    if (validFailedForm && validFailedForm.tab) {
      activeKey.value = validFailedForm.tab;
    }
    if (validFailedForm) {
      return false;
    }
    return moduleFormList;
  };

  const generateVariablesGroup = (type) => {
    refMap.value = {};
    variablesGroup.value = {};
    variablesGroupForm.value = {};

    console.log('props.fieldList:', props.fieldList);
    const variablesList = _.filter(props.fieldList, (v) => !v.uiSchema.hidden);
    _.each(variablesList, (item) => {
      const initialValue = _.get(
        props.originalFormData,
        [...item.fieldPath],
        item.default
      );
      item.default = initialValue;
      // filter empty group name
      const groups: string[] = _.filter(
        _.split(item.uiSchema.group, /\/+/) || [],
        (g) => !!g
      );
      const group = _.get(groups, '0');
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

        _.set(
          variablesGroupForm.value,
          [group, ...item.fieldPath],
          initialValue
        );
      } else {
        if (!variablesGroup.value[defaultGroupKey]) {
          variablesGroup.value[defaultGroupKey] = {
            variables: [],
            label: defaultGroupLabel
          };
        }
        variablesGroup.value[defaultGroupKey].variables.push(item);
        _.set(
          variablesGroupForm.value,
          [defaultGroupKey, ...item.fieldPath],
          initialValue
        );
      }
    });
  };

  const clearFormValidStatus = () => {
    _.keys(refMap.value).map(async (key) => {
      const refEL = refMap.value[key];
      refEL?.clearFormValidStatus?.();
    });
    schemaForm.value?.clearFormValidStatus?.();
  };

  defineExpose({
    getData,
    clearFormValidStatus
  });
  watch(
    () => props.fieldList,
    (val) => {
      generateVariablesGroup(val);
      nextTick(() => {
        handleTabChange('schemaForm0');
      });
    },
    {
      immediate: true
    }
  );
</script>

<style lang="less" scoped>
  .group-form {
    :deep(.arco-tabs-nav-tab) {
      display: flex !important;
    }

    :deep(.arco-tabs-content) {
      padding-top: var(--container-padding) !important;
    }
  }
</style>

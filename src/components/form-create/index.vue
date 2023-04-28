<template>
  <div class="form-create-wrap">
    <a-form ref="formref" :model="formData" auto-label-width :layout="layout">
      <slot></slot>
      <div class="content-wrap">
        <div v-if="keys(subGroupCache).length" class="side-menu">
          <div
            v-for="k in keys(subGroupCache)"
            :key="k"
            class="menu-item"
            :class="{ active: activeMenu === k }"
            @click.stop="handleClickSubGroup(k)"
            >{{ k }}</div
          >
        </div>
        <a-grid :cols="24" :col-gap="10" style="flex: 1">
          <template v-for="(fm, index) in schemaList" :key="fm.Name">
            <!-- three level title -->
            <a-grid-item
              v-if="
                activeMenu === fm.subGroup &&
                fm.thirdGroup &&
                !fm.thirdGroupOrder
              "
              :span="24"
            >
              <div class="sub-group-title"
                ><icon-bulb class="mright-5" />{{ fm.thirdGroup }}</div
              >
            </a-grid-item>
            <a-grid-item
              v-if="
                fm.showIf
                  ? toString(get(formData, `${fm.showCondition.key}`)) ===
                    toString(fm?.showCondition?.value)
                  : true
              "
              :class="{
                'hidden-field': activeMenu && activeMenu !== fm.subGroup
              }"
              :span="setGridItemSpan(fm, index)"
            >
              <a-form-item
                :field="fm.name"
                :rules="fm.rules"
                :label="fm.label || fm.name"
                :validate-trigger="['change']"
              >
                <template #label>
                  <span>{{ fm.label || fm.name }}</span>
                  <a-tooltip v-if="fm.description" :content="fm.description">
                    <icon-info-circle
                      style="margin-left: 2px; stroke-linecap: initial"
                    />
                  </a-tooltip>
                </template>
                <div
                  v-if="schemaType.isMapString(fm.type)"
                  style="display: flex; flex: 1; flex-direction: column"
                >
                  <!-- XInputGroup component -->
                  <template v-if="fm?.labelList?.length">
                    <component
                      :is="formComponents[fm.parentCom]"
                      v-for="(sItem, sIndex) in fm.labelList"
                      :key="sIndex"
                      v-model:dataKey="sItem.key"
                      v-model:dataValue="sItem.value"
                      v-model:value="formData[fm.name]"
                      class="group-item"
                      style="width: 100%"
                      width="100%"
                      :trigger-validate="triggerValidate"
                      :form-id="fm.name"
                      :label-list="fm.labelList"
                      :position="sIndex"
                      v-bind="{ ...fm.props }"
                      @add="(obj) => handleAddLabel(obj, fm.labelList)"
                      @delete="handleDeleteLabel(fm.labelList, sIndex)"
                    >
                      <template v-if="fm.childCom">
                        <component
                          :is="formComponents[fm.childCom]"
                          v-for="com in fm.options"
                          :key="com"
                          :form-id="formId"
                          :value="com"
                          >{{ com }}</component
                        >
                      </template>
                    </component>
                  </template>
                  <template v-else>
                    <thumbButton
                      :size="24"
                      class="mleft-5"
                      font-size="14px"
                      @click="handleAddOne(fm.labelList)"
                    ></thumbButton>
                  </template>
                </div>
                <template v-else>
                  <component
                    :is="formComponents[fm.parentCom]"
                    :key="`${formId}_editorId_${index}`"
                    v-bind="{ ...fm.props }"
                    v-model="formData[fm.name]"
                    :editor-default-value="fm.default || ''"
                    style="width: 100%"
                    width="100%"
                    :editor-id="`${fm.name}_editorId_${index}`"
                    @input="(e) => handleSelectInputChange(e, fm.type)"
                  >
                    <template v-if="fm.childCom">
                      <component
                        :is="formComponents[fm.childCom]"
                        :key="`${formId}_child_editorId_${index}`"
                        :editor-id="`${fm.name}_child_editorId_${index}`"
                        style="display: none"
                      ></component>
                      <component
                        :is="formComponents[fm.childCom]"
                        v-for="com in fm.options"
                        :key="com.label"
                        :value="com.value"
                        >{{ com.value }}</component
                      >
                    </template>
                  </component>
                </template>
              </a-form-item>
            </a-grid-item>
          </template>
        </a-grid>
      </div>
      <a-form-item v-if="showFooter">
        <editPageFooter style="display: flex; margin-top: 0; padding-bottom: 0">
          <template #save>
            <a-button
              type="primary"
              size="small"
              class="cap-title"
              :loading="submitLoading"
              @click="handleSubmit"
              >{{ $t('common.button.save') }}</a-button
            >
          </template>
          <template #cancel>
            <a-button
              type="outline"
              size="small"
              class="cap-title"
              @click="handleCancel"
              >{{ $t('common.button.cancel') }}</a-button
            >
          </template>
        </editPageFooter>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import _, {
    each,
    get,
    map,
    cloneDeep,
    sortBy,
    keys,
    add,
    toString,
    some,
    split,
    find,
    filter
  } from 'lodash';
  import {
    PropType,
    reactive,
    ref,
    computed,
    onMounted,
    watchEffect,
    watch,
    inject
  } from 'vue';
  import axios, { CancelToken } from 'axios';
  import { useI18n } from 'vue-i18n';
  import editPageFooter from '@/components/edit-page-footer/index.vue';
  import thumbButton from '@/components/buttons/thumb-button.vue';
  import {
    ComponentSchema,
    parseComponentSchema,
    schemaType,
    LabelListItem
  } from './config/interface';
  import { json2Yaml, yaml2Json } from './config/yaml-parse';
  import formComponents from './components';
  import testData from './config/test';
  import { parseMapstring, parseOptions, parseQuery } from './config/utils';

  const props = defineProps({
    formSchema: {
      type: Array as PropType<ComponentSchema[]>,
      default() {
        return {};
      }
    },
    formId: {
      type: String,
      default() {
        return 'local';
      }
    },
    layout: {
      type: String as PropType<'horizontal' | 'vertical' | 'inline'>,
      default() {
        return 'horizontal';
      }
    },
    submit: {
      type: Function
    },
    api: {
      type: String,
      default() {
        return '';
      }
    },
    showFooter: {
      type: Boolean,
      default() {
        return true;
      }
    },
    action: {
      type: String as PropType<'post' | 'put'>,
      default() {
        return 'post';
      }
    },
    model: {
      type: Object,
      default() {
        return {};
      }
    }
  });
  const numberReg = /\d+/;
  const completerData = inject('completerData', ref({}));
  const { t } = useI18n();
  const emits = defineEmits(['done', 'cancel']);
  const submitLoading = ref(false);
  const formref = ref();
  const schemaList = ref<ComponentSchema[]>([]);
  // const activeSchemaList = ref<ComponentSchema[]>([]);
  const formData = ref({});
  const subGroupCache = ref({});
  const subGroupListCache = ref({});
  const thirdGroupCache = ref({});
  const activeMenu = ref('');
  const OTHER_SUB_GROUP = 'Other';
  const triggerValidate = ref(false);

  const activeSchemaList = computed(() => {
    if (!activeMenu.value) return schemaList.value;
    const list = filter(schemaList.value, (sItem) => {
      return sItem.subGroup === activeMenu.value;
    });
    return list;
  });
  const doSubmit = async () => {
    return axios[props.action](props.api, formData.value);
  };
  const setFormData = () => {
    formData.value = {};
    each(props.formSchema, (item) => {
      let val = get(props.model, item.name) || item.default;
      // transform data type
      if (
        schemaType.isCollectionType(item.type) ||
        schemaType.isUnknownType(item.type)
      ) {
        val = json2Yaml(val);
      }
      formData.value[item.name] = val;
    });
  };
  const calcGridItemSpan = (fm, index) => {
    const isEvenPosition = (index + 1) % 2 === 0;
    const fmSchemaIsCollectionType =
      schemaType.isCollectionType(fm.type) || schemaType.isUnknownType(fm.type);
    let bilingSchema: any = {};
    if (isEvenPosition) {
      bilingSchema = activeSchemaList.value[index - 1];
    } else {
      bilingSchema = activeSchemaList.value[index + 1] || {};
    }
    const bilingSchemaIsCollectionType =
      schemaType.isCollectionType(bilingSchema.type) ||
      schemaType.isUnknownType(bilingSchema.type);

    if (
      (fmSchemaIsCollectionType && bilingSchemaIsCollectionType) ||
      (!fmSchemaIsCollectionType && !bilingSchemaIsCollectionType)
    ) {
      return 12;
    }
    if (
      (!fmSchemaIsCollectionType && bilingSchemaIsCollectionType) ||
      (fmSchemaIsCollectionType && !bilingSchemaIsCollectionType)
    ) {
      return 24;
    }
    return 12;
  };
  const setGridItemSpan = (fm, i) => {
    if (!activeMenu.value) {
      return calcGridItemSpan(fm, i);
    }
    if (activeMenu.value !== fm.subGroup) {
      return 12;
    }
    const index = _.findIndex(activeSchemaList.value || [], (item) => {
      return item.name === fm.name;
    });
    if (index === -1) {
      return 12;
    }
    return calcGridItemSpan(fm, index);
  };
  const handleSelectInputChange = (e: any, type) => {
    if (schemaType.isListNumber(type) && !numberReg.test(e.data)) {
      e.target.value = e.target.value.replace(/[^\d]/g, '');
    }
  };
  const handleClickSubGroup = (k) => {
    activeMenu.value = k;
  };
  const setSchemaList = () => {
    const showIfMap = {};
    activeMenu.value = '';
    subGroupCache.value = {};
    subGroupListCache.value = {};
    thirdGroupCache.value = {};

    let list = map(props.formSchema, (o, i) => {
      const item = cloneDeep(o);
      const content = parseComponentSchema(item);
      const groupConfig = split(item.group, '/') || [];
      const subGroup = get(groupConfig, '1') || '';
      const mainGroup = get(groupConfig, '0') || '';
      const thirdGroup = get(groupConfig, '2') || '';

      item.showCondition = parseQuery(item.showIf);
      item.order = item.required ? 0 : 10 * (i + 1);
      item.parentCom = get(content, 'component.0');
      item.childCom = get(content, 'component.1');
      item.labelList = parseMapstring(item);
      item.subGroup = subGroup;
      item.mainGroup = mainGroup;
      item.thirdGroup = thirdGroup;
      item.subGroupOrder = !get(subGroupCache.value, subGroup) ? 0 : 1;
      item.thirdGroupOrder = !get(thirdGroupCache.value, thirdGroup) ? 0 : 1;
      item.options = parseOptions(item);
      item.props = get(content, 'props') || {};
      item.rules = map(content.rules, (sItem) => {
        sItem.message = t(sItem?.message, { name: item.label || item.name });
        return sItem;
      });

      if (subGroup) {
        subGroupCache.value[subGroup] = 1;
      }
      if (thirdGroup) {
        thirdGroupCache.value[thirdGroup] = 1;
      }
      // default active subgroup
      if (!activeMenu.value) {
        activeMenu.value = subGroup;
      }

      // for set other Group
      if (subGroupListCache.value[mainGroup] && subGroup) {
        subGroupListCache.value[mainGroup] = 1;
      }
      showIfMap[item.name] = item.order;
      return item;
    });
    list = map(list, (sItem) => {
      if (sItem.showIf) {
        sItem.order = add(get(showIfMap, `${sItem?.showCondition?.key}`), 0.1);
      }
      if (
        sItem.mainGroup &&
        subGroupListCache.value[sItem.mainGroup] &&
        !sItem.subGroup
      ) {
        sItem.subGroup = OTHER_SUB_GROUP;
      }
      // transform default value data type
      if (
        schemaType.isCollectionType(sItem.type) ||
        schemaType.isUnknownType(sItem.type)
      ) {
        sItem.default = json2Yaml(sItem.default);
      }
      return sItem;
    });
    list = sortBy(list, (pItem) => pItem.order);
    schemaList.value = list;
    console.log('schemaList===', schemaList.value);
  };
  const handleAddLabel = (obj, list) => {
    list.push({ ...obj });
  };
  const handleAddOne = (list) => {
    list.push({ key: '', value: '' });
  };
  const handleDeleteLabel = (list, index) => {
    list.splice(index, 1);
  };
  // reset field default value when showIf is negative
  const resetFieldsDefaultValue = () => {
    each(schemaList.value, (item) => {
      if (
        item.showIf &&
        toString(get(formData.value, `${item.showCondition.key}`)) !==
          item?.showCondition?.value
      ) {
        formData.value[item.name] = item.default;
      }
    });
  };
  // transform data before submit
  const transformDataByType = () => {
    const result = cloneDeep(formData.value);
    each(schemaList.value, (item) => {
      if (
        schemaType.isCollectionType(item.type) ||
        schemaType.isUnknownType(item.type)
      ) {
        result[item.name] = yaml2Json(formData.value[item.name], item.type);
      }
    });
    return result;
  };
  const validateLabels = () => {
    const result = find(schemaList.value, (sItem) => {
      if (sItem.labelList?.length) {
        return some(sItem.labelList, (item) => {
          return !item.key;
        });
      }
      return false;
    });
    return result;
  };
  const clearFormValidStatus = () => {
    formref.value?.clearValidate?.();
  };
  const getFormData = async () => {
    clearFormValidStatus();
    triggerValidate.value = true;
    const result = await formref.value?.validate();
    const validLabels = validateLabels();
    console.log('result===', result, validLabels);

    if (result) {
      const errorField = get(keys(result), '0');
      const d = find(schemaList.value, (item) => item.name === errorField);
      activeMenu.value = d?.subGroup || activeMenu.value;
    } else if (validLabels) {
      activeMenu.value = validLabels?.subGroup || activeMenu.value;
    }

    if (!result && !validLabels) {
      resetFieldsDefaultValue();
      const resultFormData = transformDataByType();
      console.log('formData.value=====', formData.value);
      return resultFormData;
    }
    return false;
  };

  const handleSubmit = async () => {
    console.log('formData:', formData.value);
    const res = await formref.value?.validate();
    if (!res) {
      try {
        submitLoading.value = true;
        resetFieldsDefaultValue();
        if (props.submit) {
          await props.submit?.(formData.value);
        } else {
          await doSubmit();
        }
        setTimeout(() => {
          emits('done');
        }, 200);
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
      }
    }
  };
  defineExpose({
    getFormData,
    clearFormValidStatus
  });

  watch(
    () => props.formSchema,
    () => {
      setSchemaList();
    },
    {
      deep: true,
      immediate: true
    }
  );
  watch(
    () => props.model,
    () => {
      setFormData();
      setTimeout(() => {
        clearFormValidStatus();
      });
    },
    {
      immediate: true,
      deep: true
    }
  );

  const handleCancel = () => {
    emits('cancel');
  };
  onMounted(() => {
    // setFormData();
    console.log('qs==test');
  });
</script>

<style lang="less" scoped>
  @import url('./style/side-menu.less');

  .form-create-wrap {
    :deep(.arco-select-view) {
      width: 360px;
    }

    .hidden-field {
      display: none;
    }

    .sub-group-title {
      z-index: 10;
      margin-bottom: 10px;
      padding: 2px 0;
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 14px;
      background-color: var(--color-fill-2);
    }
  }

  .x-input {
    margin-bottom: 10px;

    &:only-child {
      margin-bottom: 0;
    }
  }
</style>

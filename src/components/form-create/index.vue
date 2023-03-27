<template>
  <div class="form-create-wrap">
    <a-form ref="formref" :model="formData" auto-label-width :layout="layout">
      <slot></slot>
      <a-grid :cols="24" :col-gap="10">
        <template v-for="(fm, index) in schemaList" :key="fm.Name">
          <a-grid-item
            v-if="
              fm.ShowIf
                ? toString(get(formData, `${fm.ShowCondition.key}`)) ===
                  fm?.ShowCondition?.value
                : true
            "
            :span="12"
          >
            <a-form-item
              :field="fm.Name"
              :rules="fm.rules"
              :label="fm.Label || fm.Name"
              :validate-trigger="['change']"
            >
              <template #label>
                <span>{{ fm.Label || fm.Name }}</span>
                <a-tooltip v-if="fm.Description" :content="fm.Description">
                  <icon-info-circle
                    style="margin-left: 2px; stroke-linecap: initial"
                  />
                </a-tooltip>
              </template>
              <div
                v-if="fm.labelList?.length"
                style="display: flex; flex-direction: column"
              >
                <!-- XInputGroup component -->
                <component
                  :is="formComponents[fm.parentCom]"
                  v-for="(sItem, sIndex) in fm.labelList"
                  :key="sIndex"
                  v-model:dataKey="sItem.key"
                  v-model:dataValue="sItem.value"
                  v-model:value="formData[fm.Name]"
                  style="width: 100%"
                  width="100%"
                  :form-id="fm.Name"
                  class="group-item"
                  :label-list="fm.labelList"
                  :position="sIndex"
                  v-bind="{ ...fm.props }"
                  @add="(obj) => handleAddLabel(obj, fm.labelList)"
                  @delete="handleDeleteLabel(fm.labelList, sIndex)"
                >
                  <template v-if="fm.childCom">
                    <component
                      :is="formComponents[fm.childCom]"
                      v-for="com in fm.Options"
                      :key="com"
                      :form-id="formId"
                      :value="com"
                      >{{ com }}</component
                    >
                  </template>
                </component>
              </div>
              <template v-else>
                <component
                  :is="formComponents[fm.parentCom]"
                  :key="`${formId}_editorId_${index}`"
                  v-bind="{ ...fm.props }"
                  v-model="formData[fm.Name]"
                  :editor-default-value="fm.Default"
                  style="width: 100%"
                  width="100%"
                  :editor-id="`${fm.Name}_editorId_${index}`"
                >
                  <template v-if="fm.childCom">
                    <component
                      :is="formComponents[fm.childCom]"
                      :key="`${formId}_child_editorId_${index}`"
                      :editor-id="`${fm.Name}_child_editorId_${index}`"
                      style="display: none"
                    ></component>
                    <component
                      :is="formComponents[fm.childCom]"
                      v-for="com in fm.Options"
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
  import {
    each,
    get,
    map,
    cloneDeep,
    sortBy,
    keys,
    add,
    toString
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
  import {
    ComponentSchema,
    parseComponentSchema,
    LabelListItem
  } from './config/interface';
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
        return 'lcoal';
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

  const completerData = inject('completerData', ref({}));
  const { t } = useI18n();
  const emits = defineEmits(['done', 'cancel']);
  const submitLoading = ref(false);
  const formref = ref();
  const schemaList = ref<ComponentSchema[]>([]);
  const formData = ref({});

  const doSubmit = async () => {
    return axios[props.action](props.api, formData.value);
  };
  const setFormData = () => {
    formData.value = {};
    each(props.formSchema, (item) => {
      formData.value[item.Name] = get(props.model, item.Name) || item.Default;
    });
  };

  const setSchemaList = () => {
    const groupOrderMap = {};
    const showIfMap = {};
    let list = map(props.formSchema, (o, i) => {
      const item = cloneDeep(o);
      const content = parseComponentSchema(item);
      item.ShowCondition = parseQuery(item.ShowIf);
      item.order = item.Required ? 0 : 10 * (i + 1);
      item.parentCom = get(content, 'component.0');
      item.childCom = get(content, 'component.1');
      item.labelList = parseMapstring(item);
      item.Options = parseOptions(item);
      item.props = get(content, 'props') || {};
      item.rules = map(content.rules, (sItem) => {
        sItem.message = t(sItem?.message, { name: item.Label || item.Name });
        return sItem;
      });

      // if (item.Group && groupOrderMap[item.Group] && !item.Required) {
      //   item.order = groupOrderMap[item.Group];
      // } else if (item.Group) {
      //   groupOrderMap[item.Group] = item.order;
      // }
      showIfMap[item.Name] = item.order;
      return item;
    });
    list = map(list, (sItem) => {
      if (sItem.ShowIf) {
        sItem.order = add(get(showIfMap, `${sItem?.ShowCondition?.key}`), 0.1);
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
  const handleDeleteLabel = (list, index) => {
    list.splice(index, 1);
  };
  // reset field default value when showIf is negative
  const resetFieldsDefaultValue = () => {
    each(schemaList.value, (item) => {
      if (
        item.ShowIf &&
        toString(get(formData.value, `${item.ShowCondition.key}`)) !==
          item?.ShowCondition?.value
      ) {
        formData.value[item.Name] = item.Default;
      }
    });
  };
  const getFormData = async () => {
    const result = await formref.value?.validate();
    if (!result) {
      resetFieldsDefaultValue();
      return formData.value;
    }
    return false;
  };
  const handleSubmit = async () => {
    console.log('formData:', formData);
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
    getFormData
  });
  watchEffect(() => {
    setSchemaList();
  });
  watch(
    () => props.model,
    () => {
      setFormData();
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
  .form-create-wrap {
    :deep(.arco-select-view) {
      width: 360px;
    }
  }

  .x-input {
    margin-bottom: 10px;

    &:only-child {
      margin-bottom: 0;
    }
  }
</style>

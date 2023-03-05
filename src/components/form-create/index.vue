<template>
  <div class="form-create-wrap">
    <a-form ref="formref" :model="formData" auto-label-width :layout="layout">
      <slot></slot>
      <a-form-item
        v-for="fm in schemaList"
        :key="fm.Name"
        :field="fm.Name"
        :rules="fm.rules"
        :label="fm.Label || fm.Name"
        :validate-trigger="['change']"
      >
        <div
          v-if="fm.labelList?.length"
          style="display: flex; flex-direction: column"
        >
          <component
            :is="formComponents[fm.parentCom]"
            v-for="(sItem, sIndex) in fm.labelList"
            :key="sIndex"
            v-model:dataKey="sItem.key"
            v-model:dataValue="sItem.value"
            v-model:value="formData[fm.Name]"
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
                :value="com"
                >{{ com }}</component
              >
            </template>
          </component>
        </div>
        <template v-else>
          <component
            :is="formComponents[fm.parentCom]"
            v-bind="{ ...fm.props }"
            v-model="formData[fm.Name]"
          >
            <template v-if="fm.childCom">
              <component
                :is="formComponents[fm.childCom]"
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
      <a-form-item v-if="showFooter">
        <editPageFooter style="display: flex; margin-top: 0; padding-bottom: 0">
          <template #save>
            <a-button
              type="primary"
              size="small"
              class="cap-title"
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
  import { each, get, map, cloneDeep, sortBy, keys } from 'lodash';
  import {
    PropType,
    reactive,
    ref,
    computed,
    onMounted,
    watchEffect
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
  import { parseMapstring, parseOptions } from './config/utils';

  const props = defineProps({
    formSchema: {
      type: Array as PropType<ComponentSchema[]>,
      default() {
        return {};
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

  const { t } = useI18n();
  const emits = defineEmits(['done', 'cancel']);
  const submitLoading = ref(false);
  const formref = ref();
  const schemaList = ref<ComponentSchema[]>([]);
  const formData = reactive({});

  const doSubmit = async () => {
    return axios[props.action](props.api, formData);
  };
  const setFormData = () => {
    each(props.formSchema, (item) => {
      formData[item.Name] = get(props.model, item.Name) || item.Default;
    });
  };

  const setSchemaList = () => {
    const groupOrderMap = {};
    let list = map(props.formSchema, (o, i) => {
      const item = cloneDeep(o);
      const content = parseComponentSchema(item);
      item.order = 10 * (i + 1);
      item.parentCom = get(content, 'component.0');
      item.childCom = get(content, 'component.1');
      item.labelList = parseMapstring(item);
      item.Options = parseOptions(item);
      item.props = get(content, 'props') || {};
      item.rules = map(content.rules, (sItem) => {
        sItem.message = t(sItem?.message, { name: item.Label || item.Name });
        return sItem;
      });
      if (item.Group && groupOrderMap[item.Group]) {
        item.order = groupOrderMap[item.Group];
      } else if (item.Group) {
        groupOrderMap[item.Group] = item.order;
      }
      return item;
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
  const handleSubmit = async () => {
    console.log('formData:', formData);
    const res = await formref.value?.validate();
    if (!res) {
      try {
        submitLoading.value = true;
        if (props.submit) {
          await props.submit?.(formData);
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
  watchEffect(() => {
    setSchemaList();
  });
  const handleCancel = () => {
    emits('cancel');
  };
  onMounted(() => {
    setFormData();
  });
</script>

<style lang="less" scoped>
  .form-create-wrap {
    :deep(.arco-select-view) {
      width: 360px;
    }
  }

  .group-item {
    margin-bottom: 10px;

    &:only-child {
      margin-bottom: 0;
    }
  }
</style>

<template>
  <div class="group-form">
    <a-tabs
      v-if="formGroup.length > 1"
      class="page-line-tabs"
      :active-key="activeKey"
      :destroy-on-hide="destroyed"
      @change="handleTabChange"
    >
      <a-tab-pane
        v-for="(item, index) in formGroup"
        :key="item.group"
        :title="item.group"
      >
        <SingleForm
          :ref="(el: any) => setRefMap(el, item.group)"
          :form-id="`schemaForm${index}`"
          layout="vertical"
          :origin-form-data="rootFormData"
          :internal-form-data="uiFormData"
          :schema="item.schema"
          :action="action"
          @change="handleChange"
        >
        </SingleForm>
      </a-tab-pane>
    </a-tabs>
    <SingleForm
      v-if="formGroup.length === 1"
      :key="`${Date.now()}`"
      ref="schemaForm"
      form-id="schemaForm"
      layout="vertical"
      :action="action"
      :internal-form-data="uiFormData"
      :origin-form-data="rootFormData"
      :schema="formGroup[0].schema"
      @change="handleChange"
    >
    </SingleForm>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { InjectSchemaFormStatusKey, PageAction } from '@/views/config';
  import { PropType, watch, ref, nextTick, toRaw, provide, inject } from 'vue';
  import SingleForm from './single-form.vue';
  import { FieldSchema, FormGroup } from './interface';
  import { createFormGroup } from './utils/create-form-group';
  import { ProvideErrorFieldsKey } from './config';
  import { genFieldMap, genHiddenFieldData } from './utils/flatten-schema';
  import { isEmptyvalue, isBasicType } from './utils';

  const props = defineProps({
    schema: {
      type: Object as PropType<FieldSchema>,
      default() {
        return {};
      }
    },
    formData: {
      type: Object as PropType<any>,
      default() {
        return {};
      }
    },
    uiFormData: {
      type: Object as PropType<any>,
      default() {
        return {};
      }
    },
    action: {
      type: String as PropType<'edit' | 'view' | 'create'>,
      default() {
        return 'create';
      }
    }
  });

  const schemaFormStatus = inject(InjectSchemaFormStatusKey, ref(''));
  const emits = defineEmits(['update:formData', 'change']);
  const activeKey = ref<string>('schemaForm');
  const refMap = ref<any>({});
  const schemaForm = ref();
  const rootFormData = ref({});
  const destroyed = ref<boolean>(false);
  const formGroup = ref<FormGroup[]>([]);
  const hiddenFormData = ref<any>({});
  const validResult = ref<any>([]);
  const errorFields = ref<string[]>([]);

  provide(ProvideErrorFieldsKey, errorFields);
  const setRefMap = (el: any, name) => {
    if (el) {
      refMap.value[`${name}`] = el;
    }
  };

  const handleChange = (data) => {
    emits('update:formData', data);
    emits('change', data);
  };

  const handleTabChange = (key) => {
    activeKey.value = key;
  };

  const genErrorFields = () => {
    errorFields.value = [];
    _.each(validResult.value, (item) => {
      errorFields.value = _.concat(errorFields.value, _.keys(item.errors));
    });
  };
  const handleUnsetField = () => {
    const fieldList = genFieldMap(_.cloneDeep(props.schema));
    _.each(fieldList.resultList, (item) => {
      if (
        isEmptyvalue(_.get(props.formData, item.fieldPath)) &&
        !item.default &&
        isBasicType(item.type)
      ) {
        _.unset(props.formData, item.fieldPath);
      }
    });
  };
  const validate = async () => {
    const resultList: any[] = [];
    validResult.value = [];
    errorFields.value = [];
    if (formGroup.value.length === 1) {
      const res = await schemaForm.value?.validate?.();
      resultList.push({
        tab: 'Baisc',
        errors: res,
        result: !res
      });
    } else {
      await Promise.all(
        _.keys(refMap.value).map(async (key) => {
          const refEL = refMap.value[key];
          const res = await refEL?.validate?.();
          resultList.push({
            tab: key,
            errors: res,
            result: !res
          });
        })
      );
    }

    const errorList = _.filter(resultList, (item) => !item.result);
    if (errorList.length) {
      activeKey.value = errorList[0].tab;
    }

    validResult.value = errorList;

    if (!errorList.length) {
      handleUnsetField();
    } else {
      genErrorFields();
    }

    return errorList.length;
  };

  const getHiddenFormData = (groups: FormGroup[]) => {
    const result = {};
    const list = _.filter(groups, (item) => {
      return item.hidden;
    });
    _.each(list, (item) => {
      genHiddenFieldData(toRaw(item.schema), result);
    });
    hiddenFormData.value = result;
  };

  const getHiddenData = () => {
    return hiddenFormData.value;
  };

  const setFormGroupHidden = (groups: FormGroup[]) => {
    const list = _.map(groups, (item) => {
      const properties = _.get(item, 'schema.properties') || {};
      const shownFields = _.filter(_.keys(properties), (key) => {
        return !_.get(properties, [key, 'x-walrus-ui', 'hidden']);
      });
      return {
        ...item,
        hidden: !shownFields.length
      };
    });
    return list;
  };
  defineExpose({
    validate,
    getHiddenData
  });
  watch(
    () => props.formData,
    () => {
      rootFormData.value = props.formData;
    },
    {
      immediate: true,
      deep: true
    }
  );
  watch(
    () => props.schema,
    () => {
      hiddenFormData.value = {};
      formGroup.value = [];
      destroyed.value = true;
      if (schemaFormStatus.value === PageAction.CREATE) {
        rootFormData.value = {};
      }
      nextTick(() => {
        destroyed.value = false;
        const groups = createFormGroup(props.schema);
        const allGroups = setFormGroupHidden(groups);
        formGroup.value = _.filter(allGroups, (item) => {
          return !item.hidden;
        });
        activeKey.value = formGroup.value[0]?.group;

        getHiddenFormData(allGroups);
      });
    },
    {
      immediate: true,
      deep: true
    }
  );
</script>

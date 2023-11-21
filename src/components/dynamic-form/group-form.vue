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
          :origin-form-data="formData"
          :schema="item.schema"
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
      :origin-form-data="formData"
      :schema="formGroup[0].schema"
      @change="handleChange"
    >
    </SingleForm>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { PropType, watch, ref, nextTick } from 'vue';
  import SingleForm from './single-form.vue';
  import { FieldSchema, FormGroup } from './interface';
  import { createFormGroup } from './utils/create-form-group';
  import { genFieldMap } from './utils/flatten-schema';
  import FIELD_TYPE from './config/field-type';

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
    }
  });

  const emits = defineEmits(['update:formData', 'change']);
  const activeKey = ref<string>('schemaForm');
  const refMap = ref<any>({});
  const schemaForm = ref();
  const rootFormData = ref({});
  const destroyed = ref<boolean>(false);
  const formGroup = ref<FormGroup[]>([]);
  const fieldList = ref<FieldSchema[]>([]);

  const setRefMap = (el: any, name) => {
    if (el) {
      refMap.value[`${name}`] = el;
    }
  };

  const handleChange = (data) => {
    emits('update:formData', data);
    emits('change', data);
    console.log('data===99999===', props.formData);
  };

  const handleTabChange = (key) => {
    activeKey.value = key;
  };

  const isEmptyvalue = (val) => {
    return val === '' || val === null || val === undefined;
  };

  const isBasicType = (type) => {
    return [
      FIELD_TYPE.BOOLEAN,
      FIELD_TYPE.NUMBER,
      FIELD_TYPE.STRING,
      FIELD_TYPE.INTEGER
    ].includes(type);
  };
  const handleUnsetField = () => {
    const fieldList = genFieldMap(props.schema);
    _.each(fieldList, (item) => {
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
    let valid: any = null;
    if (formGroup.value.length === 1) {
      const res = await schemaForm.value?.validate?.();
      valid = res;
    } else {
      const resultList: any[] = [];
      await Promise.all(
        _.keys(refMap.value).map(async (key) => {
          const refEL = refMap.value[key];
          const res = await refEL?.validate?.();
          resultList.push({
            tab: key,
            result: !res
          });
        })
      );
      const errorList = _.filter(resultList, (item) => !item.result);
      if (errorList.length) {
        activeKey.value = errorList[0].tab;
      }
      valid = errorList.length;
    }

    if (!valid) {
      handleUnsetField();
    }

    return valid;
  };
  defineExpose({
    validate
  });
  watch(
    () => props.schema,
    () => {
      formGroup.value = [];
      destroyed.value = true;
      nextTick(() => {
        destroyed.value = false;
        formGroup.value = createFormGroup(props.schema);
        activeKey.value = formGroup.value[0]?.group;
      });
    },
    {
      immediate: true,
      deep: true
    }
  );
</script>

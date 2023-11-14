<template>
  <div class="group-form">
    <a-tabs
      v-if="formGroup.length > 1"
      class="page-line-tabs"
      :active-key="activeKey"
      @change="handleTabChange"
    >
      <a-tab-pane
        v-for="(item, index) in formGroup"
        :key="`schemaForm${index}`"
        :title="item.group"
      >
        <SingleForm
          :ref="(el: any) => setRefMap(el, `schemaForm${index}`)"
          :form-id="`schemaForm${index}`"
          layout="vertical"
          :origin-form-data="formData"
          :schema="item.schema"
        >
        </SingleForm>
      </a-tab-pane>
    </a-tabs>
    <SingleForm
      v-if="formGroup.length === 1"
      ref="schemaForm"
      form-id="schemaForm"
      layout="vertical"
      :origin-form-data="formData"
      :schema="formGroup[0].schema"
    >
    </SingleForm>
  </div>
</template>

<script lang="ts" setup>
  import { PropType, watch, ref } from 'vue';
  import SingleForm from './single-form.vue';
  import { FieldSchema, FormGroup } from './interface';
  import { createFormGroup } from './utils/create-form-group';

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

  const activeKey = ref<string>('schemaForm');
  const refMap = ref<any>({});
  const formGroup = ref<FormGroup[]>([]);

  const setRefMap = (el: any, name) => {
    if (el) {
      refMap.value[`${name}`] = el;
    }
  };

  const handleTabChange = (key) => {
    activeKey.value = key;
  };

  watch(
    () => props.schema,
    () => {
      formGroup.value = createFormGroup(props.schema);
      activeKey.value = formGroup.value[0]?.group;
      console.log('formGroup======', formGroup.value);
    },
    {
      immediate: true,
      deep: true
    }
  );
</script>

<template>
  <div>
    <a-form ref="formref" :model="formData" auto-label-width>
      <a-form-item
        v-for="fm in schemaList"
        :key="fm.Name"
        :field="fm.Name"
        :rules="fm.rules"
        :label="fm.Label || fm.Name"
        :validate-trigger="['change']"
      >
        <component
          :is="formComponents[fm.parentCom]"
          v-model="formData[fm.Name]"
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
      </a-form-item>
      <a-form-item>
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
  import { each, get, map, cloneDeep, sortBy } from 'lodash';
  import { PropType, reactive, ref, computed, onMounted } from 'vue';
  import axios, { CancelToken } from 'axios';
  import { useI18n } from 'vue-i18n';
  import editPageFooter from '@/components/edit-page-footer/index.vue';
  import { ComponentSchema, parseComponentSchema } from './config/interface';
  import formComponents from './components';
  import testData from './config/test';

  const props = defineProps({
    formSchema: {
      type: Array as PropType<ComponentSchema[]>,
      default() {
        return testData;
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
  const formData = reactive({});

  const doSubmit = async () => {
    return axios[props.action](props.api, formData);
  };
  const setFormData = () => {
    each(props.formSchema, (item) => {
      formData[item.Name] = get(props.model, item.Name) || item.Default;
    });
  };
  const schemaList = computed(() => {
    const groupOrderMap = {};
    let list = map(props.formSchema, (o, i) => {
      const item = cloneDeep(o);
      const content = parseComponentSchema(item);
      item.order = 10 * (i + 1);
      item.parentCom = get(content, 'component.0');
      item.childCom = get(content, 'component.1');
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
    return list;
  });
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

  const handleCancel = () => {
    emits('cancel');
  };
  onMounted(() => {
    setFormData();
  });
</script>

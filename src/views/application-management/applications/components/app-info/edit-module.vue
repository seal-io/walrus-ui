<template>
  <a-modal
    top="10%"
    :align-center="false"
    :width="600"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    :body-style="{ 'max-height': '400px', 'overflow': 'auto' }"
    modal-class="oci-modal"
    title="添加Module"
    @cancel="handleCancel"
    @ok="handleOk"
    @before-open="handleBeforeOpen"
    @open="handleOpened"
    @before-close="handleBeforeClose"
  >
    <div>
      <a-form ref="formref" :model="formData" auto-label-width>
        <a-form-item
          label="Name"
          field="name"
          :rules="[{ required: true, message: '名称必填' }]"
        >
          <a-input
            v-model="formData.name"
            :max-length="50"
            show-word-limit
          ></a-input>
        </a-form-item>
        <a-form-item
          label="Type"
          field="module.id"
          :rules="[{ required: true, message: '类型必选' }]"
        >
          <a-select v-model="formData.module.id" @change="handleTemplateChange">
            <a-option
              v-for="item in templates"
              :key="item.id"
              :value="item.id"
              >{{ item.id }}</a-option
            >
          </a-select>
        </a-form-item>
      </a-form>
      <div class="variables">
        <GroupTitle title="Variables"></GroupTitle>
        <formCreate
          v-if="show"
          ref="schemaForm"
          action="post"
          api=""
          :show-footer="false"
          :submit="() => {}"
          :model="formData.variables"
          :form-schema="moduleInfo.Variables"
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
  import { get, find, cloneDeep, each, assignIn } from 'lodash';
  import { ref, reactive, PropType } from 'vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import formCreate from '@/components/form-create/index.vue';
  import GroupTitle from '@/components/group-title/index.vue';
  import { TemplateRowData } from '@/views/operation-hub/templates/config/interface';

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
  const emit = defineEmits(['save', 'update:show', 'reset', 'update:action']);
  const formref = ref();
  const loading = ref(false);
  const schemaForm = ref();
  const submitLoading = ref(false);
  const moduleInfo = ref<any>({});
  const formData = reactive({
    name: '',
    module: { id: '' },
    variables: {}
  });
  const handleCancel = () => {
    emit('update:show', false);
  };
  const setFormData = (schemas) => {
    each(get(schemas, 'Variables'), (item) => {
      formData.variables[item.Name] = item.Default;
    });
  };
  const handleTemplateChange = (val) => {
    const moduleData = find(props.templates, (item) => item.id === val);
    moduleInfo.value = get(moduleData, 'schema') || {};
    setFormData(moduleInfo.value);
  };
  const handleOk = async () => {
    const res = await formref.value?.validate();
    const moduleForm = await schemaForm.value.getFormData();
    if (!res && moduleForm) {
      try {
        submitLoading.value = true;
        formData.variables = { ...moduleForm };
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

  const handleBeforeOpen = () => {
    if (props.action === 'create') {
      moduleInfo.value = get(props.templates, '0.schema') || {};
      setFormData(moduleInfo.value);
      formData.module.id = get(props.templates, '0.id') || '';
    } else {
      // set the default value
      each(get(moduleInfo.value, 'Variables') || [], (item) => {
        item.Default = get(props.dataInfo.variables, item.Name);
      });
      assignIn(formData, props.dataInfo);
    }
  };
  const handleOpened = () => {};
  const handleBeforeClose = () => {
    formref.value.resetFields();
    emit('update:action', 'create');
  };
</script>

<style lang="less" scoped></style>

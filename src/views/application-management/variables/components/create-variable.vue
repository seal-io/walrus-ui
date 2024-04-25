<template>
  <a-modal
    top="10%"
    :closable="false"
    :align-center="false"
    :width="600"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    :body-style="{ 'max-height': '500px', 'overflow': 'auto' }"
    modal-class="project-modal"
    :title="title"
    unmount-on-close
    @cancel="handleCancel"
    @ok="handleOk"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <a-spin :loading="loading" style="width: 100%; text-align: center">
      <a-form ref="formref" :model="formData" auto-label-width>
        <a-form-item
          :disabled="action === 'edit'"
          :label="$t('applications.applications.form.name')"
          hide-label
          field="metadata.name"
          :validate-trigger="['change', 'input']"
          :rules="[
            {
              required: true,
              match: validateLabelNameRegx,
              message: $t('common.validate.labelName')
            }
          ]"
        >
          <seal-input
            v-model.trim="formData.metadata.name"
            :label="$t('applications.applications.form.name')"
            :required="true"
            style="width: 100%"
            :max-length="validateInputLength.NAME"
            show-word-limit
          ></seal-input>
        </a-form-item>
        <a-form-item
          :label="$t('applications.applications.secret.value')"
          field="spec.value"
          hide-label
          validate-trigger="change"
          :rules="[
            {
              required: formData.status?.value !== '(sensitive)',
              message: $t('applications.secret.rules.value')
            }
          ]"
        >
          <seal-textarea
            v-model="formData.spec.value"
            :label="$t('applications.applications.secret.value')"
            :required="formData.status?.value !== '(sensitive)'"
            style="width: 100%"
            :auto-size="{ minRows: 4, maxRows: 4 }"
          ></seal-textarea>
        </a-form-item>
        <a-form-item
          :label="$t('common.table.description')"
          field="description"
          hide-label
          validate-trigger="change"
        >
          <seal-textarea
            v-model="formData.metadata.description"
            :label="$t('common.table.description')"
            :max-length="validateInputLength.DESC"
            show-word-limit
            style="width: 100%"
            :auto-size="{ minRows: 4, maxRows: 5 }"
          ></seal-textarea>
        </a-form-item>
        <a-form-item
          :label="$t('common.table.sensitive')"
          field="spec.sensitive"
          hide-label
          validate-trigger="change"
        >
          <seal-checkbox
            v-model="formData.spec.sensitive"
            :label="$t('common.table.sensitive')"
            :required="false"
          ></seal-checkbox>
        </a-form-item>
      </a-form>
    </a-spin>
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
  import { ref, PropType } from 'vue';
  import _ from 'lodash';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { validateLabelNameRegx, validateInputLength } from '@/views/config';
  import {
    createVariable,
    updateVariable,
    apiVersion,
    ResouceKinds
  } from '../api';
  import { VariableFormData } from '../config/interface';

  const props = defineProps({
    show: {
      type: Boolean,
      default() {
        return false;
      }
    },
    title: {
      type: String,
      default() {
        return '';
      }
    },
    info: {
      type: Object as PropType<VariableFormData>,
      default() {
        return {};
      }
    },
    action: {
      type: String as PropType<'create' | 'edit'>,
      default() {
        return 'create';
      }
    },
    scope: {
      type: String,
      default() {
        return '';
      }
    },
    namespace: {
      type: String,
      default() {
        return '';
      }
    },
    project: {
      type: String,
      default() {
        return '';
      }
    },
    environment: {
      type: String,
      default() {
        return '';
      }
    }
  });
  const emit = defineEmits(['save', 'update:show']);
  const formref = ref();
  const loading = ref(false);
  const submitLoading = ref(false);
  const formData = ref<VariableFormData>({
    apiVersion,
    kind: ResouceKinds.Variable,
    metadata: {
      name: '',
      namespace: props.namespace
    },
    spec: {
      sensitive: false,
      value: '',
      description: ''
    },
    status: {
      scope: props.scope
    }
  });
  const handleCancel = () => {
    emit('update:show', false);
  };

  const handleOk = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        submitLoading.value = true;
        if (props.action === 'create') {
          await createVariable({
            data: formData.value,
            name: formData.value.metadata.name,
            namespace: formData.value.metadata.namespace
          });
        } else {
          if (formData.value.spec.sensitive && !formData.value.spec.value) {
            formData.value = _.omit(formData.value, 'spec.value');
          }
          await updateVariable({
            data: formData.value,
            name: formData.value.metadata.name,
            namespace: formData.value.metadata.namespace
          });
        }
        setTimeout(() => {
          emit('save');
        }, 100);
        emit('update:show', false);
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
      }
    }
  };

  const handleBeforeOpen = () => {
    if (props.action === 'create') {
      formData.value = {
        apiVersion,
        kind: ResouceKinds.Variable,
        metadata: {
          name: '',
          namespace: props.namespace
        },
        spec: {
          sensitive: false,
          value: '',
          description: ''
        },
        status: {
          scope: props.scope
        }
      };
    } else {
      formData.value = props.info;
      formData.value.spec.value = props.info.spec.sensitive
        ? ''
        : props.info.status?.value || '';
    }
  };
  const handleBeforeClose = () => {
    formref.value.resetFields();
  };
</script>

<style lang="less">
  .arco-modal.project-modal {
    .btn-wrapper {
      margin-left: 12px;

      .arco-icon {
        color: rgb(var(--arcoblue-6));
        cursor: pointer;

        &:hover {
          color: rgb(var(--arcoblue-5));
        }
      }
    }
  }
</style>

<style lang="less" scoped>
  .arco-form-item-content {
    .tips-wrap {
      padding: 6px;
      color: var(--color-text-3);
      font-size: 13px;
      text-align: left;
      text-align: left;
      background-color: rgb(var(--arcoblue-1));
      border-radius: var(--border-radius-small);

      .content {
        margin-left: 20px;
        opacity: 0.7;
      }
    }
  }
</style>

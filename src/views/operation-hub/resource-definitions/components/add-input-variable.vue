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
    @cancel="handleCancel"
    @ok="handleOk"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <a-spin :loading="loading" style="width: 100%; text-align: center">
      <a-form ref="formref" :model="formData" auto-label-width>
        <a-form-item
          :label="$t('applications.applications.form.name')"
          hide-label
          field="name"
          validate-trigger="change"
          :rules="[
            {
              required: true,
              match: validateLabelNameRegx,
              message: $t('common.validate.labelName')
            }
          ]"
        >
          <seal-input
            v-model.trim="formData.name"
            :label="$t('applications.applications.form.name')"
            :required="true"
            style="width: 100%"
            :max-length="63"
            show-word-limit
          ></seal-input>
          <template #extra>
            <span class="tips">{{ $t('common.validate.labelName') }}</span>
          </template>
        </a-form-item>
        <a-form-item
          :label="$t('common.table.type')"
          field="type"
          hide-label
          validate-trigger="change"
          :rules="[{ required: true, message: $t('catalogs.form.rules.type') }]"
          @change="handleTypeChange"
        >
          <seal-select
            v-model="formData.type"
            :label="$t('common.table.type')"
            :required="true"
            :options="variableTypeList"
            style="width: 100%"
          ></seal-select>
        </a-form-item>
        <a-form-item
          :label="$t('common.table.default')"
          field="default"
          hide-label
          validate-trigger="change"
        >
          <seal-input
            v-if="formData.type === 'string'"
            v-model="formData.default"
            :label="$t('common.table.default')"
            style="width: 100%"
          ></seal-input>
          <seal-input-number
            v-if="formData.type === 'number'"
            v-model="formData.default"
            :label="$t('common.table.default')"
            style="width: 100%"
          ></seal-input-number>
          <seal-checkbox
            v-if="formData.type === 'bool'"
            v-model="formData.default"
            :label="$t('common.table.default')"
            style="width: 100%"
          ></seal-checkbox>
          <AceEditor
            v-if="formData.type === 'object'"
            lang="yaml"
            editor-id="inputVariableEditor"
            :show-gutter="true"
            height="200px"
            style="width: 100%"
            :label="$t('common.table.default')"
            :editor-default-value="formData.default"
            :model-value="formData.default"
            @input="(val) => handleInput(val, 'default')"
          ></AceEditor>
          <!-- <seal-textarea
            v-model="formData.default"
            :label="$t('applications.applications.secret.value')"
            :required="true"
            style="width: 100%"
            :auto-size="{ minRows: 4, maxRows: 4 }"
          ></seal-textarea> -->
        </a-form-item>
        <a-form-item
          :label="$t('common.table.description')"
          field="description"
          hide-label
          validate-trigger="change"
        >
          <seal-textarea
            v-model="formData.description"
            :label="$t('common.table.description')"
            :max-length="100"
            show-word-limit
            style="width: 100%"
            :auto-size="{ minRows: 4, maxRows: 5 }"
          ></seal-textarea>
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
  import { ref, reactive, PropType } from 'vue';
  import _ from 'lodash';
  import AceEditor from '@/components/ace-editor/index.vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { validateLabelNameRegx } from '@/views/config';
  import {
    json2Yaml,
    yaml2Json
  } from '@/components/form-create/config/yaml-parse';
  import { variableTypeList } from '../config';

  interface InfoData {
    name: string;
    default: any;
    description: string;
    type: string;
  }
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
      type: Object as PropType<InfoData>,
      default() {
        return {};
      }
    },
    action: {
      type: String as PropType<'create' | 'edit'>,
      default() {
        return 'create';
      }
    }
  });
  const emit = defineEmits(['save', 'update:show']);
  const formref = ref();
  const loading = ref(false);
  const submitLoading = ref(false);
  const formData = ref<InfoData>({
    name: '',
    default: '',
    description: '',
    type: 'string'
  });
  const handleCancel = () => {
    emit('update:show', false);
  };

  const handleOk = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        const data = _.cloneDeep(formData.value);
        data.default =
          data.type === 'object' ? yaml2Json(data.default) : data.default;
        emit('save', data);
        setTimeout(() => {
          emit('update:show', false);
        }, 100);
      } catch (error) {
        // eslint-disable-next-line no-console
      }
    }
  };
  const handleInput = (val, key) => {
    formData.value[key] = val;
  };
  const handleTypeChange = () => {
    formData.value.default = null;
  };
  const handleBeforeOpen = () => {
    if (props.action === 'create') {
      formData.value = {
        name: '',
        default: '',
        type: 'string',
        description: ''
      };
    } else {
      formData.value = _.cloneDeep(props.info);
      formData.value.default =
        formData.value.type === 'object'
          ? json2Yaml(props.info.default)
          : formData.value.default;
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

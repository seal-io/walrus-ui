<template>
  <a-modal
    top="10%"
    :closable="false"
    :align-center="false"
    :width="532"
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
      <a-form
        ref="formref"
        :model="formData"
        auto-label-width
        label-align="left"
      >
        <a-form-item
          :label="$t('operation.connectors.table.name')"
          field="name"
          hide-asterisk
          :hide-label="true"
          :disabled="action === ModalAction.EDIT"
          :validate-trigger="['change']"
          :rules="[
            {
              required: true,
              match: validateLabelNameRegx,
              message: $t('common.validate.labelName')
            }
          ]"
        >
          <seal-input
            v-model="formData.name"
            :label="$t('operation.connectors.table.name')"
            :required="true"
            :style="{ width: `${InputWidth.LARGE}px` }"
            :max-length="63"
            show-word-limit
          ></seal-input>

          <template #extra>
            <span class="tips">{{ $t('common.validate.labelName') }}</span>
          </template>
        </a-form-item>
        <a-form-item
          hide-label
          field="type"
          :rules="[
            {
              required: true,
              message: $t('catalogs.form.rules.type')
            }
          ]"
        >
          <seal-select
            v-model="formData.type"
            :label="$t('catalogs.form.source.type')"
            :required="true"
            :style="{ width: `${InputWidth.LARGE}px` }"
          >
            <a-option
              v-for="(item, index) in providers"
              :key="index"
              :value="item.value"
            >
              <ProviderIcon :provider="toLower(item.value)"></ProviderIcon>
              <span style="margin-left: 5px">{{ item.label }}</span>
            </a-option>
            <template #prefix>
              <ProviderIcon
                :provider="toLower(formData.type || '')"
              ></ProviderIcon>
            </template>
          </seal-select>
        </a-form-item>
        <a-form-item
          field="source"
          :label="$t('operation.templates.detail.source')"
          hide-asterisk
          :hide-label="true"
          :validate-trigger="['change']"
          :rules="[
            {
              required: true,
              message: $t('operation.templates.rules.source')
            }
          ]"
        >
          <seal-input
            v-model.trim="formData.source"
            :label="$t('operation.templates.detail.source')"
            :required="true"
            :style="{ width: `${InputWidth.LARGE}px` }"
          ></seal-input>
          <template #extra>
            <span>{{
              $t('catalogs.form.source.desc', {
                url: 'https://github.com/terraform-seal-modules'
              })
            }}</span>
          </template>
        </a-form-item>
        <a-form-item
          :label="$t('operation.environments.table.description')"
          hide-asterisk
          :hide-label="true"
          field="description"
        >
          <seal-textarea
            v-model="formData.description"
            :label="$t('operation.environments.table.description')"
            :style="{ width: `${InputWidth.LARGE}px` }"
            :auto-size="{ minRows: 4, maxRows: 4 }"
            :max-length="200"
            show-word-limit
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
  import { ref, reactive, PropType, computed } from 'vue';
  import { urlReg } from '@/utils/validate';
  import _, { toLower, get } from 'lodash';
  import { ModalActionType } from '@/views/config/interface';
  import {
    ModalAction,
    InputWidth,
    validateLabelNameRegx
  } from '@/views/config';
  import { execSucceed } from '@/utils/monitor';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import ProviderIcon from '@/components/provider-icon/index.vue';
  import { CatalogFormData } from '../config/interface';
  import { createCatalog, updateCatalog } from '../api';

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
    action: {
      type: String as PropType<ModalActionType>,
      default() {
        return ModalAction.CREATE;
      }
    },
    dataInfo: {
      type: Object,
      default() {
        return {};
      }
    }
  });
  const providers = [
    {
      label: 'Github',
      value: 'Github'
    },
    {
      label: 'Gitlab',
      value: 'Gitlab'
    }
  ];
  const emit = defineEmits(['save', 'update:show', 'update:dataInfo']);
  const formref = ref();
  const loading = ref(false);
  const submitLoading = ref(false);
  const formData: CatalogFormData = reactive({
    description: '',
    // icon: '',
    name: '',
    source: '',
    type: 'Github'
  });

  const handleCancel = () => {
    emit('update:show', false);
  };

  const handleOk = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        submitLoading.value = true;
        if (props.action === ModalAction.EDIT) {
          await updateCatalog(formData);
        } else {
          await createCatalog(formData);
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
  const resetForm = () => {
    formData.description = '';
    formData.name = '';
    formData.source = '';
    formData.type = 'Github';
    emit('update:dataInfo', {});
  };
  const init = async () => {
    _.assignIn(formData, props.dataInfo);
  };
  const handleBeforeOpen = () => {
    init();
  };
  const handleBeforeClose = () => {
    formref.value.resetFields();
    resetForm();
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
  :deep(.arco-select-view-single) {
    .arco-select-view-prefix {
      padding-right: 5px;
    }
  }
</style>

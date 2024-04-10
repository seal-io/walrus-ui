<template>
  <a-modal
    top="10%"
    :closable="false"
    :align-center="false"
    :width="652"
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
        <TemplateBasic
          v-model:form-data="formData"
          :action="action"
        ></TemplateBasic>
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
  import _ from 'lodash';
  import useCallCommon from '@/hooks/use-call-common';
  import { ModalActionType } from '@/views/config/interface';
  import { ModalAction, apiVersion, ResourceKinds } from '@/views/config';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import ProviderIcon from '@/components/provider-icon/index.vue';
  import TemplateBasic from './template-basic.vue';
  import { GlobalNamespace, createTemplate, updateTemplate } from '../api';
  import { TemplateFormData } from '../config/interface';

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
      label: 'GitHub',
      value: 'Github'
    },
    {
      label: 'GitLab',
      value: 'Gitlab'
    },
    {
      label: 'Gitee',
      value: 'Gitee'
    }
  ];
  const sealCatalog = 'https://github.com/walrus-catalog';
  const emit = defineEmits(['save', 'update:show', 'update:dataInfo']);
  const { route } = useCallCommon();
  const projectName = route.params.projectName as string;
  const formref = ref();
  const loading = ref(false);
  const submitLoading = ref(false);
  const formData = ref<TemplateFormData>({
    apiVersion,
    kind: ResourceKinds.Template,
    metadata: {
      name: '',
      namespace: projectName || GlobalNamespace
    },
    spec: {
      templateFormat: 'terraform',
      description: '',
      vcsRepository: {
        platform: 'Github',
        url: '',
        token: ''
      }
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
        if (props.action === ModalAction.CREATE) {
          await createTemplate(formData.value);
        } else {
          await updateTemplate(formData.value);
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
    formData.value = {
      apiVersion,
      kind: ResourceKinds.Template,
      metadata: {
        name: '',
        namespace: projectName || GlobalNamespace
      },
      spec: {
        templateFormat: 'terraform',
        description: '',
        vcsRepository: {
          platform: 'Github',
          url: '',
          token: ''
        }
      }
    };
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

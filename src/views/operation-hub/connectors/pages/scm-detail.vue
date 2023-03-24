<template>
  <comCard top-gap class="kuber-detail-wrap">
    <GroupTitle :title="title" show-back></GroupTitle>
    <div>
      <a-form ref="formref" :model="formData" auto-label-width>
        <a-form-item
          :label="$t('operation.connectors.detail.clusterName')"
          field="name"
          :rules="[
            {
              required: true,
              message: $t('operation.connectors.rules.name')
            }
          ]"
        >
          <a-input
            v-model="formData.name"
            style="width: 500px"
            :max-length="50"
            show-word-limit
          ></a-input>
        </a-form-item>
        <a-form-item
          field="configData.kubeconfig"
          :hide-asterisk="false"
          label="描述"
          :validate-trigger="['change']"
        >
          <a-textarea
            v-model.trim="formData.configData.kubeconfig"
            style="width: 500px"
            :spellcheck="false"
            :auto-size="{ minRows: 4, maxRows: 6 }"
          />
        </a-form-item>
        <a-form-item label="类型">
          <a-select :options="typeOptions" style="width: 500px"></a-select>
        </a-form-item>
        <a-form-item label="访问令牌">
          <a-input style="width: 500px"></a-input>
        </a-form-item>
      </a-form>
    </div>
    <EditPageFooter>
      <template #save>
        <a-button
          type="primary"
          class="cap-title cancel-btn"
          :loading="submitLoading"
          @click="handleSubmit"
          >{{ $t('common.button.confirm') }}</a-button
        >
      </template>
      <a-button
        type="outline"
        class="cap-title cancel-btn"
        @click="handleCancel"
        >{{ $t('common.button.cancel') }}</a-button
      >
    </EditPageFooter>
  </comCard>
</template>

<script lang="ts" setup>
  import { assignIn } from 'lodash';
  import { ref, reactive, onMounted, computed } from 'vue';
  import GroupTitle from '@/components/group-title/index.vue';
  import readBlob from '@/utils/readBlob';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { ConnectorFormData } from '../config/interface';
  import { createConnector, updateConnector, queryItemConnector } from '../api';

  const { t, router, route } = useCallCommon();
  const id = route.query.id as string;
  const formref = ref();
  const submitLoading = ref(false);
  const formData: ConnectorFormData = reactive({
    name: '',
    configData: {
      kubeconfig: ''
    },
    configVersion: 'v1',
    type: 'Kubernetes',
    enableFinOps: true
  });

  const typeOptions = [
    { label: 'GitHub', value: 'github' },
    { label: 'GitLab', value: 'gitlab' }
  ];
  const title = computed(() => {
    if (id) {
      return t('operation.connectors.title.edit', { type: 'Kubernetes' });
    }
    return t('operation.connectors.title.new', { type: 'Kubernetes' });
  });
  const handleUploadSuccess = async (list, fileItem) => {
    const res = await readBlob(fileItem.file);
    formData.configData.kubeconfig = res as string;
    formref.value.validateField('configData.kubeconfig');
  };
  const handleBeforeUpload = async (file) => {
    return true;
  };
  const handleSubmit = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        submitLoading.value = true;
        if (id) {
          await updateConnector(formData);
        } else {
          await createConnector(formData);
        }
        router.back();
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
      }
    }
  };
  const getConnectorInfo = async () => {
    if (!id) return;
    try {
      const { data } = await queryItemConnector({ id });
      assignIn(formData, data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCancel = () => {
    router.back();
  };
  getConnectorInfo();
</script>

<style lang="less" scoped>
  .kuber-detail-wrap {
    .label-wrap {
      display: flex;
      align-items: center;

      .text {
        margin-right: 8px;
      }
    }
  }
</style>

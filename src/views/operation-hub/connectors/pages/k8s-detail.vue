<template>
  <comCard top-gap class="kuber-detail-wrap">
    <GroupTitle
      :title="title"
      show-back
      :show-edit="pageAction === 'view'"
      @edit="handleEdit"
    ></GroupTitle>
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
            v-if="pageAction === 'edit'"
            v-model="formData.name"
            style="width: 500px"
            :max-length="50"
            show-word-limit
          ></a-input>
          <span v-else class="readonly-view-label">{{
            formData.name || '-'
          }}</span>
        </a-form-item>
        <a-form-item
          v-if="pageAction === 'edit'"
          field="configData.kubeconfig"
          :hide-asterisk="false"
          label="KubeConfig"
          :validate-trigger="['change']"
          :rules="[
            {
              required: true,
              message: $t('operation.connectors.rules.kubeconfig')
            }
          ]"
        >
          <a-textarea
            v-model="formData.configData.kubeconfig"
            style="width: 500px"
            :spellcheck="false"
            :placeholder="$t('operation.connectors.rules.kubeconfigTips')"
            :auto-size="{ minRows: 6, maxRows: 10 }"
          />
          <template #extra>
            <div>
              <a-upload
                action="/"
                :auto-upload="false"
                :show-file-list="false"
                :on-before-upload="handleBeforeUpload"
                @change="handleUploadSuccess"
              >
                <template #upload-button>
                  <div>
                    <a-button type="primary" size="small">
                      <template #icon><icon-file /></template>
                      {{ $t('operation.connectors.detail.readfile') }}</a-button
                    >
                    <span style="margin-left: 5px">{{
                      $t('operation.connectors.detail.fileformat')
                    }}</span>
                  </div>
                </template>
              </a-upload>
            </div>
          </template>
        </a-form-item>
        <a-form-item label="">
          <template #label>
            <div class="label-wrap">
              <span class="text">成本分析器(可选)</span>
            </div>
          </template>
          <a-checkbox
            v-if="pageAction == 'edit'"
            v-model="formData.enableFinOps"
            >{{ $t('operation.connectors.rules.enable') }}</a-checkbox
          >
          <span v-else class="readonly-view-label">{{
            formData.enableFinOps ? '已开启' : '未开启'
          }}</span>
        </a-form-item>
      </a-form>
    </div>
    <EditPageFooter v-if="pageAction === 'edit'">
      <template #save>
        <a-button
          type="primary"
          class="cap-title cancel-btn"
          :loading="submitLoading"
          @click="handleSubmit"
          >{{ $t('common.button.save') }}</a-button
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
  import usePageAction from '@/hooks/use-page-action';
  import { ConnectorFormData } from '../config/interface';
  import { createConnector, updateConnector, queryItemConnector } from '../api';

  const { t, router, route } = useCallCommon();
  const { pageAction, handleEdit } = usePageAction();
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
    category: 'Kubernetes',
    enableFinOps: true
  });

  const title = computed(() => {
    if (!id) {
      return t('operation.connectors.title.new', { type: 'Kubernetes' });
    }
    if (id && pageAction.value === 'edit') {
      return t('operation.connectors.title.edit', { type: 'Kubernetes' });
    }
    if (id && pageAction.value === 'view') {
      return t('operation.connectors.title.view', { type: 'Kubernetes' });
    }
    return t('operation.connectors.title.edit', { type: 'Kubernetes' });
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
    if (pageAction.value === 'edit' && route.params.action === 'view') {
      pageAction.value = 'view';
      getConnectorInfo();
      return;
    }
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

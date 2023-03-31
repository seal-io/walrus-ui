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
          label="名称"
          field="name"
          :rules="[
            {
              required: pageAction === 'edit',
              message: '名称必填'
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
          <span v-else>{{ formData.name }}</span>
        </a-form-item>
        <!-- <a-form-item
          field="description"
          :hide-asterisk="false"
          label="描述"
          :validate-trigger="['change']"
        >
          <a-textarea
            v-model="formData.description"
            style="width: 500px"
            :spellcheck="false"
            :auto-size="{ minRows: 4, maxRows: 6 }"
          />
        </a-form-item> -->
        <a-form-item
          label="类型"
          field="type"
          :rules="[{ required: pageAction === 'edit', message: '类型必选' }]"
        >
          <a-select
            v-if="pageAction === 'edit'"
            v-model="formData.type"
            style="width: 500px"
          >
            <a-option
              v-for="(item, index) in typeOptions"
              :key="index"
              :value="item.value"
            >
              <ProviderIcon :provider="toLower(item.value)"></ProviderIcon>
              <span style="margin-left: 5px">{{ item.label }}</span>
            </a-option>
            <template #prefix>
              <ProviderIcon :provider="toLower(formData.type)"></ProviderIcon>
            </template>
          </a-select>
          <span v-else
            ><ProviderIcon
              :provider="toLower(formData.type)"
              class="mright-5"
            ></ProviderIcon>
            <span>{{ formData.type }}</span>
          </span>
        </a-form-item>
        <a-form-item
          v-if="pageAction === 'edit'"
          label="Access Token"
          field="configData.token"
          :rules="[
            { required: pageAction === 'edit', message: '访问令牌必填' }
          ]"
        >
          <a-input-password
            v-model="formData.configData.token"
            style="width: 500px"
          ></a-input-password>
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
  import { assignIn, toLower } from 'lodash';
  import { ref, reactive, onMounted, computed } from 'vue';
  import GroupTitle from '@/components/group-title/index.vue';
  import readBlob from '@/utils/readBlob';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import usePageAction from '@/hooks/use-page-action';
  import ProviderIcon from '@/components/provider-icon/index.vue';
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
      token: ''
    },
    description: '',
    configVersion: 'v1',
    type: 'Github',
    category: 'VersionControl',
    enableFinOps: false
  });

  const typeOptions = [
    { label: 'GitHub', value: 'Github' }
    // { label: 'GitLab', value: 'Gitlab' }
  ];
  const title = computed(() => {
    if (!id) {
      return t('operation.connectors.title.new', { type: '版本控制' });
    }
    if (id && pageAction.value === 'edit') {
      return t('operation.connectors.title.edit', { type: '版本控制' });
    }
    if (id && pageAction.value === 'view') {
      return t('operation.connectors.title.view', { type: '版本控制' });
    }
    return t('operation.connectors.title.edit', { type: '版本控制' });
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

    :deep(.arco-select-view-single) {
      .arco-select-view-prefix {
        padding-right: 5px;
      }
    }
  }
</style>

<template>
  <ComCard top-gap>
    <GroupTitle title="环境详情"></GroupTitle>
    <a-form ref="formref" :model="formData" auto-label-width>
      <a-form-item
        :label="$t('operation.environments.table.name')"
        field="name"
        :validate-trigger="['change']"
        :rules="[{ required: true, message: '环境名称必填' }]"
      >
        <a-input
          v-model="formData.name"
          style="width: 500px"
          :max-length="50"
          show-word-limit
        ></a-input>
      </a-form-item>
      <a-form-item
        :label="$t('operation.environments.table.description')"
        field="description"
      >
        <a-textarea
          v-model="formData.description"
          :max-length="200"
          show-word-limit
          :auto-size="{ minRows: 6, maxRows: 10 }"
        ></a-textarea>
      </a-form-item>
      <a-form-item
        :label="$t('operation.connectors.menu')"
        field="connectors"
        :validate-trigger="['change']"
        :rules="[{ required: true, message: '请添加连接器' }]"
      >
        <connectorsTable></connectorsTable>
        <template #extra>
          <div style="display: flex">
            <a-button
              type="primary"
              size="small"
              style="margin-right: 8px; padding: 0 6px"
              @click="handleAddConnector"
            >
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('operation.environments.detail.addConnector') }}</a-button
            >
            <ConnectorSelector
              v-if="showModal"
              v-model:show="showModal"
              v-model:selected="formData.connectors"
              :list="connectorList"
              @change="handleConnectorChange"
            ></ConnectorSelector>
          </div>
        </template>
      </a-form-item>
    </a-form>
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
  </ComCard>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import GroupTitle from '@/components/group-title/index.vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { EnvironFormData, EnvironmentRow } from '../config/interface';
  import connectorsTable from '../components/connectors.vue';
  import ConnectorSelector from '../components/connector-selector.vue';

  const { router } = useCallCommon();
  const formref = ref();
  const selectedList = ref<string[]>([]);
  const connectorList = [
    { label: 'connector-1', value: '1' },
    { label: 'connector-2', value: '2' },
    { label: 'connector-3', value: '3' }
  ];
  const showModal = ref(false);
  const submitLoading = ref(false);
  const formData: EnvironFormData = reactive({
    name: '',
    description: '',
    connectors: []
  });
  const handleAddConnector = () => {
    showModal.value = true;
  };
  const handleConnectorChange = () => {};
  const handleSubmit = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        submitLoading.value = true;
        // TODO
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
      }
    }
  };
  const handleCancel = () => {
    router.back();
  };
</script>

<style></style>

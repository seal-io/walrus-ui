<template>
  <ComCard top-gap>
    <GroupTitle show-back title="新建模块"></GroupTitle>
    <a-select v-model="type" :options="optionList" style="width: 300px">
    </a-select>
    <EditPageFooter>
      <template #save>
        <a-button
          type="primary"
          class="cap-title cancel-btn"
          :loading="submitLoading"
          @click="handleCreatePR"
          >{{ $t('operation.templates.gpt.create') }}</a-button
        >
      </template>
      <template #cancel>
        <a-button
          type="outline"
          class="cap-title cancel-btn"
          @click="handleCancel"
          >{{ $t('common.button.cancel') }}</a-button
        >
      </template>
    </EditPageFooter>
    <CreatePR v-model:show="showModal" title="创建PR" :status="status">
    </CreatePR>
  </ComCard>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import GroupTitle from '@/components/group-title/index.vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import CreatePR from '../components/create-pr.vue';

  const optionList = [
    { label: 'create a kubernetes workload', value: 'k8s' },
    { label: 'create a alicloud vm', value: 'alivm' }
  ];
  const { router } = useCallCommon();
  const type = ref('k8s');
  const status = ref('create');
  const showModal = ref(false);
  const submitLoading = ref(false);

  const handleCreatePR = async () => {
    showModal.value = true;
  };
  const handleCancel = () => {
    router.back();
  };
</script>

<style lang="less" scoped></style>

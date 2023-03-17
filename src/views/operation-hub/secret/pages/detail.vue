<template>
  <ComCard top-gap>
    <GroupTitle
      show-back
      :title="
        id
          ? $t('operation.environments.edit')
          : $t('operation.environments.create')
      "
    ></GroupTitle>
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
          v-model="formData.value"
          style="width: 500px"
          :max-length="200"
          show-word-limit
          :auto-size="{ minRows: 6, maxRows: 10 }"
        ></a-textarea>
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
  import { SecretFormData, SecretRow } from '../config/interface';
  import { createSecret, updateSecret, queryItemSecret } from '../api';

  const { router, route } = useCallCommon();
  const id = route.query.id as string;
  const formref = ref();
  const submitLoading = ref(false);
  const formData = ref({
    name: '',
    value: '',
    project: {
      id: ''
    }
  });

  const getItemSecretInfo = async () => {
    if (!id) return;
    try {
      const { data } = await queryItemSecret({ id });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        submitLoading.value = true;
        // TODO
        if (id) {
          await updateSecret(formData.value);
        } else {
          await createSecret(formData.value);
        }
        router.back();
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
      }
    }
  };
  const handleCancel = () => {
    router.back();
  };
  const init = async () => {
    getItemSecretInfo();
  };
  init();
</script>

<style></style>

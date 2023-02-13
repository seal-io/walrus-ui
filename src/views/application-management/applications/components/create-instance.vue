<template>
  <a-modal
    top="10%"
    :align-center="false"
    :width="500"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    :body-style="{ 'max-height': '400px', 'overflow': 'auto' }"
    modal-class="oci-modal"
    :title="$t('applications.applications.detail.createInstance')"
    @cancel="handleCancel"
    @ok="handleOk"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <a-spin :loading="loading" style="width: 100%; text-align: center">
      <a-form ref="formref" :model="formData" auto-label-width>
        <a-form-item
          :label="$t('applications.applications.table.name')"
          field="name"
          validate-trigger="change"
          :rules="[{ required: true, message: '实例名称必填' }]"
        >
          <a-input v-model="formData.name"></a-input>
        </a-form-item>
        <a-form-item
          :label="$t('applications.applications.detail.env')"
          field="environment"
          validate-trigger="change"
          :rules="[{ required: true, message: '实例部署环境必选' }]"
        >
          <a-select
            v-model="formData.environment"
            :options="environmentList"
          ></a-select>
        </a-form-item>
      </a-form>
    </a-spin>
    <template #footer>
      <EditPageFooter>
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
  import { ref, reactive } from 'vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';

  const props = defineProps({
    show: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });
  const emit = defineEmits(['save', 'update:show', 'reset']);
  const formref = ref();
  const loading = ref(false);
  const submitLoading = ref(false);
  const formData = reactive({
    name: '',
    environment: ''
  });
  const environmentList = ref([
    { label: 'Development', value: 'dev' },
    { label: 'Production', value: 'prod' },
    { label: 'Staging', value: 'stage' }
  ]);
  const handleCancel = () => {
    emit('update:show', false);
  };
  const handleOk = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        submitLoading.value = true;
        // TODO
        setTimeout(() => {
          emit('save');
        }, 200);
        emit('update:show', false);
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
      }
    }
  };
  const handleBeforeOpen = () => {};
  const handleBeforeClose = () => {};
</script>

<style></style>

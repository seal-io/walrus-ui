<template>
  <a-modal
    top="10%"
    :closable="false"
    :align-center="false"
    :width="550"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    :body-style="{ 'max-height': '400px', 'overflow': 'auto' }"
    modal-class="oci-modal"
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
        layout="vertical"
      >
        <a-form-item
          :label="$t('operation.connectors.menu')"
          field="connectors"
          validate-trigger="change"
          :rules="[{ required: true, message: '请选择连接器' }]"
        >
          <a-select v-model="formData.connectors" :options="labelList">
          </a-select>
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
    },
    title: {
      type: String,
      default() {
        return '';
      }
    }
  });
  const emit = defineEmits(['save', 'update:show', 'reset']);
  const formref = ref();
  const loading = ref(false);
  const submitLoading = ref(false);
  const formData = reactive({
    connectors: []
  });
  const labelList = ref([{ label: 'connector-1', value: 'dev' }]);
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
  const handleAddLabel = () => {
    labelList.value.push({ label: 'label1', value: 'dev' });
  };
  const handleDeleteLabel = (index) => {
    labelList.value.splice(index, 1);
  };
  const handleBeforeOpen = () => {};
  const handleBeforeClose = () => {};
</script>

<style></style>

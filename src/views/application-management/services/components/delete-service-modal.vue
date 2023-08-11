<template>
  <a-modal
    top="10%"
    simple
    :closable="false"
    :align-center="false"
    :width="500"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    :body-style="{
      'max-height': '400px',
      'overflow': 'auto',
      'text-align': 'center'
    }"
    modal-class="oci-modal"
    :title="title"
    @cancel="handleCancel"
    @ok="handleOk"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <template #title>
      <icon-exclamation-circle-fill
        style="margin-right: 5px; color: rgb(255, 125, 0)"
      />
      <span>{{ title }}</span>
    </template>
    <div style="display: center">
      <a-checkbox v-model="withoutCleanup">{{
        $t('applications.applications.instance.deleteTips')
      }}</a-checkbox>
    </div>
    <template #footer>
      <EditPageFooter style="margin-top: 0">
        <template #save>
          <a-button
            :loading="submitLoading"
            type="primary"
            class="cap-title cancel-btn"
            @click="handleOk"
            >{{ $t('common.button.confirm') }}</a-button
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
  import { ref } from 'vue';
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
    },
    serviceId: {
      type: String,
      default() {
        return '';
      }
    },
    callback: Function
  });

  const emit = defineEmits(['save', 'update:show']);
  const withoutCleanup = ref(false);
  const submitLoading = ref(false);

  const handleCancel = () => {
    emit('update:show', false);
  };
  const handleOk = async () => {
    try {
      submitLoading.value = true;
      await props.callback?.(withoutCleanup.value);
      emit('update:show', false);
      submitLoading.value = false;
    } catch (error) {
      submitLoading.value = false;
    }
  };

  const handleBeforeOpen = () => {
    withoutCleanup.value = false;
  };
  const handleBeforeClose = () => {};
</script>

<style></style>

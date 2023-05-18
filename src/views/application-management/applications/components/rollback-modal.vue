<template>
  <a-modal
    top="10%"
    :closable="false"
    :align-center="false"
    :width="600"
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
    <div>
      <a-select></a-select>
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
  import AceEditor from '@/components/ace-editor/index.vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  // import useCloseModal from '@/views/commons/hooks/use-close-modal';
  import { InstanceData, HistoryData } from '../config/interface';

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
  // const { closeModal } = useCloseModal();
  const instanceList = ref<InstanceData[]>([]);
  const revisionList = ref<HistoryData[]>([]);
  const submitLoading = ref(false);

  const handleOk = () => {};
  const handleCancel = () => {
    // closeModal();
  };
  const handleBeforeOpen = () => {};
  const handleBeforeClose = () => {};
</script>

<style lang="less" scoped></style>

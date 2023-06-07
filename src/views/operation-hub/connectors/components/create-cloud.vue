<template>
  <a-modal
    top="10%"
    :closable="false"
    :align-center="false"
    :width="700"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    :body-style="{
      'max-height': '500px',
      'overflow': 'auto'
    }"
    modal-class="project-modal"
    :title="title"
    unmount-on-close
    @cancel="handleCancel"
    @ok="handleOk"
    @open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <a-spin :loading="loading" style="width: 100%">
      <cloudProvider :id="info.id" ref="connectorPage"></cloudProvider>
    </a-spin>
    <template #footer>
      <EditPageFooter style="margin-top: 0">
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
  import { ref, PropType, computed } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { ModalAction } from '@/views/config';
  import cloudProvider from '../pages/cloud-provider.vue';

  const props = defineProps({
    show: {
      type: Boolean,
      default() {
        return false;
      }
    },
    info: {
      type: Object,
      default() {
        return {};
      }
    },
    action: {
      type: String,
      default() {
        return 'edit';
      }
    },
    showValue: {
      type: String,
      default() {
        return '';
      }
    }
  });
  const emit = defineEmits([
    'save',
    'update:showValue',
    'reset',
    'update:info'
  ]);
  const { t } = useCallCommon();
  const connectorPage = ref();
  const loading = ref(false);
  const submitLoading = ref(false);

  const title = computed(() => {
    if (props.action === ModalAction.CREATE) {
      return t('operation.connectors.title.new', {
        type: t('operation.connectors.reinstall.cloudProvider')
      });
    }
    return t('operation.connectors.title.edit', {
      type: t('operation.connectors.reinstall.cloudProvider')
    });
  });
  const handleCancel = () => {
    emit('update:showValue', '');
  };
  const handleOk = async () => {
    submitLoading.value = true;
    const res = await connectorPage.value.handleSubmit();
    if (!res) {
      submitLoading.value = false;
    } else {
      submitLoading.value = false;
      emit('save');
      emit('update:showValue', '');
    }
  };
  const init = async () => {
    loading.value = true;
    await connectorPage.value?.getConnectorInfo?.();
    loading.value = false;
  };
  const handleBeforeOpen = () => {
    init();
  };
  const handleBeforeClose = () => {
    emit('update:info', {});
    loading.value = false;
  };
</script>

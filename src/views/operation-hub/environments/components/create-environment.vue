<template>
  <a-modal
    top="10%"
    :closable="false"
    :align-center="false"
    :width="800"
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
      <EnvironmentDetail :id="info.id" ref="envDetail"></EnvironmentDetail>
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
  import EnvironmentDetail from '../pages/detail.vue';

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
    }
  });
  const emit = defineEmits(['save', 'update:show', 'reset', 'update:info']);
  const { t } = useCallCommon();
  const envDetail = ref();
  const loading = ref(false);
  const submitLoading = ref(false);

  const title = computed(() => {
    if (props.action === ModalAction.CREATE) {
      return t('operation.environments.create');
    }
    if (props.action === ModalAction.EDIT) {
      return t('operation.environments.edit');
    }
    return t('operation.environments.view');
  });
  const handleCancel = () => {
    emit('update:show', false);
  };
  const handleOk = async () => {
    submitLoading.value = true;
    const res = await envDetail.value.handleSubmit();
    if (!res) {
      submitLoading.value = false;
    } else {
      submitLoading.value = false;
      emit('save');
      emit('update:show', false);
    }
  };
  const init = async () => {
    loading.value = true;
    await envDetail.value?.init?.();
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

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
      'min-height': '200px',
      'overflow': 'auto',
      'backgroundColor': 'var(--color-fill-2)'
    }"
    modal-class="project-modal"
    :title="title"
    @cancel="handleCancel"
    @ok="handleOk"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <div class="content" style="white-space: pre-wrap">{{ content }}</div>
    <template #footer>
      <EditPageFooter style="margin-top: 0">
        <template #save>
          <a-button
            type="primary"
            class="cap-title cancel-btn"
            @click="handleOk"
            >{{ $t('common.button.confirm') }}</a-button
          >
        </template>
      </EditPageFooter>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
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
    content: {
      type: String,
      default() {
        return '';
      }
    }
  });
  const emit = defineEmits(['update:show', 'update:content']);

  const handleCancel = () => {
    emit('update:show', false);
  };

  const handleOk = async () => {
    emit('update:show', false);
    emit('update:content', '');
  };

  const handleBeforeOpen = () => {};
  const handleBeforeClose = () => {};
</script>

<style lang="less" scoped></style>

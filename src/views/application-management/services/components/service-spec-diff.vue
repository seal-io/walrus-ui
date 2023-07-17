<template>
  <a-modal
    top="10%"
    :closable="false"
    :align-center="false"
    :width="700"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    :body-style="{ 'max-height': '560px', 'overflow': 'auto' }"
    modal-class="spec-diff-modal"
    :title="title"
    @cancel="handleCancel"
    @ok="handleOk"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <div>
      <div v-show="removeLines.length || addLines.length">
        <AceEditor
          ref="editor_instance"
          read-only
          :remove-lines="removeLines"
          :add-lines="addLines"
          editor-id="firstEditor"
          :editor-default-value="codeResult"
          lang="json"
          :height="460"
        ></AceEditor>
      </div>
      <div
        v-show="!removeLines.length && !addLines.length"
        style="color: var(--color-text-3); text-align: left"
        >{{ $t('applications.applications.history.diff.same') }}</div
      >
    </div>
    <template #footer>
      <EditPageFooter style="margin-top: 0">
        <template #save>
          <a-button
            :disabled="_.get(serviceInfo, 'status') === RevisionStatus.Running"
            type="primary"
            class="cap-title cancel-btn"
            @click="handleOk"
            >{{ $t('common.button.rollback') }}</a-button
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
  import _ from 'lodash';
  import useCodeDiff from '@/hooks/use-code-diff';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import AceEditor from '@/components/ace-editor/index.vue';
  import { RevisionStatus } from '@/views/application-management/services/config';

  const props = defineProps({
    title: String,
    serviceInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    show: {
      type: Boolean,
      default() {
        return false;
      }
    },
    content: {
      type: Object,
      default() {
        return {};
      }
    }
  });
  const {
    removeLines,
    addLines,
    codeResult,
    setDiffResult,
    getCodeResult,
    getDiffResultLines,
    clearDiffLines
  } = useCodeDiff();
  const emit = defineEmits(['confirm', 'update:show']);

  const handleCancel = () => {
    emit('update:show', false);
  };
  const handleOk = async () => {
    emit('update:show', false);
    emit('confirm');
  };
  const reset = () => {
    codeResult.value = '';
    clearDiffLines();
  };
  const init = () => {
    if (!props.content?.old && !props.content?.new) {
      return;
    }
    setDiffResult(props.content.old, props.content.new);
    getCodeResult();
    getDiffResultLines();
    console.log('addLine===', addLines.value, removeLines.value);
  };
  const handleBeforeOpen = () => {
    init();
  };
  const handleBeforeClose = () => {
    reset();
  };
</script>

<style lang="less">
  .arco-modal.spec-diff-modal {
    .tips {
      margin-bottom: 10px;
      color: var(--color-text-3);
      font-size: 13px;

      .rm {
        padding: 0 6px;
        background-color: var(--code-remove-number-line);
        border-radius: 2px;
      }

      .add {
        padding: 0 6px;
        background-color: var(--code-add-number-line);
        border-radius: 2px;
      }
    }
  }
</style>

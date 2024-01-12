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
      <div>
        <AceEditor
          ref="editor_instance"
          read-only
          :remove-lines="removeLines"
          :add-lines="addLines"
          editor-id="diffModelEditor"
          :editor-default-value="codeResult"
          lang="json"
          :height="400"
        >
          <template #label>
            <a-select
              v-model="compareType"
              :bordered="false"
              style="height: 36px; padding-left: 0"
              @change="handleCompareTypeChange"
            >
              <a-option
                v-for="item in options"
                :key="item.value"
                :value="item.value"
              >
                {{ $t(item.label) }}
              </a-option>
            </a-select>
          </template>
        </AceEditor>
        <div class="m-t-10">
          <seal-textarea
            v-model="changeComment"
            style="width: 100%"
            :label="$t('common.table.rollback.mark')"
            :max-length="100"
            show-word-limit
          ></seal-textarea>
        </div>
      </div>
      <a-alert
        v-if="!removeLines.length && !addLines.length"
        class="m-t-10"
        style="color: var(--color-text-3); text-align: left"
        >{{ $t('applications.applications.history.diff.same') }}</a-alert
      >
    </div>
    <template #footer>
      <EditPageFooter style="margin-top: 0">
        <template #save>
          <a-button
            v-if="
              userStore.hasProjectResourceActions({
                projectID,
                environmentID,
                resource: Resources.ResourceRevisions,
                actions: ['PUT']
              })
            "
            :disabled="
              _.get(serviceInfo, 'status.summaryStatus') ===
              RevisionStatus.Running
            "
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
            >{{ $t('common.button.close') }}</a-button
          >
        </template>
      </EditPageFooter>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { ref, PropType, Prop, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { useUserStore } from '@/store';
  import { Resources } from '@/permissions/config';
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
    options: {
      type: Array as PropType<{ label: string; value: string }[]>,
      default() {
        return [];
      }
    },
    show: {
      type: Boolean,
      default() {
        return false;
      }
    },
    activeType: {
      type: String,
      default() {
        return '';
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
  const userStore = useUserStore();
  const route = useRoute();
  const projectID = route.params.projectId as string;
  const environmentID = route.params.environmentId as string;
  const editorKey = ref(Date.now());
  const changeComment = ref('');
  const compareType = ref(props.activeType);
  const compareOptions = [
    {
      label: 'applications.service.revision.runtime',
      value: 'computedAttributes'
    },
    { label: 'applications.service.revision.custom', value: 'attributes' }
  ];

  const emit = defineEmits(['confirm', 'update:show', 'compare']);

  const handleCompareTypeChange = (val) => {
    compareType.value = val;
    emit('compare', val);
  };
  const handleCancel = () => {
    emit('update:show', false);
  };
  const handleOk = async () => {
    emit('update:show', false);
    emit('confirm', changeComment.value);
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
  };
  const handleBeforeOpen = () => {
    editorKey.value = Date.now();
    changeComment.value = '';
    init();
  };
  const handleBeforeClose = () => {
    setTimeout(() => {
      reset();
    }, 300);
  };
  watch(
    () => props.content,
    () => {
      init();
    }
  );
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

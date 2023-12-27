<template>
  <a-modal
    top="10%"
    :closable="false"
    :align-center="false"
    :width="800"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    :body-style="{ 'max-height': '600px', 'overflow': 'auto' }"
    modal-class="run-config-modal"
    @cancel="handleCancel"
    @ok="handleOk"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <a-spin :loading="loading" style="width: 100%; text-align: center">
      <div class="flex m-b-10">
        <a-upload
          action="/"
          :auto-upload="false"
          :show-file-list="false"
          :on-before-upload="handleBeforeUpload"
          @change="handleUploadSuccess"
        >
          <template #upload-button>
            <div>
              <a-button type="primary" size="small">
                <template #icon><icon-file /></template>
                {{ $t('operation.connectors.detail.readfile') }}</a-button
              >
              <!-- <span style="margin-left: 5px">{{
                $t('operation.connectors.detail.fileformat')
              }}</span> -->
            </div>
          </template>
        </a-upload>
      </div>
      <AceEditor
        ref="editor"
        v-model="formData.yaml"
        :editor-default-value="defaultValue"
        editor-id="firstEditor"
        lang="yaml"
        :height="500"
      ></AceEditor>
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
  import { ref, reactive, PropType, computed } from 'vue';
  import readBlob from '@/utils/readBlob';
  import _ from 'lodash';
  import i18n from '@/locale';
  import AceEditor from '@/components/ace-editor/index.vue';
  import {
    validateYaml,
    yaml2Json
  } from '@/components/form-create/config/yaml-parse';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';

  interface InfoData {
    variables: object;
    description: string;
  }
  const props = defineProps({
    show: {
      type: Boolean,
      default() {
        return false;
      }
    },
    info: {
      type: Object as PropType<any>,
      default() {
        return {};
      }
    },
    action: {
      type: String as PropType<'create' | 'edit'>,
      default() {
        return 'create';
      }
    }
  });
  const emit = defineEmits(['save', 'update:show']);
  const loading = ref(false);
  const submitLoading = ref(false);
  const defaultValue = ref<string>('');
  const editor = ref<any>();
  const formData = ref<any>({
    yaml: ''
  });

  const handleCancel = () => {
    formData.value.yaml = '';
    emit('update:show', false);
  };

  const handleUploadSuccess = async (list, fileItem) => {
    const res = await readBlob(fileItem.file);
    formData.value.yaml = res;
    defaultValue.value = res as string;
  };
  const handleBeforeUpload = async (file) => {
    return true;
  };

  const handleOk = async () => {
    const res = validateYaml(formData.value.yaml);
    if (!res.error) {
      try {
        const data = _.cloneDeep(formData.value);
        emit('save', data);
        setTimeout(() => {
          emit('update:show', false);
        }, 100);
      } catch (error) {
        // eslint-disable-next-line no-console
      }
    }
  };

  const handleBeforeOpen = () => {
    formData.value.yaml = '';
    defaultValue.value = '';
    editor?.value?.clear();
  };
  const handleBeforeClose = () => {
    defaultValue.value = '';
  };
</script>

<style lang="less">
  .arco-modal.project-modal {
    .btn-wrapper {
      margin-left: 12px;

      .arco-icon {
        color: rgb(var(--arcoblue-6));
        cursor: pointer;

        &:hover {
          color: rgb(var(--arcoblue-5));
        }
      }
    }
  }
</style>

<style lang="less" scoped>
  .run-config-modal {
    .title {
      margin-bottom: 16px;
      color: var(--color-text-2);
      font-weight: var(--font-weight-medium);
      font-size: var(--font-size-large);
      text-align: left;
    }
  }

  .arco-form-item-content {
    .tips-wrap {
      padding: 6px;
      color: var(--color-text-3);
      font-size: 13px;
      text-align: left;
      text-align: left;
      background-color: rgb(var(--arcoblue-1));
      border-radius: var(--border-radius-small);

      .content {
        margin-left: 20px;
        opacity: 0.7;
      }
    }
  }
</style>

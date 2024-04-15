<template>
  <a-modal
    top="5%"
    :closable="false"
    :align-center="false"
    :ok-text="$t('common.button.save')"
    :visible="show"
    width="auto"
    :mask-closable="false"
    :esc-to-close="false"
    unmount-on-close
    :body-style="{ 'max-height': '600px', 'overflow': 'auto' }"
    modal-class="import-config-modal"
    @cancel="handleCancel"
    @ok="handleOk"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <div style="width: 100%" class="flex">
      <div>
        <div class="flex m-b-10 flex-justify-between">
          <a-upload
            action="/"
            :auto-upload="false"
            :show-file-list="false"
            :on-before-upload="handleBeforeUpload"
            @change="handleUploadSuccess"
          >
            <template #upload-button>
              <div>
                <a-button type="primary">
                  <template #icon><icon-file /></template>
                  {{ $t('operation.connectors.detail.readfile') }}</a-button
                >
              </div>
            </template>
          </a-upload>
          <a-button type="outline" @click="handleShowBox"
            >Walrus File Hub<icon-menu-unfold class="m-l-5"
          /></a-button>
        </div>
        <div class="yaml">
          <AceEditor
            ref="editor"
            v-model="formData.yaml"
            :editor-default-value="defaultValue"
            editor-id="firstEditor"
            lang="yaml"
            style="width: 760px"
            :height="500"
          ></AceEditor>
        </div>
        <span
          v-if="showError?.error"
          class="error-tips"
          style="color: rgb(var(--red-6))"
          >{{ showError?.error?.message }}</span
        >
      </div>

      <div class="box" :class="{ show: showBox, readme: showReadme }">
        <div class="input">
          <a-input
            v-model.trim="query"
            style="width: 200px; height: 36px"
            :placeholder="$t('common.search.name.placeholder')"
          >
            <template #prefix>
              <icon-search />
            </template>
          </a-input>
        </div>
        <div class="content-wrap">
          <div class="content">
            <WalrusFilelist
              :data-list="dataList"
              :refresh="refreshKey"
              @show-readme="handleShowReadme"
              @select="handleSelectItem"
            ></WalrusFilelist>
          </div>
          <div class="readme" :class="{ collapse: showReadme }">
            <div class="close">
              <a-link @click="handleToggleReadme"><icon-close-circle /></a-link>
            </div>
            <markdownViewer
              :md-str="markdownConent"
              class="readme-content"
            ></markdownViewer>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <EditPageFooter style="margin-top: 0">
        <template #save>
          <a-button
            :loading="submitLoading"
            type="primary"
            class="cap-title cancel-btn"
            @click="handleOk"
            >{{ $t('common.button.import') }}</a-button
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
  import 'github-markdown-css';
  import i18n from '@/locale';
  import { ref, reactive, PropType, computed } from 'vue';
  import readBlob from '@/utils/readBlob';
  import _ from 'lodash';
  import AceEditor from '@/components/ace-editor/index.vue';
  import {
    validateYaml,
    yaml2Json
  } from '@/components/form-create/config/yaml-parse';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { getWalrusFileHub } from '@/views/login/api';
  import markdownViewer from '@/components/markdown-viewer/index.vue';
  import WalrusFilelist from './walrus-filelist.vue';

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
  const walrusFileList = ref<any[]>([]);
  const query = ref<string>('');
  const showReadme = ref<boolean>(false);
  const showBox = ref<boolean>(true);
  const markdownConent = ref<string>('');
  const selectedFile = ref(false);
  const showError = ref<any>();
  const refreshKey = ref(Date.now());
  const formData = ref<any>({
    yaml: ''
  });

  const dataList = computed(() => {
    if (!_.trim(query.value)) {
      return walrusFileList.value;
    }
    return _.filter(walrusFileList.value, (item) => {
      return item.name.includes(query.value);
    });
  });
  const handleSelectItem = (item) => {
    formData.value.yaml = item.content;
    defaultValue.value = item.content;
    markdownConent.value = item.readme;
    selectedFile.value = true;
  };

  const handleToggleReadme = () => {
    showReadme.value = false;
  };

  const handleShowReadme = (item) => {
    formData.value.yaml = item.content;
    defaultValue.value = item.content;
    markdownConent.value = item.readme;
    showReadme.value = true;
  };
  const handleCancel = () => {
    formData.value.yaml = '';
    emit('update:show', false);
  };

  const handleUploadSuccess = async (list, fileItem) => {
    const res = await readBlob(fileItem.file);
    formData.value.yaml = res;
    defaultValue.value = res as string;
    selectedFile.value = false;
    refreshKey.value = Date.now();
    markdownConent.value = '';
  };
  const handleBeforeUpload = async (file) => {
    return true;
  };

  const handleShowBox = () => {
    showBox.value = !showBox.value;
  };
  const getWalrusFileList = async () => {
    try {
      const { data } = await getWalrusFileHub();
      walrusFileList.value = data || [];
    } catch (error) {
      walrusFileList.value = [];
      // eslint-disable-next-line no-console
    }
  };
  const handleOk = async () => {
    const res = validateYaml(formData.value.yaml);
    if (!formData.value.yaml) {
      showError.value = {
        error: {
          message: i18n.global.t('common.form.rule.input', { name: 'YAML' })
        }
      };
      return;
    }
    showError.value = res;
    if (!res?.error && formData.value.yaml) {
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
    showBox.value = true;
    showError.value = {};
    editor?.value?.clear();
  };
  const handleBeforeClose = () => {
    defaultValue.value = '';
  };
  getWalrusFileList();
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

<style lang="less">
  .import-config-modal {
    .box {
      position: relative;
      width: 0;
      height: 550px;
      margin-left: 0;
      overflow-x: hidden;
      overflow-y: auto;
      transition: all 0.3s ease-in-out;

      .input {
        display: flex;
        padding-bottom: 10px;
      }

      &.show {
        width: 230px;
        margin-left: 15px;
        transition: all 0.3s ease-in-out;
      }

      &.show.readme {
        width: 530px;
        transition: width 0.3s ease-in-out;
      }

      .content-wrap {
        display: flex;
        width: max-content;
      }

      .content {
        width: 215px;
        height: 500px;
        overflow-x: hidden;
        overflow-y: auto;
      }

      .readme {
        width: 0;
        max-height: 500px;
        padding: 0;
        overflow-x: hidden;
        overflow-y: auto;
        font-size: 12px !important;
        font-family: 'noto sans', sans-serif;
        background-color: var(--color-fill-1);
        border-radius: var(--border-radius-small);
        transition: all 0.3s ease-in-out;

        .close {
          text-align: right;
        }

        &.collapse {
          width: 300px;
          margin-left: 10px;
          padding: 10px;
          transition: all 0.3s ease-in-out;
        }

        .readme-content {
          width: 280px;
        }
      }
    }

    .yaml {
      display: flex;
    }
  }
</style>

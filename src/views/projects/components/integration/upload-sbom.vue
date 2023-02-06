<template>
  <div id="containerOci" class="container">
    <a-modal
      top="10%"
      :align-center="false"
      :width="600"
      :ok-text="$t('common.button.save')"
      :visible="show"
      :mask-closable="false"
      :title="$t('resource.sbom.upload.title')"
      @cancel="handleCancel"
      @ok="handleOk"
      @before-open="handleBeforeOpen"
      @before-close="handleBeforeClose"
    >
      <a-spin :loading="loading" style="width: 100%; text-align: center">
        <a-form ref="formref" :model="formData" auto-label-width>
          <a-form-item
            hide-asterisk
            field="name"
            :label="$t('resource.sbom.upload.name')"
            validate-trigger="change"
            :rules="[
              {
                required: true,
                message: $t('resource.sbom.rule.name'),
              },
            ]"
          >
            <a-input
              v-model="formData.name"
              max-length="50"
              show-word-limit
            ></a-input>
          </a-form-item>
          <!-- <a-form-item
            hide-asterisk
            field="namespace"
            :label="$t('resource.sbom.upload.namespace')"
            validate-trigger="change"
            :rules="[
              {
                required: false,
              },
            ]"
          >
            <template #label>
              <span>{{ $t('resource.sbom.upload.namespace') }}</span>
              <span class="optional-notes">{{
                `(${$t('common.form.field.optional')})`
              }}</span>
            </template>
            <a-input
              v-model="formData.namespace"
              max-length="50"
              show-word-limit
            ></a-input>
          </a-form-item> -->
          <a-form-item
            hide-asterisk
            field="fileId"
            :label="$t('resource.sbom.upload.file')"
            validate-trigger="change"
            :rules="[
              {
                required: true,
                message: $t('resource.sbom.rule.file'),
              },
            ]"
          >
            <a-upload
              ref="uploadRef"
              action="/v1/resources?upload=true"
              with-credentials
              :auto-upload="false"
              :show-retry-button="false"
              :show-cancel-button="false"
              :limit="1"
              :file-list="files"
              :data="{ name: formData.name }"
              @progress="handleUploadProgress"
              @success="handleUploadSuccess"
              @change="handleFileChange"
              @error="handleUploadError"
            >
              <template #start-icon>
                <span></span>
              </template>
              <template #file-name>
                <div
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                  "
                >
                  <span
                    style="
                      display: inline-block;
                      width: 365px;
                      padding-right: 5px;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    "
                    >{{ get(files, '0.name') }}</span
                  >
                  <a-progress
                    v-show="percent"
                    type="circle"
                    size="mini"
                    :percent="percent"
                    style="margin-left: 5px"
                  />
                </div>
              </template>
              <template #upload-button>
                <div class="upload-btn-wrap">
                  <a-button type="primary">{{
                    $t('common.button.addfile')
                  }}</a-button>
                </div>
              </template>
            </a-upload>
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
  </div>
</template>

<script lang="ts" setup>
  import { cloneDeep, map, pick, get } from 'lodash';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { reactive, ref } from 'vue';
  import useLoading from '@/hooks/loading';

  const props = defineProps({
    show: {
      type: Boolean,
      default() {
        return false;
      },
    },
    provider: {
      type: String,
      default() {
        return '';
      },
    },
  });
  const uploadRef = ref();
  const files = ref([]);
  const { loading, setLoading } = useLoading();
  const emit = defineEmits(['save', 'update:show']);
  const submitLoading = ref(false);
  const formref = ref();
  const percent = ref(0);
  const formData = reactive({
    name: '',
    // namespace: '',
    fileId: '',
  });

  const handleCancel = () => {
    emit('update:show', false);
  };
  const handleBeforeClose = () => {
    files.value = [];
    formData.name = '';
    // formData.namespace = '';
    formData.fileId = '';
    formref.value.resetFields();
  };
  const handleFileChange = (fileList, file) => {
    files.value = fileList;
    percent.value = get(file, 'percent') || 0;
    if (files.value.length) {
      formData.fileId = 'ok';
    } else {
      formData.fileId = '';
    }
    console.log('file====', file, fileList);
  };
  const handleBeforeUpload = async (file) => {
    console.log('file===', file);
    // files.value = [].concat(file)
    if (files.value.length) {
      formData.fileId = 'ok';
      return true;
    }
    formData.fileId = '';
    return false;
  };
  const handleUploadProgress = (e) => {
    submitLoading.value = true;
    percent.value = e?.percent || 0;
  };
  const handleUploadSuccess = () => {
    submitLoading.value = false;
    setTimeout(() => {
      emit('save');
    }, 100);
    emit('update:show', false);
  };
  const handleUploadError = () => {
    submitLoading.value = false;
  };
  const handleUpload = (e) => {
    e.stopPropagation();
    uploadRef.value.submit();
  };
  const handleOk = async (e) => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        handleUpload(e);
      } catch (error) {
        submitLoading.value = false;
      }
    }
  };

  const handleBeforeOpen = async () => {
    console.log('open');
  };
</script>

<style lang="less">
  .arco-trigger-content.image-import-modal {
    .arco-select-dropdown-list-wrapper {
      max-height: 140px;
    }
  }
</style>

<style lang="less" scoped>
  .image-name {
    // font-size: 12px;
    color: var(--color-text-3);
  }

  :deep(.arco-upload-wrapper) {
    text-align: left;
  }

  :deep(.arco-upload-progress) {
    display: none;
  }
</style>

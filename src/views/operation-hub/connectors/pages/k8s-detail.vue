<template>
  <comCard top-gap class="kuber-detail-wrap">
    <GroupTitle title="Kubernetes Detail"></GroupTitle>
    <div>
      <a-form
        ref="formref"
        :model="formData"
        auto-label-width
        layout="vertical"
      >
        <a-form-item
          :label="$t('operation.connectors.detail.clusterName')"
          field="name"
          :rules="[
            {
              required: true,
              message: '集群名称必填'
            }
          ]"
        >
          <a-input
            v-model="formData.name"
            :max-length="50"
            show-word-limit
          ></a-input>
        </a-form-item>
        <a-form-item
          field="kubeConfig"
          :hide-asterisk="false"
          label="KubeConfig"
          :validate-trigger="['change']"
          :rules="[
            {
              required: true,
              message: 'kubeconfig为必填'
            }
          ]"
        >
          <a-textarea
            v-model.trim="formData.kubeConfig"
            placeholder="可上传配置文件或者直接输入在下方文本框"
            :auto-size="{ minRows: 6, maxRows: 10 }"
          />
          <template #extra>
            <div>
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
                    <span style="margin-left: 5px">{{
                      $t('operation.connectors.detail.fileformat')
                    }}</span>
                  </div>
                </template>
              </a-upload>
            </div>
          </template>
        </a-form-item>
        <a-form-item label="是否部署成本分析器(可选)">
          <template #label>
            <div class="label-wrap">
              <span class="text">是否部署成本分析器(可选)</span>
              <a-checkbox v-model="formData.depolyAnalyzer"></a-checkbox>
            </div>
          </template>
        </a-form-item>
      </a-form>
    </div>
    <EditPageFooter>
      <template #save>
        <a-button
          type="primary"
          class="cap-title cancel-btn"
          :loading="submitLoading"
          @click="handleSubmit"
          >{{ $t('common.button.confirm') }}</a-button
        >
      </template>
      <a-button
        type="outline"
        class="cap-title cancel-btn"
        :loading="submitLoading"
        @click="handleCancel"
        >{{ $t('common.button.cancel') }}</a-button
      >
    </EditPageFooter>
  </comCard>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue';
  import GroupTitle from '@/components/group-title/index.vue';
  import readBlob from '@/utils/readBlob';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import router from '@/router';

  // 是否部署成本分析器
  const formref = ref();
  const submitLoading = ref(false);
  const formData = reactive({
    name: '',
    kubeConfig: '',
    depolyAnalyzer: true
  });

  const handleUploadSuccess = async (list, fileItem) => {
    const res = await readBlob(fileItem.file);
    formData.kubeConfig = res as string;
    formref.value.validateField('kubeConfig');
  };
  const handleBeforeUpload = async (file) => {
    return true;
  };
  const handleSubmit = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        submitLoading.value = true;
        // TODO
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
      }
    }
  };
  const handleCancel = () => {
    router.back();
  };
</script>

<style lang="less" scoped>
  .kuber-detail-wrap {
    .label-wrap {
      display: flex;
      align-items: center;

      .text {
        margin-right: 8px;
      }
    }
  }
</style>

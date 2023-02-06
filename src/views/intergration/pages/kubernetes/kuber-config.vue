<template>
  <div class="container">
    <a-space direction="vertical" fill :size="0">
      <div class="title">
        <div>
          <span>Kubernetes</span>
          <a-tag
            v-if="formData.id"
            color="#00B42A"
            size="small"
            style="margin-left: 8px"
            >{{ $t('intergration.configured') }}</a-tag
          >
          <a-tag
            v-if="!formData.id"
            color="#ff7d00"
            size="small"
            style="margin-left: 8px"
            >{{ $t('intergration.unconfigured') }}</a-tag
          >
        </div>
      </div>
      <com-card class="com-card">
        <a-form
          ref="form"
          :model="formData"
          auto-label-width
          layout="vertical"
          @submit="handleSubmit"
        >
          <a-form-item
            field="name"
            :hide-asterisk="true"
            :label="$t('intergration.containerrepo.form.clustername')"
            :validate-trigger="['change', 'input']"
            :rules="[
              {
                required: true,
                message: $t('intergration.rules.kuber.name'),
              },
            ]"
          >
            <a-input v-model="formData.name" :max-length="50" show-word-limit />
          </a-form-item>
          <a-form-item
            field="kubeConfig"
            :hide-asterisk="true"
            :label="$t('intergration.containerrepo.form.kuberconfig')"
            :validate-trigger="['change', 'input']"
            :rules="[
              {
                required: true,
                message: $t('intergration.rules.kuber.config'),
              },
            ]"
          >
            <template #label>
              <div>
                <span>{{
                  $t('intergration.containerrepo.form.kuberconfig')
                }}</span>
                <span class="config-label">{{
                  `(${$t('intergration.containerrepo.kubeconfig.desc')})`
                }}</span>
              </div>
            </template>
            <a-textarea
              v-model.trim="formData.kubeConfig"
              placeholder=""
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
                        {{ $t('intergration.containerrepo.upload') }}</a-button
                      >
                      <span style="margin-left: 5px">{{
                        $t('intergration.containerrepo.file.desc')
                      }}</span>
                    </div>
                  </template>
                </a-upload>
              </div>
            </template>
          </a-form-item>
          <a-form-item
            field="excludedNamespaces"
            :hide-asterisk="true"
            :label="$t('intergration.containerrepo.form.excludes')"
          >
            <a-input-group style="width: 100%">
              <a-select
                v-model="formData.excludeType"
                :style="{ width: '160px' }"
                @change="handleExcludeTypeChange"
              >
                <a-option
                  v-for="(item, index) in namespaceExcludesOpts"
                  :key="index"
                  :value="item.value"
                  >{{ $t(item.label) }}</a-option
                >
              </a-select>
              <a-select
                v-if="formData.excludeType !== 'none'"
                v-model="formData.excludedNamespaces"
                multiple
                allow-create
                unique-value
                :max-tag-count="3"
                :trigger-props="{
                  contentClass:
                    !excludeOpitons?.length &&
                    !formData?.excludedNamespaces?.length
                      ? 'input-select-drop-list'
                      : '',
                }"
                :placeholder="
                  formData.excludeType === 'custom'
                    ? $t('intergration.containerrepo.options.holder')
                    : ''
                "
              >
                <a-option style="display: none"></a-option>
                <a-option
                  v-for="(item, index) in excludeOpitons"
                  :key="index"
                  :disabled="formData.excludeType === 'system'"
                  :value="item.value"
                  >{{ item.label }}</a-option
                >
                <template #empty><span></span></template>
              </a-select>
              <!-- <a-input
                v-else
                v-model="formData.namespaceStr"
                :disabled="formData.excludeType === 'none'"
                @change="handleNamespacesChange"
              /> -->
            </a-input-group>
            <template v-if="formData.excludeType === 'custom'" #extra>
              <span>{{ $t('intergration.containerrepo.namespace.desc') }}</span>
            </template>
          </a-form-item>
          <a-form-item class="edit-footer-wrap">
            <EditPageFooter>
              <template #save>
                <a-button
                  type="primary"
                  :loading="submitLoading"
                  :disabled="submitLoading"
                  html-type="submit"
                  class="cap-title save-btn"
                  >{{ $t('intergration.button.save') }}</a-button
                >
              </template>
              <template #cancel>
                <a-button
                  type="outline"
                  class="cap-title cancel-btn"
                  @click="handleCancel"
                  >{{ $t('common.button.cancel') }}</a-button
                >
              </template>
            </EditPageFooter>
          </a-form-item>
        </a-form>
      </com-card>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import comCard from '@/components/page-wrap/com-card.vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { cloneDeep, isEqual, join, split, get, filter, map } from 'lodash';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
  import { ref, computed, reactive, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import {
    FormType,
    submitFormData,
    getFormData,
    updateFormData,
  } from '../../api/kubernetes';
  import { namespaceExcludesOpts } from '../../config';
  import { readBlob } from './hooks';

  const systemOptions = [
    { label: 'kube-node-lease', value: 'kube-node-lease' },
    { label: 'kube-public', value: 'kube-public' },
    { label: 'kube-system', value: 'kube-system' },
    { label: 'local-path-storage', value: 'local-path-storage' },
  ];
  const optionsList = [
    'kube-node-lease',
    'kube-public',
    'kube-system',
    'local-path-storage',
  ];
  type receiveAddress = Array<{ value: string }>;
  type idType = string | number | undefined;
  const { locale } = useI18n();
  const route = useRoute();
  const router = useRouter();
  const { id } = route.query;
  const form = ref();
  const excludedNamespacesList = ref<string[]>([]);
  const submitLoading = ref(false);
  const testLoading = ref(false);
  const testPass = ref(false);
  const checkMsg = ref<string>('');
  let copyFormData: any = {};
  let formData: FormType = reactive({
    name: '',
    excludeType: 'none',
    kubeConfig: '',
    namespaceStr: '',
    excludedNamespaces: [],
  });

  const excludeOpitons = computed(() => {
    if (formData.excludeType === 'system') {
      return [
        { label: 'kube-node-lease', value: 'kube-node-lease' },
        { label: 'kube-public', value: 'kube-public' },
        { label: 'kube-system', value: 'kube-system' },
        { label: 'local-path-storage', value: 'local-path-storage' },
      ];
    }
    if (formData.excludeType === 'custom') {
      const list = formData.excludedNamespaces || [];
      const arr = [...new Set([...list, ...excludedNamespacesList.value])];
      return map(arr, (val) => {
        return {
          label: val,
          value: val,
        };
      });
    }
    return [];
  });
  const getExcludeType = (value) => {
    if (!value.length) {
      return 'none';
    }
    if (value.every((val) => optionsList.includes(val))) {
      return 'system';
    }
    return 'custom';
  };
  const save = async () => {
    const res = { id: '' };
    if (formData.id) {
      // update
      await updateFormData(formData);
      res.id = formData.id;
    } else {
      // create
      const { data } = await submitFormData(formData);
      res.id = data.id;
    }
    return res;
  };
  const handleSubmit = async ({ errors }) => {
    console.log('valid:', { values: formData, errors });
    if (!errors) {
      try {
        submitLoading.value = true;
        const res = await save();
        copyFormData = cloneDeep(formData);
        submitLoading.value = false;
        router.push({
          name: 'kubernetesList',
        });
      } catch (error) {
        console.log(error);
        submitLoading.value = false;
      }
    }
  };

  const handleCancel = () => {
    router.back();
  };
  const fetchFormData = async () => {
    copyFormData = cloneDeep(formData);
    if (!id) return;
    const params: any = {
      id,
    };
    try {
      getFormData(params).then((res) => {
        console.log('res:', res, params);
        formData = Object.assign(formData, res.data);
        formData.excludedNamespaces = get(res.data, 'excludedNamespaces') || [];
        excludedNamespacesList.value =
          get(res.data, 'excludedNamespaces') || [];
        // formData.namespaceStr = join(formData.excludedNamespaces, ',');
        formData.excludeType = getExcludeType(formData.excludedNamespaces);
        copyFormData = cloneDeep(formData);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleExcludeTypeChange = () => {
    if (formData.excludeType === 'system') {
      formData.excludedNamespaces = [
        'kube-node-lease',
        'kube-public',
        'kube-system',
        'local-path-storage',
      ];
    } else {
      formData.excludedNamespaces = [];
      formData.namespaceStr = '';
    }
  };
  const handleNamespacesChange = () => {
    let list = split(formData.namespaceStr, ',');
    list = filter(list, (val) => !!val);
    formData.namespaceStr = join(list, ',');
  };
  const handleUploadSuccess = async (list, fileItem) => {
    const res = await readBlob(fileItem.file);
    formData.kubeConfig = res as string;
    form.value.validateField('kubeConfig');
  };
  const handleBeforeUpload = async (file) => {
    // if (file.type === '' || file.type === 'application/x-yaml') {
    //   form.value.clearValidate();
    //   return true;
    // }
    return true;
  };
  onBeforeRouteLeave(async (to, from) => {
    console.log('leave');
    if (!isEqual(copyFormData, formData)) {
      beforeLeaveCallback(to, from, () => {
        copyFormData = cloneDeep(formData);
        router.push({
          name: to.name as string,
        });
      });
      return false;
    }
    return true;
  });
  onMounted(() => {
    fetchFormData();
  });
</script>

<style lang="less" scoped>
  .container {
    margin-top: 0;

    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 20px;
      padding-bottom: 15px;
      font-weight: 500;
      font-size: 18px;
      // border-bottom: 1px solid #fff;
    }

    :deep(.arco-btn-icon) {
      margin-right: 0;
    }

    :deep(.arco-form-item-label) {
      .config-label {
        margin-left: 5px;
        color: var(--color-text-3);
        font-size: 12px;
      }
    }

    :deep(.arco-form-item.test-btn) {
      .arco-form-item-label-col {
        display: none;
      }
    }

    :deep(.arco-form-item-content-wrapper) {
      width: 560px;
    }

    :deep(.arco-list-content .arco-empty) {
      display: none;
    }

    .com-card {
      .cap-title {
        text-transform: capitalize;
      }

      .label {
        margin-bottom: 15px;
        padding-top: 20px;
        padding-bottom: 12px;
        text-transform: capitalize;
        border-bottom: 1px solid var(--seal-border-gray);
      }

      .error-msg {
        color: rgb(var(--danger-6));
      }
    }
  }
</style>

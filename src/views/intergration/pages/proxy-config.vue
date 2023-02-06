<template>
  <div class="container">
    <a-space direction="vertical" fill :size="0">
      <div class="title">
        <div>
          <span>{{ $t('intergration.policy.title', { repo: repo }) }}</span>
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
        <!-- <a-button
          v-if="id"
          type="primary"
          style="width: 120px"
          @click="handleDelete"
          >{{ $t('common.button.delete') }}</a-button
        > -->
      </div>
      <a-card class="general-card q-s-w-card">
        <div class="label">{{ $t('intergration.policy.label') }}</div>

        <a-form
          ref="form"
          :model="formData"
          layout="vertical"
          @submit="handleSubmit"
        >
          <a-form-item
            field="name"
            :hide-asterisk="true"
            :extra="$t('intergration.form.repoNameDesc')"
            :label="$t('intergration.form.repoName')"
            :validate-trigger="['change', 'input']"
            :rules="[
              { required: true, message: $t('intergration.rules.required') },
              {
                required: true,
                match: /^[a-zA-Z]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/,
                message: $t('intergration.rules.repoName'),
              },
            ]"
          >
            <a-input
              v-model="formData.name"
              :max-length="63"
              show-word-limit
              placeholder=""
            />
          </a-form-item>
          <a-form-item
            field="upstreamUrl"
            :hide-asterisk="true"
            :label="$t('intergration.form.repoUrl')"
            :validate-trigger="['change', 'input']"
            :rules="[
              { required: true, message: $t('intergration.rules.upstreamUrl') },
              {
                match: urlReg,
                message: $t('system.rules.url'),
              },
            ]"
          >
            <a-input v-model="formData.upstreamUrl" placeholder="" />
          </a-form-item>
          <a-row>
            <a-col :span="24">
              <EditPageFooter>
                <template #save>
                  <a-button
                    type="primary"
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
              <!-- <div class="btn-wrap">
                <a-space :size="40" style="margin-bottom: 20px">
                  
                  
                </a-space>
              </div> -->
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { cloneDeep, isEqual } from 'lodash';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
  import { ref, computed, reactive, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { urlReg } from '@/utils/validate';
  import {
    submitFormData,
    getFormData,
    updateFormData,
    deleteProxyItem,
  } from '../api/proxy-config';

  interface FormType {
    id?: string;
    name: string;
    upstreamUrl: string;
    type: string;
    proxyUrl: string;
    policySelected?: string[];
  }
  type idType = string | number | undefined;
  const { t } = useI18n();
  const route = useRoute();
  const router = useRouter();
  const repo = route.params.repo as string;
  const { id } = route.query;
  const policyList = ref([]);
  let copyFormData: any = {};
  let formData = reactive<FormType>({
    name: '',
    upstreamUrl: '',
    type: repo,
    proxyUrl: '',
    policySelected: [],
  });

  const transferTitle = computed(() => {
    return [t('intergration.policy.list'), t('intergration.policy.selected')];
  });
  const handleDelete = async () => {
    console.log('delete');
    const params = {
      id,
    };
    try {
      await deleteProxyItem(params);
      router.push({
        name: 'allIntegration',
      });
    } catch (error) {
      console.log(error);
    }
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
    if (!errors) {
      console.log('valid:', { values: formData, errors });
      const res = await save();
      copyFormData = cloneDeep(formData);
      router.push({
        name: 'repoPolicy',
        params: {
          repo,
        },
        query: {
          type: repo,
        },
      });
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
        copyFormData = cloneDeep(formData);
      });
    } catch (error) {
      console.log(error);
    }
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
      text-transform: capitalize;
      // border-bottom: 1px solid #fff;
    }

    :deep(.arco-list-content .arco-empty) {
      display: none;
    }

    :deep(.arco-transfer) {
      width: 100%;
    }

    :deep(.arco-transfer-view) {
      width: 50%;
    }

    .general-card {
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

      .btn-wrap {
        width: 200px;
        margin: 0 auto;
        margin-top: 40px;
      }
    }
  }
</style>

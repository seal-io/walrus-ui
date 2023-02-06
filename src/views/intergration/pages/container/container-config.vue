<template>
  <div class="container">
    <a-space direction="vertical" fill :size="0">
      <div class="title">
        <div>
          <span>{{ title }}</span>
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
            :label="$t('intergration.webhook.name')"
            :validate-trigger="['change', 'input']"
            :rules="[
              {
                required: true,
                message: $t('intergration.rules.webhook.name'),
              },
            ]"
          >
            <a-input v-model="formData.name" :max-length="50" show-word-limit />
          </a-form-item>
          <a-form-item
            field="url"
            :hide-asterisk="true"
            :label="$t('intergration.containerrepo.form.address')"
            :validate-trigger="['change', 'input']"
            :rules="[
              {
                required: true,
                message: $t('intergration.rules.container.url'),
              },
              {
                required: true,
                match: urlHttp,
                message: $t('system.rules.url'),
              },
            ]"
          >
            <a-input
              v-model="formData.url"
              :placeholder="$t('intergration.container.url.holder')"
            />
          </a-form-item>
          <a-form-item
            field="username"
            :hide-asterisk="true"
            :label="$t('intergration.email.userName')"
            :rules="[
              {
                required: false,
                message: $t('intergration.rules.container.userName'),
              },
            ]"
          >
            <template #label>
              <span>{{ $t('intergration.email.userName') }}</span>
              <span class="optional-notes">{{
                `(${$t('common.form.field.optional')})`
              }}</span>
            </template>
            <a-input v-model="formData.username" placeholder="" />
          </a-form-item>
          <a-form-item
            field="password"
            :hide-asterisk="true"
            :label="$t('intergration.email.password')"
            :rules="[
              {
                required: false,
                message: $t('intergration.rules.container.password'),
              },
            ]"
          >
            <a-input-password v-model="formData.password" placeholder="" />
            <template #label>
              <span>{{ $t('intergration.email.password') }}</span>
              <span class="optional-notes">{{
                `(${$t('common.form.field.optional')})`
              }}</span>
            </template>
          </a-form-item>
          <a-form-item
            :hide-asterisk="true"
            :wrapper-col-style="{ display: 'none' }"
          >
            <template #label>
              <!-- <span>{{ $t('intergration.containerrepo.connect') }}</span> -->
              <!-- <span class="desc">{{
                `(${$t('intergration.containerrepo.connect.desc')})`
              }}</span> -->
              <a-space :size="20">
                <span>
                  <span>{{
                    $t('intergration.containerrepo.connect.insecure')
                  }}</span>
                  <a-tooltip
                    :content="$t('intergration.containerrepo.verify.tips')"
                  >
                    <icon-question-circle style="margin-left: 2px" />
                  </a-tooltip>
                </span>
                <a-checkbox v-model="formData.insecure"></a-checkbox>
              </a-space>
            </template>
            <!-- <a-checkbox v-model="formData.verifyTLS">
              <span class="option-label">{{
                $t('intergration.containerrepo.connect.insecure')
              }}</span>
            </a-checkbox> -->
          </a-form-item>
          <a-form-item class="test-btn">
            <a-space direction="vertical">
              <a-button
                :disabled="testLoading"
                type="outline"
                @click="handleClickTestAccount"
              >
                <template #icon>
                  <icon-loading v-show="testLoading" style="font-size: 16px" />
                  <icon-check-circle
                    v-show="testPass"
                    style="color: rgb(0, 180, 42); font-size: 16px"
                  />
                </template>
                {{ $t('intergration.containerrepo.config.test') }}
              </a-button>
              <div v-show="!!checkMsg" class="error-msg">{{ checkMsg }}</div>
            </a-space>
          </a-form-item>
          <a-form-item class="edit-footer-wrap">
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
          </a-form-item>
        </a-form>
      </com-card>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import comCard from '@/components/page-wrap/com-card.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { cloneDeep, isEqual, capitalize } from 'lodash';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
  import { ref, computed, reactive, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { urlHttp } from '@/utils/validate';
  import {
    FormType,
    submitFormData,
    getFormData,
    updateFormData,
    testFormData,
  } from '../../api/registry';

  const { route, router, t } = useCallCommon();
  const { id } = route.query;
  const repo = route.params.repo as string;
  const form = ref();
  const testLoading = ref(false);
  const testPass = ref(false);
  const checkMsg = ref<string>('');
  let copyFormData: any = {};
  let formData: FormType = reactive({
    name: '',
    url: '',
    username: '',
    password: '',
    insecure: false,
    provider: route.params.repo as string,
  });

  const title = computed(() => {
    const repoText =
      repo === 'oci'
        ? t('intergration.containerrepo.standar')
        : capitalize(repo);
    return `${t('intergration.containerrepo.title', { repo: repoText })}`;
  });
  const save = async () => {
    console.log('valid:', formData);
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
      const res = await save();
      copyFormData = cloneDeep(formData);
      router.push({
        name: 'containerList',
        params: {
          type: repo,
        },
      });
    }
  };
  const testAcountCallback = async (data) => {
    testLoading.value = true;
    testPass.value = false;
    testFormData(data).then(
      () => {
        testLoading.value = false;
        testPass.value = true;
      },
      (error) => {
        console.log('error=====', error);
        checkMsg.value = error.msg;
        testLoading.value = false;
        testPass.value = false;
      }
    );
  };
  const handleClickTestAccount = async () => {
    form.value.validate((errors) => {
      if (errors) return;
      checkMsg.value = '';
      try {
        testAcountCallback(formData);
      } catch (error) {
        console.log('error>>', error);
        testLoading.value = false;
        testPass.value = false;
      }
    });
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

    .option-label {
      font-size: 12px;
    }

    :deep(.arco-btn-icon) {
      margin-right: 0;
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

    .desc {
      margin-left: 3px;
      color: var(--color-text-3);
      font-size: 12px;
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

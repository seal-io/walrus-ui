<template>
  <div class="container">
    <a-space direction="vertical" fill :size="0">
      <div class="title">
        <div>
          <span>{{ $t('intergration.webhook.title.create') }}</span>
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
      <a-card class="general-card q-s-w-card">
        <!-- <div class="hook-tips">
          <dl class="box">
            <dt class="icon"><icon-info-circle-fill /></dt>
            <dd class="content">{{ $t('intergration.webhook.tips') }}</dd>
          </dl>
        </div> -->
        <!-- <div class="hook-tips warn">
          <dl class="box">
            <dt class="icon"><icon-exclamation-circle-fill /></dt>
            <dd class="content">{{ $t('intergration.webhook.tokenTips') }}</dd>
          </dl>
        </div> -->
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
            <a-input
              v-model="formData.name"
              :max-length="100"
              show-word-limit
              :placeholder="$t('intergration.webhook.nameHolder')"
            />
          </a-form-item>
          <a-form-item
            :hide-asterisk="true"
            :label="$t('intergration.webhook.contentType')"
          >
            <a-input default-value="application/json" placeholder="" disabled />
          </a-form-item>
          <a-form-item
            field="webhook.url"
            :hide-asterisk="false"
            :label="$t('intergration.webhook.url')"
            :validate-trigger="['change', 'input']"
            :rules="[
              { required: true, message: $t('intergration.rules.webhook') },
              {
                required: true,
                match: urlReg,
                message: $t('system.rules.url'),
              },
            ]"
          >
            <a-input
              v-model="formData.webhook.url"
              placeholder="https://webhook.url/endpoint"
            />
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
                {{ $t('intergration.webhook.testing') }}
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
    testWebhookData,
  } from '../api/webhook';

  interface FormType {
    id?: string;
    name: string;
    webhook: {
      url: string;
    };
  }
  type receiveAddress = Array<{ value: string }>;
  type idType = string | number | undefined;
  const { locale } = useI18n();
  const route = useRoute();
  const router = useRouter();
  const { id } = route.query;
  const form = ref();
  const testLoading = ref(false);
  const testPass = ref(false);
  const checkMsg = ref<string>('');
  let copyFormData: any = {};
  let formData: FormType = reactive({
    name: '',
    webhook: {
      url: '',
    },
  });

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
      const res = await save();
      copyFormData = cloneDeep(formData);
      router.push({
        name: 'notifiersList',
        params: {
          type: 'webhook',
        },
      });
    }
  };
  const testAcountCallback = async (data) => {
    testLoading.value = true;
    testPass.value = false;
    testWebhookData(data).then(
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

    .hook-tips {
      margin-bottom: 10px;
      padding: 10px;
      color: var(--color-text-2);
      font-weight: 400;
      font-size: 14px;
      line-height: 1.5;
      background-color: var(--seal-color-bg-2);
      border-radius: 4px;

      .box {
        margin: 0;
      }

      .icon {
        float: left;
        color: var(--sealblue-6);
        font-size: 16px;
      }

      :deep(.arco-icon) {
        vertical-align: text-top;
      }

      &.warn {
        background-color: var(--seal-color-bg-3);

        .icon {
          color: var(--seal-color-warning);
        }
      }

      .content {
        margin-left: 25px;
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

    .default-receive {
      .arco-btn-size-small.arco-btn-shape-circle {
        width: 32px;
      }

      :deep(.arco-input-wrapper) {
        //   margin-right: 20px;
      }

      :deep(.arco-btn) {
        margin-left: 15px;
      }

      :deep(.arco-form-item-content-wrapper) {
        margin-right: 20px;
      }
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
      :deep(.arco-card-body) {
        padding: 20px;
      }

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

      .btn-wrap {
        // width: 200px;
        margin-top: 40px;
        margin-bottom: 20px;
        // margin-left: 100px;
        :deep(.arco-space.arco-space-align-center) {
          justify-content: center;
          width: 100%;
        }

        &.en-local {
          // margin-left: 136px;
        }
      }
    }
  }
</style>

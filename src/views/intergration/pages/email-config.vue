<template>
  <div class="container">
    <a-space direction="vertical" fill :size="0">
      <div class="title">
        <div>
          <span>{{ $t('intergration.email.title') }}</span>
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
        <a-form
          ref="formref"
          :model="formData"
          auto-label-width
          @submit="handleSubmit"
        >
          <a-form-item
            field="name"
            :hide-asterisk="false"
            :extra="$t('intergration.email.idDesc')"
            :label="$t('intergration.email.id')"
            :validate-trigger="['change', 'input']"
            :rules="[
              { required: true, message: $t('intergration.rules.host.id') },
            ]"
          >
            <a-input
              v-model="formData.name"
              :max-length="100"
              show-word-limit
              placeholder=""
            />
          </a-form-item>
          <a-form-item
            field="host"
            :hide-asterisk="false"
            :label="$t('intergration.email.ip')"
            :validate-trigger="['change', 'blur']"
            :rules="[
              { required: true, message: $t('intergration.rules.host') },
              {
                required: true,
                match: hostReg,
                message: $t('intergration.rules.host.url'),
              },
            ]"
          >
            <a-input v-model="formData.host" placeholder="" />
          </a-form-item>
          <a-form-item
            field="port"
            :hide-asterisk="false"
            :label="$t('intergration.email.port')"
            :validate-trigger="['change', 'input']"
            :rules="[
              { required: true, message: $t('intergration.rules.port') },
            ]"
          >
            <a-input-number
              v-model="formData.port"
              placeholder=""
              :hide-button="true"
            ></a-input-number>
          </a-form-item>
          <a-form-item
            field="senderAddress"
            :hide-asterisk="false"
            :extra="$t('intergration.email.senderDesc')"
            :label="$t('intergration.email.sender')"
            :validate-trigger="['change', 'blur']"
            :rules="[
              { required: true, message: $t('intergration.rules.sender') },
              {
                required: true,
                match: emailReg,
                message: $t('intergration.rules.email'),
              },
            ]"
          >
            <a-input
              v-model="formData.senderAddress"
              placeholder="server@example.com"
            />
          </a-form-item>
          <a-form-item
            field="username"
            :hide-asterisk="true"
            :extra="$t('intergration.email.userNameDesc')"
            :label="$t('intergration.email.userName')"
            :validate-trigger="['change', 'input']"
            :rules="[
              {
                required: false,
                message: $t('intergration.rules.email'),
              },
            ]"
          >
            <a-input
              v-model="formData.username"
              placeholder="user@example.com"
            />
          </a-form-item>
          <a-form-item
            field="password"
            :hide-asterisk="!formData.username"
            :label="$t('intergration.email.password')"
            :validate-trigger="['change', 'input']"
            :rules="[
              {
                required: false,
                message: $t('intergration.rules.password'),
              },
            ]"
          >
            <a-input-password v-model="formData.password" placeholder="" />
          </a-form-item>
          <!-- <a-form-item field="tls">
            <a-checkbox v-model="formData.tls">{{
              $t('intergration.email.tls')
            }}</a-checkbox>
          </a-form-item> -->
          <a-form-item
            v-for="(item, index) in formData.defaultRecipientAddresses"
            :key="index"
            class="default-receive"
            field="defaultRecipientAddresses.0.value"
            :hide-asterisk="false"
            :label="$t('intergration.email.defaultReceipient')"
            :validate-trigger="['change', 'blur']"
            :rules="[
              {
                required: true,
                validator: (val, callback) =>
                  handleValidator(val, callback, index),
              },
            ]"
          >
            <template #label>
              <span
                >{{ $t('intergration.email.defaultReceipient') }}({{
                  index + 1
                }})</span
              >
            </template>
            <a-input
              v-model="item.value"
              placeholder="user@example.com"
              @change="(val) => handleInput(val, index)"
            />
            <a-button
              v-show="index === formData.defaultRecipientAddresses.length - 1"
              type="primary"
              size="small"
              @click="handleAddReceive"
            >
              <template #icon>
                <icon-plus />
              </template>
            </a-button>
            <a-button
              v-show="formData.defaultRecipientAddresses.length !== 1"
              type="primary"
              shape="circle"
              size="small"
              @click="handleRemoveReceive(index)"
            >
              <icon-minus />
            </a-button>
          </a-form-item>
          <a-form-item>
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
                {{ $t('intergration.email.testAccount') }}
              </a-button>
              <div v-show="!!checkMsg" class="error-msg">{{ checkMsg }}</div>
            </a-space>
          </a-form-item>
          <a-form-item class="edit-footer-wrap">
            <EditPageFooter>
              <template #save>
                <a-button
                  :loading="submitLoading"
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
  import { urlReg, hostReg, emailReg } from '@/utils/validate';
  import {
    submitFormData,
    getFormData,
    updateFormData,
    testEmailAccount,
  } from '../api/email-config';

  interface FormType {
    id?: string;
    host: string;
    name: string;
    port: any;
    username: string;
    password: string;
    senderAddress: string;
    tls: boolean;
    defaultRecipientAddresses: Array<any>;
  }
  type receiveAddress = Array<{ value: string }>;
  type idType = string | number | undefined;
  const formref = ref();
  const testLoading = ref(false);
  const testPass = ref(false);
  const submitLoading = ref(false);
  const { t, locale } = useI18n();
  const route = useRoute();
  const router = useRouter();
  const { id } = route.query;
  const checkMsg = ref<string>('');
  let copyFormData: any = {};
  let formData: FormType = reactive({
    name: '',
    host: '',
    port: '',
    username: '',
    password: '',
    senderAddress: '',
    tls: false,
    defaultRecipientAddresses: [{ value: '' }],
  });

  const save = async () => {
    const res = { id: '' };
    const list = formData.defaultRecipientAddresses.map((item) => {
      return item.value;
    });
    const dataInfo = {
      ...formData,
      defaultRecipientAddresses: list || [],
    };
    submitLoading.value = true;
    if (formData.id) {
      // update
      await updateFormData(dataInfo);
      res.id = formData.id;
    } else {
      // create
      const { data } = await submitFormData(dataInfo);
      res.id = data.id;
    }
    submitLoading.value = false;
    return res;
  };
  const handleSubmit = async ({ errors }) => {
    // console.log('valid:', { values: formData, errors });
    if (!errors) {
      await save();
      copyFormData = cloneDeep(formData);
      router.push({
        name: 'notifiersList',
        params: {
          type: 'smtp',
        },
      });
    }
  };
  const handleAddReceive = () => {
    formData.defaultRecipientAddresses.push({
      value: '',
    });
  };

  const handleRemoveReceive = (index) => {
    formData.defaultRecipientAddresses.splice(index, 1);
  };

  const handleValidator = (value, callback, index) => {
    value = formData.defaultRecipientAddresses[index].value;
    if (!value) {
      callback(t('intergration.rules.receiver'));
    } else if (!emailReg.test(value)) {
      callback(t('intergration.rules.email'));
    } else {
      callback();
    }
  };
  const handleInput = (val, index) => {
    formData.defaultRecipientAddresses[index].value = val;
  };

  const handleCancel = () => {
    router.back();
  };
  const testAcountCallback = async (data) => {
    testLoading.value = true;
    testPass.value = false;
    testEmailAccount(data).then(
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
    formref.value.validate((errors) => {
      if (errors) return;
      checkMsg.value = '';
      try {
        const list = formData.defaultRecipientAddresses.map((item) => {
          return item.value;
        });
        const data = {
          ...formData,
          defaultRecipientAddresses: list || [],
        };
        testAcountCallback(data);
      } catch (error) {
        console.log('error>>', error);
        testLoading.value = false;
        testPass.value = false;
      }
    });
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
        const defaultRecipientAddresses =
          res.data?.smtp?.defaultRecipientAddresses || [];
        formData = Object.assign(
          formData,
          { id: res?.data?.id, name: res?.data?.name },
          res.data.smtp
        );
        formData.tls = false;
        if (defaultRecipientAddresses.length) {
          const list = defaultRecipientAddresses.map((val) => {
            return {
              value: val,
            };
          });
          formData.defaultRecipientAddresses = [].concat(list as Array<never>);
        }
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

    :deep(.arco-btn-icon) {
      margin-right: 0;
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
        margin-left: 90px;

        &.en-local {
          margin-left: 115px;
        }
      }
    }
  }
</style>

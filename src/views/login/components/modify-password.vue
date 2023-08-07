<template>
  <div class="container">
    <a-card class="general-card q-s-w-card">
      <a-form
        :model="formData"
        auto-label-width
        layout="vertical"
        @submit="handleSubmit"
      >
        <div class="password-info-wrap">
          <div class="settings-tip m-b-8"
            ><icon-info-circle />{{ $t('login.form.update.password') }}</div
          >
          <a-form-item
            hide-label
            field="newPassword"
            :trigger="['change', 'blur']"
            :rules="[
              {
                required: true,
                message: $t('user.password.rules.newpassword')
              }
            ]"
          >
            <seal-input-password
              v-model.trim="formData.newPassword"
              size="large"
              :required="true"
              :placeholder="$t('user.password.newPassword')"
              allow-clear
            >
              <template #prefix>
                <icon-lock />
              </template>
            </seal-input-password>
          </a-form-item>
          <a-form-item
            hide-label
            field="confirmPassword"
            :trigger="['change', 'blur']"
            :rules="[
              {
                required: true,
                validator: validateConfirmPassword
              }
            ]"
          >
            <seal-input-password
              v-model.trim="formData.confirmPassword"
              size="large"
              :required="true"
              :placeholder="$t('user.password.confirmPassword')"
              allow-clear
            >
              <template #prefix>
                <icon-lock />
              </template>
            </seal-input-password>
          </a-form-item>
          <a-divider />
          <div class="settings-tip m-b-8"
            ><icon-info-circle />{{ $t('login.form.update.serverurl') }}</div
          >
          <a-form-item
            hide-asterisk
            field="serverUrl"
            hide-label
            :validate-trigger="['change', 'input']"
            :rules="[
              { required: true, message: $t('login.config.serverUrl') },
              {
                match: urlReg,
                required: true,
                message: t('system.rules.url')
              }
            ]"
          >
            <seal-input
              v-model.trim="formData.serverUrl"
              size="large"
              placeholder="serverURL"
            >
              <template #prefix>
                <icon-home />
              </template>
            </seal-input>
          </a-form-item>
          <a-divider />
          <div class="settings-tip m-b-8"
            ><icon-info-circle />{{ $t('login.config.join.improvement') }}</div
          >
          <a-form-item hide-label>
            <a-checkbox v-model="formData.enableTelemetry">
              <span
                v-html="$t('login.config.user.action', { link: cllectionLink })"
              ></span>
            </a-checkbox>
          </a-form-item>
        </div>
        <div style="margin-top: 50px">
          <a-button type="primary" html-type="submit" long size="large">{{
            $t('common.button.submit')
          }}</a-button>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { get } from 'lodash';
  import { reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import { modifyPassword } from '@/api/user';
  import { useUserStore } from '@/store';
  import { updateUserSettingBatch } from '@/views/system/api/setting';
  import { urlReg } from '@/utils/validate';

  const cllectionLink = 'https://seal-io.github.io/docs/quickstart';
  const { t } = useI18n();
  const userStore = useUserStore();
  const router = useRouter();
  const emits = defineEmits(['updatePassword']);
  const props = defineProps({
    oldPassword: {
      type: String,
      default() {
        return '';
      }
    },
    userName: {
      type: String,
      default() {
        return '';
      }
    }
  });
  const serverUrlID = 'ServeUrl';
  const enableTelemetry = 'EnableTelemetry';
  const formData = reactive({
    oldPassword: props.oldPassword,
    newPassword: '',
    confirmPassword: '',
    serverUrl: window.location.origin,
    enableTelemetry: true
  });
  const handleCancel = () => {
    router.back();
  };
  const validateConfirmPassword = (value, callback) => {
    if (!value) {
      callback(t('user.password.rules.confirmpassword'));
    } else if (value !== formData.newPassword) {
      callback(t('user.password.rules.comparepassword'));
    } else {
      callback();
    }
  };
  const handleSubmit = async ({ errors }) => {
    if (!errors) {
      const data = {
        oldPassword: props.oldPassword,
        password: formData.newPassword,
        name: props.userName
      };
      const userSetting = get(userStore, 'userInfo.userSetting');
      // const serverUrl = get(userStore, 'userInfo.userSetting.ServeUrl');
      const settings = [
        {
          id: serverUrlID,
          value: formData.serverUrl
        },
        {
          id: enableTelemetry,
          value: formData.enableTelemetry.toString()
        }
      ];

      try {
        await Promise.all([
          modifyPassword(data),
          updateUserSettingBatch(settings)
        ]);
        userStore.setInfo({
          userSetting: {
            ...userSetting,
            serverUrl: { id: serverUrlID, value: formData.serverUrl },
            FirstLogin: { value: 'Invalid' }
          }
        });
        emits('updatePassword', formData.newPassword);
        // Message.success(t('common.message.success'));
      } catch (error) {
        // ignore
      }
    }
  };
</script>

<style lang="less" scoped>
  .container {
    :deep(.arco-card-body) {
      padding: 0;
    }

    :deep(.arco-divider-horizontal) {
      margin: 15px 0;
    }

    .settings-tip {
      color: var(--color-text-3);
      font-size: 12px;

      :deep(.arco-icon) {
        margin-right: 4px;
        color: var(--sealblue-6);
      }
    }

    .password-info-wrap {
      padding: 10px;
      background-color: var(--color-fill-2);
      border-radius: 4px;
    }

    .arco-input-wrapper {
      width: 100%;
      background-color: #fff;
    }
  }
</style>

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
              },
              { minLength: 6, message: $t('propfile.password.leastlength') }
            ]"
          >
            <seal-input-password
              v-model="formData.newPassword"
              style="width: 100%"
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
              },
              { minLength: 6, message: $t('propfile.password.leastlength') }
            ]"
          >
            <seal-input-password
              v-model="formData.confirmPassword"
              style="width: 100%"
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
          <div>
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
                { required: true, message: $t('login.config.serverUrl') }
              ]"
            >
              <seal-input
                v-model.trim="formData.serverUrl"
                style="width: 100%"
                size="large"
                :placeholder="$t('system.setting.serverurl')"
              >
                <template #prefix>
                  <icon-home />
                </template>
              </seal-input>
            </a-form-item>
            <a-divider />
            <div class="settings-tip m-b-8"
              ><icon-info-circle />{{
                $t('login.config.join.improvement')
              }}</div
            >
            <a-form-item hide-label>
              <a-checkbox v-model="formData.enableTelemetry">
                <span
                  v-html="
                    $t('login.config.user.action', { link: cllectionLink })
                  "
                ></span>
              </a-checkbox>
            </a-form-item>
          </div>
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
  import { reactive, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { modifyPassword } from '@/api/user';
  import { useUserStore } from '@/store';
  import { updateUserSettingBatch } from '@/views/system/api/setting';
  import { urlReg } from '@/utils/validate';

  const cllectionLink = 'https://seal-io.github.io/docs/improvement-plan';
  const { t } = useI18n();
  const userStore = useUserStore();
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
    },
    settingsInfo: {
      type: Object,
      default() {
        return {};
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
      const settings = [
        {
          name: serverUrlID,
          value: formData.serverUrl
        },
        {
          name: enableTelemetry,
          value: formData.enableTelemetry.toString()
        }
      ];

      try {
        if (userStore.isSystemAdmin()) {
          await Promise.all([
            modifyPassword(data),
            updateUserSettingBatch({ items: settings })
          ]);
        } else {
          await modifyPassword(data);
        }

        userStore.setInfo({
          userSetting: {
            ...userSetting,
            serverUrl: { name: serverUrlID, value: formData.serverUrl },
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
  watch(
    () => props.settingsInfo,
    (val) => {
      if (val) {
        formData.serverUrl = val.ServeUrl || window.location.origin;
        formData.enableTelemetry = val.EnableTelemetry === 'true';
      }
    },
    { immediate: true }
  );
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
      border-radius: var(--border-radius-small);
    }

    .arco-input-wrapper {
      width: 100%;
      background-color: var(--color-white);
    }
  }
</style>

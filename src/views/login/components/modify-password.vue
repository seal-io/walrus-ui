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
          <span class="settings-tip"
            ><icon-info-circle />{{ $t('login.form.update.password') }}</span
          >
          <a-form-item
            hide-asterisk
            field="newPassword"
            :trigger="['change', 'blur']"
            :rules="[
              {
                required: true,
                message: $t('user.password.rules.newpassword')
              }
            ]"
          >
            <a-input-password
              v-model.trim="formData.newPassword"
              :placeholder="$t('user.password.newPassword')"
              allow-clear
            >
              <template #prefix>
                <icon-lock />
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item
            hide-asterisk
            field="confirmPassword"
            :trigger="['change', 'blur']"
            :rules="[
              {
                required: true,
                validator: validateConfirmPassword
              }
            ]"
          >
            <a-input-password
              v-model.trim="formData.confirmPassword"
              :placeholder="$t('user.password.confirmPassword')"
              allow-clear
            >
              <template #prefix>
                <icon-lock />
              </template>
            </a-input-password>
          </a-form-item>
          <a-divider />
          <span class="settings-tip"
            ><icon-info-circle />{{ $t('login.form.update.serverurl') }}</span
          >
          <a-form-item
            hide-asterisk
            field="serverUrl"
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
            <a-input v-model.trim="formData.serverUrl" placeholder="serverURL">
              <template #prefix>
                <icon-home />
              </template>
            </a-input>
          </a-form-item>
        </div>
        <div style="margin-top: 50px">
          <a-button type="primary" html-type="submit" long>{{
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
  import { urlReg } from '@/utils/validate';

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

  const formData = reactive({
    oldPassword: props.oldPassword,
    newPassword: '',
    confirmPassword: '',
    serverUrl: window.location.origin
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
      const serverUrl = get(userStore, 'userInfo.userSetting.ServeUrl');
      const serverUrlData = {
        id: serverUrl.id,
        value: formData.serverUrl
      };
      try {
        Promise.all([
          modifyPassword(data),
          userStore.updateUserSetting(serverUrlData)
        ]).then(() => {
          userStore.setInfo({
            serverUrl: { ...serverUrl, value: formData.serverUrl }
          });
          emits('updatePassword', formData.newPassword);
          // Message.success(t('common.message.success'));
        });
      } catch (error) {
        console.log(error);
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
      background-color: #fff;
    }
  }
</style>

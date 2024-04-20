<template>
  <div class="main-wrapper">
    <div id="login-form-wrapper" class="login-form-wrapper">
      <!-- login box -->
      <div v-show="!showModify">
        <div v-if="errorMessage" class="login-form-error-msg">{{
          errorMessage
        }}</div>
        <a-form
          ref="loginForm"
          :model="userInfo"
          class="login-form"
          layout="vertical"
          @submit="handleSubmit"
        >
          <a-form-item
            field="username"
            :rules="[
              { required: true, message: $t('login.form.userName.errMsg') }
            ]"
            :validate-trigger="['change']"
            hide-label
          >
            <seal-input
              v-model="userInfo.username"
              style="width: 380px"
              :show-required-mark="false"
              allow-clear
              :placeholder="$t('login.form.userName.placeholder')"
            >
              <template #prefix>
                <icon-user />
              </template>
            </seal-input>
          </a-form-item>
          <a-form-item
            field="password"
            :rules="[
              { required: true, message: $t('login.form.password.errMsg') }
            ]"
            :validate-trigger="['change']"
            hide-label
          >
            <seal-input-password
              v-model="userInfo.password"
              style="width: 380px"
              :show-required-mark="false"
              :placeholder="$t('login.form.password.placeholder')"
              allow-clear
            >
              <template #prefix>
                <icon-lock />
              </template>
            </seal-input-password>
          </a-form-item>
          <a-space :size="16" direction="vertical">
            <div class="login-form-password-actions">
              <a-checkbox
                v-model="rememberPassword"
                @change="setRememberPassword"
              >
                {{ $t('login.form.rememberPassword') }}
              </a-checkbox>
            </div>
            <a-button
              type="primary"
              html-type="submit"
              long
              :loading="loading"
              size="large"
            >
              {{ $t('login.form.login') }}
            </a-button>
          </a-space>
        </a-form>
      </div>
      <!-- modify password box -->
      <modifyPassword
        v-show="showModify"
        :original-password="userInfo.password || tempPassword"
        :user-name="userInfo.username"
        :settings-info="settingsInfo"
        @updatePassword="handleModifyDefaultPassword"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { useDark, useToggle } from '@vueuse/core';
  import { ref, reactive, onMounted, inject, watch } from 'vue';
  import { useUserStore, useAppStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import useEnterPage from '@/hooks/use-enter-page';
  import { queryUserPartialSetting } from '@/views/system/api/setting';
  import CryptoJS from 'crypto-js';
  import {
    rememberPasswordFn,
    readLocalLoginInfo,
    removeLocalLoginInfo,
    removeTempLocalLoginInfo,
    LOGIN_INFO,
    TEMP_LOGIN_INFO
  } from '@/utils/auth';
  import modifyPassword from './modify-password.vue';
  import { FirstGetPasswordCommand } from '../config';

  const props = defineProps({
    firstLoginStatus: {
      type: Object,
      default() {
        return {};
      }
    }
  });
  const providerList = inject('providerList', ref([]));
  const CRYPT_TEXT = 'web';
  const emits = defineEmits([
    'loginSuccess',
    'update:hideTips',
    'modifyPassword'
  ]);
  const { enterUserPage } = useEnterPage();
  const errorMessage = ref('');
  const { loading, setLoading } = useLoading();
  const userStore = useUserStore();
  const appStore = useAppStore();
  const rememberPassword = ref<boolean>(false);
  const settingsInfo = ref<any>({
    ServeUrl: window.location.origin,
    EnableTelemetry: 'true'
  });
  const tempPassword = ref<string>('');
  const showModify = ref<boolean>(false);
  const userInfo = reactive({
    username: '',
    password: ''
  });

  const isDark = useDark({
    selector: 'body',
    attribute: 'arco-theme',
    valueDark: 'dark',
    valueLight: 'light',
    storageKey: 'arco-theme',
    onChanged(dark: boolean) {
      // overridded default behavior
      appStore.toggleTheme(dark);
    }
  });
  const toggleTheme = useToggle(isDark);

  const encryptPassword = (password) => {
    const psw = CryptoJS.AES?.encrypt?.(password, CRYPT_TEXT).toString();
    return psw;
  };
  const decryptPassword = (password) => {
    const bytes = CryptoJS.AES?.decrypt?.(password, CRYPT_TEXT);
    const res = bytes.toString(CryptoJS.enc.Utf8);
    return res;
  };
  const handleModifyDefaultPassword = async (newpassword) => {
    showModify.value = false;
    if (rememberPassword.value) {
      const hash = encryptPassword(newpassword);
      rememberPasswordFn(LOGIN_INFO, {
        rememberPswd: rememberPassword.value,
        username: userInfo.username,
        password: hash
      });
    }
    removeTempLocalLoginInfo();
    userStore.getUserSetting();
    enterUserPage();
  };

  const getUserPartialSetting = async () => {
    try {
      const params = {
        name: ['serve-url', 'enable-telemetry']
      };
      const { data } = await queryUserPartialSetting(params);
      settingsInfo.value = _.reduce(
        data.items || [],
        (result, item) => {
          const name = item.metadata?.name;
          if (name) {
            result[name] = {
              data: item,
              value: item.status.value
            };
          }
          return result;
        },
        {}
      );
      console.log('settingsInfo', settingsInfo.value);
    } catch (error) {
      settingsInfo.value = {};
      // ingore
    }
  };

  const handleShowModifyCallback = () => {
    showModify.value = true;
    emits('update:hideTips', true);
    emits('loginSuccess');
    emits('modifyPassword');
  };
  const checkShowModify = () => {
    if (userStore?.isFirstLogin() && userStore.name) {
      handleShowModifyCallback();
    }
  };

  const handleSubmit = async ({ errors, values }) => {
    if (!errors) {
      setLoading(true);
      try {
        const hash = encryptPassword(userInfo.password);
        if (rememberPassword.value) {
          rememberPasswordFn(LOGIN_INFO, {
            rememberPswd: rememberPassword.value,
            username: userInfo.username,
            password: hash
          });
        } else {
          removeLocalLoginInfo();
          rememberPasswordFn(TEMP_LOGIN_INFO, {
            rememberPswd: rememberPassword.value,
            username: userInfo.username,
            password: hash
          });
        }
        await userStore.login(values);
        await userStore.info();
        // help to get serverURL id
        const userSetting = _.get(userStore, 'userInfo.userSetting');
        userStore.setInfo({
          userSetting: {
            ...userSetting,
            'bootstrap-password-provision': { ...props.firstLoginStatus }
          }
        });

        if (userStore?.isFirstLogin() && userStore.isSystemAdmin()) {
          handleShowModifyCallback();
          getUserPartialSetting();
          return;
        }
        userStore.getUserSetting();
        // locate  to first menu has permission
        enterUserPage();
      } catch (err) {
        errorMessage.value = (err as Error).message;
      } finally {
        setLoading(false);
      }
    }
  };

  const setRememberPassword = (val) => {
    rememberPassword.value = val;
  };

  const getLocalSetting = async () => {
    const res = await readLocalLoginInfo(LOGIN_INFO);
    userInfo.username = res?.username || '';
    userInfo.password = res?.password ? decryptPassword(res?.password) : '';
    rememberPassword.value = res?.rememberPswd || false;

    // ========= refresh page when modify password =============

    const tempRes = await readLocalLoginInfo(TEMP_LOGIN_INFO);
    tempPassword.value = tempRes?.password
      ? decryptPassword(tempRes?.password)
      : '';

    // ========= refresh page when modify password =============
  };

  watch(
    () => props.firstLoginStatus,
    (val) => {
      if (val) {
        const isFirstLogin =
          props.firstLoginStatus?.value !== FirstGetPasswordCommand.Invalid;
        if (isFirstLogin) {
          checkShowModify();
        } else {
          getLocalSetting();
        }
      }
    },
    {
      immediate: false,
      deep: true
    }
  );
</script>

<style lang="less" scoped>
  .setting-tips {
    height: 16px;
    color: var(--color-text-3);
    font-size: 12px;
  }

  .login-form {
    &-wrapper {
      width: 100%;

      .password-type {
        width: 380px;
      }
    }

    .arco-input-wrapper {
      width: 100%;
    }

    &-error-msg {
      height: 32px;
      color: rgb(var(--red-6));
      line-height: 32px;
    }

    &-password-actions {
      display: flex;
      justify-content: space-between;
    }
  }
</style>

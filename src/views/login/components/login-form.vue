<template>
  <div class="main-wrapper">
    <div id="login-form-wrapper" class="login-form-wrapper">
      <div class="login-form-title">
        <span v-show="!showModify">{{ $t('login.form.title') }}</span>
        <span v-show="showModify">{{ $t('login.form.login.update') }}</span>
        <div class="language">
          <a-switch
            v-model="isDark"
            checked-color="var(--black-2)"
            unchecked-color="rgb(185, 207, 243)"
            @change="toggleTheme"
          >
            <template #checked-icon>
              <icon-moon class="size-16" />
            </template>
            <template #unchecked-icon>
              <icon-sun class="size-16" />
            </template>
          </a-switch>
          <a-dropdown @select="changeLocale">
            <a-button shape="circle" type="text" size="mini"
              ><i class="iconfont icon-language size-18"
            /></a-button>
            <template #content>
              <a-doption
                v-for="item in locales"
                :key="item.value"
                :value="item.value"
                style="font-size: var(--font-size-normal)"
              >
                {{ item.label }}
              </a-doption>
            </template>
          </a-dropdown>
        </div>
      </div>
      <!-- login box -->
      <div v-show="!showModify">
        <div class="login-form-error-msg">{{ errorMessage }}</div>
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
        :old-password="userInfo.password || tempPassword"
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
  import { ref, reactive, onMounted } from 'vue';
  import { LOCALE_OPTIONS } from '@/locale';
  import useLocale from '@/hooks/locale';
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

  const props = defineProps({
    firstLoginStatus: {
      type: Object,
      default() {
        return {};
      }
    }
  });
  const CRYPT_TEXT = 'web';
  const emits = defineEmits(['loginSuccess', 'update:hideTips']);
  const { enterUserPage } = useEnterPage();
  const { changeLocale } = useLocale();
  const locales = [...LOCALE_OPTIONS];
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
        name: ['ServeUrl', 'EnableTelemetry']
      };
      const { data } = await queryUserPartialSetting(params);
      settingsInfo.value = _.reduce(
        data.items || [],
        (result, item) => {
          if (item.name) {
            result[item.name] = item.value;
          }
          return result;
        },
        {}
      );
    } catch (error) {
      settingsInfo.value = {};
      // ingore
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
        // help to get serverURL id
        const userSetting = _.get(userStore, 'userInfo.userSetting');
        userStore.setInfo({
          userSetting: {
            ...userSetting,
            FirstLogin: { ...props.firstLoginStatus }
          }
        });
        if (userStore?.isFirstLogin() && userStore.isSystemAdmin()) {
          showModify.value = true;
          emits('update:hideTips', true);
          emits('loginSuccess');
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
  const checkShowModify = () => {
    if (userStore?.isFirstLogin() && userStore.name) {
      showModify.value = true;
      emits('update:hideTips', true);
      emits('loginSuccess');
    }
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
  onMounted(async () => {
    getLocalSetting();
    checkShowModify();
  });
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
      width: 380px;
      // min-width: 320px;
      .language {
        position: fixed;
        top: 20px;
        right: 30px;
        display: flex;
        align-items: center;
        height: 24px;
        font-size: 0;

        .iconfont {
          color: var(--color-text-selected);
        }

        .arco-switch {
          margin-right: 20px;
        }

        :deep(.arco-switch-checked) {
          .arco-switch-handle {
            color: var(--color-text-3);
            background-color: transparent;

            .arco-switch-handle-icon {
              display: flex;
              align-items: center;
            }
          }
        }
      }
    }

    .arco-input-wrapper {
      width: 100%;
    }

    &-title {
      text-align: center;
    }

    &-title {
      color: var(--color-text-1);
      font-weight: var(--font-weight-medium);
      font-size: 24px;
      line-height: 32px;
    }

    &-sub-title {
      color: var(--color-text-3);
      font-size: var(--font-size-large);
      line-height: 24px;
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

    &-register-btn {
      color: var(--color-text-3) !important;
    }
  }
</style>

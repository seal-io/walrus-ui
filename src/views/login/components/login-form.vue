<template>
  <div class="main-wrapper">
    <div id="login-form-wrapper" class="login-form-wrapper">
      <div class="login-form-title">
        <span v-show="!showModify">{{ $t('login.form.title') }}</span>
        <span v-show="showModify">{{ $t('login.form.login.update') }}</span>
        <div class="language">
          <a-dropdown @select="changeLocale">
            <a-button shape="circle" type="outline" size="mini"
              ><icon-language
            /></a-button>
            <template #content>
              <a-doption
                v-for="item in locales"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </a-doption>
            </template>
          </a-dropdown>
        </div>
        <div v-show="showModify" class="setting-tips">{{
          $t('login.form.login.update.tips')
        }}</div>
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
              { required: true, message: $t('login.form.userName.errMsg') },
            ]"
            :validate-trigger="['change', 'blur']"
            hide-label
          >
            <a-input
              v-model="userInfo.username"
              size="large"
              :placeholder="$t('login.form.userName.placeholder')"
            >
              <template #prefix>
                <icon-user />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item
            field="password"
            :rules="[
              { required: true, message: $t('login.form.password.errMsg') },
            ]"
            :validate-trigger="['change', 'blur']"
            hide-label
          >
            <a-input-password
              v-model="userInfo.password"
              size="large"
              :placeholder="$t('login.form.password.placeholder')"
              allow-clear
            >
              <template #prefix>
                <icon-lock />
              </template>
            </a-input-password>
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
            <!-- <a-button type="text" long class="login-form-register-btn">
            {{ $t('login.form.register') }}
          </a-button> -->
          </a-space>
        </a-form>
      </div>
      <!-- modify password box -->
      <modifyPassword
        v-show="showModify"
        :old-password="userInfo.password"
        :user-name="userInfo.username"
        @updatePassword="handleModifyDefaultPassword"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import localStore from '@/utils/localStore';
  import { ref, reactive, onMounted } from 'vue';
  import { LOCALE_OPTIONS } from '@/locale';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import useLocale from '@/hooks/locale';
  import { useUserStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import useEnterPage from '@/hooks/use-enter-page';
  import { LoginData } from '@/api/user';
  import {
    rememberPasswordFn,
    readLocalLoginInfo,
    removeLocalLoginInfo,
  } from '@/utils/auth';
  import modifyPassword from './modify-password.vue';

  const emits = defineEmits(['loginSuccess']);
  const { enterUserPage } = useEnterPage();
  const { changeLocale } = useLocale();
  const locales = [...LOCALE_OPTIONS];
  const errorMessage = ref('');
  const visible = ref(false);
  const { loading, setLoading } = useLoading();
  const userStore = useUserStore();
  const rememberPassword = ref<boolean>(false);
  const showModify = ref<boolean>(false);
  const userInfo = reactive({
    username: '',
    password: '',
  });

  const handleModifyDefaultPassword = async (newpassword) => {
    showModify.value = false;
    if (rememberPassword.value) {
      rememberPasswordFn({
        rememberPswd: rememberPassword.value,
        username: userInfo.username,
        password: newpassword,
      });
    }
    await userStore.getUserSetting();
    enterUserPage();
  };
  const handleSubmit = async ({ errors, values }) => {
    if (!errors) {
      setLoading(true);
      try {
        if (rememberPassword.value) {
          rememberPasswordFn({
            rememberPswd: rememberPassword.value,
            ...userInfo,
          });
        } else {
          removeLocalLoginInfo();
        }
        await userStore.login(values);
        await userStore.getUserSetting();
        if (userStore.userSetting.FirstLogin === 'true') {
          showModify.value = true;
          localStore.removeValue('POLICY_DRIVER_KEY');
          emits('loginSuccess');
          return;
        }
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
    const res = await readLocalLoginInfo();
    console.log('res:', res);
    userInfo.username = res?.username || '';
    userInfo.password = res?.password || '';
    rememberPassword.value = res?.rememberPswd || false;
  };
  onMounted(async () => {
    getLocalSetting();
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
      // width: 360px;
      min-width: 320px;

      .language {
        position: fixed;
        top: 20px;
        right: 30px;
        height: 24px;
        font-size: 0;
      }
    }

    &-title {
      text-align: center;
    }

    &-title {
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 24px;
      line-height: 32px;
    }

    &-sub-title {
      color: var(--color-text-3);
      font-size: 16px;
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

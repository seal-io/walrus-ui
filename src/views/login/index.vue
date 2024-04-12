<template>
  <div class="login-page" :class="{ dark: appStore.theme === 'dark' }">
    <div class="header">
      <div class="logo">
        <img
          alt="logo"
          :src="appStore.theme === 'dark' ? logodark : logolight"
        />
      </div>
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
    <div class="main">
      <div class="content">
        <a-button
          v-if="loginType !== 'provider'"
          class="back"
          @click="handleClickBack"
          ><icon-arrow-left
        /></a-button>
        <div class="content-title">
          <span v-if="!isModifyPassword">{{ $t('login.form.title') }}</span>
          <span v-else>{{ $t('login.form.login.update') }}</span>
        </div>

        <SSOProvider
          v-if="loginType === 'provider'"
          :providers="externalProviders"
          @select="handleLoginTypeChange"
        ></SSOProvider>
        <PasswordLogin
          v-else
          @modifyPassword="handleModifyPassword"
        ></PasswordLogin>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts" setup>
  import { useAppStore, useUserStore } from '@/store';
  import { ref, provide } from 'vue';
  import { useDark, useToggle } from '@vueuse/core';
  import useLocale from '@/hooks/locale';
  import Footer from '@/components/footer/index.vue';
  import logolight from '@/assets/images/logo_02.png';
  import logodark from '@/assets/images/logo_05.png';
  import { LOCALE_OPTIONS } from '@/locale';
  import PasswordLogin from './components/password-login.vue';
  import SSOProvider from './components/sso-provider.vue';
  import { externalProviders } from './config';
  import { queryIdentifyProviders, ProviderItem } from './api';

  const locales = [...LOCALE_OPTIONS];
  const appStore = useAppStore();
  const { changeLocale } = useLocale();
  const isDark = useDark({
    selector: 'body',
    attribute: 'arco-theme',
    valueDark: 'dark',
    valueLight: 'light',
    storageKey: 'arco-theme',
    onChanged(dark: boolean) {
      appStore.toggleTheme(dark);
    }
  });
  const toggleTheme = useToggle(isDark);
  const loginType = ref('provider');
  const providerList = ref<ProviderItem[]>([]);
  const isModifyPassword = ref(false);

  provide('providerList', providerList);

  const handleLoginTypeChange = (type: string, item) => {
    loginType.value = type;
  };

  const handleClickBack = () => {
    loginType.value = 'provider';
  };

  const handleModifyPassword = () => {
    isModifyPassword.value = true;
  };

  const fetchData = async () => {
    try {
      const { data } = await queryIdentifyProviders();
      providerList.value = data.items || [];
    } catch (error) {
      // ignore
      providerList.value = [];
    }
  };
  const init = () => {
    fetchData();
  };
  init();
</script>

<style lang="less" scoped>
  .login-page {
    background-image: url('../../assets/images/bg2.jpg');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;

    &.dark {
      background-color: rgb(var(--color-background-1));
      background-image: none;
    }

    .header {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 56px;
      padding: 0 20px;
      padding-right: 30px;

      .logo {
        img {
          width: 136px;
          height: auto;
        }
      }

      .language {
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

    .main {
      position: relative;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      height: max-content;
      min-height: calc(100vh - 104px);
      padding-bottom: 40px;

      .content {
        position: relative;
        padding: var(--card-content-padding);
        background-color: rgba(var(--color-background-2), 0.7);
        border-radius: 8px;

        &-title {
          color: var(--color-text-1);
          font-weight: var(--font-weight-medium);
          font-size: 24px;
          line-height: 48px;
          text-align: center;
        }

        .back {
          position: absolute;
          top: 20px;
          left: 20px;
          color: var(--color-text-3);
          font-size: 20px;
        }
      }
    }
  }
</style>

<template>
  <div class="container">
    <div class="logo">
      <img alt="logo" src="../../assets/images/seal-logo.png" />
      <!-- <div class="logo-text">SEAL</div> -->
    </div>
    <LoginBanner />

    <div class="content">
      <div class="content-inner">
        <LoginForm
          :first-login-status="firstLoginStatus"
          @loginSuccess="handleLoginSuccess"
        />
        <div
          v-if="isFirstLogin"
          style="background: var(--color-fill-2)"
          class="first-login-tips"
        >
          <div class="text"
            ><icon-info-circle-fill />{{ $t('login.config.getPswd') }}</div
          >
          <highlightBlock
            :code="GET_ADMIN_PASSWORD"
            style="position: relative; background: #fff"
          >
            <copy
              :content="GET_ADMIN_PASSWORD"
              style="position: absolute; top: 0; right: 0"
            ></copy>
          </highlightBlock>
        </div>
      </div>

      <div class="footer">
        <Footer />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { onMounted, ref } from 'vue';
  import { getFirstLoginStatus } from '@/api/user';
  import { useUserStore } from '@/store';
  import useEnterPage from '@/hooks/use-enter-page';
  import Footer from '@/components/footer/index.vue';
  import highlightBlock from '@/components/highlight-block/index.vue';
  import copy from '@/components/copy/index.vue';
  import LoginBanner from './components/banner.vue';
  import LoginForm from './components/login-form.vue';
  import { GET_ADMIN_PASSWORD } from './config';

  const { enterUserPage } = useEnterPage();
  const userStore = useUserStore();
  const isFirstLogin = ref(false);
  const firstLoginStatus = ref({});
  const handleLoginSuccess = () => {
    isFirstLogin.value = true;
  };
  const getUserLoginStatus = async () => {
    try {
      const { data } = await getFirstLoginStatus();
      const value = data?.value;
      isFirstLogin.value = value === 'true';
      firstLoginStatus.value = data;
    } catch (error) {
      console.log(error);
    }
  };

  onMounted(async () => {
    // ====== remove under line when always verify permission ======
    // try {
    //   const enableAuth = await userStore.checkEnableAuth();
    //   if (enableAuth.value === 'false') {
    //     enterUserPage();
    //     return;
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
    // ========= end ===============
    // userStore.resetInfo();
    getUserLoginStatus();
  });
</script>

<style lang="less" scoped>
  .container {
    display: flex;
    height: 100vh;
    margin-top: 0;
    background-color: #fff;

    :deep(.hljs.bash) {
      background-color: #fff;
    }

    :deep(.arco-space-item) {
      .arco-space-vertical.get-pwd {
        padding: 20px;
        background-color: var(--color-fill-2);
        border-radius: 4px;

        .arco-icon {
          margin-right: 8px;
          color: var(--sealblue-6);
        }
      }
    }

    .first-login-tips {
      margin-top: 40px;
      padding: 10px;
      font-size: 12px;
      border-radius: 4px;

      .text {
        margin-bottom: 10px;
      }

      .arco-icon {
        margin-right: 4px;
        color: var(--sealblue-6);
      }
    }

    .banner {
      width: 550px;
      background: linear-gradient(163.85deg, #1d2129 0%, #00308f 100%);
    }

    .content {
      position: relative;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      padding-bottom: 40px;
    }

    .footer {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 100%;
      background-color: #fff;
    }
  }

  .logo {
    position: fixed;
    top: 20px;
    left: 22px;
    z-index: 1;
    display: inline-flex;
    align-items: center;

    img {
      width: 90px;
      height: auto;
    }

    &-text {
      margin-right: 4px;
      margin-left: 4px;
      color: var(--color-fill-1);
      font-size: 20px;
    }
  }
</style>

<style lang="less" scoped>
  // responsive
  @media (max-width: @screen-lg) {
    .container {
      .banner {
        width: 25%;
      }
    }
  }
</style>

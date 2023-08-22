<template>
  <div>
    <div class="container login">
      <div class="logo">
        <img alt="logo" src="../../assets/images/logo2.png" />
      </div>

      <div class="content">
        <div class="content-inner">
          <LoginForm
            v-model:hideTips="hideTips"
            :first-login-status="firstLoginStatus"
            @loginSuccess="handleLoginSuccess"
          />
          <div
            v-if="isFirstLogin && !hideTips"
            style="background: var(--color-fill-2)"
            class="first-login-tips"
          >
            <div v-if="specifiedPSWD()" class="text" style="margin-bottom: 0"
              ><icon-info-circle-fill />{{
                $t('login.config.pswd.specified')
              }}</div
            >
            <div v-else class="text"
              ><icon-info-circle-fill />{{ $t('login.config.pswd.exec') }}</div
            >
            <highlightBlock
              v-if="!specifiedPSWD()"
              :code="
                $t(_.get(FirstLoginGetPassword, firstLoginStatus?.value) || '')
              "
              class="hl-code"
              style="position: relative; background: #fff"
            >
              <copy
                :content="
                  $t(
                    _.get(FirstLoginGetPassword, firstLoginStatus?.value) || ''
                  )
                "
                style="position: absolute; top: 0; right: 0"
              ></copy>
            </highlightBlock>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <Footer />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { onMounted, ref } from 'vue';
  import { getFirstLoginStatus } from '@/api/user';
  import { useUserStore, useAppStore } from '@/store';
  import useEnterPage from '@/hooks/use-enter-page';
  import Footer from '@/components/footer/index.vue';
  import highlightBlock from '@/components/highlight-block/index.vue';
  import copy from '@/components/copy/copy-command.vue';
  import LoginForm from './components/login-form.vue';
  import { FirstLoginGetPassword, FirstGetPasswordCommand } from './config';

  const { enterUserPage } = useEnterPage();
  const userStore = useUserStore();
  const appStore = useAppStore();
  const isFirstLogin = ref(false);
  const hideTips = ref(false);
  const firstLoginStatus = ref<any>({});
  // TODO delete
  const handleLoginSuccess = () => {
    isFirstLogin.value = true;
  };
  const getUserLoginStatus = async () => {
    try {
      const { data } = await getFirstLoginStatus();
      const value = data?.value;
      isFirstLogin.value = value !== FirstGetPasswordCommand.Invalid;
      firstLoginStatus.value = data;
    } catch (error) {
      // ignore
    }
  };
  const specifiedPSWD = () => {
    return (
      _.get(firstLoginStatus.value, 'value') ===
      FirstGetPasswordCommand.Specified
    );
  };

  // enter page password-free
  const enterPageForFree = async () => {
    try {
      userStore.resetInfo();
      appStore.resetInfo();
      await userStore.info();
      if (userStore.name) {
        enterUserPage();
      }
    } catch (error) {
      // ingore
    }
  };
  onMounted(async () => {
    getUserLoginStatus();
    enterPageForFree();
  });
</script>

<style lang="less" scoped>
  .container {
    display: flex;
    height: calc(100vh - 48px);
    margin-top: 0;
    overflow: auto;
    background-image: url('../../assets/images/bg2.jpeg');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;

    :deep(.hljs.bash) {
      background-color: #fff;
    }

    :deep(.hljs) {
      white-space: break-spaces;
    }

    .hl-code {
      &:hover {
        .copy-btn {
          opacity: 1;
          transition: opacity 0.2s var(--seal-transition-func);
        }
      }
    }

    .copy-btn {
      opacity: 0;
      transition: opacity 0.2s var(--seal-transition-func);
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
      width: 380px;
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

      .content-inner {
        padding: 20px;
        background-color: rgba(255, 255, 255, 0.7);
        border-radius: 8px;
      }
    }

    .footer {
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
      width: 100px;
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

<template>
  <div>
    <div class="container login">
      <div class="content-inner">
        <PasswordForm
          v-model:hideTips="hideTips"
          :first-login-status="firstLoginStatus"
          @loginSuccess="handleLoginSuccess"
          @modifyPassword="handleModifyPassword"
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
            style="position: relative; background: var(--color-white)"
          >
            <copy
              :content="
                $t(_.get(FirstLoginGetPassword, firstLoginStatus?.value) || '')
              "
              style="position: absolute; top: 0; right: 0"
            ></copy>
          </highlightBlock>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { onMounted, ref } from 'vue';
  import { useUserStore } from '@/store';
  import useEnterPage from '@/hooks/use-enter-page';
  import highlightBlock from '@/components/highlight-block/index.vue';
  import copy from '@/components/copy/copy-command.vue';
  import { getFirstLoginStatus } from '../api';
  import PasswordForm from './password-form.vue';
  import { FirstLoginGetPassword, FirstGetPasswordCommand } from '../config';

  const emits = defineEmits(['modifyPassword']);
  const { enterUserPage } = useEnterPage();
  const userStore = useUserStore();
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
      const value = data?.status?.value;
      isFirstLogin.value = value !== FirstGetPasswordCommand.Invalid;
      userStore.setInfo({
        userSetting: {
          FirstLogin: {
            data,
            value
          }
        }
      });
      firstLoginStatus.value = data.status;
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

  const handleModifyPassword = () => {
    emits('modifyPassword');
  };
  // enter page password-free
  const enterPageForFree = async () => {
    try {
      if (userStore.name && !userStore.isFirstLogin()) {
        enterUserPage();
      }
    } catch (error) {
      // ingore
    }
  };
  const init = async () => {
    userStore.resetInfo();
    await Promise.all([userStore.info(), getUserLoginStatus()]);
    enterPageForFree();
  };
  onMounted(() => {
    init();
  });
</script>

<style lang="less" scoped>
  .container {
    :deep(.hljs.bash) {
      background-color: var(--color-white);
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
        border-radius: var(--border-radius-small);

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
      border-radius: var(--border-radius-small);

      .text {
        margin-bottom: 10px;
        color: var(--color-text-2);
      }

      .arco-icon {
        margin-right: 4px;
        color: var(--sealblue-6);
      }
    }
  }
</style>

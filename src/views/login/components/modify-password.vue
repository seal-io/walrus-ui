<template>
  <div class="container">
    <div>
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
              { minLength: 10, message: $t('propfile.password.leastlength') }
            ]"
          >
            <seal-input-password
              v-model="formData.newPassword"
              style="width: 100%"
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
              { minLength: 10, message: $t('propfile.password.leastlength') }
            ]"
          >
            <seal-input-password
              v-model="formData.confirmPassword"
              style="width: 100%"
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
              field="serve-url"
              hide-label
              :validate-trigger="['change', 'input']"
              :rules="[
                { required: true, message: $t('login.config.serverUrl') }
              ]"
            >
              <seal-input
                v-model.trim="formData['serve-url']"
                style="width: 100%"
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
              <a-checkbox v-model="formData['enable-telemetry']">
                <span
                  v-html="
                    $t('login.config.user.action', { link: cllectionLink })
                  "
                ></span>
              </a-checkbox>
            </a-form-item>
          </div>
        </div>
        <div style="margin-top: 30px">
          <a-button type="primary" html-type="submit" long size="large">{{
            $t('common.button.submit')
          }}</a-button>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import _, { get } from 'lodash';
  import { reactive, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { handleBatchRequest } from '@/views/config/utils';
  import { useUserStore } from '@/store';
  import { updateUserSetting } from '@/views/system/api/setting';
  import {
    modifyPassword,
    NAMESPACES,
    ResourceKinds,
    apiVersion,
    GlobalNamespace
  } from '../api';
  import { FirstGetPasswordCommand } from '../config';

  const cllectionLink = 'https://seal-io.github.io/docs/improvement-plan';
  const { t } = useI18n();
  const userStore = useUserStore();
  const emits = defineEmits(['updatePassword']);
  const props = defineProps({
    originalPassword: {
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
  const formData = reactive({
    'originalPassword': props.originalPassword,
    'newPassword': '',
    'confirmPassword': '',
    'serve-url': window.location.origin,
    'enable-telemetry': true
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

  const updateServerURLAndTelemetry = async (settings) => {
    const list = _.map(settings, (item) => {
      return {
        name: item.name,
        namespace: GlobalNamespace,
        data: {
          kind: ResourceKinds.Setting,
          apiVersion,
          metadata: {
            name: item.name,
            namespace: GlobalNamespace
          },
          spec: {
            value: item.value
          }
        }
      };
    });

    return handleBatchRequest(list, updateUserSetting);
  };
  const handleSubmit = async ({ errors }) => {
    if (!errors) {
      const data = {
        originalPassword: props.originalPassword,
        password: formData.newPassword,
        name: props.userName
      };
      const userSetting = get(userStore, 'userInfo.userSetting');
      const settings = [
        {
          name: 'serve-url',
          value: formData['serve-url']
        },
        {
          name: 'enable-telemetry',
          value: formData['enable-telemetry'].toString()
        }
      ];

      try {
        if (userStore.isSystemAdmin()) {
          await Promise.all([
            modifyPassword(data),
            updateServerURLAndTelemetry(settings)
          ]);
        } else {
          await modifyPassword(data);
        }

        userStore.setInfo({
          userSetting: {
            ...userSetting,
            'serve-url': {
              data: _.get(userSetting, ['serve-url', 'data'], {}),
              value: formData['serve-url']
            },
            'bootstrap-password-provision': {
              data: _.get(
                userSetting,
                ['bootstrap-password-provision', 'data'],
                {}
              ),
              value: FirstGetPasswordCommand.Invalid
            }
          }
        });
        emits('updatePassword', formData.newPassword);
        // Message.success(t('common.message.success'));
      } catch (error) {
        // ignore
        console.log('error========112333', error);
      }
    }
  };
  watch(
    () => props.settingsInfo,
    (val) => {
      if (val) {
        formData['serve-url'] =
          props.settingsInfo['serve-url']?.value || window.location.origin;
        formData['enable-telemetry'] =
          props.settingsInfo['enable-telemetry']?.value === 'true';
      }
    },
    { immediate: true }
  );
</script>

<style lang="less" scoped>
  .container {
    min-width: 400px;

    :deep(.arco-card-body) {
      padding: 0;
    }

    :deep(.arco-card) {
      background: none;
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
      padding: 0;
      background-color: transparent;
      border-radius: var(--border-radius-small);
    }

    .arco-input-wrapper {
      width: 100%;
      background-color: var(--color-white);
    }
  }
</style>

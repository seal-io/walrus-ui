<template>
  <div class="container">
    <a-card class="general-card q-s-w-card">
      <GroupTitle :title="$t('user.password.modify')" show-back></GroupTitle>
      <a-form :model="formData" auto-label-width @submit="handleSubmit">
        <a-form-item
          field="oldPassword"
          :label="$t('user.password.oldPassword')"
          :trigger="['change', 'blur']"
          :rules="[
            { required: true, message: $t('user.password.rules.oldpassword') }
          ]"
        >
          <a-input-password v-model="formData.oldPassword" allow-clear />
        </a-form-item>
        <a-form-item
          field="newPassword"
          :label="$t('user.password.newPassword')"
          :trigger="['change', 'blur']"
          :rules="[
            { required: true, message: $t('user.password.rules.newpassword') }
          ]"
        >
          <a-input-password v-model="formData.newPassword" allow-clear />
        </a-form-item>
        <a-form-item
          field="confirmPassword"
          :label="$t('user.password.confirmPassword')"
          :trigger="['change', 'blur']"
          :rules="[
            {
              required: true,
              validator: validateConfirmPassword
            }
          ]"
        >
          <a-input-password v-model="formData.confirmPassword" allow-clear />
        </a-form-item>
        <a-form-item class="edit-footer-wrap">
          <EditPageFooter>
            <template #save>
              <a-button type="primary" class="save-btn" html-type="submit">{{
                $t('common.button.save')
              }}</a-button>
            </template>
            <template #cancel>
              <a-button
                type="outline"
                class="cancel-btn"
                @click="handleCancel"
                >{{ $t('common.button.cancel') }}</a-button
              >
            </template>
          </EditPageFooter>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { modifyPassword } from '@/api/user';
  import { useUserStore } from '@/store';
  import GroupTitle from '@/components/group-title/index.vue';

  const { t } = useI18n();
  const userStore = useUserStore();
  const router = useRouter();
  const props = defineProps({
    show: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });

  const formData = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
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
        oldPassword: formData.oldPassword,
        password: formData.newPassword,
        name: userStore.name
      };
      await modifyPassword(data);
      Message.success(t('common.message.success'));
    }
  };
</script>

<style lang="less" scoped>
  .container {
    :deep(.arco-card-body) {
      padding: 20px;
    }

    .arco-input-wrapper {
      width: 300px;
    }
  }
</style>

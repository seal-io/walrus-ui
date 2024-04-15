<template>
  <div>
    <a-form :model="formData" auto-label-width @submit="handleSubmit">
      <a-form-item
        hide-asterisk
        hide-label
        field="oldPassword"
        :trigger="['change', 'blur']"
        :rules="[
          { required: true, message: $t('user.password.rules.oldpassword') }
        ]"
      >
        <seal-input-password
          v-model="formData.oldPassword"
          :style="{ width: `${InputWidth.LARGE}px` }"
          :required="true"
          allow-clear
          :placeholder="$t('user.password.oldPassword')"
        />
      </a-form-item>
      <a-form-item
        hide-asterisk
        hide-label
        field="newPassword"
        :trigger="['change', 'blur']"
        :rules="[
          { required: true, message: $t('user.password.rules.newpassword') },
          { minLength: 6, message: $t('propfile.password.leastlength') }
        ]"
      >
        <seal-input-password
          v-model="formData.newPassword"
          :style="{ width: `${InputWidth.LARGE}px` }"
          :required="true"
          allow-clear
          :placeholder="$t('user.password.newPassword')"
        />
      </a-form-item>
      <a-form-item
        hide-label
        hide-asterisk
        field="confirmPassword"
        :trigger="['change', 'blur']"
        :rules="[
          {
            required: true,
            validator: validateConfirmPassword
          },
          { minLength: 6, message: $t('propfile.password.leastlength') }
        ]"
      >
        <seal-input-password
          v-model="formData.confirmPassword"
          :style="{ width: `${InputWidth.LARGE}px` }"
          :required="true"
          allow-clear
          :placeholder="$t('user.password.confirmPassword')"
        />
      </a-form-item>
      <a-form-item class="edit-footer-wrap">
        <EditPageFooter>
          <template #save>
            <a-button type="primary" class="save-btn" html-type="submit">{{
              $t('common.button.save')
            }}</a-button>
          </template>
          <template #cancel>
            <a-button type="outline" class="cancel-btn" @click="handleCancel">{{
              $t('common.button.cancel')
            }}</a-button>
          </template>
        </EditPageFooter>
      </a-form-item>
    </a-form>
    <!-- <EditPageFooter :size="100">
      <template #save>
        <a-button type="primary" class="save-btn" html-type="submit">{{
          $t('common.button.save')
        }}</a-button>
      </template>
      <template #cancel>
        <a-button type="outline" class="cancel-btn" @click="handleCancel">{{
          $t('common.button.cancel')
        }}</a-button>
      </template>
    </EditPageFooter> -->
  </div>
</template>

<script lang="ts" setup>
  import { InputWidth } from '@/views/config';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { modifyPassword } from '@/views/login/api';
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
  // .container {
  //   :deep(.arco-card-body) {
  //     padding: 20px;
  //   }

  //   .arco-input-wrapper {
  //     width: 300px;
  //   }
  // }
</style>

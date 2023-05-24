<template>
  <ComCard class="container">
    <!-- <GroupTitle :title="$t('account.settings.title')" show-back></GroupTitle> -->
    <a-tabs
      v-model:active-key="activeKey"
      :default-active-key="activeKey"
      @change="handleTabChange"
    >
      <a-tab-pane key="account" title="账户管理">
        <AccountManagement></AccountManagement>
      </a-tab-pane>
      <a-tab-pane key="password" title="修改密码">
        <ModifyPassword></ModifyPassword>
      </a-tab-pane>
    </a-tabs>
  </ComCard>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import GroupTitle from '@/components/group-title/index.vue';
  import ModifyPassword from './modify-password.vue';
  import AccountManagement from './account-management.vue';

  const activeKey = ref('account');
  const handleTabChange = () => {};
</script>

<style lang="less" scoped></style>

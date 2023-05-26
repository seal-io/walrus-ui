<template>
  <ComCard class="container">
    <GroupTitle
      :title="$t('propfile.account.user.title')"
      show-back
      style="margin-bottom: 15px"
    ></GroupTitle>
    <a-tabs
      v-model:active-key="activeKey"
      :default-active-key="activeKey"
      class="page-line-tabs"
    >
      <a-tab-pane key="userInfo" :title="$t('propfile.account.user.info')">
        <UserInfo></UserInfo>
      </a-tab-pane>
      <a-tab-pane key="password" :title="$t('user.password.modify')">
        <ModifyPassword></ModifyPassword>
      </a-tab-pane>
    </a-tabs>
  </ComCard>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import GroupTitle from '@/components/group-title/index.vue';
  import UserInfo from './user-info.vue';
  import ModifyPassword from './modify-password.vue';

  const activeKey = ref('userInfo');
</script>

<style lang="less" scoped></style>

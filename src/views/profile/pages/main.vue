<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :menu="{
          icon: 'icon-user1',
          iconfont: true,
          label: $t('propfile.account.user.title')
        }"
      ></Breadcrumb>
    </BreadWrapper>
    <ComCard padding="0" top-gap>
      <HeaderInfo :info="{ name: $t('propfile.account.user.title') }">
        <template #icon>
          <i class="iconfont icon-user-circle"></i>
        </template>
      </HeaderInfo>
      <ComCard>
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
          <a-tab-pane key="tokens" :title="$t('account.settings.apikeys')">
            <Tokens></Tokens>
          </a-tab-pane>
        </a-tabs>
      </ComCard>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import HeaderInfo from '@/components/header-info/index.vue';
  import GroupTitle from '@/components/group-title/index.vue';
  import UserInfo from './user-info.vue';
  import ModifyPassword from './modify-password.vue';
  import Tokens from './tokens.vue';

  const activeKey = ref('userInfo');
</script>

<style lang="less" scoped></style>

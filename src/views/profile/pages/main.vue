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
    <ComCard padding="0">
      <HeaderInfo :info="{ name: userStore.name }">
        <template #icon>
          <i class="iconfont icon-user-circle"></i>
        </template>
        <template #description>
          <span>{{ $t(userRole) }}</span>
        </template>
      </HeaderInfo>
      <ComCard padding="0 var(--card-content-padding) 20px">
        <a-tabs
          v-model:active-key="activeKey"
          :default-active-key="activeKey"
          class="page-line-tabs"
          @change="setPageTabActive"
        >
          <a-tab-pane
            :key="UserTabs.USERS"
            :title="$t('menu.systemsettings.permissions')"
          >
            <UserInfo></UserInfo>
          </a-tab-pane>
          <a-tab-pane
            :key="UserTabs.PASSWORD"
            :title="$t('settings.user.setting')"
          >
            <ModifyPassword></ModifyPassword>
          </a-tab-pane>
        </a-tabs>
      </ComCard>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { ref, computed } from 'vue';
  import { useUserStore } from '@/store';
  import { UserTabs } from '@/views/config';
  import useTabActive, { TabPage } from '@/hooks/use-tab-active';
  import { RoleType, RolesTypeMap } from '@/views/system/config/users';
  import HeaderInfo from '@/components/header-info/index.vue';
  import UserInfo from './user-info.vue';
  import ModifyPassword from './modify-password.vue';
  import Tokens from './tokens.vue';

  const userStore = useUserStore();
  const { activeKey, setPageTabActive } = useTabActive(
    TabPage.USERTAB,
    UserTabs.USERS
  );

  const userRole = computed(() => {
    const { role } = userStore;
    return _.get(RolesTypeMap, RoleType[role]);
  });
</script>

<style lang="less" scoped></style>

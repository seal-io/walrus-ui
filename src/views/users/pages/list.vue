<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :menu="{
          icon: 'icon-users-o',
          iconfont: true,
          label: $t('menu.systemsettings.user')
        }"
      ></Breadcrumb>
    </BreadWrapper>
    <ComCard padding="0">
      <HeaderInfo :info="{ name: $t('menu.systemsettings.user') }">
        <template #icon>
          <i class="iconfont icon-users"></i>
        </template>
      </HeaderInfo>
      <ComCard padding="0 var(--card-content-padding) 20px">
        <a-tabs
          v-model:active-key="activeKey"
          :default-active-key="activeKey"
          lazy-load
          class="page-line-tabs"
          @change="setPageTabActive"
        >
          <a-tab-pane :key="SubjectTabs.USERS" title="Users">
            <Users></Users>
          </a-tab-pane>
          <a-tab-pane :key="SubjectTabs.PROVIDERS" title="User Providers">
            <ProviderUsers></ProviderUsers>
          </a-tab-pane>
        </a-tabs>
      </ComCard>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import { USERS } from '@/router/config';
  import { SubjectTabs } from '@/views/config';
  import useTabActive, { TabPage } from '@/hooks/use-tab-active';
  import HeaderInfo from '@/components/header-info/index.vue';
  import Users from '@/views/system/pages/users.vue';
  import ProviderUsers from '@/views/subject-providers/components/providers.vue';

  const { activeKey, setPageTabActive } = useTabActive(
    TabPage.USERTAB,
    SubjectTabs.USERS
  );
</script>

<script lang="ts">
  export default {
    name: USERS.List
  };
</script>

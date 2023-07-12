<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :menu="{ icon: 'icon-settings', label: $t('menu.systemsettings') }"
      ></Breadcrumb>
    </BreadWrapper>
    <ComCard padding="0">
      <HeaderInfo :info="{ name: $t('menu.systemsettings') }">
        <template #icon>
          <i class="iconfont icon-custom"></i>
        </template>
      </HeaderInfo>
      <ComCard>
        <a-tabs
          v-model:active-key="activeKey"
          class="page-line-tabs"
          lazy-load
          :default-active-key="activeKey"
          @change="handleTabChange"
        >
          <a-tab-pane
            v-if="
              userStore.hasRolesActionsPermission({
                resource: Resources.Subjects,
                actions: [Actions.GET]
              })
            "
            :key="TabKeys.USERS"
            :title="$t('menu.systemsettings.user')"
          >
            <Users></Users>
          </a-tab-pane>
          <a-tab-pane
            v-if="
              userStore.hasRolesActionsPermission({
                resource: Resources.Settings,
                actions: [Actions.GET]
              })
            "
            :key="TabKeys.SETTINGS"
            :title="$t('menu.systemsettings.config')"
          >
            <Settings></Settings>
          </a-tab-pane>
        </a-tabs>
      </ComCard>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { Resources, Actions } from '@/permissions/config';
  import { useUserStore } from '@/store';
  import HeaderInfo from '@/components/header-info/index.vue';
  import Settings from './setting.vue';
  import Users from './users.vue';

  const TabKeys = {
    USERS: 'users',
    SETTINGS: 'settings'
  };
  const userStore = useUserStore();
  const activeKey = ref(TabKeys.USERS);
  const setDefaultTab = () => {
    if (
      userStore.hasRolesActionsPermission({
        resource: Resources.Subjects,
        actions: [Actions.GET]
      })
    ) {
      activeKey.value = TabKeys.USERS;
      return;
    }
    activeKey.value = TabKeys.SETTINGS;
  };
  const handleTabChange = () => {};
  setDefaultTab();
</script>

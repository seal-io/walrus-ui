<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :menu="{ icon: 'icon-settings', label: $t('menu.systemsettings') }"
      ></Breadcrumb>
    </BreadWrapper>
    <ComCard padding="0" top-gap>
      <HeaderInfo :info="{ name: $t('menu.systemsettings') }">
        <template #icon>
          <i class="iconfont icon-custom"></i>
        </template>
      </HeaderInfo>
      <ComCard>
        <a-tabs
          v-model:active-key="activeKey"
          class="page-line-tabs"
          :default-active-key="activeKey"
          @change="handleTabChange"
        >
          <a-tab-pane key="users" :title="$t('menu.systemsettings.user')">
            <Users></Users>
          </a-tab-pane>
          <a-tab-pane key="settings" :title="$t('menu.systemsettings.config')">
            <Settings></Settings>
          </a-tab-pane>
        </a-tabs>
      </ComCard>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import HeaderInfo from '@/components/header-info/index.vue';
  import Settings from './setting.vue';
  import Users from './users.vue';

  const activeKey = ref('users');
  const handleTabChange = () => {};
</script>

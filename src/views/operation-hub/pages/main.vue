<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :menu="{ icon: 'icon-relation', label: $t('menu.operatorHub') }"
      ></Breadcrumb>
    </BreadWrapper>
    <ComCard padding="0">
      <HeaderInfo :info="{ name: $t('menu.operatorHub') }">
        <template #icon>
          <i class="iconfont icon-yunwei"></i>
        </template>
      </HeaderInfo>
      <ComCard>
        <a-tabs
          v-model:active-key="activeKey"
          class="page-line-tabs"
          :default-active-key="activeKey"
          @change="handleTabChange"
        >
          <a-tab-pane key="templates" :title="$t('menu.operatorHub.module')">
            <Templates></Templates>
          </a-tab-pane>
          <a-tab-pane key="variables" :title="$t('menu.operatorHub.secret')">
            <GlobalVariables></GlobalVariables>
          </a-tab-pane>
          <a-tab-pane
            key="connectors"
            :title="$t('menu.operatorHub.connector')"
          >
            <Connectors></Connectors>
          </a-tab-pane>
        </a-tabs>
      </ComCard>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import { OPERATIONHUB } from '@/router/config';
  import { ref } from 'vue';
  import HeaderInfo from '@/components/header-info/index.vue';
  import Connectors from '../connectors/components/table-list.vue';
  import Templates from '../templates/pages/list.vue';
  import GlobalVariables from '../variables/pages/list.vue';

  const activeKey = ref('templates');
  const handleTabChange = () => {};
</script>

<script lang="ts">
  export default {
    name: OPERATIONHUB.Main
  };
</script>

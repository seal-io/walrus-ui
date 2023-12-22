<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :menu="{
          icon: 'icon-a-relation10-line',
          iconfont: true,
          label: $t('menu.operatorHub')
        }"
      ></Breadcrumb>
    </BreadWrapper>
    <ComCard padding="0">
      <HeaderInfo :info="{ name: $t('menu.operatorHub') }">
        <template #icon>
          <i class="iconfont icon-a-relation10-fill"></i>
        </template>
      </HeaderInfo>
      <ComCard>
        <a-tabs
          v-model:active-key="activeKey"
          lazy-load
          class="page-line-tabs"
          :default-active-key="activeKey"
          @change="handleTabChange"
        >
          <a-tab-pane
            :key="OperatorHubTabs.ResouceDefinitions"
            :title="$t('menu.operatorHub.resourceDefinitions')"
          >
            <ResourceDefinition></ResourceDefinition>
          </a-tab-pane>
          <a-tab-pane
            :key="OperatorHubTabs.TEMPLATES"
            :title="$t('menu.operatorHub.module')"
          >
            <Templates :current-view="dataView.templates"></Templates>
          </a-tab-pane>
          <a-tab-pane
            :key="OperatorHubTabs.CATALOGS"
            :title="$t('menu.operatorHub.catalog')"
          >
            <Catalogs></Catalogs>
          </a-tab-pane>
          <a-tab-pane
            :key="OperatorHubTabs.VARIABLES"
            :title="$t('menu.operatorHub.secret')"
          >
            <GlobalVariables></GlobalVariables>
          </a-tab-pane>
          <a-tab-pane
            :key="OperatorHubTabs.CONNECTOR"
            :title="$t('menu.operatorHub.connector')"
          >
            <Connectors></Connectors>
          </a-tab-pane>

          <template #extra>
            <IconBtnGroup
              v-if="activeKey === OperatorHubTabs.TEMPLATES"
              v-model:active="dataView[activeKey]"
              :icon-list="iconList"
            ></IconBtnGroup>
          </template>
        </a-tabs>
      </ComCard>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import { OPERATIONHUB } from '@/router/config';
  import { ref, reactive } from 'vue';
  import useTabActive, { TabPage } from '@/hooks/use-tab-active';
  import { OperatorHubTabs } from '@/views/config';
  import HeaderInfo from '@/components/header-info/index.vue';
  import IconBtnGroup from '@/components/icon-btn-group/index.vue';
  import Connectors from '../connectors/components/table-list.vue';
  import Templates from '../templates/pages/list.vue';
  import Catalogs from '../catalogs/pages/list.vue';
  import GlobalVariables from '../variables/pages/list.vue';
  import ResourceDefinition from '../resource-definitions/pages/list.vue';

  const iconList = [
    {
      icon: 'icon-apps',
      view: 'thumb',
      iconfont: false
    },
    {
      icon: 'icon-table',
      view: 'list',
      iconfont: true
    }
  ];

  // The catalog list does not need the thumbnail mode for now
  const dataView = reactive({
    templates: 'thumb',
    catalogs: 'thumb'
  });
  const { activeKey, setPageTabActive } = useTabActive(
    TabPage.OPERATORHUBTAB,
    OperatorHubTabs.ResouceDefinitions
  );
  const handleTabChange = (val) => {
    setPageTabActive(val);
  };
</script>

<script lang="ts">
  export default {
    name: OPERATIONHUB.Main
  };
</script>

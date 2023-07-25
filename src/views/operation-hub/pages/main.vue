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
        <template #extra>
          <QuestionPopup :link="QAlinkMap.Template"></QuestionPopup>
        </template>
      </HeaderInfo>
      <ComCard>
        <a-tabs
          v-model:active-key="activeKey"
          class="page-line-tabs"
          :default-active-key="activeKey"
          @change="handleTabChange"
        >
          <a-tab-pane
            :key="TabKeys.Templates"
            :title="$t('menu.operatorHub.module')"
          >
            <Templates :current-view="templateView"></Templates>
          </a-tab-pane>
          <a-tab-pane
            :key="TabKeys.Variables"
            :title="$t('menu.operatorHub.secret')"
          >
            <GlobalVariables></GlobalVariables>
          </a-tab-pane>
          <a-tab-pane
            :key="TabKeys.Connectors"
            :title="$t('menu.operatorHub.connector')"
          >
            <Connectors></Connectors>
          </a-tab-pane>
          <template #extra>
            <IconBtnGroup
              v-if="activeKey === TabKeys.Templates"
              v-model:active="templateView"
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
  import { ref } from 'vue';
  import { QAlinkMap } from '@/views/config';
  import QuestionPopup from '@/components/question-popup/index.vue';
  import HeaderInfo from '@/components/header-info/index.vue';
  import IconBtnGroup from '@/components/icon-btn-group/index.vue';
  import Connectors from '../connectors/components/table-list.vue';
  import Templates from '../templates/pages/list.vue';
  import GlobalVariables from '../variables/pages/list.vue';

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
  const TabKeys = {
    Templates: 'templates',
    Variables: 'variables',
    Connectors: 'connectors'
  };
  const templateView = ref('thumb');
  const activeKey = ref(TabKeys.Templates);
  const handleTabChange = () => {};
</script>

<script lang="ts">
  export default {
    name: OPERATIONHUB.Main
  };
</script>

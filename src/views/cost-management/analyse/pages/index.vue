<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :menu="{ icon: 'icon-bar-chart', label: $t('navbar.costmanagement') }"
      ></Breadcrumb>
    </BreadWrapper>
    <ComCard padding="0" top-gap>
      <HeaderInfo :info="{ name: $t('navbar.costmanagement') }">
        <template #icon>
          <i class="iconfont icon-zhuzhuangtu"></i>
        </template>
      </HeaderInfo>
      <div>
        <a-tabs
          v-model:active-key="activeKey"
          class="page-line-tabs"
          :default-active-key="activeKey"
          @change="handleTabChange"
        >
          <a-tab-pane key="list" :title="$t('menu.costManagement.perspective')">
            <ComCard padding="0 16px 16px 16px">
              <CostList></CostList>
            </ComCard>
          </a-tab-pane>
          <a-tab-pane key="detail" :title="$t('menu.costManagement.analyse')">
            <CostDetail></CostDetail>
          </a-tab-pane>
        </a-tabs>
      </div>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import HeaderInfo from '@/components/header-info/index.vue';
  import CostList from './list.vue';
  import CostDetail from './main.vue';

  const activeKey = ref('list');
  const handleTabChange = () => {};
</script>

<style lang="less" scoped>
  :deep(.arco-tabs) {
    &.page-line-tabs {
      .arco-tabs-nav {
        margin: 16px;
        margin-bottom: 16px;
      }

      .arco-tabs-content {
        padding-top: 0;
      }
    }
  }
</style>

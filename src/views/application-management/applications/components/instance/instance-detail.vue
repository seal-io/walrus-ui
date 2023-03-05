<template>
  <div>
    <ModuleCard title="实例基本信息">
      <template #title>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
          "
        >
          <span>实例基本信息</span>
          <a-button
            type="primary"
            size="small"
            style="width: 98px"
            @click="handleUpgradeInstance"
            >升级</a-button
          >
        </div>
      </template>
      <BasicInfo></BasicInfo>
    </ModuleCard>
    <ModuleCard title="History">
      <applicationHistory></applicationHistory>
    </ModuleCard>
    <a-tabs
      lazy-load
      type="rounded"
      :active-key="activeKey"
      class="module-tabs"
      @change="handleTabChange"
    >
      <a-tab-pane
        v-for="item in instanceTabs"
        :key="item.value"
        :title="item.label"
      >
        <Component :is="instanceTabMap[item.com]"></Component>
      </a-tab-pane>
    </a-tabs>
    <createInstance
      v-model:show="showInstanceModal"
      title="升级实例"
      :status="status"
      @save="handleSaveInstanceInfo"
    ></createInstance>
  </div>
</template>

<script lang="ts" setup>
  import { markRaw, ref } from 'vue';
  import tabTerminal from '@/components/x-terminal/index.vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import tabResource from './tab-resource.vue';
  import tabLogs from './tab-logs.vue';
  import tabOutput from './tab-output.vue';
  import tabOptimization from './tab-optimization.vue';
  import tabGraph from './tab-graph.vue';
  import applicationHistory from './application-history.vue';
  import createInstance from '../create-instance.vue';
  import BasicInfo from './basic-info.vue';
  import { instanceTabs } from '../../config';

  const activeKey = ref('resource');
  const showInstanceModal = ref(false);
  const status = ref('edit');
  const instanceTabMap = {
    tabResource: markRaw(tabResource),
    tabLogs: markRaw(tabLogs),
    tabOutput: markRaw(tabOutput),
    tabOptimization: markRaw(tabOptimization),
    tabGraph: markRaw(tabGraph),
    tabHistory: markRaw(applicationHistory),
    tabTerminal: markRaw(tabTerminal)
  };
  const handleTabChange = (val) => {
    activeKey.value = val;
  };
  const handleSaveInstanceInfo = () => {};
  const handleUpgradeInstance = () => {
    showInstanceModal.value = true;
  };
  const handleOk = () => {};
</script>

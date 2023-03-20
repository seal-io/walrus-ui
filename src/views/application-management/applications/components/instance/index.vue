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
    <ModuleCard title="历史版本">
      <applicationHistory></applicationHistory>
    </ModuleCard>
    <ModuleCard title="资源信息" style="margin-top: 20px">
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
    </ModuleCard>
    <EditPageFooter>
      <template #save>
        <a-button
          type="primary"
          class="cap-title cancel-btn"
          @click="handleOk"
          >{{ $t('common.button.back') }}</a-button
        >
      </template>
      <!-- <template #cancel>
        <a-button
          type="outline"
          class="cap-title cancel-btn"
          @click="handleCancel"
          >{{ $t('common.button.cancel') }}</a-button
        >
      </template> -->
    </EditPageFooter>
    <createInstance
      v-model:show="showInstanceModal"
      v-model:status="status"
      title="升级实例"
      :variables="appInfoVariables"
      :environment-list="environmentList"
      @save="handleSaveInstanceInfo"
    ></createInstance>
  </div>
</template>

<script lang="ts" setup>
  import { cloneDeep, get } from 'lodash';
  import { markRaw, ref, reactive, watch, inject, computed } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import tabTerminal from './x-terminal/tab-terminal.vue';
  import tabResource from './tab-resource.vue';
  import tabLogs from './tab-logs.vue';
  import tabOutput from './tab-output.vue';
  import tabOptimization from './tab-optimization.vue';
  import tabGraph from './tab-graph.vue';
  import tabEndpoint from './tab-endpoint.vue';
  import applicationHistory from './application-history.vue';
  import createInstance from '../create-instance.vue';
  import BasicInfo from './basic-info.vue';
  import { instanceTabs } from '../../config';
  import { queryItemApplicationInstances } from '../../api';

  const props = defineProps({
    instanceId: {
      type: String,
      default() {
        return '';
      }
    }
  });
  const environmentList = inject('environmentList', ref([]));
  const appInfo = inject('appInfo', reactive({}));
  const { router, route } = useCallCommon();
  const activeKey = ref('resource');
  const showInstanceModal = ref(false);
  const status = ref('edit');
  const instanceTabMap = {
    tabResource: markRaw(tabResource),
    tabLogs: markRaw(tabLogs),
    // tabOutput: markRaw(tabOutput),
    // tabOptimization: markRaw(tabOptimization),
    // tabGraph: markRaw(tabGraph),
    tabHistory: markRaw(applicationHistory),
    tabTerminal: markRaw(tabTerminal),
    tabEndpoint: markRaw(tabEndpoint)
  };

  const appInfoVariables = computed(() => {
    return cloneDeep(get(appInfo, 'variables') || []);
  });
  const handleTabChange = (val) => {
    activeKey.value = val;
  };
  const handleSaveInstanceInfo = () => {};
  const handleUpgradeInstance = () => {
    status.value = 'edit';
    showInstanceModal.value = true;
  };
  const getInstanceInfo = async () => {
    if (!props.instanceId) return;
    try {
      const { data } = await queryItemApplicationInstances({
        id: props.instanceId
      });
    } catch (error) {
      console.log(error);
    }
  };

  watch(
    () => props.instanceId,
    () => {
      // getInstanceInfo();
    },
    {
      immediate: true
    }
  );
  const handleOk = () => {
    router.back();
  };
  const handleCancel = () => {
    router.back();
  };
</script>

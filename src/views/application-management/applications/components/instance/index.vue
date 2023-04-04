<template>
  <div>
    <ModuleCard :title="$t('applications.instance.basic.title')">
      <template #title>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
          "
        >
          <span>{{ $t('applications.instance.basic.title') }}</span>
        </div>
      </template>
      <BasicInfo></BasicInfo>
    </ModuleCard>
    <ModuleCard :title="$t('applications.applications.instance.history')">
      <applicationHistory :deploy-id="deployId"></applicationHistory>
    </ModuleCard>
    <ModuleCard :title="$t('applications.applications.instance.accessUrl')">
      <tabEndpoint ref="tabEndpointCom"></tabEndpoint>
    </ModuleCard>

    <ModuleCard
      :title="$t('applications.applications.instance.resource')"
      style="margin-top: 20px"
    >
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
          :title="$t(item.label)"
        >
          <Component
            :is="instanceTabMap[item.com]"
            @updateEndpoint="handleCallUpdateEndpoint"
          ></Component>
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
      :title="$t('applications.applications.instance.upgrade')"
      :variables="appInfoVariables"
      :environment-list="environmentList"
      @save="handleSaveInstanceInfo"
    ></createInstance>
  </div>
</template>

<script lang="ts" setup>
  import { cloneDeep, get, split, includes } from 'lodash';
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
  import { EndPointRow } from '../../config/interface';
  import { queryItemApplicationInstances } from '../../api';

  const props = defineProps({
    instanceId: {
      type: String,
      default() {
        return '';
      }
    }
  });
  // 1: create 2: update 3: delete
  const environmentList = inject('environmentList', ref([]));
  const instanceInfo = inject('instanceInfo', ref({}));
  const appInfo = inject('appInfo', reactive({}));
  const { router, route } = useCallCommon();
  const activeKey = ref('resource');
  const showInstanceModal = ref(false);
  const status = ref('edit');
  const deployId = ref('');
  const tabEndpointCom = ref();
  const instanceTabMap = {
    tabResource: markRaw(tabResource),
    tabLogs: markRaw(tabLogs),
    // tabOutput: markRaw(tabOutput),
    // tabOptimization: markRaw(tabOptimization),
    // tabGraph: markRaw(tabGraph),
    tabHistory: markRaw(applicationHistory),
    tabTerminal: markRaw(tabTerminal)
    // tabEndpoint: markRaw(tabEndpoint)
  };

  const appInfoVariables = computed(() => {
    return cloneDeep(get(appInfo, 'variables') || []);
  });
  const handleTabChange = (val) => {
    activeKey.value = val;
  };
  const handleCallUpdateEndpoint = () => {
    console.log('update endpoint');
    tabEndpointCom.value.refreshDataList();
  };
  const handleSaveInstanceInfo = (res) => {
    deployId.value = res?.data.id;
  };
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
      deployId.value = '';
      // getInstanceInfo();
      // getEndpoints();
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

<style lang="less" scoped>
  .url-wrap {
    display: inline-flex;
    margin-bottom: 10px;

    .access-link-item {
      max-width: 160px;
      margin-right: 10px;
      padding: 5px 10px;
      background-color: var(--color-fill-2);
      border-radius: 14px;
      cursor: pointer;

      &:hover {
        background-color: rgb(var(--arcoblue-1));

        .arco-link {
          background-color: transparent;
        }
      }
    }
  }
</style>

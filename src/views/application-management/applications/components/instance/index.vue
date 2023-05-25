<template>
  <div>
    <ModuleCard :title="$t('applications.instance.basic.title')">
      <BasicInfo></BasicInfo>
    </ModuleCard>
    <ModuleCard :title="$t('applications.applications.instance.history')">
      <applicationHistory></applicationHistory>
    </ModuleCard>
    <ModuleCard :title="$t('applications.applications.instance.accessUrl')">
      <tabEndpoint ref="tabEndpointCom"></tabEndpoint>
    </ModuleCard>

    <ModuleCard
      :title="$t('applications.applications.instance.resource')"
      style="margin-top: 20px"
    >
      <template #title>
        <span>{{ $t('applications.applications.instance.resource') }}</span>
        <a-tooltip
          :content="$t('applications.applications.instance.resource.tips')"
        >
          <icon-info-circle class="mleft-5" />
        </a-tooltip>
      </template>
      <a-tabs
        lazy-load
        type="rounded"
        :active-key="activeKey"
        class="module-tabs"
        @change="handleTabChange"
      >
        <a-tab-pane
          v-for="item in instanceTabList"
          :key="item.value"
          :title="$t(item.label)"
        >
          <Component
            :is="instanceTabMap[item.com]"
            :resource-list="dataList"
            :is-loading="loading"
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
    </EditPageFooter>
  </div>
</template>

<script lang="ts" setup>
  import { Resources } from '@/permissions/resources';
  import { useUserStore } from '@/store';
  import _ from 'lodash';
  import { markRaw, ref, watch, onMounted } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import tabTerminal from './x-terminal/tab-terminal.vue';
  import tabResource from './tab-resource.vue';
  import tabLogs from './tab-logs.vue';
  import tabOutput from './tab-output.vue';
  import tabOptimization from './tab-optimization.vue';
  import tabGraph from './tab-graph/index.vue';
  import tabEndpoint from './tab-endpoint.vue';
  import applicationHistory from './application-history.vue';
  import BasicInfo from './basic-info.vue';
  import { instanceTabs } from '../../config';
  import useFetchResource from '../hooks/use-fetch-chunk-data';

  const props = defineProps({
    instanceId: {
      type: String,
      default() {
        return '';
      }
    }
  });
  // 1: create 2: update 3: delete

  const userStore = useUserStore();
  const { router, route } = useCallCommon();
  const { loading, fetchData, createResourceChunkConnection, dataList } =
    useFetchResource();
  const projectID = route.params.projectId || '';
  const activeKey = ref('resource');
  const tabEndpointCom = ref();
  const instanceTabMap = {
    tabResource: markRaw(tabResource),
    tabLogs: markRaw(tabLogs),
    tabOutput: markRaw(tabOutput),
    // tabOptimization: markRaw(tabOptimization),
    tabGraph: markRaw(tabGraph),
    tabHistory: markRaw(applicationHistory),
    tabTerminal: markRaw(tabTerminal)
    // tabEndpoint: markRaw(tabEndpoint)
  };
  const instanceTabList = ref<any[]>([]);

  const setInstanceTabList = () => {
    instanceTabList.value = _.filter(instanceTabs, (item) => {
      if (!item.requiredAuth) return true;
      return userStore.hasProjectResourceActions({
        projectID,
        resource: Resources.ApplicationResources,
        actions: ['GET']
      });
    });
  };
  const handleTabChange = (val) => {
    activeKey.value = val;
  };

  const debunceFun = () => {
    if (!props.instanceId) return;
    fetchData();
    createResourceChunkConnection();
  };
  watch(
    () => props.instanceId,
    () => {
      debunceFun();
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
  onMounted(() => {
    setInstanceTabList();
  });
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

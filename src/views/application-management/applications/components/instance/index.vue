<template>
  <div>
    <ComCard padding="0" top-gap>
      <HeaderInfo :info="currentInfo">
        <template #icon>
          <i class="iconfont icon-apps-fill"></i>
        </template>
        <template #title>
          <BasicInfo
            :data-info="basicDataList"
            :actions="serviceActions"
            @select="handleSelect"
          >
            <!-- <template #value="{ data }">
              <template
                v-if="
                  data.key === 'operation' &&
                  !_.get(currentInfo, 'status.transitioning')
                "
              >
                <a-button type="primary" size="small" @click="handleUpgrade">
                  <i class="iconfont icon-upgrade"></i
                  >{{ $t('common.button.upgrade') }}</a-button
                >
              </template>
            </template> -->
          </BasicInfo>
        </template>
        <template #description></template>
      </HeaderInfo>
      <slTransition>
        <div v-if="pageAction === 'edit'">
          <serviceEdit
            pg-type="com"
            @save="handleEditSucceed"
            @cancel="handleEditCancel"
          ></serviceEdit>
        </div>
      </slTransition>
      <slTransition>
        <div v-if="pageAction === 'view'">
          <ComCard>
            <ModuleCard
              :title="$t('applications.applications.detail.configuration')"
              :title-style="{ 'margin-bottom': '10px', 'margin-top': 0 }"
            >
              <serviceInfo> </serviceInfo>
            </ModuleCard>
          </ComCard>
          <ComCard>
            <ModuleCard
              :title="$t('applications.applications.instance.history')"
              :title-style="{ 'margin-top': 0 }"
            >
              <applicationHistory></applicationHistory>
            </ModuleCard>
            <ModuleCard
              :title="$t('applications.applications.instance.accessUrl')"
            >
              <tabEndpoint ref="tabEndpointCom"></tabEndpoint>
            </ModuleCard>

            <ModuleCard
              :title="$t('applications.applications.instance.resource')"
              style="margin-top: 20px"
            >
              <template #title>
                <span>{{
                  $t('applications.applications.instance.resource')
                }}</span>
                <a-tooltip
                  :content="
                    $t('applications.applications.instance.resource.tips')
                  "
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
          </ComCard>
        </div>
      </slTransition>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { Resources } from '@/permissions/config';
  import { useUserStore } from '@/store';
  import _ from 'lodash';
  import { markRaw, ref, watch, onMounted, computed, inject } from 'vue';
  import slTransition from '@/components/sl-transition/index.vue';
  import { useSetChunkRequest } from '@/api/axios-chunk-request';
  import HeaderInfo from '@/components/header-info/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import useBasicInfoData from '@/views/application-management/projects/hooks/use-basicInfo-data';
  import tabTerminal from './x-terminal/tab-terminal.vue';
  import tabResource from './tab-resource.vue';
  import tabLogs from './tab-logs.vue';
  import tabOutput from './tab-output.vue';
  // import tabOptimization from './tab-optimization.vue';
  import tabGraph from './tab-graph/index.vue';
  import tabEndpoint from './tab-endpoint.vue';
  import applicationHistory from './application-history.vue';
  import BasicInfo from '../basic-info.vue';
  import {
    instanceTabs,
    instanceBasicInfo,
    serviceActions
  } from '../../config';
  import useFetchResource from '../hooks/use-fetch-chunk-data';
  import { queryItemApplicationInstances } from '../../api';
  import serviceInfo from '../service-info.vue';
  import serviceEdit from '../../pages/service-edit.vue';

  type Reload = () => void;
  const props = defineProps({
    instanceId: {
      type: String,
      default() {
        return '';
      }
    }
  });
  // 1: create 2: update 3: delete
  const execReload: Reload | undefined = inject('execReload');
  const pageAction = ref('view');
  const { setChunkRequest } = useSetChunkRequest();
  const userStore = useUserStore();
  const { router, route, t } = useCallCommon();
  const { loading, fetchData, createResourceChunkConnection, dataList } =
    useFetchResource();
  const projectID = route.params.projectId || '';
  const activeKey = ref('resource');
  const currentInfo = ref({});
  const instanceTabMap = {
    tabResource: markRaw(tabResource),
    tabLogs: markRaw(tabLogs),
    tabOutput: markRaw(tabOutput),
    // tabOptimization: markRaw(tabOptimization),
    tabGraph: markRaw(tabGraph),
    tabHistory: markRaw(applicationHistory),
    tabTerminal: markRaw(tabTerminal)
  };
  const instanceTabList = ref<any[]>([]);
  const basicDataList = useBasicInfoData(instanceBasicInfo, currentInfo);

  const handleUpgrade = () => {
    pageAction.value = 'edit';
  };
  const handleSelect = (value) => {
    handleUpgrade();
  };
  const handleEditSucceed = () => {
    router.replace({
      params: {
        ...route.params
      },
      query: {
        ...route.query
      }
    });
    // execReload?.();
    pageAction.value = 'view';
  };
  const handleEditCancel = () => {
    pageAction.value = 'view';
  };
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
  const getServiceItemInfo = async () => {
    try {
      const params = {
        id: route.query.id
      };
      const { data } = await queryItemApplicationInstances(params);
      currentInfo.value = data;
    } catch (error) {
      console.log(error);
    }
  };
  const handleTabChange = (val) => {
    activeKey.value = val;
  };
  const updateServiceState = (data) => {
    const updateData = _.find(
      data.collection || [],
      (sItem) =>
        _.get(sItem, 'project.id') === _.get(currentInfo.value, 'project.id') &&
        _.get(sItem, 'environment.id') ===
          _.get(currentInfo.value, 'environment.id') &&
        _.get(sItem, 'id') === _.get(currentInfo.value, 'id')
    );
    if (updateData) {
      currentInfo.value = _.cloneDeep(updateData);
    }
  };
  const updateHandler = (list) => {
    _.each(list, (data) => {
      updateServiceState(data);
    });
  };
  const createServiceChunkRequest = () => {
    try {
      setChunkRequest({
        url: `/services`,
        params: {
          projectID: route.params.projectId
        },
        handler: updateHandler
      });
    } catch (error) {
      console.log(error);
    }
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
      getServiceItemInfo();
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
    createServiceChunkRequest();
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

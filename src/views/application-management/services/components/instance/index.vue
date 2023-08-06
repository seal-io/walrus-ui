<template>
  <div id="service-page">
    <ComCard padding="0">
      <HeaderInfo :info="currentInfo">
        <template #icon>
          <i class="iconfont icon-apps-fill"></i>
        </template>
        <template #title>
          <BasicInfo
            :data-info="basicDataList"
            :actions="actionList"
            @group-click="handleClick"
            @group-select="handleSelect"
          >
          </BasicInfo>
        </template>
        <template #description></template>
      </HeaderInfo>
      <slTransition>
        <div v-if="pageAction === PageAction.EDIT">
          <serviceEdit
            pg-type="com"
            @save="handleEditSucceed"
            @cancel="handleEditCancel"
          ></serviceEdit>
        </div>
      </slTransition>
      <div v-if="pageAction === PageAction.VIEW">
        <ComCard>
          <ModuleCard
            :title="$t('applications.applications.detail.configuration')"
            :title-style="{ 'margin-bottom': '10px', 'margin-top': 0 }"
          >
            <serviceInfo ref="serviceInfoRef"> </serviceInfo>
          </ModuleCard>
        </ComCard>
        <ComCard>
          <ModuleCard
            :title="$t('applications.applications.instance.history')"
            :title-style="{ 'margin-top': 0 }"
          >
            <serviceHistory></serviceHistory>
          </ModuleCard>
          <ModuleCard
            :title="$t('applications.applications.instance.accessUrl')"
          >
            <tabEndpoint ref="tabEndpointCom"></tabEndpoint>
          </ModuleCard>

          <ModuleCard
            :title="$t('applications.applications.instance.resource')"
            :title-style="{ 'margin-bottom': '10px' }"
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
              type="line"
              :active-key="activeKey"
              class="page-line-tabs"
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
    </ComCard>
    <deleteServiceModal
      v-model:show="showDeleteModal"
      :callback="handleDeleteConfirm"
      :title="$t('common.delete.tips')"
    >
    </deleteServiceModal>
  </div>
</template>

<script lang="ts" setup>
  import { Resources } from '@/permissions/config';
  import { useUserStore, useServiceStore } from '@/store';
  import _ from 'lodash';
  import { PageAction, websocketEventType } from '@/views/config';
  import {
    markRaw,
    ref,
    PropType,
    onMounted,
    computed,
    onBeforeUnmount
  } from 'vue';
  import slTransition from '@/components/sl-transition/index.vue';
  import { useSetChunkRequest } from '@/api/axios-chunk-request';
  import HeaderInfo from '@/components/header-info/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import useBasicInfoData from '@/views/application-management/projects/hooks/use-basicInfo-data';
  import tabTerminal from './x-terminal/tab-terminal.vue';
  import tabLogs from './tab-logs.vue';
  import tabOutput from './tab-output.vue';
  import tabEndpoint from './tab-endpoint.vue';
  import tabResource from './tab-resource.vue';
  import serviceHistory from './service-history.vue';
  import BasicInfo from '../basic-info.vue';
  import deleteServiceModal from '../delete-service-modal.vue';
  import {
    instanceTabs,
    instanceBasicInfo,
    serviceActions
  } from '../../config';
  import { InstanceData } from '../../config/interface';
  import useFetchResource from '../hooks/use-fetch-chunk-data';
  import { queryItemApplicationService, deleteServiceItem } from '../../api';
  import serviceInfo from '../service-info.vue';
  import serviceEdit from '../../pages/edit.vue';

  const props = defineProps({
    serviceList: {
      type: Array as PropType<InstanceData[]>,
      default() {
        return [];
      }
    }
  });
  // 1: create 2: update 3: delete
  const actionMap = new Map();
  const showCloneModal = ref(false);
  const showDeleteModal = ref(false);
  const pageAction = ref(PageAction.VIEW);
  const { setChunkRequest } = useSetChunkRequest();
  const userStore = useUserStore();
  const serviceStore = useServiceStore();
  const { router, route, t } = useCallCommon();
  const { loading, fetchData, createResourceChunkConnection, dataList } =
    useFetchResource();
  const projectID = route.params.projectId || '';
  const serviceID = route.query.id || '';
  const activeKey = ref('resource');
  const currentInfo = ref({});
  const serviceInfoRef = ref();
  const instanceTabMap = {
    tabResource: markRaw(tabResource),
    tabLogs: markRaw(tabLogs),
    tabOutput: markRaw(tabOutput),
    tabTerminal: markRaw(tabTerminal)
  };
  const instanceTabList = ref<any[]>([]);
  const basicDataList = useBasicInfoData(instanceBasicInfo, currentInfo);

  const actionList = computed(() => {
    const list = _.filter(serviceActions, (item) => {
      if (item.value === 'rollback') {
        return false;
      }
      return item.filterFun ? item.filterFun(currentInfo.value) : true;
    });
    return _.map(list, (o) => {
      const item = _.cloneDeep(o);
      item.disabled = _.isFunction(item.disabled)
        ? item.disabled?.(currentInfo.value)
        : item.disabled;
      return item;
    });
  });
  const handleUpgrade = () => {
    pageAction.value = PageAction.EDIT;
  };

  const handleDeleteConfirm = async (force) => {
    try {
      await deleteServiceItem({ id: route.query.id, force });
    } catch (error) {
      console.log(error);
    }
  };
  const handleClick = () => {
    handleUpgrade();
  };
  const handleClickClone = () => {
    showCloneModal.value = true;
  };
  const handleDelete = () => {
    showDeleteModal.value = true;
  };
  const handleSelect = (value) => {
    actionMap.get(value)?.();
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
    pageAction.value = PageAction.VIEW;
    setTimeout(() => {
      serviceInfoRef.value?.initData();
    }, 100);
  };
  const setActionMap = () => {
    actionMap.set('delete', handleDelete);
    actionMap.set('clone', handleClickClone);
  };
  const handleEditCancel = () => {
    pageAction.value = PageAction.VIEW;
    setTimeout(() => {
      serviceInfoRef.value?.initData();
    }, 100);
  };
  const setInstanceTabList = () => {
    instanceTabList.value = _.filter(instanceTabs, (item) => {
      if (!item.requiredAuth) return true;
      return userStore.hasProjectResourceActions({
        projectID,
        resource: Resources.ServiceResources,
        actions: ['GET']
      });
    });
  };
  const getServiceItemInfo = async () => {
    if (!route.query.id) return;
    try {
      serviceStore.deleteService(route.query.id);
      const params = {
        id: route.query.id,
        environmentID: route.params.environmentId,
        projectID: route.params.projectId
      };
      const { data } = await queryItemApplicationService(params);
      currentInfo.value = data;
      serviceStore.setServiceInfo(route.query.id, data);
    } catch (error) {
      serviceStore.deleteService(route.query.id);
      console.log(error);
    } finally {
      // template confg info
      serviceInfoRef.value?.initData();
    }
  };
  const handleTabChange = (val) => {
    activeKey.value = val;
  };
  const updateServiceState = (data) => {
    const ids = data.ids || [];
    // delete: if current service is deleted, jump to the next service
    if (
      data.type === websocketEventType.DELETE &&
      _.includes(ids, _.get(currentInfo.value, 'id'))
    ) {
      const list = _.filter(
        props.serviceList,
        (item) => _.get(item, 'id') !== _.get(currentInfo.value, 'id')
      );
      const nextServiceId = _.get(list, '0.id');
      if (!nextServiceId) {
        router.back();
        return;
      }
      router.replace({
        params: {
          ...route.params
        },
        query: {
          ...route.query,
          id: nextServiceId
        }
      });
    }
    // update: if current service is updated, update the current service info
    const updateData = _.find(
      data.collection || [],
      (sItem) => _.get(sItem, 'id') === _.get(currentInfo.value, 'id')
    );
    if (updateData) {
      currentInfo.value = _.cloneDeep({
        ...updateData,
        project: _.get(currentInfo.value, 'project')
      });
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
          projectID: route.params.projectId,
          environmentID: route.params.environmentId
        },
        handler: updateHandler,
        beforeReconnect: getServiceItemInfo
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleOk = () => {
    router.back();
  };
  const handleCancel = () => {
    router.back();
  };

  onMounted(() => {
    console.log('service page mounted');
    setInstanceTabList();
    setActionMap();

    // chunk request
    createServiceChunkRequest();
    createResourceChunkConnection();
  });
  onBeforeUnmount(() => {
    serviceStore.deleteService(serviceID);
  });
  const init = () => {
    getServiceItemInfo();
    fetchData();
  };
  init();
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

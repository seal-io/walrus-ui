<template>
  <div id="service-page" class="service-page">
    <ComCard padding="0">
      <HeaderInfo v-if="pageAction === PageAction.VIEW" :info="currentInfo">
        <template #icon>
          <i class="iconfont icon-apps-fill"></i>
        </template>
        <template #title>
          <div class="title">
            <span class="m-r-30"> {{ currentInfo.name }}</span>
            <StatusLabel
              :status="{
                inactive: _.includes(
                  StartableStatus,
                  _.get(currentInfo, 'status.summaryStatus')
                ),
                status: _.get(currentInfo, 'status.summaryStatus') || '',
                text: _.get(currentInfo, 'status.summaryStatus'),
                message:
                  _.get(currentInfo, 'status.summaryStatusMessage') || '',
                transitioning: _.get(currentInfo, 'status.transitioning'),
                error: _.get(currentInfo, 'status.error')
              }"
            ></StatusLabel>
          </div>
          <div v-if="actionList.length" class="dropdown">
            <DropButtonGroup
              size="medium"
              :actions="actionList"
              :layout="actionList.length === 1 ? 'horizontal' : 'vertical'"
              @select="handleSelect"
            ></DropButtonGroup>
          </div>
        </template>
        <!-- <template #description v-if="pageAction === PageAction.VIEW">
          <BasicInfo
            :data-info="basicDataList"
            style="max-width: 800px"
          ></BasicInfo>
        </template> -->
      </HeaderInfo>
      <!-- <slTransition>
        <div v-if="pageAction === PageAction.EDIT">
          <serviceEdit
            pg-type="com"
            @save="handleEditSucceed"
            @cancel="handleEditCancel"
          ></serviceEdit>
        </div>
      </slTransition> -->
      <div v-if="pageAction === PageAction.VIEW">
        <!-- <ComCard>
          <ModuleCard
            :title="$t('common.title.basicInfo')"
            icon="icon-jibenxinxi"
            :title-style="{ 'margin-bottom': '10px', 'margin-top': 0 }"
          >
            <BasicInfo
              :data-info="basicDataList"
              style="max-width: 800px"
            ></BasicInfo>
          </ModuleCard>
        </ComCard> -->
        <ComCard padding="0 var(--card-content-padding) 20px">
          <a-tabs
            v-model:active-key="activeTab"
            lazy-load
            class="page-line-tabs"
            :default-active-key="activeTab"
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
            <a-tab-pane
              key="accessUrl"
              :title="$t('applications.applications.instance.accessUrl')"
            >
              <tabEndpoint ref="tabEndpointCom"></tabEndpoint>
            </a-tab-pane>
            <a-tab-pane
              key="revisions"
              :title="$t('applications.applications.instance.history')"
            >
              <serviceRevisions></serviceRevisions>
            </a-tab-pane>
            <a-tab-pane key="config" :title="$t('common.button.settings')">
              <serviceEdit
                v-if="
                  userStore.hasProjectResourceActions({
                    resource: Resources.Resources,
                    environmentID: _.get(currentInfo, 'environment.id'),
                    projectID: _.get(currentInfo, 'project.id'),
                    actions: [Actions.PUT]
                  })
                "
                pg-type="com"
                @save="handleEditSucceed"
                @cancel="handleEditCancel"
              ></serviceEdit>
              <serviceInfo
                v-else
                ref="serviceInfoRef"
                :is-collapsed="isCollapsed"
              >
              </serviceInfo>
            </a-tab-pane>
          </a-tabs>
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
  import { Resources, Actions } from '@/permissions/config';
  import { useUserStore, useServiceStore } from '@/store';
  import _ from 'lodash';
  import { PageAction, websocketEventType } from '@/views/config';
  import { execSucceed, deleteModal } from '@/utils/monitor';
  import {
    markRaw,
    ref,
    PropType,
    onMounted,
    computed,
    nextTick,
    provide,
    onBeforeUnmount
  } from 'vue';
  import ModuleCard from '@/components/page-wrap/module-card.vue';
  import DropButtonGroup from '@/components/drop-button-group/index.vue';
  import slTransition from '@/components/sl-transition/index.vue';
  import { useSetChunkRequest } from '@/api/axios-chunk-request';
  import HeaderInfo from '@/components/header-info/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import useBasicInfoData from '@/views/application-management/projects/hooks/use-basicInfo-data';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import moduleWrapper from '@/components/module-wrapper/index.vue';
  import tabOutput from './tab-output.vue';
  import tabEndpoint from './tab-endpoint.vue';
  import tabResource from './tab-resource.vue';
  import serviceRevisions from './service-revisions.vue';
  import BasicInfo from '../basic-info.vue';
  import deleteServiceModal from '../delete-service-modal.vue';
  import {
    instanceTabs,
    serviceBasicInfo,
    serviceActions,
    serviceActionMap,
    ServiceDataType,
    StartableStatus,
    ProvideServiceInfoKey
  } from '../../config';
  import { ServiceRowData } from '../../config/interface';
  import useFetchResource from '../hooks/use-fetch-chunk-data';
  import {
    queryItemService,
    deleteServiceItem,
    SERVICE_API,
    SERVICE_API_PREFIX,
    stopApplicationInstance,
    startApplicationInstance
  } from '../../api';
  import serviceInfo from '../service-info.vue';
  import serviceEdit from '../../pages/edit.vue';

  const props = defineProps({
    serviceList: {
      type: Array as PropType<ServiceRowData[]>,
      default() {
        return [];
      }
    }
  });
  // 1: create 2: update 3: delete
  const actionMap = new Map();
  const showDeleteModal = ref(false);
  const pageAction = ref(PageAction.VIEW);
  const { setChunkRequest } = useSetChunkRequest();
  const userStore = useUserStore();
  const serviceStore = useServiceStore();
  const { router, route, t } = useCallCommon();
  const { loading, fetchData, createResourceChunkRequest, dataList } =
    useFetchResource();
  const projectID = route.params.projectId || '';
  const serviceID = route.query.id || '';
  const activeKey = ref('resource');
  const isCollapsed = ref(false);
  const currentInfo = ref<ServiceRowData>({} as ServiceRowData);
  const serviceInfoRef = ref();
  const activeTab = ref('resource');
  const instanceTabMap = {
    tabResource: markRaw(tabResource),
    tabOutput: markRaw(tabOutput)
  };
  const instanceTabList = ref<any[]>([]);
  const basicDataList = useBasicInfoData(serviceBasicInfo, currentInfo);

  provide(ProvideServiceInfoKey, currentInfo);
  const actionList = computed(() => {
    const list = _.filter(serviceActions, (item) => {
      if (
        [
          serviceActionMap.rollback,
          serviceActionMap.logs,
          serviceActionMap.upgrade
        ].includes(item.value)
      ) {
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

  const handleDeleteConfirm = async (withoutCleanup) => {
    try {
      await deleteServiceItem({ id: route.query.id, withoutCleanup });
      router.back();
    } catch (error) {
      //
    }
  };

  const handleBasicCollapse = async (val) => {
    isCollapsed.value = val;
  };

  const handleStopResource = async () => {
    try {
      await stopApplicationInstance({ id: route.query.id });
      execSucceed();
    } catch (error) {
      // ignore
    }
  };
  const handleStartResource = async () => {
    try {
      await startApplicationInstance({ id: route.query.id });
      execSucceed();
    } catch (error) {
      // ignore
    }
  };
  const handleStopModal = async (row) => {
    deleteModal({
      content: 'applications.service.stop.confirm',
      title: t('applications.service.stop.tips', {
        type: t('applications.applications.resource.title')
      }),
      okText: 'common.button.stop',
      onOk: () => handleStopResource()
    });
  };
  const handleDelete = () => {
    showDeleteModal.value = true;
  };
  const handleSelect = (value) => {
    actionMap.get(value)?.();
  };

  const setActionMap = () => {
    actionMap.set(serviceActionMap.delete, handleDelete);
    actionMap.set(serviceActionMap.start, handleStartResource);
    actionMap.set(serviceActionMap.stop, handleStopModal);
    actionMap.set(serviceActionMap.upgrade, handleUpgrade);
  };

  const setInstanceTabList = () => {
    instanceTabList.value = _.filter(instanceTabs, (item) => {
      if (!item.requiredAuth) return true;
      return userStore.hasProjectResourceActions({
        projectID,
        resource: Resources.ResourceComponents,
        actions: ['GET']
      });
    });
  };
  const getServiceItemInfo = async () => {
    if (!route.query.id) return;
    try {
      serviceStore.deleteService(route.query.id);
      const params = {
        id: route.query.id
      };
      const { data } = await queryItemService(params);
      currentInfo.value = data;
      serviceStore.setServiceInfo(route.query.id, data);
      console.log('currentInfo========', currentInfo.value);
    } catch (error) {
      serviceStore.deleteService(route.query.id);
      console.log('error===========', error);
    }
  };

  const handleEditCancel = () => {
    // pageAction.value = PageAction.VIEW;
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
      getServiceItemInfo();
    }, 100);
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
        ...currentInfo.value,
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
        url: `${SERVICE_API_PREFIX()}${SERVICE_API}`,
        params: {
          extract: ['-attributes', '-description']
        },
        handler: updateHandler,
        beforeReconnect: getServiceItemInfo
      });
    } catch (error) {
      console.log('error===========', error);
    }
  };

  const handleOk = () => {
    router.back();
  };

  onMounted(() => {
    setInstanceTabList();
    setActionMap();

    // chunk request
    nextTick(() => {
      createServiceChunkRequest();
      createResourceChunkRequest();
    });
  });
  onBeforeUnmount(() => {
    serviceStore.deleteService(serviceID);
  });
  const init = () => {
    getServiceItemInfo();
    fetchData();
    console.log('dataList=======', dataList.value);
  };
  onMounted(() => {
    init();
  });
</script>

<style lang="less" scoped>
  .service-page {
    .dropdown {
      position: absolute;
      top: 16px;
      right: var(--card-content-padding);
    }
  }

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

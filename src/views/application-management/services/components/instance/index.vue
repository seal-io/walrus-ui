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
              :status="_.get(currentInfo, 'status', {})"
            ></StatusLabel>
          </div>
          <div v-if="actionList.length" class="dropdown">
            <DropButtonGroup
              size="small"
              :actions="actionList"
              :layout="actionList.length === 1 ? 'horizontal' : 'vertical'"
              @select="handleSelect"
            ></DropButtonGroup>
          </div>
        </template>
      </HeaderInfo>
      <div v-if="pageAction === PageAction.VIEW">
        <ComCard padding="0 var(--card-content-padding) 20px">
          <a-tabs
            v-model:active-key="activeKey"
            lazy-load
            class="page-line-tabs"
            :default-active-key="activeKey"
            @change="setPageTabActive"
          >
            <a-tab-pane
              :key="ResourceDetailTabs.OVERVIEW"
              :title="$t('applications.applications.table.overview')"
            >
              <a-grid :cols="24" :col-gap="20" :row-gap="20">
                <a-grid-item
                  :span="{ xxl: 16, xl: 16, lg: 24, md: 24, sm: 24, xs: 24 }"
                >
                  <LatestRun
                    ref="latestRunRef"
                    :key="latestKey"
                    :service-info="currentInfo"
                  ></LatestRun>
                </a-grid-item>

                <a-grid-item
                  :span="{ xxl: 8, xl: 8, lg: 24, md: 24, sm: 24, xs: 24 }"
                >
                  <ComCard
                    :title="$t('applications.applications.instance.accessUrl')"
                    padding="0 20px 20px"
                    :header-style="{ padding: '20px', height: 'auto' }"
                    bordered
                    style="height: 100%; border-radius: 16px"
                  >
                    <tabEndpoint ref="tabEndpointCom"></tabEndpoint>
                  </ComCard>
                </a-grid-item>
                <a-grid-item
                  :span="{ xxl: 16, xl: 16, lg: 24, md: 24, sm: 24, xs: 24 }"
                >
                  <ComCard
                    :title="$t('applications.instance.tab.resource')"
                    padding="0 20px 20px"
                    :header-style="{ padding: '20px', height: 'auto' }"
                    bordered
                    style="height: 100%; border-radius: 16px"
                  >
                    <tabResource :resource-list="dataList"></tabResource>
                  </ComCard>
                </a-grid-item>
                <a-grid-item
                  :span="{ xxl: 8, xl: 8, lg: 24, md: 24, sm: 24, xs: 24 }"
                >
                  <ComCard
                    :title="$t('applications.instance.tab.output')"
                    padding="0 20px 20px"
                    :header-style="{ padding: '20px', height: 'auto' }"
                    bordered
                    style="height: 100%; border-radius: 16px"
                  >
                    <tabOutput></tabOutput>
                  </ComCard>
                </a-grid-item>
              </a-grid>
            </a-tab-pane>
            <a-tab-pane
              :key="ResourceDetailTabs.REVISIONS"
              :title="$t('applications.applications.instance.history')"
            >
              <serviceRevisions
                @rollback="handleRollbackSuccess"
              ></serviceRevisions>
            </a-tab-pane>
            <a-tab-pane
              :key="ResourceDetailTabs.SETTINGS"
              :title="$t('common.button.settings')"
            >
              <serviceEdit
                v-if="
                  userStore.hasProjectResourceActions({
                    resource: Resources.Resources,
                    environmentID: _.get(currentInfo, 'environment.id'),
                    projectID: _.get(currentInfo, 'project.id'),
                    actions: [Actions.PUT]
                  })
                "
                :key="settingKey"
                pg-type="com"
                @save="handleEditSucceed"
                @cancel="handleEditCancel"
              ></serviceEdit>
              <serviceInfo v-else :detail-info="currentInfo"> </serviceInfo>
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
    <CommentModal
      v-model:show="showCommentModal"
      :title="$t('applications.service.batchDeploy')"
      @confirm="handleComfirmComment"
    ></CommentModal>
  </div>
</template>

<script lang="ts" setup>
  import { Resources, Actions } from '@/permissions/config';
  import { PROJECT } from '@/router/config';
  import { useUserStore, useServiceStore } from '@/store';
  import _ from 'lodash';
  import {
    PageAction,
    websocketEventType,
    ResourceDetailTabs
  } from '@/views/config';
  import { execSucceed, deleteModal } from '@/utils/monitor';
  import CommentModal from '@/views/commons/components/comment-modal/index.vue';
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
  import useTabActive, { TabPage } from '@/hooks/use-tab-active';
  import DropButtonGroup from '@/components/drop-button-group/index.vue';
  import slTransition from '@/components/sl-transition/index.vue';
  import { useSetChunkRequest } from '@/api/axios-chunk-request';
  import HeaderInfo from '@/components/header-info/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import useBasicInfoData from '@/views/application-management/projects/hooks/use-basicInfo-data';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import { exportEnvironment } from '@/views/application-management/environments/api';
  import useDownload from '@/hooks/use-download';
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
    ServiceStatus,
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
    startApplicationInstance,
    deployItemService
  } from '../../api';
  import serviceInfo from '../service-info.vue';
  import serviceEdit from '../../pages/edit.vue';
  import LatestRun from './latest-run.vue';

  const props = defineProps({
    serviceList: {
      type: Array as PropType<ServiceRowData[]>,
      default() {
        return [];
      }
    }
  });
  // 1: create 2: update 3: delete
  const settingKey = ref(Date.now());
  const latestKey = ref(Date.now());
  const actionMap = new Map();
  const latestRunRef = ref();
  const showCommentModal = ref(false);
  const showDeleteModal = ref(false);
  const pageAction = ref(PageAction.VIEW);
  const { download } = useDownload();
  const { setChunkRequest } = useSetChunkRequest();
  const userStore = useUserStore();
  const serviceStore = useServiceStore();
  const { router, route, t } = useCallCommon();
  const { loading, fetchData, createResourceChunkRequest, dataList } =
    useFetchResource();
  const projectID = route.params.projectId as string;
  const serviceID = route.query.id || '';
  const isCollapsed = ref(false);
  const currentInfo = ref<ServiceRowData>({} as ServiceRowData);
  const instanceTabMap = {
    tabResource: markRaw(tabResource),
    tabOutput: markRaw(tabOutput)
  };
  const instanceTabList = ref<any[]>([]);
  const basicDataList = useBasicInfoData(serviceBasicInfo, currentInfo);

  const { activeKey, setPageTabActive } = useTabActive(
    TabPage.RESOURCEDETAILTAB,
    ResourceDetailTabs.OVERVIEW
  );

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
      if (item.value === serviceActionMap.viewRun) {
        return false;
      }
      return item.filterFun ? item.filterFun(currentInfo.value) : true;
    });
    const res = _.map(list, (o) => {
      const item = _.cloneDeep(o);
      item.disabled = _.isFunction(item.disabled)
        ? item.disabled?.(currentInfo.value)
        : item.disabled;
      return item;
    });
    console.log('res');
    return res;
  });

  const updateLatestRun = () => {
    latestKey.value = Date.now();
  };

  const handleComfirmComment = async (comment: string) => {
    try {
      const params = {
        items: [{ id: currentInfo.value.id }],
        serviceID: currentInfo.value.id,
        environmentID: route.params.environmentId as string,
        projectID,
        changeComment: comment,
        reuseAttributes: true
      };
      await deployItemService(params);
      execSucceed();
      updateLatestRun();
    } catch (error) {
      // ignore
    }
  };
  const handleUpgrade = () => {
    showCommentModal.value = true;
  };

  const handleDeleteConfirm = async (withoutCleanup) => {
    try {
      await deleteServiceItem({ id: route.query.id, withoutCleanup });
      router.back();
    } catch (error) {
      //
    }
  };

  const handleRollbackSuccess = () => {
    latestKey.value = Date.now();
    settingKey.value = Date.now();
  };

  const handleExportYaml = () => {
    try {
      const url = exportEnvironment({
        id: route.params.environmentId as string,
        data: {
          id: [currentInfo.value?.id]
        }
      });
      download(url);
      // execSucceed();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const handleStopResource = async () => {
    try {
      await stopApplicationInstance({ id: route.query.id });
      execSucceed();
      updateLatestRun();
    } catch (error) {
      // ignore
    }
  };
  const handleStartResource = async () => {
    try {
      await startApplicationInstance({ id: route.query.id });
      execSucceed();
      updateLatestRun();
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

  const handleCloneService = () => {
    router.push({
      name: PROJECT.ServiceClone,
      query: {
        resources: [currentInfo.value.id]
      }
    });
  };
  const handleDelete = () => {
    showDeleteModal.value = true;
  };
  const handleSelect = async (value) => {
    actionMap.get(value)?.();
  };

  const setActionMap = () => {
    actionMap.set(serviceActionMap.delete, handleDelete);
    actionMap.set(serviceActionMap.start, handleStartResource);
    actionMap.set(serviceActionMap.stop, handleStopModal);
    actionMap.set(serviceActionMap.deploy, handleUpgrade);
    actionMap.set(serviceActionMap.clone, handleCloneService);
    actionMap.set(serviceActionMap.export, handleExportYaml);
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
    } catch (error) {
      serviceStore.deleteService(route.query.id);
    }
  };

  const handleEditCancel = () => {
    // pageAction.value = PageAction.VIEW;
    setPageTabActive(ResourceDetailTabs.OVERVIEW);
  };
  const handleEditSucceed = async () => {
    router.replace({
      params: {
        ...route.params
      },
      query: {
        ...route.query
      }
    });
    pageAction.value = PageAction.VIEW;

    await getServiceItemInfo();
    settingKey.value = Date.now();
    latestKey.value = Date.now();
    setPageTabActive(ResourceDetailTabs.OVERVIEW);
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
      currentInfo.value = {} as ServiceRowData;
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
      // console.log('error===========', error);
    }
  };

  const handleOk = () => {
    router.back();
  };

  onMounted(() => {
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

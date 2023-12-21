<template>
  <div id="service-page" class="service-page">
    <ComCard padding="0">
      <HeaderInfo :info="currentInfo">
        <template #icon>
          <i class="iconfont icon-apps-fill"></i>
        </template>
        <template #title>
          <div class="title">
            <span> {{ currentInfo.name }}</span>
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
          <div class="dropdown">
            <DropButtonGroup
              v-if="actionList.length"
              :actions="actionList"
              :layout="actionList.length === 1 ? 'horizontal' : 'vertical'"
              @select="handleSelect"
            ></DropButtonGroup>
          </div>
        </template>
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
            :title="$t('common.title.basicInfo')"
            icon="icon-jibenxinxi"
            :title-style="{ 'margin-bottom': '10px', 'margin-top': 0 }"
          >
            <BasicInfo
              :data-info="basicDataList"
              style="max-width: 800px"
            ></BasicInfo>
          </ModuleCard>
        </ComCard>
        <ComCard>
          <ModuleCard
            icon="icon-kaifazujian"
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
          <ModuleCard
            icon="icon-URLguanli"
            :title="$t('applications.applications.instance.accessUrl')"
          >
            <tabEndpoint ref="tabEndpointCom"></tabEndpoint>
          </ModuleCard>
          <ModuleCard
            :title="$t('common.title.config')"
            icon="icon-peizhixinxi"
            :title-style="{ 'margin-bottom': '10px', 'margin-top': 0 }"
          >
            <moduleWrapper
              :show-delete="false"
              inner-wrap
              title="template"
              @collapse="handleBasicCollapse"
            >
              <template #title>
                <div
                  v-if="dataType === ServiceDataType.service"
                  class="bold-400"
                >
                  <span class="m-r-20"
                    >{{ $t('applications.applications.table.module') }}:
                    <span class="mleft-5">{{
                      currentInfo.template?.name
                    }}</span>
                  </span>
                  <span
                    >{{ $t('applications.applications.history.version') }}:
                    <span class="mleft-5">{{
                      currentInfo.template?.version
                    }}</span>
                  </span>
                </div>
                <div
                  v-if="dataType === ServiceDataType.resource"
                  class="bold-400"
                >
                  <span class="m-r-20"
                    >{{ $t('applications.applications.table.resourceType') }}:
                    <span class="mleft-5">{{ currentInfo.type }}</span>
                  </span>
                </div>
              </template>
              <serviceInfo ref="serviceInfoRef" :is-collapsed="isCollapsed">
              </serviceInfo>
            </moduleWrapper>
          </ModuleCard>
        </ComCard>
        <ComCard>
          <ModuleCard
            :title="$t('applications.applications.instance.history')"
            icon="icon-lishibanben"
            :title-style="{ 'margin-top': 0 }"
          >
            <serviceRevisions></serviceRevisions>
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
  const dataType = route.params.dataType || '';
  const activeKey = ref('resource');
  const isCollapsed = ref(false);
  const currentInfo = ref<ServiceRowData>({} as ServiceRowData);
  const serviceInfoRef = ref();
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
        [serviceActionMap.rollback, serviceActionMap.logs].includes(item.value)
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
        type:
          dataType === ServiceDataType.service
            ? t('applications.applications.service.title')
            : t('applications.applications.resource.title')
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
  const handleEditCancel = () => {
    pageAction.value = PageAction.VIEW;
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
      right: 16px;
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

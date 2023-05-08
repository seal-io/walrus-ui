<template>
  <ComCard top-gap class="application-detail-wrap">
    <GroupTitle
      show-back
      :title="title"
      :show-edit="pageAction === 'view' && activeInstanceTab === 'app'"
      @edit="handleEdit"
    >
    </GroupTitle>
    <div class="instance-box">
      <div
        v-if="pageAction === 'view'"
        class="app"
        :class="{ active: activeInstanceTab === 'app' }"
        @click="handleClickApp"
      >
        <span>{{ $t('applications.applications.detail.info') }}</span>
        <icon-right />
      </div>
      <div v-if="pageAction === 'view'" class="instance">
        <div class="content">
          <instanceThumb
            v-for="item in instanseList"
            :key="item.id"
            :size="[160, 100]"
            :active="item.id === activeInstanceTab"
            :data-info="item"
            :actions="instanceActions"
            :action-loading="
              includes(
                [AppInstanceStatus.Deleting, AppInstanceStatus.Deploying],
                item.status
              )
            "
            @clone="handleCloneInstance(item)"
            @upgrade="handleUpgradeInstance(item)"
            @delete="handleDeleteInstance(item)"
            @click="handleClickInstance(item)"
          >
            <template #description>
              <span>{{ get(item, 'environment.name') }}</span>
            </template>
            <template #default>
              <span style="font-weight: 700">{{ get(item, 'name') }}</span>
            </template>
            <template #status>
              <StatusLabel
                :size="16"
                :status="{
                  status: get(item, 'status.summaryStatus'),
                  message: '',
                  transitioning: get(item, 'status.transitioning'),
                  error: get(item, 'status.error')
                }"
              ></StatusLabel>
            </template>
          </instanceThumb>
          <a-tooltip :content="$t('applications.applications.instance.add')">
            <thumbButton :size="60" @click="handleAddInstance"></thumbButton>
          </a-tooltip>
        </div>
      </div>
    </div>
    <div>
      <component
        :is="pageComMap[pgCom]"
        :instance-id="currentInstance"
        @save="handleSaveApp"
        @cancelEdit="handleCancelEdit"
      ></component>
    </div>
    <createInstance
      v-model:show="showInstanceModal"
      v-model:status="status"
      v-model:active-instance-info="activeInstanceInfo"
      :variables="appInfoVariables"
      :environment-list="environmentList"
      :title="
        status === 'create'
          ? $t('applications.applications.instance.add')
          : $t('applications.applications.instance.upgrade')
      "
      @save="handleSaveInstanceInfo"
      @upgrade="handleInstanceUpgradeSucceed"
    ></createInstance>
    <deleteInstanceModal
      v-model:show="showDeleteModal"
      :callback="handleDeleteConfirm"
      :title="$t('common.delete.tips')"
    >
    </deleteInstanceModal>
    <cloneInstanceModal
      v-model:show="showCloneModal"
      :title="
        $t('applications.applications.instance.clonetitle', {
          from: get(cloneInstance, 'name')
        })
      "
      @save="cloneHandler"
    ></cloneInstanceModal>
  </ComCard>
</template>

<script lang="ts" setup>
  import {
    reactive,
    ref,
    markRaw,
    provide,
    computed,
    inject,
    onMounted,
    nextTick,
    onBeforeUnmount
  } from 'vue';
  import _, {
    keys,
    get,
    map,
    assignIn,
    cloneDeep,
    find,
    each,
    findIndex,
    remove,
    includes
  } from 'lodash';
  import { useSetChunkRequest } from '@/api/axios-chunk-request';
  import { execSucceed } from '@/utils/monitor';
  import useCallCommon from '@/hooks/use-call-common';
  import GroupTitle from '@/components/group-title/index.vue';
  import thumbButton from '@/components/buttons/thumb-button.vue';
  import { queryEnvironments } from '@/views/operation-hub/environments/api';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import { createWebsocketInstance } from '@/hooks/use-websocket';
  import instanceThumb from '../components/instance-thumb.vue';
  import { InstanceData, AppFormData } from '../config/interface';
  import {
    instanceActions,
    instanceStatus,
    AppInstanceStatus,
    websocketEventType
  } from '../config/index';
  import AppDetail from '../components/app-info/index.vue';
  import InstanceDetail from '../components/instance/index.vue';
  import createInstance from '../components/create-instance.vue';
  import deleteInstanceModal from '../components/delete-instance-modal.vue';
  import cloneInstanceModal from '../components/clone-instance-modal.vue';
  import {
    queryApplicationInstances,
    deleteApplicationInstance,
    queryItemApplication,
    cloneApplicationInstance
  } from '../api';
  import {
    listenerUpdateAppAction,
    removeUpdateAppActionListener
  } from '../hooks/update-application-listener';

  const { setChunkRequest } = useSetChunkRequest();
  const { router, route, t } = useCallCommon();
  const id = route.query.id as string;
  const pageAction = ref(route.params.action || 'edit');
  const pageEditable = ref(false);
  const cloneId = route.query.cloneId as string;
  const activeInstanceTab = ref('app'); //
  const currentInstance = ref('');
  const showDeleteModal = ref(false);
  const showCloneModal = ref(false);
  const environmentList = ref<{ label: string; value: string }[]>([]);
  const pgCom = ref('appDetail'); // instanceDetail、appDetail
  const showInstanceModal = ref(false);
  const instanceInfo = ref({});
  const cloneInstance = ref({});
  const activeInstanceInfo = ref({});
  const websocketInstanceList = ref<any>(null);
  const appInfo = reactive({
    name: '',
    description: '',
    labels: {},
    variables: [],
    project: {
      id: route.params.projectId
    },
    modules: []
  }) as AppFormData;
  const axiosInstance: any = null;
  const execReload = inject('execReload', () => {});
  provide('instanceId', currentInstance);
  provide('environmentList', environmentList);
  provide('appInfo', appInfo);
  provide('instanceInfo', instanceInfo);
  provide('pageAction', pageAction);
  const status = ref('create');
  const pageComMap = {
    appDetail: markRaw(AppDetail),
    instanceDetail: markRaw(InstanceDetail)
  };
  const instanseList = ref<InstanceData[]>([]);
  const instanceId = ref('');

  const title = computed(() => {
    if (cloneId) {
      return t('applications.applications.title.clone');
    }
    if (pageAction.value === 'view') {
      return t('applications.applications.title.view');
    }
    if (pageAction.value === 'edit' && id) {
      return t('applications.applications.title.edit');
    }
    return t('applications.applications.create');
  });
  const appInfoVariables = computed(() => {
    return cloneDeep(get(appInfo, 'variables') || []);
  });
  const handleAddInstance = () => {
    showInstanceModal.value = true;
    status.value = 'create';
  };

  const handleUpgradeInstance = (item) => {
    status.value = 'edit';
    activeInstanceInfo.value = item;
    setTimeout(() => {
      showInstanceModal.value = true;
    }, 100);
  };
  const cloneHandler = async (name) => {
    try {
      const { data } = await cloneApplicationInstance({
        id: get(cloneInstance.value, 'id'),
        name
      });
      // TODO
      instanseList.value.push(data);
      instanseList.value = _.uniqBy(instanseList.value, 'id');
      execSucceed();
    } catch (error) {
      console.log(error);
    }
  };
  const handleCloneInstance = async (item) => {
    cloneInstance.value = item;
    setTimeout(() => {
      showCloneModal.value = true;
    }, 100);
  };

  const handleClickApp = () => {
    activeInstanceTab.value = 'app';
    pgCom.value = 'appDetail';
  };

  const handleClickInstance = (item) => {
    activeInstanceTab.value = item.id;
    currentInstance.value = item.id;
    instanceInfo.value = item;
    pgCom.value = 'instanceDetail';
  };

  const getApplicationInstances = async () => {
    if (!id) return;
    try {
      const params = {
        page: -1,
        applicationID: route.query.id
      };
      const { data } = await queryApplicationInstances(params);
      instanseList.value = data?.items || [];
    } catch (error) {
      instanseList.value = [];
      console.log(error);
    }
  };
  const handleSaveInstanceInfo = (data, action) => {
    console.log('data===', data);
    if (action === 'create') {
      const newInstance = cloneDeep(data);
      // TODO
      instanseList.value.push(newInstance);
      setTimeout(() => {
        instanseList.value = _.uniqBy(instanseList.value, 'id');
        handleClickInstance(newInstance);
      });
    }
  };
  const handleInstanceUpgradeSucceed = (deleteId) => {
    const data = find(instanseList.value, (item) => item.id === deleteId) || {};
    _.set(data, 'status', {
      summaryStatus: AppInstanceStatus.Deploying,
      summaryStatusMessage: 'Upgrading',
      transitioning: true
    });
  };
  const getEnvironmentList = async () => {
    try {
      const params = {
        page: -1
      };
      const { data } = await queryEnvironments(params);
      const list = data?.items || [];
      environmentList.value = map(list, (item) => {
        return {
          label: item.name,
          value: item.id,
          disabled: !item?.connectors?.length
        };
      });
    } catch (error) {
      environmentList.value = [];
      console.log(error);
    }
  };
  const getApplicationDetail = async () => {
    if (!id) return;
    const queryId = id;
    try {
      const params = {
        id: queryId
      };
      const { data } = await queryItemApplication(params);
      assignIn(appInfo, data);
      appInfo.labels = data.labels || {};
      appInfo.modules = data.modules || [];
      appInfo.variables = data.variables || [];
      console.log('appInfo===', appInfo);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteConfirm = async (force) => {
    try {
      await deleteApplicationInstance({ id: instanceId.value, force });
      const data =
        find(instanseList.value, (item) => item.id === instanceId.value) || {};
      _.set(data, 'status', {
        summaryStatus: AppInstanceStatus.Deleting,
        transitioning: true
      });
      // await getApplicationInstances();
      // if (instanseList.value.length) {
      //   handleClickInstance(get(instanseList.value, '0'));
      // } else {
      //   handleClickApp();
      // }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteInstance = async (item) => {
    instanceId.value = item.id;
    setTimeout(() => {
      showDeleteModal.value = true;
    }, 100);
  };
  const handleOk = () => {
    router.back();
  };
  const handleEdit = () => {
    pageAction.value = 'edit';
  };
  const handleCancelEdit = () => {
    pageAction.value = 'view';
  };
  const handleSaveApp = async (resId, action) => {
    if (!id) {
      router.replace({
        name: 'ApplicationsDetail',
        params: {
          projectId: route.params.projectId,
          action: 'view'
        },
        query: {
          id: resId || id
        }
      });
    } else {
      getApplicationDetail();
      pageAction.value = 'view';
    }
  };

  const handleActiveInstance = () => {
    const instance_id = route.query.instanceId || '';
    if (instance_id) {
      const data = find(instanseList.value, (item) => item.id === instance_id);
      handleClickInstance(data);
    }
  };
  // update instance data from websocket
  const updateInstanceList = (data) => {
    const collections = data?.collection || [];
    // 1: create, 2: update, 3: delete
    if (data?.type === websocketEventType.create) {
      instanseList.value = _.concat(collections, instanseList.value);
      instanseList.value = _.uniqBy(instanseList.value, 'id');
      return;
    }

    // delete
    if (data?.type === websocketEventType.delete) {
      const ids = data?.ids || [];
      remove(instanseList.value, (item) => includes(ids, item.id));
      if (!instanseList.value.length) {
        handleClickApp();
        return;
      }
      // active instance deleted
      if (includes(ids, activeInstanceTab.value)) {
        handleClickInstance(get(instanseList.value, '0'));
      }
      return;
    }

    each(collections, (item) => {
      const updateIndex = findIndex(
        instanseList.value,
        (sItem) => sItem.id === item.id
      );

      if (updateIndex > -1) {
        const updateItem = cloneDeep(item);
        instanseList.value[updateIndex] = updateItem;
        if (currentInstance.value === updateItem.id) {
          instanceInfo.value = updateItem;
        }
      }
    });
    console.log('message:', data);
  };
  const updateHandler = (list) => {
    _.each(list, (data) => {
      updateInstanceList(data);
    });
  };
  // create websocket  connecting
  const createInstanceListChunkConnection = () => {
    try {
      const appId = route.query.id || '';
      if (!id) return;
      // websocketInstanceList.value?.close?.();
      axiosInstance?.cancel?.();
      setChunkRequest({
        url: `/application-instances`,
        params: {
          applicationID: appId
        },
        handler: updateHandler
      });
    } catch (error) {
      console.log(error);
    }
  };

  const init = async () => {
    await getApplicationInstances();
    getEnvironmentList();
    // provide app info to instances
    getApplicationDetail();
    handleActiveInstance();
  };
  onMounted(() => {
    nextTick(() => {
      createInstanceListChunkConnection();
    });
    // update application listener
    listenerUpdateAppAction(getApplicationDetail);
  });
  onBeforeUnmount(() => {
    // websocketInstanceList.value?.close?.();
    axiosInstance?.cancel?.();
    // remove application listener
    removeUpdateAppActionListener();
  });
  init();
</script>

<style lang="less" scoped>
  .application-detail-wrap {
    .instance-box {
      display: flex;
      // border: 1px solid var(--color-border-2);
      // border-radius: var(--border-radius-small);
      .app {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100px;
        height: 100px;
        margin-right: 40px;
        color: var(--sealblue-6);
        text-align: center;
        background-color: rgba(var(--arcoblue-1), 0.3);
        cursor: pointer;
        .thumbCard();

        &:hover {
          .thumbCardHover();
        }

        &.active {
          .thumbCardHover();
        }

        .arco-icon-right {
          position: absolute;
          top: 40px;
          right: -30px;
          font-size: 24px;
        }
      }

      .instance {
        flex: 1;
        max-height: 260px;
        padding: 2px;
        overflow: auto;

        .content {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          min-height: 100px;

          .thumb-item {
            margin-right: 12px;
            margin-bottom: 12px;
          }
        }
      }
    }

    .content {
      display: flex;
      flex-wrap: wrap;
      align-items: center;

      .tips-box {
        width: 200px;
        height: 80px;
        line-height: 80px;
        text-align: center;
        border: 1px solid var(--color-border-2);
        border-radius: var(--border-radius-small);
      }

      .thumb-item {
        margin-right: 12px;
        margin-bottom: 12px;
      }
    }

    .instance-info {
      margin-top: 10px;

      .server .url {
        display: flex;
        justify-content: space-between;
      }
    }
  }
</style>

<template>
  <ComCard top-gap class="application-detail-wrap">
    <GroupTitle show-back :title="title"></GroupTitle>
    <div v-if="id" class="instance-box">
      <div
        class="app"
        :class="{ active: activeInstance === 'app' }"
        @click="handleClickApp"
      >
        <span>应用配置</span>
        <icon-right />
      </div>
      <div class="instance">
        <div class="content">
          <instanceThumb
            v-for="item in instanseList"
            :key="item.id"
            :size="[160, 100]"
            :active="item.id === activeInstance"
            :data-info="item"
            :actions="instanceActions"
            @upgrade="handleInstanceUpgrade(item)"
            @delete="handleDeleteInstance(item)"
            @click="handleClickInstance(item)"
          >
            <template #description>
              <span style="font-weight: 700">{{
                get(item, 'environment.name')
              }}</span>
            </template>
            <template #status>
              <StatusLabel
                :zoom="0.9"
                :status="{
                  status: get(item, 'status'),
                  message: '',
                  transitioning: get(item, 'status') === 'Deploying',
                  error: get(item, 'status') === 'DeployFailed'
                }"
              ></StatusLabel>
            </template>
          </instanceThumb>
          <a-tooltip content="添加应用实例">
            <thumbButton :size="60" @click="handleAddInstance"></thumbButton>
          </a-tooltip>
          <!-- <div v-if="!instanseList.length" class="tips-box"
            ><a-button
              type="text"
              size="small"
              style="font-weight: 500; font-size: 18px"
              @click="handleAddInstance"
              >添加应用实例</a-button
            ></div
          > -->
        </div>
      </div>
    </div>
    <div>
      <component
        :is="pageComMap[pgCom]"
        :instance-id="currentInstance"
        @save="handleSaveApp"
        @deploy="handleDeployDone"
      ></component>
    </div>
    <createInstance
      v-model:show="showInstanceModal"
      v-model:status="status"
      v-model:active-instance-id="activeInstanceId"
      v-model:active-instance-info="activeInstanceInfo"
      :variables="appInfoVariables"
      :environment-list="environmentList"
      :title="status === 'create' ? '创建实例' : '升级实例'"
      @save="handleSaveInstanceInfo"
    ></createInstance>
  </ComCard>
</template>

<script lang="ts" setup>
  import { reactive, ref, markRaw, provide, computed, inject } from 'vue';
  import { keys, get, map, assignIn, cloneDeep } from 'lodash';
  import { deleteModal, execSucceed } from '@/utils/monitor';
  import useCallCommon from '@/hooks/use-call-common';
  import GroupTitle from '@/components/group-title/index.vue';
  import thumbButton from '@/components/buttons/thumb-button.vue';
  import { queryEnvironments } from '@/views/operation-hub/environments/api';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import instanceThumb from '../components/instance-thumb.vue';
  import { InstanceData, AppFormData } from '../config/interface';
  import { instanceActions } from '../config/index';

  import AppDetail from '../components/app-info/index.vue';
  import InstanceDetail from '../components/instance/index.vue';
  import createInstance from '../components/create-instance.vue';

  import {
    queryApplicationInstances,
    deleteApplicationInstance,
    queryItemApplication
  } from '../api';

  const { router, route, t } = useCallCommon();
  const id = route.query.id as string;
  const cloneId = route.query.cloneId as string;
  const activeInstance = ref('app'); //
  const currentInstance = ref('');
  const environmentList = ref<{ label: string; value: string }[]>([]);
  const pgCom = ref('appDetail'); // instanceDetail、appDetail
  const showInstanceModal = ref(false);
  const projectBasicInfo = ref<any>({});
  const instanceInfo = ref({});
  const activeInstanceId = ref('');
  const activeInstanceInfo = ref({});
  const appInfo = reactive({
    name: '',
    description: '',
    labels: {},
    variables: [],
    project: {
      id: route.params.projectId
    },
    environment: {
      id: ''
    },
    modules: []
  }) as AppFormData;
  const execReload = inject('execReload', () => {});
  provide('instanceId', currentInstance);
  provide('environmentList', environmentList);
  provide('appInfo', appInfo);
  provide('instanceInfo', instanceInfo);
  const status = ref('create');
  const pageComMap = {
    appDetail: markRaw(AppDetail),
    instanceDetail: markRaw(InstanceDetail)
  };
  const instanseList = ref<InstanceData[]>([]);
  const labelList = ref<{ key: string; value: string }[]>([]);

  const title = computed(() => {
    if (cloneId) {
      return '克隆应用';
    }
    if (id) {
      return '编辑应用';
    }
    return '新建应用';
  });
  const appInfoVariables = computed(() => {
    return cloneDeep(get(appInfo, 'variables') || []);
  });
  const handleAddInstance = () => {
    showInstanceModal.value = true;
    status.value = 'create';
  };
  const handleInstanceUpgrade = (item) => {
    status.value = 'edit';
    activeInstanceId.value = item.id;
    activeInstanceInfo.value = item;
    setTimeout(() => {
      showInstanceModal.value = true;
    }, 100);
  };

  const transformlabels = () => {
    const labelKeys = keys(projectBasicInfo.value.labels);
    if (labelKeys.length) {
      labelList.value = labelKeys.map((k) => {
        return {
          key: k,
          value: get(projectBasicInfo.value, `labels.${k}`)
        };
      });
    } else {
      labelList.value = [];
    }
  };

  const handleClickApp = () => {
    activeInstance.value = 'app';
    pgCom.value = 'appDetail';
  };

  const handleClickInstance = (item) => {
    activeInstance.value = item.id;
    currentInstance.value = item.id;
    instanceInfo.value = item;
    pgCom.value = 'instanceDetail';
  };
  const getApplicationInstances = async () => {
    if (!id) return;
    try {
      const params = {
        page: 1,
        perPage: -1,
        applicationID: route.query.id
      };
      const { data } = await queryApplicationInstances(params);
      instanseList.value = data?.items || [];
    } catch (error) {
      instanseList.value = [];
      console.log(error);
    }
  };
  const handleSaveInstanceInfo = () => {
    getApplicationInstances();
  };
  const getEnvironmentList = async () => {
    try {
      const params = {
        page: 1,
        perPage: -1
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
        id: queryId,
        extract: ['modules']
      };
      const { data } = await queryItemApplication(params);
      assignIn(appInfo, data);
      console.log('appInfo===', appInfo);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteConfirm = async (item) => {
    try {
      await deleteApplicationInstance([{ id: item.id }]);
      getApplicationInstances();
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteInstance = async (item) => {
    deleteModal({
      onOk() {
        handleDeleteConfirm(item);
      }
    });
  };
  const handleDeployDone = async () => {
    getApplicationInstances();
  };
  const handleOk = () => {
    router.back();
  };
  const handleSaveApp = async (resId) => {
    if (!id) {
      router.replace({
        name: 'applicationsDetail',
        params: {
          projectId: route.params.projectId
        },
        query: {
          id: resId
        }
      });
      setTimeout(() => {
        execReload?.();
      }, 100);
    }
    getApplicationDetail();
  };
  const init = async () => {
    getApplicationInstances();
    getEnvironmentList();
    // provide app info to instances
    getApplicationDetail();
  };
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
        flex-basis: 100px;
        height: 100px;
        margin-right: 40px;
        color: var(--sealblue-6);
        line-height: 100px;
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

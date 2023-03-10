<template>
  <ComCard top-gap class="application-detail-wrap">
    <GroupTitle show-back :title="id ? '编辑应用' : '新建应用'"></GroupTitle>
    <div v-if="id" class="instance-box">
      <div
        class="app"
        :class="{ active: activeInstance === 'app' }"
        @click="handleClickApp"
      >
        <span>应用信息</span>
        <icon-right />
      </div>
      <div class="instance">
        <div class="content">
          <instanceThumb
            v-for="item in instanseList"
            :key="item.id"
            :active="item.id === activeInstance"
            :data-info="item"
            :actions="instanceActions"
            @delete="handleDeleteInstance(item)"
            @click="handleClickInstance(item)"
          >
            <template #description>
              <span style="font-weight: 700">{{
                get(item, 'environment.name')
              }}</span>
            </template>
          </instanceThumb>
          <!-- <a-tooltip content="添加应用实例">
            <thumbButton :size="60" @click="handleAddInstance"></thumbButton>
          </a-tooltip> -->
          <!-- <div>应用实例</div> -->
        </div>
      </div>
    </div>
    <div>
      <component
        :is="pageComMap[pgCom]"
        :instance-id="currentInstance"
        @deploy="handleDeployDone"
      ></component>
    </div>
    <createInstance
      v-model:show="showInstanceModal"
      :variables="appInfoVariables"
      :environment-list="environmentList"
      title="创建实例"
      @save="handleSaveInstanceInfo"
    ></createInstance>
  </ComCard>
</template>

<script lang="ts" setup>
  import { reactive, ref, markRaw, provide, computed } from 'vue';
  import { keys, get, map, assignIn, cloneDeep } from 'lodash';
  import useCallCommon from '@/hooks/use-call-common';
  import GroupTitle from '@/components/group-title/index.vue';
  import thumbButton from '@/components/buttons/thumb-button.vue';
  import { queryEnvironments } from '@/views/operation-hub/environments/api';
  import { queryItemProject } from '@/views/application-management/projects/api';
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
  const activeInstance = ref('app'); //
  const currentInstance = ref('');
  const environmentList = ref<{ label: string; value: string }[]>([]);
  const pgCom = ref('appDetail'); // instanceDetail、appDetail
  const showInstanceModal = ref(false);
  const projectBasicInfo = ref<any>({});
  const instanceInfo = ref({});
  const appInfo = reactive({
    name: '',
    description: '',
    labels: {},
    variables: [],
    project: {
      id: route.params.projectId
    },
    environment: {
      id: 'test'
    },
    modules: []
  }) as AppFormData;
  provide('instanceId', currentInstance);
  provide('environmentList', environmentList);
  provide('appInfo', appInfo);
  provide('instanceInfo', instanceInfo);
  const pageComMap = {
    appDetail: markRaw(AppDetail),
    instanceDetail: markRaw(InstanceDetail)
  };
  const instanseList = ref<InstanceData[]>([]);
  const labelList = ref<{ key: string; value: string }[]>([]);

  const appInfoVariables = computed(() => {
    return cloneDeep(get(appInfo, 'variables') || []);
  });
  const handleAddInstance = () => {
    showInstanceModal.value = true;
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
          value: item.id
        };
      });
    } catch (error) {
      environmentList.value = [];
      console.log(error);
    }
  };
  const getApplicationDetail = async () => {
    if (!id) return;
    try {
      const params = {
        id,
        extract: ['modules']
      };
      const { data } = await queryItemApplication(params);
      assignIn(appInfo, data);
      console.log('appInfo===', appInfo);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteInstance = async (item) => {
    try {
      await deleteApplicationInstance({ id: item.id });
      getApplicationInstances();
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeployDone = async () => {
    getApplicationInstances();
  };
  const handleOk = () => {
    router.back();
  };
  const init = async () => {
    getApplicationInstances();
    getEnvironmentList();
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

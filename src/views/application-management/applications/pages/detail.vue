<template>
  <ComCard top-gap class="application-detail-wrap">
    <GroupTitle title="新建应用"></GroupTitle>
    <ModuleCard title="基本信息">
      <template #title>
        <span>项目信息</span>
        <!-- <a-link style="line-height: 1">
          <template #icon>
            <icon-edit
              style="margin-left: 4px; font-size: 16px"
              @click="handleEditApp"
            />
          </template>
        </a-link> -->
      </template>
      <a-form ref="formref" :model="formData" auto-label-width disabled>
        <a-form-item label="项目名称">
          <a-input v-model="formData.name"></a-input>
        </a-form-item>
        <a-form-item
          v-for="(item, index) in labelList"
          :key="index"
          :label="`标签${index + 1}`"
        >
          <a-input-group style="width: 360px">
            <a-input></a-input><span style="padding: 0 4px">:</span
            ><a-input></a-input>
          </a-input-group>
        </a-form-item>
      </a-form>
    </ModuleCard>
    <ModuleCard :title="`应用实例(${instanseList.length})`">
      <div class="content">
        <instanceThumb
          v-for="item in instanseList"
          :key="item.id"
          :active="item.id === activeInstance"
          :data-info="item"
          @edit="handleEditApp('edit')"
          @click="handleClickInstance(item)"
        ></instanceThumb>
        <thumbButton :size="60" @click="handleEditApp('create')"></thumbButton>
      </div>
      <div class="instance-info">
        <div class="server">
          <div class="url">
            <a-button size="small" type="primary">部署</a-button>
            <a-link href="google.com">
              <icon-link class="size-16" />
              <span>
                Server URL:
                https://localhost:4000/#/app-management/applications/edit
              </span>
            </a-link>
          </div>
          <a-divider :margin="8"></a-divider>
        </div>
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
            :title="item.label"
          >
            <Component :is="instanceTabMap[item.com]"></Component>
          </a-tab-pane>
        </a-tabs>
      </div>
    </ModuleCard>
    <!-- <ModuleCard title="历史记录" style="margin-top: 30px">
      <applicationHistory></applicationHistory>
    </ModuleCard> -->
    <EditPageFooter>
      <template #save>
        <a-button
          type="primary"
          class="cap-title cancel-btn"
          @click="handleOk"
          >{{ $t('common.button.confirm') }}</a-button
        >
      </template>
    </EditPageFooter>
    <createApplication
      v-model:show="showAppModal"
      :title="appModalTitle"
      @save="handleSaveAppInfo"
    ></createApplication>
    <!-- <createInstance
      v-model:show="showInstanceModal"
      @save="handleSaveInstanceInfo"
    ></createInstance> -->
  </ComCard>
</template>

<script lang="ts" setup>
  import { reactive, ref, markRaw } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import GroupTitle from '@/components/group-title/index.vue';
  import thumbButton from '@/components/buttons/thumb-button.vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import instanceThumb from '../components/instance-thumb.vue';
  import { InstanceData } from '../config/interface';
  import { instanceTabs } from '../config/index';
  import tabConfiguration from '../components/tab-configuration.vue';
  import tabResource from '../components/tab-resource.vue';
  import tabLogs from '../components/tab-logs.vue';
  import tabOutput from '../components/tab-output.vue';
  import tabOptimization from '../components/tab-optimization.vue';
  import tabGraph from '../components/tab-graph.vue';
  import createApplication from '../components/create-application.vue';
  import createInstance from '../components/create-instance.vue';
  import applicationHistory from '../components/application-history.vue';

  const { router, t } = useCallCommon();
  const formref = ref();
  const activeInstance = ref('1');
  const appModalTitle = ref('');
  const showInstanceModal = ref(false);
  const showAppModal = ref(false);
  const activeKey = ref('configuration');
  const formData = reactive({
    name: ''
  });
  const instanceTabMap = {
    tabConfiguration: markRaw(tabConfiguration),
    tabResource: markRaw(tabResource),
    tabLogs: markRaw(tabLogs),
    tabOutput: markRaw(tabOutput),
    tabOptimization: markRaw(tabOptimization),
    tabGraph: markRaw(tabGraph),
    tabHistory: markRaw(applicationHistory)
  };
  const instanseList = ref<InstanceData[]>([
    { name: 'app1', id: '1' },
    { name: 'app2', id: '2' },
    { name: 'app3', id: '3' }
  ]);
  const labelList = ref([1, 2]);
  const handleAddInstance = () => {
    showInstanceModal.value = true;
  };
  const handleTabChange = (val) => {
    activeKey.value = val;
  };
  const handleEditApp = (type) => {
    showAppModal.value = true;
    appModalTitle.value =
      type === 'create'
        ? t('applications.applications.create')
        : t('applications.applications.edit');
  };
  const handleSaveAppInfo = () => {};
  const handleSaveInstanceInfo = () => {
    instanseList.value.push({
      name: 'app',
      id: `${instanseList.value.length + 1}`
    });
  };
  const handleClickInstance = (item) => {
    activeInstance.value = item.id;
  };
  const handleOk = () => {
    router.back();
  };
</script>

<style lang="less" scoped>
  .application-detail-wrap {
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

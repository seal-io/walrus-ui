<template>
  <ComCard top-gap class="application-detail-wrap">
    <GroupTitle title="新建应用"></GroupTitle>
    <ModuleCard title="基本信息">
      <a-form ref="formref" :model="formData" auto-label-width>
        <a-form-item label="应用名">
          <a-input v-model="formData.name"></a-input>
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
        ></instanceThumb>
        <thumbButton :size="60" @click="handleAddInstance"></thumbButton>
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
  </ComCard>
</template>

<script lang="ts" setup>
  import { reactive, ref, markRaw } from 'vue';
  import GroupTitle from '@/components/group-title/index.vue';
  import thumbButton from '@/components/buttons/thumb-button.vue';
  import instanceThumb from '../components/instance-thumb.vue';
  import { InstanceData } from '../config/interface';
  import { instanceTabs } from '../config/index';
  import tabConfiguration from '../components/tab-configuration.vue';
  import tabResource from '../components/tab-resource.vue';
  import tabLogs from '../components/tab-logs.vue';
  import tabOutput from '../components/tab-output.vue';
  import tabOptimization from '../components/tab-optimization.vue';
  import tabGraph from '../components/tab-graph.vue';

  const formref = ref();
  const activeInstance = ref('1');
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
    tabGraph: markRaw(tabGraph)
  };
  const instanseList = ref<InstanceData[]>([
    { name: 'intance1', id: '1' },
    { name: 'intance2', id: '2' },
    { name: 'intance3', id: '3' }
  ]);
  const handleAddInstance = () => {
    instanseList.value.push({
      name: 'intance3',
      id: `${instanseList.value.length + 1}`
    });
  };
  const handleTabChange = (val) => {
    activeKey.value = val;
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

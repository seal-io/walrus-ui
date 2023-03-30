<template>
  <div>
    <ModuleCard title="实例基本信息">
      <template #title>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
          "
        >
          <span>实例信息</span>
          <!-- <a-button
            v-if="get(instanceInfo, 'status') !== 'Deploying'"
            type="primary"
            size="small"
            style="width: 98px"
            @click="handleUpgradeInstance"
            >升级</a-button
          > -->
        </div>
      </template>
      <BasicInfo></BasicInfo>
    </ModuleCard>
    <ModuleCard title="历史版本">
      <applicationHistory :deploy-id="deployId"></applicationHistory>
    </ModuleCard>
    <ModuleCard title="访问URL">
      <tabEndpoint></tabEndpoint>
      <!-- <span
        v-for="(record, sIndex) in accessURLList"
        :key="sIndex"
        class="url-wrap"
      >
        <span
          v-for="(item, index) in record.endpoints"
          :key="index"
          class="access-link-item"
        >
          <AutoTip
            :tooltip-props="{
              content:
                record.resourceSubKind === 'NodePort'
                  ? get(split(item, ':'), 1)
                  : item
            }"
          >
            <a-link
              style="line-height: 1"
              :href="
                includes(item, 'https') || includes(item, 'http')
                  ? item
                  : `http://${item}`
              "
              target="_blank"
            >
              <span>{{
                record.resourceSubKind === 'NodePort'
                  ? get(split(item, ':'), 1)
                  : item
              }}</span>
            </a-link>
          </AutoTip>
        </span>
      </span> -->
    </ModuleCard>

    <ModuleCard title="资源信息" style="margin-top: 20px">
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
      <!-- <template #cancel>
        <a-button
          type="outline"
          class="cap-title cancel-btn"
          @click="handleCancel"
          >{{ $t('common.button.cancel') }}</a-button
        >
      </template> -->
    </EditPageFooter>
    <createInstance
      v-model:show="showInstanceModal"
      v-model:status="status"
      title="升级实例"
      :variables="appInfoVariables"
      :environment-list="environmentList"
      @save="handleSaveInstanceInfo"
    ></createInstance>
  </div>
</template>

<script lang="ts" setup>
  import { cloneDeep, get, split, includes } from 'lodash';
  import { markRaw, ref, reactive, watch, inject, computed } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import tabTerminal from './x-terminal/tab-terminal.vue';
  import tabResource from './tab-resource.vue';
  import tabLogs from './tab-logs.vue';
  import tabOutput from './tab-output.vue';
  import tabOptimization from './tab-optimization.vue';
  import tabGraph from './tab-graph.vue';
  import tabEndpoint from './tab-endpoint.vue';
  import applicationHistory from './application-history.vue';
  import createInstance from '../create-instance.vue';
  import BasicInfo from './basic-info.vue';
  import { instanceTabs } from '../../config';
  import { EndPointRow } from '../../config/interface';
  import {
    queryItemApplicationInstances,
    queryInstanceEndpoints
  } from '../../api';

  const props = defineProps({
    instanceId: {
      type: String,
      default() {
        return '';
      }
    }
  });
  const accessURLList = ref<EndPointRow[]>([]);
  const environmentList = inject('environmentList', ref([]));
  const instanceInfo = inject('instanceInfo', ref({}));
  const appInfo = inject('appInfo', reactive({}));
  const { router, route } = useCallCommon();
  const activeKey = ref('resource');
  const showInstanceModal = ref(false);
  const status = ref('edit');
  const deployId = ref('');
  const instanceTabMap = {
    tabResource: markRaw(tabResource),
    tabLogs: markRaw(tabLogs),
    // tabOutput: markRaw(tabOutput),
    // tabOptimization: markRaw(tabOptimization),
    // tabGraph: markRaw(tabGraph),
    tabHistory: markRaw(applicationHistory),
    tabTerminal: markRaw(tabTerminal)
    // tabEndpoint: markRaw(tabEndpoint)
  };

  const appInfoVariables = computed(() => {
    return cloneDeep(get(appInfo, 'variables') || []);
  });
  const handleTabChange = (val) => {
    activeKey.value = val;
  };

  const getEndpoints = async () => {
    try {
      const params = {
        page: 1,
        perPage: -1,
        instanceID: props.instanceId
      };
      const { data } = await queryInstanceEndpoints(params);
      accessURLList.value = data?.endpoints || [
        {
          endpoints: [
            '192.168.1.2192.168.1.2192.168.1.2192.168.1.2192.168.1.2',
            '192.168.1.3'
          ]
        },
        { endpoints: ['192.168.1.5', '192.168.1.7'] },
        { endpoints: ['192.168.1.6', '192.168.1.8'] },
        { endpoints: ['192.168.1.6', '192.168.1.8'] },
        { endpoints: ['192.168.1.6', '192.168.1.8'] },
        { endpoints: ['192.168.1.6', '192.168.1.8'] },
        { endpoints: ['192.168.1.6', '192.168.1.8'] },
        { endpoints: ['192.168.1.6', '192.168.1.8'] },
        { endpoints: ['192.168.1.6', '192.168.1.8'] },
        { endpoints: ['192.168.1.6', '192.168.1.8'] },
        { endpoints: ['192.168.1.6', '192.168.1.8'] },
        { endpoints: ['192.168.1.6', '192.168.1.8'] },
        { endpoints: ['192.168.1.6', '192.168.1.8'] },
        { endpoints: ['192.168.1.6', '192.168.1.8'] },
        { endpoints: ['192.168.1.6', '192.168.1.8'] },
        { endpoints: ['192.168.1.6', '192.168.1.8'] }
      ];
    } catch (error) {
      accessURLList.value = [];
      console.log(error);
    }
  };
  const handleSaveInstanceInfo = (res) => {
    deployId.value = res?.data.id;
  };
  const handleUpgradeInstance = () => {
    status.value = 'edit';
    showInstanceModal.value = true;
  };
  const getInstanceInfo = async () => {
    if (!props.instanceId) return;
    try {
      const { data } = await queryItemApplicationInstances({
        id: props.instanceId
      });
    } catch (error) {
      console.log(error);
    }
  };

  watch(
    () => props.instanceId,
    () => {
      deployId.value = '';
      // getInstanceInfo();
      // getEndpoints();
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

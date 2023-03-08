<template>
  <ComCard top-gap class="application-detail-wrap">
    <GroupTitle show-back :title="id ? '应用详情' : '新建应用'"></GroupTitle>
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
            @delete="handleDeleteInstance('edit')"
            @click="handleClickInstance(item)"
          >
            <template #description>
              <span style="font-weight: 700">{{ item.type }}</span>
            </template>
          </instanceThumb>
          <a-tooltip content="添加应用实例">
            <thumbButton :size="60" @click="handleAddInstance"></thumbButton>
          </a-tooltip>
        </div>
      </div>
    </div>
    <div>
      <component :is="pageComMap[pgCom]"></component>
    </div>
    <createInstance
      v-model:show="showInstanceModal"
      title="创建实例"
      @save="handleSaveInstanceInfo"
    ></createInstance>
  </ComCard>
</template>

<script lang="ts" setup>
  import { reactive, ref, markRaw } from 'vue';
  import { keys, get } from 'lodash';
  import useCallCommon from '@/hooks/use-call-common';
  import GroupTitle from '@/components/group-title/index.vue';
  import thumbButton from '@/components/buttons/thumb-button.vue';
  import { queryItemProject } from '@/views/application-management/projects/api';
  import instanceThumb from '../components/instance-thumb.vue';
  import { InstanceData } from '../config/interface';
  import { instanceActions } from '../config/index';

  import AppDetail from '../components/app-info/index.vue';
  import InstanceDetail from '../components/instance/index.vue';
  import createInstance from '../components/create-instance.vue';

  const { router, route, t } = useCallCommon();
  const id = route.query.id as string;
  const activeInstance = ref('app'); //
  const pgCom = ref('appDetail'); // instanceDetail、appDetail
  const showInstanceModal = ref(false);
  const projectBasicInfo = ref<any>({});

  const pageComMap = {
    appDetail: markRaw(AppDetail),
    instanceDetail: markRaw(InstanceDetail)
  };
  const instanseList = ref<InstanceData[]>([
    // { name: 'instance-1', id: '1', type: 'dev' },
    // { name: 'instance-2', id: '2', type: 'staging' },
    // { name: 'instance-3', id: '3', type: 'prod' }
  ]);
  const labelList = ref<{ key: string; value: string }[]>([]);
  const handleAddInstance = () => {
    showInstanceModal.value = true;
  };
  const handleSaveInstanceInfo = () => {};
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
  const getProjectInfo = async () => {
    try {
      const { data } = await queryItemProject({ id });
      projectBasicInfo.value = data;
    } catch (error) {
      projectBasicInfo.value = {};
      console.log(error);
    } finally {
      transformlabels();
    }
  };
  const handleDeleteInstance = (type) => {};
  const handleClickApp = () => {
    activeInstance.value = 'app';
    pgCom.value = 'appDetail';
  };

  const handleClickInstance = (item) => {
    activeInstance.value = item.id;
    pgCom.value = 'instanceDetail';
  };
  const handleOk = () => {
    router.back();
  };
  const init = async () => {
    // getProjectInfo();
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

        .content {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          min-height: 112px;

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

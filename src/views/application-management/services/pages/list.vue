<template>
  <div class="service">
    <FilterBox style="margin-bottom: var(--filter-box-margin)">
      <template #params>
        <a-input
          v-model.trim="queryParams.query"
          allow-clear
          style="width: 220px"
          :placeholder="$t('common.search.name.placeholder')"
          @clear="handleSearch"
          @press-enter="handleSearch"
        >
          <template #prefix>
            <icon-search />
          </template>
        </a-input>
        <a-space style="margin-left: 0" :size="10">
          <a-button type="primary" @click="handleSearch">{{
            $t('common.button.search')
          }}</a-button>
          <a-button type="outline" @click="handleReset">{{
            $t('common.button.clear')
          }}</a-button>
        </a-space>
      </template>
      <template #button-group>
        <a-button
          v-if="
            userStore.hasProjectResourceActions({
              projectID,
              environmentID,
              resource: Resources.Resources,
              actions: [Actions.POST]
            })
          "
          type="primary"
          @click="handleCreate"
        >
          {{ $t('applications.applications.create.resource') }}</a-button
        >
        <a-button
          v-if="
            userStore.hasProjectResourceActions({
              projectID,
              environmentID,
              resource: Resources.Resources,
              actions: [Actions.POST]
            })
          "
          status="success"
          type="primary"
          @click="handleImportFile"
          >{{ $t('applications.service.importyaml') }}
        </a-button>
        <a-button
          v-if="
            userStore.hasProjectResourceActions({
              projectID,
              environmentID,
              resource: Resources.Resources,
              actions: [Actions.DELETE]
            })
          "
          type="primary"
          status="warning"
          :disabled="!selectedKeys.length"
          @click="handleDelete"
          >{{ $t('common.button.delete')
          }}<span v-if="selectedKeys.length">{{
            `(${selectedKeys.length})`
          }}</span></a-button
        >
        <primaryButtonGroup
          v-if="batchActions.length"
          size="medium"
          :actions="batchActions"
          position="br"
          trigger="hover"
          @select="(value) => handleClickAction(value)"
        >
          <a-button type="primary" style="padding: 0 12px"
            ><icon-more-vertical style="stroke-width: 5" class="font-14"
          /></a-button>
        </primaryButtonGroup>
      </template>
    </FilterBox>

    <tableList
      ref="resourceTable"
      :type="ServiceDataType.resource"
      :title="$t('menu.applicationManagement.resource')"
      :request-params="queryParams"
      @selection-change="handleResourceSelectChange"
    >
      <template #empty>
        <result-view
          :loading="loading"
          :title="
            queryParams.query
              ? $t('common.result.nodata.title', {
                  type: $t('applications.applications.table.resource')
                })
              : $t('project.resource.result.title')
          "
          :subtitle="
            queryParams.query
              ? $t('common.result.nodata.subtitle')
              : $t('project.resource.result.subTitle')
          "
        >
          <template #icon>
            <icon-find-replace v-if="queryParams.query" />
            <i v-else class="iconfont icon-apps-fill"></i>
          </template>
          <template #extra>
            <a-space
              v-if="
                userStore.hasProjectResourceActions({
                  projectID,
                  environmentID,
                  resource: Resources.Resources,
                  actions: [Actions.POST]
                }) && !queryParams.query
              "
              :size="30"
            >
              <a-button type="outline" @click="handleCreate"
                ><icon-plus class="m-r-4" />{{
                  $t('common.button.create.now')
                }}</a-button
              >
              <a-button
                status="success"
                type="outline"
                @click="handleImportFile"
                ><icon-import class="m-r-4" />{{
                  $t('applications.service.importyaml')
                }}
              </a-button>
            </a-space>
          </template>
        </result-view>
      </template>
    </tableList>
    <deleteServiceModal
      v-model:show="showDeleteModal"
      :callback="handleDeleteConfirm"
      :title="$t('common.delete.tips')"
    >
    </deleteServiceModal>
    <importWalrusFile
      v-model:show="showImportYaml"
      :title="$t('applications.service.importyaml')"
      @save="handleImportYaml"
    ></importWalrusFile>
    <CommentModal
      v-model:show="showCommentModal"
      :title="$t('applications.service.batchDeploy')"
      @confirm="handleComfirmComment"
    ></CommentModal>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { PageAction } from '@/views/config';
  import { Resources, Actions } from '@/permissions/config';
  import { PROJECT } from '@/router/config';
  import { reactive, ref, computed, onMounted } from 'vue';
  import { execSucceed, deleteModal } from '@/utils/monitor';
  import useCallCommon from '@/hooks/use-call-common';
  import { useAppStore, useUserStore } from '@/store';
  import FilterBox from '@/components/filter-box/index.vue';
  import {
    applyEnvironment,
    exportEnvironment
  } from '@/views/application-management/environments/api';
  import CommentModal from '@/views/commons/components/comment-modal/index.vue';
  import primaryButtonGroup from '@/components/drop-button-group/primary-button-group.vue';
  import useDownload from '@/hooks/use-download';
  import tableList from '../components/table-list.vue';
  import deleteServiceModal from '../components/delete-service-modal.vue';
  import importWalrusFile from '../components/import-walrus-file.vue';
  import {
    serviceBatchAction,
    serviceActionMap,
    ServiceDataType
  } from '../config';
  import {
    deleteServices,
    batchDeployService,
    batchStartService,
    batchStopService
  } from '../api';

  const { download } = useDownload();
  const { route, router, t } = useCallCommon();
  const userStore = useUserStore();
  const resourceTable = ref();
  const serviceSelectKeys = ref<string[]>([]);
  const resourceSelectKeys = ref<string[]>([]);
  const projectID = route.params.projectId as string;
  const environmentID = route.params.environmentId as string;
  const showDeleteModal = ref(false);
  const showImportYaml = ref(false);
  const loading = ref(false);
  const showCommentModal = ref(false);
  const commentTitle = ref('');
  const actionHandlerMap = new Map();
  const queryParams = reactive({
    query: ''
  });

  const selectedKeys = computed(() => {
    return [...serviceSelectKeys.value, ...resourceSelectKeys.value];
  });

  const batchActions = computed(() => {
    const list: any[] = _.map(serviceBatchAction, (o) => {
      const item = _.cloneDeep(o);
      if (!_.isFunction(item.disabled)) {
        item.disabled = !selectedKeys.value.length;
      } else {
        item.disabled = item.disabled({ selectedKeys: selectedKeys.value });
      }
      return item;
    });
    return _.filter(list, (item) => {
      return item?.filterFun?.({ projectID, environmentID });
    });
  });
  const handleDeleteConfirm = async (withoutCleanup) => {
    try {
      loading.value = true;
      const ids = _.map(selectedKeys.value, (val) => {
        return { id: val as string };
      });
      await deleteServices({
        data: { items: ids },
        withoutCleanup
      });
      loading.value = false;
      execSucceed();
      serviceSelectKeys.value = [];
      resourceSelectKeys.value = [];
      // serviceTable.value.clearStatus();
      resourceTable.value.clearStatus();
    } catch (error) {
      loading.value = false;
    }
  };

  const handleDelete = () => {
    showDeleteModal.value = true;
  };

  const handleCloneService = () => {
    router.push({
      name: PROJECT.ServiceClone,
      query: {
        services: serviceSelectKeys.value,
        resources: resourceSelectKeys.value
      }
    });
  };

  const handleBatchDeployment = async () => {
    showCommentModal.value = true;
  };

  const handleComfirmComment = async (val) => {
    try {
      await batchDeployService({
        items: _.map(resourceSelectKeys.value, (val) => {
          return { id: val as string };
        }),
        reuseAttributes: true,
        changeComment: val
      });
      execSucceed();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };
  const handleBatchStart = async () => {
    try {
      await batchStartService({
        items: _.map(resourceSelectKeys.value, (val) => {
          return { id: val as string };
        })
      });
      execSucceed();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const handleBatchStop = async () => {
    try {
      await batchStopService({
        items: _.map(resourceSelectKeys.value, (val) => {
          return { id: val as string };
        })
      });
      execSucceed();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const handleStopModal = async () => {
    deleteModal({
      content: 'applications.service.stop.confirm',
      title: t('applications.service.stop.tips', {
        type: t('applications.applications.resource.title')
      }),
      okText: 'common.button.stop',
      onOk: () => handleBatchStop()
    });
  };
  const handleCreate = () => {
    router.push({
      name: PROJECT.ServiceEdit,
      params: {
        dataType: ServiceDataType.resource,
        projectId: projectID,
        environmentId: environmentID,
        action: PageAction.EDIT
      }
    });
  };

  const handleSearch = () => {
    setTimeout(() => {
      resourceTable.value.handleSearch();
    }, 100);
  };
  const handleReset = () => {
    queryParams.query = '';

    handleSearch();
  };

  const handleImportYaml = async (data) => {
    try {
      const res = await applyEnvironment({
        data: {
          ...data
        },
        id: environmentID
      });
      if (res) {
        showImportYaml.value = false;
        execSucceed();
        handleSearch();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };
  const handleExportYaml = async () => {
    try {
      const url = exportEnvironment({
        id: environmentID,
        data: {
          id: resourceSelectKeys.value
        }
      });
      download(url);
      // execSucceed();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };
  const handleServiceSelectChange = (keys: string[]) => {
    serviceSelectKeys.value = keys;
  };

  const handleResourceSelectChange = (keys: string[]) => {
    resourceSelectKeys.value = keys;
  };
  const handleDeleted = (ids) => {
    serviceSelectKeys.value = _.difference(
      serviceSelectKeys.value,
      ids as string[]
    );
    resourceSelectKeys.value = _.difference(
      resourceSelectKeys.value,
      ids as string[]
    );
  };

  const handleImportFile = () => {
    showImportYaml.value = true;
  };
  const setActionHandler = () => {
    actionHandlerMap.set(serviceActionMap.clone, handleCloneService);
    actionHandlerMap.set(serviceActionMap.export, handleExportYaml);
    actionHandlerMap.set(serviceActionMap.stop, handleStopModal);
    actionHandlerMap.set(serviceActionMap.start, handleBatchStart);
    actionHandlerMap.set(serviceActionMap.deploy, handleBatchDeployment);
  };

  const handleClickAction = (val) => {
    actionHandlerMap.get(val)();
  };

  onMounted(() => {
    setActionHandler();
  });
</script>

<style lang="less" scoped>
  .service {
    :deep(.mo-wrap) {
      overflow: hidden;
      border: none !important;

      .arco-table .arco-table-tr .arco-table-th {
        background-color: var(--color-white);
        border-bottom: 1px solid var(--color-border-2);
      }

      .content {
        padding: 0;
      }
    }
  }
</style>

<template>
  <div class="service">
    <FilterBox style="margin-bottom: 10px">
      <template #params>
        <a-input
          v-model="queryParams.query"
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
        <a-space style="margin-left: 10px">
          <a-button type="primary" @click="handleSearch">{{
            $t('common.button.search')
          }}</a-button>
          <a-button type="outline" @click="handleReset">{{
            $t('common.button.clear')
          }}</a-button>
        </a-space>
      </template>
      <template #button-group>
        <primaryButtonGroup
          v-if="
            userStore.hasProjectResourceActions({
              projectID,
              environmentID,
              resource: Resources.Services,
              actions: [Actions.POST]
            })
          "
          :btn-text="$t('applications.applications.create.serviceResource')"
          :action-list="CreatActions"
          @select="handleSelectAction"
        ></primaryButtonGroup>
        <a-button
          v-if="
            userStore.hasProjectResourceActions({
              projectID,
              environmentID,
              resource: Resources.Services,
              actions: [Actions.POST]
            })
          "
          status="success"
          type="primary"
          :disabled="!selectedKeys.length"
          @click="handleCloneService"
          >{{ $t('applications.service.clone')
          }}<span v-if="selectedKeys.length">{{
            `(${selectedKeys.length})`
          }}</span></a-button
        >
        <a-button
          v-if="
            userStore.hasProjectResourceActions({
              projectID,
              environmentID,
              resource: Resources.Services,
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
      </template>
    </FilterBox>

    <moduleWrapper
      :title="$t('menu.applicationManagement.services')"
      :show-delete="false"
      class="m-b-20"
      :status="true"
    >
      <tableList
        ref="serviceTable"
        :type="ServiceDataType.service"
        :title="$t('menu.applicationManagement.resources')"
        :request-params="queryParams"
        @selection-change="handleServiceSelectChange"
      ></tableList>
    </moduleWrapper>
    <moduleWrapper
      :title="$t('applications.applications.table.resource')"
      :show-delete="false"
      :status="true"
    >
      <tableList
        ref="resourceTable"
        :type="ServiceDataType.resource"
        :title="$t('applications.applications.table.resource')"
        :request-params="queryParams"
        @selection-change="handleResourceSelectChange"
      ></tableList>
    </moduleWrapper>
    <deleteServiceModal
      v-model:show="showDeleteModal"
      :callback="handleDeleteConfirm"
      :title="$t('common.delete.tips')"
    >
    </deleteServiceModal>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { PageAction } from '@/views/config';
  import { Resources, Actions } from '@/permissions/config';
  import { PROJECT } from '@/router/config';
  import { reactive, ref, computed } from 'vue';
  import { execSucceed } from '@/utils/monitor';
  import useCallCommon from '@/hooks/use-call-common';
  import { useAppStore, useUserStore } from '@/store';
  import FilterBox from '@/components/filter-box/index.vue';
  import primaryButtonGroup from '@/components/drop-button-group/primary-button-group.vue';
  import moduleWrapper from '@/components/module-wrapper/index.vue';
  import tableList from '../components/table-list.vue';
  import deleteServiceModal from '../components/delete-service-modal.vue';
  import { CreatActions, ServiceDataType } from '../config';
  import { deleteServices } from '../api';

  const { route, router } = useCallCommon();
  const appStore = useAppStore();
  const userStore = useUserStore();
  const serviceTable = ref();
  const resourceTable = ref();
  const serviceSelectKeys = ref<string[]>([]);
  const resourceSelectKeys = ref<string[]>([]);
  const projectID = route.params.projectId as string;
  const environmentID = route.params.environmentId as string;
  const showDeleteModal = ref(false);
  const loading = ref(false);
  const queryParams = reactive({
    query: ''
  });

  const selectedKeys = computed(() => {
    return [...serviceSelectKeys.value, ...resourceSelectKeys.value];
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
      serviceTable.value.clearStatus();
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

  const handleSelectAction = (action: string) => {
    if (!ServiceDataType[action]) return;
    router.push({
      name: PROJECT.ServiceEdit,
      params: {
        dataType: ServiceDataType[action],
        projectId: projectID,
        environmentId: environmentID,
        action: PageAction.EDIT
      }
    });
  };

  const handleSearch = () => {
    setTimeout(() => {
      serviceTable.value.handleSearch();
      resourceTable.value.handleSearch();
    }, 100);
  };
  const handleReset = () => {
    queryParams.query = '';

    handleSearch();
  };

  const handleServiceSelectChange = (keys: string[]) => {
    serviceSelectKeys.value = keys;
  };

  const handleResourceSelectChange = (keys: string[]) => {
    resourceSelectKeys.value = keys;
  };
</script>

<style lang="less" scoped>
  .service {
    :deep(.mo-wrap) {
      overflow: hidden;
      border: none !important;

      .arco-table .arco-table-tr .arco-table-th {
        background-color: #fff;
        border-bottom: 1px solid var(--color-border-2);
      }

      .content {
        padding: 0;
      }
    }
  }
</style>

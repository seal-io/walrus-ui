<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :items="breadCrumbList"
        :menu="{ icon: 'icon-apps' }"
        @change="handleSelectChange"
      ></Breadcrumb>
    </BreadWrapper>
    <ComCard top-gap>
      <GroupTitle
        :bordered="false"
        style="margin-bottom: 0"
        :show-edit="
          pageAction === PageAction.VIEW &&
          userStore.hasProjectResourceActions({
            resource: Resources.Environments,
            projectID: route.params.projectId,
            actions: ['POST']
          })
        "
        @edit="handleEdit"
      ></GroupTitle>
      <a-form ref="formref" :model="formData" auto-label-width>
        <a-form-item
          :label="$t('operation.environments.table.name')"
          field="name"
          :validate-trigger="['change']"
          :rules="[
            {
              required: pageAction === PageAction.EDIT,
              message: $t('operation.environments.rule.name')
            }
          ]"
        >
          <a-input
            v-if="pageAction === PageAction.EDIT"
            v-model="formData.name"
            style="width: 500px"
            :max-length="30"
            show-word-limit
          ></a-input>
          <span v-else class="readonly-view-label">{{
            formData.name || '-'
          }}</span>
        </a-form-item>
        <a-form-item
          :label="$t('operation.environments.table.description')"
          field="description"
        >
          <a-textarea
            v-if="pageAction === PageAction.EDIT"
            v-model="formData.description"
            style="width: 500px"
            :max-length="200"
            show-word-limit
            :auto-size="{ minRows: 6, maxRows: 10 }"
          ></a-textarea>
          <div v-else class="description-content readonly-view-label">{{
            formData.description || '-'
          }}</div>
        </a-form-item>
        <a-form-item
          v-if="environmentId"
          :label="$t(`applications.projects.form.label`)"
        >
          <a-space
            v-if="labelList?.length"
            style="display: flex; flex-direction: column; width: 565px"
            direction="vertical"
          >
            <xInputGroup
              v-for="(sItem, sIndex) in labelList"
              :key="sIndex"
              v-model:dataKey="sItem.key"
              v-model:dataValue="sItem.value"
              v-model:value="formData.labels"
              :trigger-validate="validateTrigger"
              :label-list="labelList"
              :position="sIndex"
              @add="(obj) => handleAddLabel(obj, labelList)"
              @delete="handleDeleteLabel(labelList, sIndex)"
            ></xInputGroup>
          </a-space>
        </a-form-item>
        <a-form-item
          :label="$t('operation.connectors.menu')"
          field="connectorIDs"
          :validate-trigger="['change']"
        >
          <div>
            <div style="display: flex; margin-bottom: 10px">
              <a-button
                v-if="pageAction === PageAction.EDIT"
                type="primary"
                size="small"
                style="margin-right: 8px; padding: 0 6px"
                @click.stop="handleAddConnector"
              >
                <template #icon>
                  <icon-plus />
                </template>
                {{ $t('operation.environments.detail.addConnector') }}</a-button
              >
              <ConnectorSelector
                v-if="showModal"
                v-model:show="showModal"
                v-model:connectorIDs="formData.connectorIDs"
                :selected="selectedList"
                :list="connectorList"
                @confirm="handleConnectorChange"
              ></ConnectorSelector>
            </div>
            <connectorsTable
              :style="{
                width: '800px',
                marginLeft: pageAction === PageAction.VIEW ? '12px' : 0
              }"
              :action="pageAction"
              :list="formData?.edges || []"
              @delete="handleDeleteConnector"
            ></connectorsTable>
          </div>
        </a-form-item>
        <a-form-item
          v-if="environmentId"
          :label="$t('applications.applications.table.service')"
        >
          <CloneService
            ref="serviceRef"
            :service-list="serviceList"
            style="width: 800px"
          ></CloneService>
        </a-form-item>
      </a-form>
      <EditPageFooter v-if="pageAction === PageAction.EDIT">
        <template #save>
          <a-button
            type="primary"
            class="cap-title cancel-btn"
            :loading="submitLoading"
            @click="handleSubmit"
            >{{ $t('common.button.save') }}</a-button
          >
        </template>
        <a-button
          type="outline"
          class="cap-title cancel-btn"
          @click="handleCancel"
          >{{ $t('common.button.cancel') }}</a-button
        >
      </EditPageFooter>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import { PROJECT } from '@/router/config';
  import { Resources } from '@/permissions/config';
  import { useUserStore, useTabBarStore } from '@/store';
  import { ref, computed, defineExpose } from 'vue';
  import _, {
    each,
    includes,
    map,
    remove,
    get,
    isEqual,
    cloneDeep
  } from 'lodash';
  import { PageAction } from '@/views/config';
  import GroupTitle from '@/components/group-title/index.vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import { onBeforeRouteLeave } from 'vue-router';
  import { queryConnectors } from '@/views/operation-hub/connectors/api';
  import usePageAction from '@/hooks/use-page-action';
  import xInputGroup from '@/components/form-create/custom-components/x-input-group.vue';
  import useLabelsActions from '@/components/form-create/hooks/use-labels-action';
  import useProjectBreadcrumbData from '@/views/application-management/projects/hooks/use-project-breadcrumb-data';
  import { queryServices } from '@/views/application-management/services/api';
  import { ServiceRowData } from '@/views/application-management/services/config/interface';
  import { BreadcrumbOptions } from '@/views/config/interface';
  import CloneService from '../components/clone-service.vue';
  import { EnvironFormData } from '../config/interface';
  import connectorsTable from '../components/connectors.vue';
  import ConnectorSelector from '../components/connector-selector.vue';
  import {
    createEnvironment,
    updateEnvironment,
    queryItemEnvironments,
    cloneEnvironment
  } from '../api';

  // const props = defineProps({
  //   id: {
  //     type: String,
  //     default() {
  //       return '';
  //     }
  //   }
  // });

  const { getProjectList, setProjectList, initBreadValues, handleBreadChange } =
    useProjectBreadcrumbData();
  const userStore = useUserStore();
  const tabBarStore = useTabBarStore();
  const { router, route, t } = useCallCommon();
  const { pageAction, handleEdit } = usePageAction();
  const id = route.query.id as string;
  const environmentId = route.params.environmentId as string; // only in clone
  const serviceList = ref<ServiceRowData[]>([]);
  const formref = ref();
  const serviceRef = ref(); // only in clone
  const connectorList = ref<{ label: string; value: string }[]>([]);
  const showModal = ref(false);
  const submitLoading = ref(false);
  const validateTrigger = ref(false);
  const breadCrumbList = ref<BreadcrumbOptions[]>([]);
  let copyFormData: any = {};
  const selectedList = ref<string[]>([]);
  const formData = ref<EnvironFormData>({
    projectID: route.params.projectId as string,
    name: '',
    description: '',
    connectorIDs: [],
    connectors: [],
    edges: [],
    labels: {},
    services: []
  });
  const { labelList, handleAddLabel, handleDeleteLabel } =
    useLabelsActions(formData);
  const title = computed(() => {
    // only in clone
    if (environmentId) {
      return t('applications.environment.clone');
    }
    if (!id) {
      return t('operation.environments.create');
    }
    if (id && pageAction.value === PageAction.EDIT) {
      return t('operation.environments.edit');
    }
    return t('operation.environments.view');
  });
  const handleSelectChange = ({ value, item }) => {
    handleBreadChange(value, item);
  };
  const setBreadCrumbList = async () => {
    const list = await initBreadValues();

    breadCrumbList.value = [
      ...list,
      {
        type: 'menu.operatorHub.evniroment',
        label: title.value
      }
    ] as BreadcrumbOptions[];

    const projectList = await getProjectList();
    const projectRes = await setProjectList(projectList);
    breadCrumbList.value = [
      {
        ...projectRes
      },
      {
        type: 'menu.operatorHub.evniroment',
        label: title.value
      }
    ] as BreadcrumbOptions[];
  };
  const setFormDataConnectors = (connectors) => {
    formData.value.edges = [];
    each(connectorList.value, (item) => {
      if (includes(connectors, item.value)) {
        formData.value?.edges?.push(item);
      }
    });
    formData.value.connectors = map(formData.value.connectorIDs, (val) => {
      return {
        connector: {
          id: val
        }
      };
    });
  };
  const getItemEnvironmentInfo = async () => {
    copyFormData = cloneDeep(formData.value);
    if (!id) return;
    try {
      const { data } = await queryItemEnvironments({ id });
      formData.value = data;
      formData.value.edges = [];
      formData.value.connectorIDs = map(get(data, 'connectors') || [], (s) => {
        return s?.connector?.id;
      });
      // only in clone
      formData.value.name = environmentId
        ? `${formData.value.name}-clone`
        : formData.value.name;
      selectedList.value = [...formData.value.connectorIDs];
      setFormDataConnectors(formData.value.connectorIDs);
      copyFormData = cloneDeep(formData.value);
    } catch (error) {
      formData.value = {
        projectID: route.params.projectId as string,
        name: '',
        description: '',
        connectorIDs: [],
        connectors: [],
        edges: []
      };
      console.log(error);
    }
  };
  const getEnvironmentServices = async () => {
    if (!route.params.environmentId) return;
    try {
      const params = {
        projectID: route.params.projectId as string,
        environmentID: route.params.environmentId as string,
        page: -1
      };
      const { data } = await queryServices(params);
      serviceList.value = data.items || [];
    } catch (error) {
      serviceList.value = [];
      console.log(error);
    }
  };
  const getConnectors = async () => {
    try {
      const params = {
        page: -1,
        projectID: route.params.projectId,
        withGlobal: true
      };
      const { data } = await queryConnectors(params);
      const list = data?.items || [];
      connectorList.value = map(list, (item) => {
        item.value = item.id;
        item.label = item.name;
        return item;
      }) as Array<{ label: string; value: string }>;
    } catch (error) {
      connectorList.value = [];
      console.log(error);
    }
  };
  const handleAddConnector = () => {
    showModal.value = true;
  };

  const handleConnectorChange = (values) => {
    console.log('values===', values);
    formData.value.connectorIDs = [...values];
    setFormDataConnectors(formData.value.connectorIDs);
    formref.value.validateField('connectorIDs');
  };
  const handleDeleteConnector = (record, index) => {
    formData.value.edges?.splice(index, 1);
    remove(formData.value.connectorIDs, (val) => record.id === val);
    remove(formData.value.connectors, (o) => o.connector.id === record.id);
    remove(selectedList.value, (id) => record.id === id);
    formref.value.validateField('connectorIDs');
  };
  const handleCloneEnvironment = async () => {
    const services = serviceRef.value.getSelectServiceData();
    formData.value.services = _.cloneDeep(services);
    await cloneEnvironment(formData.value);
  };
  const validateLabel = () => {
    if (!environmentId) return false;
    const valid = _.some(labelList.value, (item) => !item.value && item.key);
    return valid;
  };
  const handleSubmit = async () => {
    const res = await formref.value?.validate();
    validateTrigger.value = validateLabel();
    if (!res && !validateTrigger.value) {
      try {
        submitLoading.value = true;
        if (environmentId) {
          await handleCloneEnvironment();
        } else if (id) {
          await updateEnvironment(formData.value);
        } else {
          await createEnvironment(formData.value);
        }
        copyFormData = cloneDeep(formData.value);
        tabBarStore.deleteTag(0, {
          title: '',
          name: PROJECT.Detail,
          fullPath: ''
        });
        router.back();
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
      }
      return true;
    }
    return false;
  };
  const cancelCallback = () => {
    if (
      pageAction.value === PageAction.EDIT &&
      route.params.action === PageAction.VIEW
    ) {
      pageAction.value = PageAction.VIEW;
      getItemEnvironmentInfo();
      return;
    }
    router.back();
  };
  const handleCancel = () => {
    if (!isEqual(copyFormData, formData.value)) {
      beforeLeaveCallback({
        isCancel: true,
        onOk: () => {
          copyFormData = cloneDeep(formData.value);
          cancelCallback();
        }
      });
    } else {
      cancelCallback();
    }
  };
  onBeforeRouteLeave(async (to, from) => {
    if (!isEqual(copyFormData, formData.value)) {
      beforeLeaveCallback({
        to,
        from,
        onOk: () => {
          copyFormData = cloneDeep(formData.value);
          router.push({
            name: to.name as string
          });
        }
      });
      return false;
    }
    return true;
  });
  const init = async () => {
    setBreadCrumbList();
    getEnvironmentServices();
    await getConnectors();
    await getItemEnvironmentInfo();
  };
  defineExpose({
    handleSubmit,
    init
  });
  init();
</script>

<script lang="ts">
  export default {
    name: PROJECT.EnvEdit
  };
</script>

<style></style>

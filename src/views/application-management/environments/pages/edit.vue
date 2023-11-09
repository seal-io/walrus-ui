<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :items="[
          ...breadCrumbList,
          {
            type: 'menu.operatorHub.evniroment',
            label: title
          }
        ]"
        :menu="{ icon: 'icon-apps' }"
        @change="handleSelectChange"
      ></Breadcrumb>
    </BreadWrapper>
    <ComCard
      class="relative"
      :style="{
        maxWidth:
          pageAction === PageAction.VIEW ? `${InputWidth.XLARGE}px` : '100%'
      }"
    >
      <GroupTitle
        :bordered="false"
        :title="$t('common.title.basicInfo')"
        flex-start
        :show-edit="
          pageAction === PageAction.VIEW &&
          userStore.hasProjectResourceActions({
            resource: Resources.Environments,
            environmentID: id,
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
          :hide-label="pageAction === PageAction.EDIT"
          :rules="[
            {
              required: pageAction === PageAction.EDIT,
              match: validateLabelNameRegx,
              message: $t('common.validate.labelName')
            }
          ]"
        >
          <seal-input
            v-if="pageAction === PageAction.EDIT"
            v-model="formData.name"
            :disabled="!!id && !environmentId"
            :label="$t('operation.environments.table.name')"
            :required="true"
            :style="{ width: `${InputWidth.LARGE}px` }"
            :max-length="63"
            show-word-limit
          ></seal-input>
          <span v-else class="readonly-view-label">{{
            formData.name || '-'
          }}</span>
          <template v-if="pageAction === PageAction.EDIT" #extra>
            <div :style="{ maxWidth: `${InputWidth.LARGE}px` }">{{
              $t('common.validate.labelName')
            }}</div>
          </template>
        </a-form-item>
        <a-form-item
          :label="$t('applications.environment.type')"
          :hide-label="pageAction === PageAction.EDIT"
          hide-asterisk
          field="type"
          :rules="[
            {
              required: true,
              message: $t('applications.environment.rule.type')
            }
          ]"
        >
          <seal-select
            v-if="pageAction === PageAction.EDIT"
            v-model="formData.type"
            :label="$t('applications.environment.type')"
            :required="true"
            :disabled="!!id"
            :options="EnvironmentTypeList"
            :style="{ width: `${InputWidth.LARGE}px` }"
            @change="handleEnvironmentTypeChange"
          ></seal-select>
          <span v-else class="readonly-view-label">{{
            $t(EnvironmentTypeMap[formData.type] || '')
          }}</span>
        </a-form-item>
        <a-form-item
          :label="$t('operation.environments.table.description')"
          field="description"
          :hide-label="pageAction === PageAction.EDIT"
        >
          <seal-textarea
            v-if="pageAction === PageAction.EDIT"
            v-model="formData.description"
            :label="$t('operation.environments.table.description')"
            :style="{ width: `${InputWidth.LARGE}px` }"
            :max-length="200"
            show-word-limit
            :auto-size="{ minRows: 6, maxRows: 10 }"
          ></seal-textarea>
          <div v-else class="description-content readonly-view-label">{{
            formData.description || '-'
          }}</div>
        </a-form-item>

        <a-form-item
          :label="$t(`applications.projects.form.label`)"
          :hide-label="pageAction === PageAction.EDIT"
        >
          <SealFormItemWrap
            v-if="pageAction === PageAction.EDIT"
            :label="$t(`applications.projects.form.label`)"
            :style="{ width: `${InputWidth.LARGE}px` }"
          >
            <a-space
              v-if="labelList.length"
              style="display: flex; flex-direction: column; width: 100%"
              direction="vertical"
            >
              <xInputGroup
                v-for="(sItem, sIndex) in labelList"
                :key="sIndex"
                v-model:dataKey="sItem.key"
                v-model:dataValue="sItem.value"
                v-model:value="formData.labels"
                :trigger-validate="validateTrigger"
                :max-length="Infinity"
                :show-word-limit="false"
                :show-required-mark="false"
                :label-list="labelList"
                :data-item="{
                  style: {
                    key: {
                      'display': 'flex',
                      'flex': 1,
                      'align-items': 'center'
                    }
                  }
                }"
                :position="sIndex"
                always-delete
                should-key
                @add="(obj) => handleAddLabel(obj, labelList)"
                @delete="handleDeleteLabel(labelList, sIndex)"
              ></xInputGroup>
            </a-space>
            <template v-else>
              <thumbButton
                :size="24"
                font-size="14px"
                @click="handleAddLabel(labelItem, labelList)"
              ></thumbButton>
            </template>
          </SealFormItemWrap>
          <div v-else class="readonly-view-label">
            <LabelsList :labels="formData.labels"></LabelsList>
          </div>
        </a-form-item>
        <GroupTitle
          class="m-t-20"
          :bordered="false"
          :title="$t('operation.connectors.table.connector')"
          flex-start
        >
          <template #title>
            <span class="flex flex-align-center">
              {{ $t('operation.connectors.table.connector') }}
              <a-tooltip
                :content="$t('applications.environment.connector.tips')"
              >
                <icon-info-circle class="m-l-2" /> </a-tooltip
            ></span>
          </template>
        </GroupTitle>
        <a-form-item
          :label="$t('operation.connectors.menu')"
          field="connectorIDs"
          :hide-label="true"
          :validate-trigger="['change']"
        >
          <div>
            <div style="display: flex; margin-bottom: 10px">
              <a-button
                v-if="pageAction === PageAction.EDIT"
                type="primary"
                :disabled="!formData.type"
                style="margin-right: 8px; padding: 0 6px"
                @click.stop="handleAddConnector"
              >
                <template #icon>
                  <icon-plus />
                </template>
                {{ $t('operation.environments.detail.addConnector') }}
              </a-button>
              <ConnectorSelector
                v-if="showModal"
                v-model:show="showModal"
                v-model:connectorIDs="formData.connectorIDs"
                :selected="selectedList"
                :list="connectorList"
                :placeholder="$t('operation.environments.detail.holder')"
                @confirm="handleConnectorChange"
              ></ConnectorSelector>
            </div>
            <connectorsTable
              :style="{
                'max-width': '800px',
                'min-width': '400px'
              }"
              :action="pageAction"
              :list="formData?.edges || []"
              @delete="handleDeleteConnector"
            ></connectorsTable>
          </div>
        </a-form-item>
        <GroupTitle
          v-if="environmentId"
          class="m-t-20"
          :bordered="false"
          :title="$t('menu.operatorHub.variables')"
          flex-start
        ></GroupTitle>
        <a-form-item
          v-if="environmentId"
          :hide-label="pageAction === PageAction.EDIT"
          :label="$t('menu.operatorHub.variables')"
        >
          <VariablesSelector
            ref="variablesRef"
            v-model:selected-list="formData.variables"
            :style="{ width: `${InputWidth.XLARGE}px`, overflow: 'auto' }"
          ></VariablesSelector>
        </a-form-item>
        <a-form-item
          v-if="environmentId"
          no-style
          :hide-label="pageAction === PageAction.EDIT"
          :label="$t('applications.applications.table.service')"
        >
          <div>
            <CloneService
              ref="serviceRef"
              key="serviceRef"
              v-model:hint-data="completeData"
              :data-list="serviceList"
              :title="$t('applications.applications.table.service')"
              clone-type="environment"
              resource-type="service"
              :style="{ width: `${InputWidth.XLARGE}px`, overflow: 'auto' }"
            ></CloneService>
            <CloneService
              key="resourceRef"
              ref="resourceRef"
              v-model:hint-data="completeData"
              :data-list="resourceList"
              :title="$t('applications.applications.table.resource')"
              clone-type="environment"
              resource-type="resource"
              :style="{ width: `${InputWidth.XLARGE}px`, overflow: 'auto' }"
            ></CloneService>
          </div>
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
  import {
    PageAction,
    validateLabelNameRegx,
    InputWidth,
    EnvironmentTypeMap
  } from '@/views/config';
  import { ref, computed, provide } from 'vue';
  import _, {
    each,
    includes,
    map,
    remove,
    get,
    isEqual,
    cloneDeep
  } from 'lodash';
  import GroupTitle from '@/components/group-title/index.vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import useScrollToView from '@/hooks/use-scroll-to-view';
  import { onBeforeRouteLeave } from 'vue-router';
  import { queryConnectors } from '@/views/operation-hub/connectors/api';
  import usePageAction from '@/hooks/use-page-action';
  import thumbButton from '@/components/buttons/thumb-button.vue';
  import xInputGroup from '@/components/form-create/custom-components/x-input-group.vue';
  import useLabelsActions from '@/components/form-create/hooks/use-labels-action';
  import useProjectBreadcrumbData from '@/views/application-management/projects/hooks/use-project-breadcrumb-data';
  import useCompleteData from '@/views/application-management/services/hooks/use-complete-data';
  import { BreadcrumbOptions } from '@/views/config/interface';
  import CloneService from '../components/clone-service.vue';
  import { EnvironFormData } from '../config/interface';
  import connectorsTable from '../components/connectors.vue';
  import ConnectorSelector from '../components/connector-selector.vue';
  import LabelsList from '../../services/components/labels-list.vue';
  import VariablesSelector from '../components/variables-selector.vue';
  import {
    createEnvironment,
    cloneEnvironment,
    updateEnvironment,
    queryItemEnvironments
  } from '../api';

  const {
    setCompleteData,
    getProjectVariables,
    getServiceList,
    serviceDataList,
    completeData,
    setAllTemplateVersions
  } = useCompleteData();
  const { getProjectList, setProjectList, initBreadValues, handleBreadChange } =
    useProjectBreadcrumbData();
  const { scrollToView } = useScrollToView();
  const userStore = useUserStore();
  const tabBarStore = useTabBarStore();
  const { router, route, t } = useCallCommon();
  const { pageAction, handleEdit } = usePageAction();
  const id = route.query.id as string;
  const environmentId = route.params.environmentId as string; // only in clone
  const formref = ref();
  const serviceRef = ref(); // only in clone
  const resourceRef = ref(); // only in clone
  const serviceList = ref<any[]>([]);
  const resourceList = ref<any[]>([]);
  const connectorList = ref<
    { label: string; value: string; project?: object; tips?: string }[]
  >([]);
  const showModal = ref(false);
  const submitLoading = ref(false);
  const breadCrumbList = ref<BreadcrumbOptions[]>([]);
  let copyFormData: any = {};
  const selectedList = ref<string[]>([]);
  const variablesRef = ref();

  const formData = ref<EnvironFormData>({
    projectID: route.params.projectId as string,
    name: '',
    type: '',
    description: '',
    connectorIDs: [],
    connectors: [],
    variables: [],
    edges: [],
    labels: {},
    resources: []
  });
  const {
    labelList,
    labelItem,
    validateLabel,
    validateTrigger,
    handleAddLabel,
    handleDeleteLabel,
    getLabelList
  } = useLabelsActions(formData);

  const EnvironmentTypeList = computed(() => {
    return _.map(userStore.applicableEnvironmentTypes, (item) => {
      return {
        label: t(EnvironmentTypeMap[item] || ''),
        value: item
      };
    });
  });
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

    breadCrumbList.value = [...list];

    const projectList = await getProjectList();
    const projectRes = await setProjectList(projectList);
    breadCrumbList.value = [
      {
        ...projectRes
      }
    ];
  };

  const setFormDataConnectors = (connectors) => {
    formData.value.edges = [];
    each(connectorList.value, (item) => {
      if (includes(connectors, item.value)) {
        formData.value?.edges?.push(item);
      }
    });
    formData.value.connectors = map(formData.value.connectorIDs, (val) => {
      const connector = connectorList.value.find((item) => {
        return item.value === val;
      });
      if (connector && connector.project) {
        return {
          connector: {
            id: val,
            project: connector.project
          }
        };
      }
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
        type: '',
        description: '',
        connectorIDs: [],
        connectors: [],
        edges: []
      };
    }
  };

  const getConnectors = async () => {
    try {
      const params = {
        page: -1,
        applicableEnvironmentType: formData.value.type,
        withGlobal: true
      };
      const { data } = await queryConnectors(params);
      const list = data?.items || [];
      connectorList.value = map(list, (item: any) => {
        item.value = item.id;
        item.label = item.name;
        item.tips = !item.project ? 'applications.variable.scope.global' : '';
        return item;
      }) as Array<{ label: string; value: string }>;
    } catch (error) {
      connectorList.value = [];
    }
  };
  const handleAddConnector = () => {
    showModal.value = true;
  };

  const handleEnvironmentTypeChange = () => {
    selectedList.value = [];
    formData.value.connectorIDs = [];
    formData.value.connectors = [];
    formData.value.edges = [];
    getConnectors();
  };
  const handleConnectorChange = (values) => {
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
  const handleCloneEnvironment = async (data) => {
    const services = serviceRef.value.getSelectServiceData();
    const resources = resourceRef.value.getSelectServiceData();
    data.resources = [..._.cloneDeep(services), ..._.cloneDeep(resources)];
    return data;
  };

  const handleSubmit = async () => {
    const res = await formref.value?.validate();
    validateLabel();
    scrollToView();
    if (!res && !validateTrigger.value) {
      try {
        submitLoading.value = true;
        const data = _.omit(formData.value, ['edges']);
        if (environmentId) {
          handleCloneEnvironment(data);
        }
        if (id && !environmentId) {
          await updateEnvironment(data);
        } else if (environmentId) {
          await cloneEnvironment(data, environmentId);
        } else if (!id && !environmentId) {
          await createEnvironment(data);
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

  const initCloneEnvironmentResource = async () => {
    if (!environmentId) return;
    try {
      serviceList.value = await getServiceList({
        isService: true,
        extract: ['-projectId', '-status']
      });
      resourceList.value = await getServiceList({
        isService: false,
        extract: ['-projectId', '-status']
      });
      await getProjectVariables();
      serviceDataList.value = [
        ..._.cloneDeep(serviceList.value),
        ..._.cloneDeep(resourceList.value)
      ];
      setAllTemplateVersions(serviceDataList.value);
      setCompleteData();
    } catch (error) {
      // ingore
    }
  };
  const init = async () => {
    setBreadCrumbList();
    await getConnectors();
    await getItemEnvironmentInfo();
    getLabelList();
    // only in clone: default select all variables
    variablesRef.value?.selectAllVars();
    initCloneEnvironmentResource();
  };

  init();
</script>

<script lang="ts">
  export default {
    name: PROJECT.EnvEdit
  };
</script>

<style></style>

<template>
  <div>
    <BreadWrapper v-if="route.name !== PROJECT.EnvDetail">
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
      :padding="
        route.name === PROJECT.EnvDetail
          ? '0'
          : `20px var(--card-content-padding)`
      "
    >
      <GroupTitle
        :bordered="false"
        :title="$t('common.title.basicInfo')"
        flex-start
        :show-edit="showEdit()"
        @edit="handleEdit"
      ></GroupTitle>
      <a-form
        ref="formref"
        :model="formData"
        auto-label-width
        @change="handleFormChange"
      >
        <a-form-item
          :label="$t('operation.environments.table.name')"
          field="metadata.name"
          :validate-trigger="['change', 'input']"
          :hide-label="true"
          :rules="[
            {
              required: true,
              message: $t('common.rule.name')
            },
            {
              required: true,
              match: validateLabelNameRegx,
              message: $t('common.validate.labelName')
            }
          ]"
        >
          <seal-input
            v-model.trim="formData.metadata.name"
            :view-status="pageAction === PageAction.VIEW"
            :disabled="!!envName && !isCloneAction"
            :label="$t('operation.environments.table.name')"
            :required="true"
            :style="{ width: `${InputWidth.LARGE}px` }"
            :max-length="validateInputLength.NAME"
            show-word-limit
          >
          </seal-input>
        </a-form-item>
        <a-form-item
          :label="$t('applications.environment.type')"
          :hide-label="true"
          hide-asterisk
          field="spec.type"
          :rules="[
            {
              required: true,
              message: $t('applications.environment.rule.type')
            }
          ]"
        >
          <seal-select
            v-model="formData.spec.type"
            :view-status="pageAction === PageAction.VIEW"
            :label="$t('applications.environment.type')"
            :required="true"
            :is-locale="true"
            :disabled="!!envName && !isCloneAction"
            :options="EnvironmentTypeList"
            :style="{ width: `${InputWidth.LARGE}px` }"
            @change="handleEnvironmentTypeChange"
          ></seal-select>
        </a-form-item>
        <a-form-item
          :label="$t('operation.environments.table.description')"
          field="spec.description"
          :hide-label="true"
          validate-trigger="change"
        >
          <seal-textarea
            v-model="formData.spec.description"
            :view-status="pageAction === PageAction.VIEW"
            :label="$t('operation.environments.table.description')"
            :style="{ width: `${InputWidth.LARGE}px` }"
            :max-length="200"
            show-word-limit
            :auto-size="{ minRows: 4, maxRows: 6 }"
          ></seal-textarea>
        </a-form-item>

        <a-form-item
          :label="$t(`applications.projects.form.label`)"
          :hide-label="true"
          field="metadata.labels"
          validate-trigger="change"
          :rules="[
            {
              required: false,
              validator(val, callback) {
                if (!labelsData.list.length) {
                  callback();
                  return;
                }
                const valid = _.some(labelsData.list, (item) => {
                  return !_.trim(item.key);
                });
                if (valid) {
                  callback(t('resource.definition.detail.rules.labelKey'));
                  return;
                }
                callback();
              },
              message: $t('common.rule.object.key')
            }
          ]"
        >
          <SealFormItemWrap
            :label="$t(`applications.projects.form.label`)"
            :style="{ width: `${InputWidth.LARGE}px` }"
          >
            <keyValueLabels
              v-model:value="formData.metadata.labels"
              v-model:labelList="labelsData.list"
              :validate-trigger="validateTrigger"
              :labels="labelsData.labels"
              :page-action="pageAction"
            ></keyValueLabels>
          </SealFormItemWrap>
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
            <div
              v-if="pageAction === PageAction.EDIT || showModal"
              style="display: flex; margin-bottom: 10px"
            >
              <a-button
                v-if="pageAction === PageAction.EDIT"
                type="primary"
                :disabled="!formData.spec.type"
                style="margin-right: 8px"
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
                v-model:connectorIDs="selectedList"
                :selected="selectedList"
                :list="selectConnectorOptions"
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
              :list="selectedConnectorList"
              @delete="handleDeleteConnector"
            ></connectorsTable>
          </div>
        </a-form-item>
        <!-- <GroupTitle
          v-if="isCloneAction"
          class="m-t-20"
          :bordered="false"
          :title="$t('menu.operatorHub.variables')"
          flex-start
        ></GroupTitle> -->
        <!-- <a-form-item
          v-if="isCloneAction"
          :hide-label="pageAction === PageAction.EDIT"
          :label="$t('menu.operatorHub.variables')"
        >
          <VariablesSelector
            ref="variablesRef"
            v-model:selected-list="formData.variables"
            :style="{ width: `${InputWidth.XLARGE}px`, overflow: 'auto' }"
          ></VariablesSelector>
        </a-form-item> -->
        <!-- <a-form-item
          v-if="isCloneAction"
          no-style
          :hide-label="pageAction === PageAction.EDIT"
        >
          <div>
            <CloneService
              key="resourceRef"
              ref="resourceRef"
              :hint-data="cloneCompleteData"
              :data-list="resourceList"
              :title="$t('menu.applicationManagement.resource')"
              clone-type="environment"
              resource-type="resource"
              :style="{ width: `${InputWidth.XLARGE}px`, overflow: 'auto' }"
            ></CloneService>
          </div>
        </a-form-item> -->
      </a-form>
      <EditPageFooter v-if="pageAction === PageAction.EDIT">
        <template #save>
          <a-button
            v-if="!isCloneAction"
            type="primary"
            class="cap-title cancel-btn"
            :loading="submitLoading"
            @click="() => handleSubmit()"
            >{{ $t('common.button.save') }}</a-button
          >
          <GroupButtonMenu
            v-else
            :loading="submitLoading"
            :actions="SaveActions"
            position="br"
            trigger="hover"
            @select="handleSelect"
          >
          </GroupButtonMenu>
        </template>
        <a-button
          type="outline"
          :disabled="!isFormChanged && route.name === PROJECT.EnvDetail"
          class="cap-title cancel-btn"
          @click="handleCancel"
          >{{ $t('common.button.cancel') }}</a-button
        >
      </EditPageFooter>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import i18n from '@/locale';
  import { handleBatchRequest } from '@/views/config/utils';
  import { PROJECT } from '@/router/config';
  import { Resources } from '@/permissions/config';
  import { useUserStore, useTabBarStore } from '@/store';
  import {
    PageAction,
    validateLabelNameRegx,
    validateInputLength,
    InputWidth,
    EnvironmentTypeMap,
    EnvironmentTypeOrder,
    SaveActions,
    HintKeyMaps
  } from '@/views/config';
  import { ref, computed, provide, onMounted, nextTick } from 'vue';
  import _, {
    each,
    includes,
    map,
    remove,
    get,
    isEqual,
    cloneDeep
  } from 'lodash';
  import { execSucceed } from '@/utils/monitor';
  import keyValueLabels from '@/components/form-create/custom-components/key-value-labels.vue';
  import GroupButtonMenu from '@/components/drop-button-group/group-button-menu.vue';
  import GroupTitle from '@/components/group-title/index.vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import useScrollToView from '@/hooks/use-scroll-to-view';
  import { onBeforeRouteLeave } from 'vue-router';
  import { queryConnectors } from '@/views/operation-hub/connectors/api';
  import usePageAction from '@/hooks/use-page-action';
  import useProjectBreadcrumbData from '@/views/application-management/projects/hooks/use-project-breadcrumb-data';
  import useCompleteData from '@/views/application-management/services/hooks/use-complete-data';
  import { BreadcrumbOptions } from '@/views/config/interface';
  import { queryProjectVairables } from '@/views/application-management/variables/api';
  import CloneService from '../components/clone-service.vue';
  import { EnvironFormData, ConnectorBindsFormData } from '../config/interface';
  import connectorsTable from '../components/connectors.vue';
  import ConnectorSelector from '../components/connector-selector.vue';
  import VariablesSelector from '../components/variables-selector.vue';
  import {
    createEnvironment,
    cloneEnvironment,
    updateEnvironment,
    queryItemEnvironments,
    queryEnvironmentConnectorBinds,
    addEnvironmentConnectorBinds,
    apiVersion,
    ResourceKinds,
    GlobalNamespace
  } from '../api';

  const {
    setCompleteData,
    getServiceList,
    serviceDataList,
    completeData,
    setAllTemplateVersions,
    getAllResourceDefinitions
  } = useCompleteData();
  const { getProjectList, setProjectList, initBreadValues, handleBreadChange } =
    useProjectBreadcrumbData();
  const { scrollToView } = useScrollToView();
  const userStore = useUserStore();
  const tabBarStore = useTabBarStore();
  const { router, route, t } = useCallCommon();
  const { pageAction, handleEdit } = usePageAction();
  const envName = route.query.name as string;
  const isCloneAction = route.params.clone as string; // only in clone
  const environmentName = route.params.environmentName as string;
  const projectName = route.params.projectName as string;
  const formref = ref();
  const resourceRef = ref(); // only in clone
  const resourceList = ref<any[]>([]);
  const connectorList = ref<
    {
      label: string;
      value: string;
      project?: object;
      tips?: string;
      applicableEnvironmentType: string;
    }[]
  >([]);
  const isFormChanged = ref(false);
  const showModal = ref(false);
  const submitLoading = ref(false);
  const breadCrumbList = ref<BreadcrumbOptions[]>([]);
  let copyFormData: any = {};
  const selectedList = ref<string[]>([]);
  const variablesRef = ref();
  const validateTrigger = ref(false);
  const labelsData = ref<any>({
    labels: {},
    list: []
  });
  const projectVariables = ref<any[]>([]);

  const formData = ref<EnvironFormData>({
    apiVersion,
    kind: ResourceKinds.Environment,
    metadata: {
      namespace: projectName,
      name: '',
      labels: {}
    },
    spec: {
      type: '',
      description: ''
    }
  });

  const connectorBindsFormData = ref<ConnectorBindsFormData>({
    apiVersion,
    kind: ResourceKinds.ConnectorBinding,
    metadata: {
      namespace: formData.value.metadata.name,
      name: ''
    },
    spec: {
      connector: {
        name: '',
        namespace: ''
      }
    }
  });

  const selectedConnectorList = computed(() => {
    return _.map(selectedList.value, (item) => {
      return connectorList.value.find((o) => o.value === item);
    });
  });

  const cloneCompleteData = computed(() => {
    const variables = _.map(formData.value.variables, (item) => {
      return {
        value: item.name,
        label: item.name,
        tips: item.value,
        showTips: false,
        sensitive: item.sensitive
      };
    });
    return {
      ...completeData.value,
      [HintKeyMaps.var]: [...projectVariables.value, ...variables]
    };
  });
  const EnvironmentTypeList = computed(() => {
    // userStore.applicableEnvironmentTypes
    return _.map(_.keys(EnvironmentTypeMap), (item) => {
      return {
        label: t(EnvironmentTypeMap[item] || ''),
        value: item,
        order: EnvironmentTypeOrder[item]
      };
    }).sort((a, b) => a.order - b.order);
  });
  const selectConnectorOptions = computed(() => {
    return _.filter(connectorList.value, (item) => {
      return item.applicableEnvironmentType === formData.value.spec.type;
    });
  });
  const title = computed(() => {
    // only in clone
    if (isCloneAction) {
      return t('applications.environment.clone');
    }
    if (!envName) {
      return t('operation.environments.create');
    }
    if (envName && pageAction.value === PageAction.EDIT) {
      return t('operation.environments.edit');
    }
    return t('operation.environments.view');
  });

  const handleFormChange = () => {
    if (route.name !== PROJECT.EnvDetail) {
      return;
    }
    isFormChanged.value = !_.isEqual(copyFormData, formData.value);
  };
  const initPageAction = () => {
    if (route.name === PROJECT.EnvDetail) {
      pageAction.value = userStore.hasProjectResourceActions({
        resource: Resources.Environments,
        environmentID: envName,
        projectID: route.params.projectName,
        actions: ['POST']
      })
        ? PageAction.EDIT
        : PageAction.VIEW;
    }
  };
  const showEdit = () => {
    if (route.name === PROJECT.EnvDetail) {
      return false;
    }
    const hasPermission = userStore.hasProjectResourceActions({
      resource: Resources.Environments,
      environmentID: envName,
      projectID: route.params.projectName,
      actions: ['POST']
    });
    return pageAction.value === PageAction.VIEW && hasPermission;
  };
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

  const getItemEnvironmentInfo = async () => {
    copyFormData = cloneDeep(formData.value);
    if (!envName) return;
    try {
      const { data } = await queryItemEnvironments({
        environmentName: envName,
        namespace: projectName
      });
      formData.value = data;
      // only in clone
      formData.value.metadata.name = isCloneAction
        ? `${formData.value.metadata.name}-clone`
        : formData.value.metadata.name;
      copyFormData = cloneDeep(formData.value);
    } catch (error) {
      formData.value = {
        apiVersion,
        kind: ResourceKinds.Environment,
        metadata: {
          namespace: projectName,
          name: '',
          labels: {}
        },
        spec: {
          type: '',
          description: ''
        }
      };
    }
  };

  const getConnectors = async (namespace) => {
    if (!namespace || !formData.value.spec.type) return [];
    try {
      const params = {
        namespace,
        applicableEnvironmentType: formData.value.spec.type,
        withGlobal: true
      };
      const { data } = await queryConnectors(params);
      const list = data?.items || [];
      return map(list, (item: any) => {
        return {
          ...item,
          value: item.metadata.name,
          label: item.metadata.name,
          applicableEnvironmentType: item.spec.applicableEnvironmentType,
          tips: !item.status.project ? 'applications.variable.scope.global' : ''
        };
      });
    } catch (error) {
      return [];
    }
  };
  const getConnectorsList = async () => {
    const res = await Promise.all([
      getConnectors(GlobalNamespace),
      getConnectors(projectName)
    ]);
    connectorList.value = [...res[0], ...res[1]];
  };
  const handleAddConnector = () => {
    showModal.value = true;
  };

  const handleEnvironmentTypeChange = () => {
    selectedList.value = [];
    getConnectorsList();
  };
  const handleConnectorChange = (values) => {};

  const handleDeleteConnector = (conName) => {
    remove(selectedList.value, (item) => {
      return item === conName.value;
    });
  };
  const handleCloneEnvironment = (data) => {
    const resources = resourceRef.value.getSelectServiceData();
    data.resources = [..._.cloneDeep(resources)];
    return data;
  };

  const updateConnectorBinds = async () => {
    try {
      const paramsList = _.map(selectedList.value, (item) => {
        const connectorData = _.find(connectorList.value, { value: item });
        return {
          namespace: envName,
          data: {
            apiVersion,
            kind: ResourceKinds.ConnectorBinding,
            metadata: {
              namespace: formData.value.metadata.name,
              name: item
            },
            spec: {
              connector: {
                name: item,
                namespace: connectorData?.metadata.namespace
              }
            }
          }
        };
      });
      await handleBatchRequest(paramsList, addEnvironmentConnectorBinds);
    } catch (error) {
      // ingore
    }
  };
  const handleSubmit = async () => {
    const res = await formref.value?.validate();
    validateTrigger.value = true;
    scrollToView();
    if (!res) {
      try {
        submitLoading.value = true;

        if (isCloneAction) {
          handleCloneEnvironment(formData.value);
        }
        if (envName && !isCloneAction) {
          await updateEnvironment({
            data: formData.value,
            name: envName,
            namespace: projectName
          });
          await updateConnectorBinds();
        } else if (isCloneAction) {
          await cloneEnvironment(formData.value, environmentName);
        } else if (!envName && !environmentName) {
          await createEnvironment({
            data: formData.value,
            namespace: projectName
          });
          await updateConnectorBinds();
        }
        copyFormData = cloneDeep(formData.value);
        tabBarStore.deleteTag(0, {
          title: '',
          name: PROJECT.Detail,
          fullPath: ''
        });
        if (route.name !== PROJECT.EnvDetail) {
          router.back();
        } else {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
        execSucceed();
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
      }
      return true;
    }
    return false;
  };
  const handleSelect = (value) => {
    _.omit(formData.value, ['preview', 'draft']);

    if (value === 'preview') {
      formData.value.spec.preview = true;
    }
    if (value === 'draft') {
      formData.value.spec.draft = true;
    }
    handleSubmit();
  };
  const getProjectVariables = async () => {
    try {
      const params = {
        namespace: projectName
      };
      const { data } = await queryProjectVairables(params);
      projectVariables.value = _.map(data?.items || [], (item) => {
        return {
          label: item.metadata.name,
          value: item.metadata.name,
          tips: item.status.value,
          showTips: false,
          sensitive: item.spec.sensitive
        };
      });
    } catch (error) {
      projectVariables.value = [];
    }
  };

  const getEnvironmentConnectorBinds = async () => {
    try {
      const { data } = await queryEnvironmentConnectorBinds({
        namespace: envName
      });
      selectedList.value = _.map(data?.items || [], (item) => {
        return item.metadata.name;
      });
    } catch (error) {
      selectedList.value = [];
    }
  };
  const cancelCallback = () => {
    if (route.name === PROJECT.EnvDetail) {
      getItemEnvironmentInfo();
      return;
    }
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
    if (!isCloneAction) return;
    try {
      resourceList.value = await getServiceList({
        extract: ['-projectId', '-status']
      });
      await getProjectVariables();
      await getAllResourceDefinitions();
      serviceDataList.value = [..._.cloneDeep(resourceList.value)];
      setAllTemplateVersions(serviceDataList.value);
      setCompleteData();
    } catch (error) {
      // ingore
    }
  };
  const setLabels = () => {
    labelsData.value.labels = _.cloneDeep(formData.value.metadata.labels);
  };
  const init = async () => {
    setBreadCrumbList();
    await getConnectorsList();
    await Promise.all([
      getItemEnvironmentInfo(),
      getEnvironmentConnectorBinds()
    ]);

    // only in clone: default select all variables
    variablesRef.value?.selectAllVars();
    initCloneEnvironmentResource();
    initPageAction();
    setLabels();
  };
  onMounted(() => {
    nextTick(() => {
      isFormChanged.value = false;
    });
  });
  init();
</script>

<script lang="ts">
  export default {
    name: PROJECT.EnvEdit
  };
</script>

<style></style>

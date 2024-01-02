<template>
  <div>
    <BreadWrapper v-if="pgType === 'page'">
      <Breadcrumb
        :items="breadCrumbList"
        :menu="{ icon: 'icon-apps' }"
        @change="handleSelectChange"
      ></Breadcrumb>
    </BreadWrapper>
    <ComCard
      :padding="pgType === 'page' ? '20px var(--card-content-padding)' : 0"
    >
      <GroupTitle
        :title="$t('common.title.basicInfo')"
        :bordered="false"
        flex-start
      ></GroupTitle>
      <a-form
        ref="formref"
        :model="formData"
        auto-label-width
        layout="vertical"
      >
        <a-form-item
          field="name"
          hide-label
          :label="$t('common.table.name')"
          :disabled="pageAction === PageAction.EDIT && !!id"
          :validate-trigger="['change', 'input']"
          :rules="[
            {
              required: true,
              message: $t('common.rule.name')
            },
            {
              required: true,
              match: validateLabelNameRegx,
              message: $t('common.validate.labelName')
            },
            {
              validator: validateNameuniq,
              message: $t('applications.applications.rule.modules.name')
            }
          ]"
        >
          <seal-input
            v-model.trim="formData.name"
            allow-clear
            :required="true"
            :placeholder="$t('common.table.name')"
            :style="{ width: `${InputWidth.LARGE}px` }"
            :max-length="63"
            show-word-limit
          ></seal-input>
          <!-- <template #extra>
            <div
              class="tips"
              :style="{ 'max-width': `${InputWidth.LARGE}px` }"
              >{{ $t('common.validate.labelName') }}</div
            >
          </template> -->
        </a-form-item>
        <a-form-item hide-label>
          <SealFormItemWrap
            :label="$t('applications.applications.form.useTemplate')"
            :style="{ width: `${InputWidth.LARGE}px` }"
          >
            <a-switch
              :model-value="dataType === ServiceDataType.service"
              :disabled="pageAction === PageAction.EDIT && !!id"
              size="small"
              @change="handleDataTypeChange"
            ></a-switch>
          </SealFormItemWrap>
        </a-form-item>
        <a-form-item
          v-if="dataType === ServiceDataType.resource"
          hide-label
          field="type"
          :label="$t('applications.applications.table.resourceType')"
          :disabled="pageAction === PageAction.EDIT && !!id"
          :rules="[
            {
              required: true,
              message: $t('applications.applications.rules.reourceType')
            }
          ]"
        >
          <div>
            <seal-select
              v-model="formData.type"
              :label="$t('applications.applications.table.resourceType')"
              :required="true"
              :virtual-list-props="virtualListProps"
              :style="{ width: `${InputWidth.LARGE}px` }"
              :options="templateList"
              allow-search
              @change="handleTemplateChange"
            >
            </seal-select>
          </div>
        </a-form-item>
        <a-form-item
          v-if="dataType === ServiceDataType.service"
          hide-label
          field="template.template.id"
          :label="$t('applications.applications.table.module')"
          :disabled="pageAction === PageAction.EDIT && !!id"
          :rules="[
            {
              required: true,
              message: $t('applications.applications.rules.modules')
            }
          ]"
        >
          <div>
            <seal-select
              v-model="formData.template.template.id"
              :label="$t('applications.applications.table.module')"
              :required="true"
              :virtual-list-props="virtualListProps"
              :style="{ width: `${InputWidth.LARGE}px` }"
              :options="templateList"
              :format-label="formatTemplateLael"
              allow-search
              @change="handleTemplateChange"
            >
              <template #option="{ data }">
                <span>{{ data.label }}</span>
                <span
                  v-if="
                    !data.project?.id && dataType === ServiceDataType.service
                  "
                  style="color: var(--color-text-3)"
                  class="font-12"
                  >{{ `(${$t('applications.variable.scope.global')})` }}</span
                >
              </template>
            </seal-select>
          </div>
        </a-form-item>
        <a-form-item
          v-if="dataType === ServiceDataType.service"
          hide-label
          field="template.version"
          :label="$t('applications.applications.history.version')"
          :rules="[
            {
              required: true,
              message: $t('applications.applications.rules.versions')
            }
          ]"
        >
          <div>
            <seal-select
              v-model="formData.template.version"
              :options="[]"
              :required="true"
              :placeholder="$t('applications.applications.history.version')"
              :style="{ width: `${InputWidth.LARGE}px` }"
              :loading="asyncLoading"
              @change="handleVersionChange"
            >
              <a-option
                v-for="item in templateVersionList"
                :key="item.id"
                :value="item.value"
                >{{ item.label }}</a-option
              >
            </seal-select>
          </div>
        </a-form-item>
        <a-form-item
          :label="$t(`applications.projects.form.label`)"
          hide-label
          :rules="[
            {
              required: false,
              validator(value, callback) {
                if (!validateLabels()) {
                  callback();
                  return;
                }
                callback(i18n.global.t('common.rule.object.key'));
              },
              message: i18n.global.t('common.rule.object.key')
            }
          ]"
        >
          <SealFormItemWrap
            :label="$t('applications.projects.form.label')"
            :style="{ width: `${InputWidth.LARGE}px` }"
          >
            <!-- <a-space
              v-if="labelList?.length"
              :style="{
                'display': 'flex',
                'flex-direction': 'column',
                'width': `${InputWidth.MIDDLE}px`
              }"
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
                always-delete
                should-key
                @add="(obj) => handleAddLabel(obj, labelList)"
                @delete="handleDeleteLabel(labelList, sIndex)"
              ></xInputGroup>
            </a-space> -->
            <keyValueLabels
              v-model:value="formData.labels"
              labels-key="labels"
              :validate-trigger="validateTrigger"
              :labels="formData"
              :page-action="pageAction"
            ></keyValueLabels>
            <!-- <template v-else>
              <a-link
                class="p-0"
                @click="
                  () => {
                    handleAddLabel(labelItem, labelList);
                  }
                "
              >
                <icon-plus-circle-fill
                  :size="24"
                  font-size="14px size-24"
                ></icon-plus-circle-fill>
              </a-link>
            </template> -->
          </SealFormItemWrap>
        </a-form-item>
        <a-form-item :label="$t('common.table.description')" hide-label>
          <seal-textarea
            v-model="formData.description"
            :placeholder="$t('common.table.description')"
            :max-length="200"
            show-word-limit
            :style="{ width: `${InputWidth.LARGE}px` }"
            :auto-size="{ minRows: 4, maxRows: 6 }"
          ></seal-textarea>
        </a-form-item>
      </a-form>
    </ComCard>
    <ComCard
      :padding="pgType === 'page' ? '0px var(--card-content-padding)' : 0"
    >
      <div
        v-if="_.keys(schemaVariables?.properties).length"
        style="display: flex; justify-content: flex-start"
      >
        <GroupTitle
          :bordered="false"
          style="margin-bottom: 0"
          :title="$t('applications.applications.detail.configuration')"
        >
          <template #title>
            <div>
              <span>{{
                $t('applications.applications.detail.configuration')
              }}</span>
              <a-tooltip position="tl">
                <template #content>
                  <div>
                    <div>{{
                      $t('applications.applications.modules.params.title')
                    }}</div>
                    <div>{{
                      $t('applications.applications.modules.params.tips2')
                    }}</div>
                    <div>{{
                      $t('applications.applications.modules.params.tips3')
                    }}</div>
                    <div>{{
                      $t('applications.applications.modules.params.tips4')
                    }}</div>
                  </div>
                </template>
                <icon-question-circle class="mleft-5" />
              </a-tooltip>
            </div>
          </template>
        </GroupTitle>
      </div>
      <a-spin style="width: 100%" :loading="asyncLoading">
        <GroupForm
          ref="groupForm"
          v-model:form-data="formData.attributes"
          :ui-form-data="uiFormData"
          :action="formAction"
          :schema="schemaVariables"
        ></GroupForm>
      </a-spin>
      <EditPageFooter>
        <template #save>
          <GroupButtonMenu
            v-if="
              _.get(serviceInfo, 'status.summaryStatus') ===
                ServiceStatus.Undeployed ||
              _.get(serviceInfo, 'status.summaryStatus') ===
                ServiceStatus.Stopped ||
              !id
            "
            :loading="submitLoading"
            :actions="SaveActions"
            @select="handleAddSelector"
          >
          </GroupButtonMenu>
          <a-button
            v-else
            :type="'primary'"
            class="cap-title"
            @click="handleOkCallback"
            >{{ $t('common.button.saveDeploy') }}</a-button
          >
        </template>
        <template #cancel>
          <a-button
            :type="'outline'"
            class="cap-title cancel-btn"
            @click="handleCancel"
            >{{ $t('common.button.cancel') }}</a-button
          >
        </template>
      </EditPageFooter>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import KuberSelect from '@/components/form-create/bussiness-components/kuber-select-bynamespace.vue';
  import { PROJECT } from '@/router/config';
  import _, { get, find, cloneDeep, reduce, pickBy, toString } from 'lodash';
  import {
    ref,
    computed,
    provide,
    watch,
    reactive,
    PropType,
    onMounted,
    nextTick
  } from 'vue';
  import i18n from '@/locale';
  import { onBeforeRouteLeave } from 'vue-router';
  import GroupButtonMenu from '@/components/drop-button-group/group-button-menu.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import useScrollToView from '@/hooks/use-scroll-to-view';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import xInputGroup from '@/components/form-create/custom-components/x-input-group.vue';
  import GroupForm from '@/components/dynamic-form/group-form.vue';
  import GroupTitle from '@/components/group-title/index.vue';
  import {
    validateLabelNameRegx,
    PageAction,
    InputWidth,
    InjectCompleteDataKey,
    InjectProjectEnvironmentKey,
    InjectShowInputHintKey,
    SaveActions,
    InjectSchemaFormStatusKey,
    InjectTraceKey
  } from '@/views/config';
  import keyValueLabels from '@/components/form-create/custom-components/key-value-labels.vue';
  import { queryEnvironmentConnector } from '@/views/application-management/environments/api';
  import { projectEnvCtxInjectionKey } from '@/components/form-create/bussiness-components/config';
  import { BreadcrumbOptions } from '@/views/config/interface';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import useLabelsActions from '@/components/form-create/hooks/use-labels-action';
  import useProjectBreadcrumbData from '../../projects/hooks/use-project-breadcrumb-data';
  import { createService, upgradeApplicationInstance } from '../api';
  import useServiceData from '../hooks/use-service-data';
  import { ServiceDataType, ServiceStatus } from '../config';

  const props = defineProps({
    // when in detail page
    pgType: {
      type: String as PropType<'page' | 'com'>,
      default() {
        return 'page';
      }
    }
  });
  const { route, router, t } = useCallCommon();
  // const dataType = ref<string>(ServiceDataType.resource);
  // const resourceTypeData = computed(() => {
  //   return { resourceType: dataType.value };
  // });
  const emits = defineEmits(['cancel', 'save']);
  const { scrollToView } = useScrollToView();
  const {
    getProjectList,
    getEnvironmentList,
    setProjectList,
    setEnvironmentList,
    handleBreadChange,
    initBreadValues
  } = useProjectBreadcrumbData();
  const {
    id,
    init,
    toggleDataType,
    getTemplateSchemaByVersion,
    setTemplateVersionList,
    getTemplateVersions,
    setTemplateInfo,
    schemaVariables,
    getItemResourceDefinition,
    dataType,
    serviceInfo,
    formData,
    uiFormData,
    pageAction,
    templateVersionList,
    serviceDataList,
    templateList,
    completeData,
    title,
    asyncLoading
  } = useServiceData();
  const {
    labelList,
    labelItem,
    handleAddLabel,
    handleDeleteLabel,
    validateLabel,
    getLabelList,
    validateTrigger
  } = useLabelsActions(formData);
  let copyFormData: any = null;
  const formref = ref();
  const groupForm = ref();
  const submitLoading = ref(false);
  const breadCrumbList = ref<BreadcrumbOptions[]>([]);
  const schemaFormCache = ref<any>({});
  const formAction = ref(!id ? PageAction.CREATE : PageAction.EDIT);
  const traceKey = ref(Date.now());
  const projectEnvCtx = reactive({
    projectID: route.params.projectId as string,
    environmentID: route.params.environmentId as string,
    connectors: []
  });

  provide(InjectCompleteDataKey, completeData);
  provide(InjectProjectEnvironmentKey, {
    projectID: route.params.projectId,
    environmentID: route.params.environmentId
  });
  provide(projectEnvCtxInjectionKey, projectEnvCtx);

  provide(InjectSchemaFormStatusKey, formAction);
  provide(InjectTraceKey, traceKey);
  const virtualListProps = computed(() => {
    if (templateList.value.length > 20) {
      return {
        height: 200
      };
    }
    return undefined;
  });

  const validateLabels = () => {
    const labels = _.get(formData.value, 'labels', {});
    const keys = _.keys(labels);
    return _.some(keys, (key) => {
      return !_.trim(key);
    });
  };

  const getEnvironmentConnectors = async () => {
    try {
      const { data } = await queryEnvironmentConnector({
        environmentID: route.params.environmentId as string,
        projectID: route.params.projectId as string
      });
      projectEnvCtx.connectors = data.connectors || [];
    } catch (error) {
      // ingore
      projectEnvCtx.connectors = [];
    }
  };
  const setBreadCrumbList = async () => {
    const [projectList, environmentList] = await Promise.all([
      getProjectList(),
      getEnvironmentList()
    ]);
    const projectRes = await setProjectList(projectList);
    const environmentRes = setEnvironmentList(environmentList);
    breadCrumbList.value = [
      { ...projectRes },
      { ...environmentRes },
      {
        type: 'menu.applicationManagement.resource',
        label: title()
      }
    ] as BreadcrumbOptions[];
  };
  const handleSelectChange = ({ value, item }) => {
    handleBreadChange(value, item);
  };
  const cancelCallback = () => {
    router.back();
  };

  const validateNameuniq = (val, callback) => {
    if (id) {
      callback();
      return;
    }
    const data = find(
      serviceDataList.value,
      (item) => get(item, 'name') === val
    );
    if (data) {
      callback(t('applications.applications.rule.modules.name'));
      return;
    }
    callback();
  };

  const getFormDataAttributeCache = () => {
    if (dataType.value === ServiceDataType.service) {
      if (
        formData.value.template?.version === copyFormData.template?.version &&
        formData.value.template?.template?.id ===
          copyFormData.template?.template?.id &&
        id
      ) {
        formData.value.attributes = _.cloneDeep(copyFormData.attributes);
        formAction.value = PageAction.EDIT;
      } else if (
        _.get(schemaFormCache.value, [formData.value.template?.version])
      ) {
        formData.value.attributes = _.cloneDeep(
          _.get(schemaFormCache.value, [formData.value.template?.version], {})
        );
      } else {
        formData.value.attributes = {};
      }

      uiFormData.value = _.cloneDeep(formData.value.attributes);
    }
  };

  const setFormDataAttributeCache = () => {
    if (dataType.value === ServiceDataType.service) {
      schemaFormCache.value[formData.value.template.version] = _.cloneDeep(
        formData.value.attributes
      );
    }
  };

  const execVersionChangeCallback = async () => {
    getFormDataAttributeCache();
    setTimeout(async () => {
      const moduleData = await getTemplateSchemaByVersion();
      setTemplateInfo(moduleData);
    }, 100);
  };

  const handleDataTypeChange = (val) => {
    dataType.value = val ? ServiceDataType.service : ServiceDataType.resource;
    formData.value.attributes = {};
    uiFormData.value = {};
    formAction.value = PageAction.CREATE;
    if (dataType.value === ServiceDataType.service) {
      formData.value.type = null as any;
      formData.value.template = {
        name: '',
        version: '',
        id: '',
        project: { id: route.params.projectId as string },
        // template info
        template: { id: '' }
      };
    }
    if (dataType.value === ServiceDataType.resource) {
      formData.value.template = null as any;
    }
    nextTick(() => {
      toggleDataType();
    });
  };

  const handleVersionChange = () => {
    formAction.value = PageAction.CREATE;
    formData.value.template.id =
      _.find(
        templateVersionList.value,
        (item) => item.value === formData.value.template.version
      )?.id || '';

    execVersionChangeCallback();
  };

  const formatTemplateLael = (data) => {
    if (!data.project?.id && ServiceDataType.service === dataType.value) {
      return `${data.name} (${t('applications.variable.scope.global')})`;
    }
    return data.name;
  };
  // template change: exec version change
  const handleTemplateChange = async (val) => {
    schemaFormCache.value = {};

    if (dataType.value === ServiceDataType.resource) {
      const data = await getItemResourceDefinition();
      setTemplateInfo(data);
      formData.value.attributes = {};
      uiFormData.value = {};
    } else {
      const data = _.find(templateList.value, (item) => item.id === val);
      formData.value.template.name = data?.name || '';
      formData.value.template.project = data?.project || {};
      await getTemplateVersions(formData.value.template, true);
      await setTemplateVersionList();

      formData.value.template.version = get(
        templateVersionList.value,
        '0.template.version',
        ''
      );

      handleVersionChange();
    }
  };

  const handleCancel = async () => {
    if (!_.isEqual(copyFormData, formData.value)) {
      beforeLeaveCallback({
        isCancel: true,
        onOk: () => {
          if (props.pgType !== 'page') {
            setTimeout(() => {
              formData.value = _.cloneDeep(copyFormData);
              groupForm.value?.refreshkey();
            }, 100);
            emits('cancel');
          } else {
            copyFormData = cloneDeep(formData.value);
            cancelCallback();
          }
        }
      });
    } else if (props.pgType !== 'page') {
      emits('cancel');
    } else {
      cancelCallback();
    }
  };

  const handleCreate = async (formData) => {
    const { data } = await createService(formData);
    if (formData.draft) {
      router.back();
      return;
    }
    router.replace({
      name: PROJECT.ServiceDetail,
      params: {
        ...route.params
      },
      query: {
        id: data.id
      }
    });
  };
  const handleOk = async (draft?: boolean) => {
    validateLabel();
    const res = await formref.value?.validate();
    const groupres = await groupForm.value?.validate();
    const hiddenFormData = groupForm.value?.getHiddenData();
    console.log(
      'groupres===',
      groupres,
      res,
      formData.value.attributes,
      validateTrigger.value
    );

    if (!res && !groupres && !validateTrigger.value) {
      try {
        submitLoading.value = true;
        if (!formData.value.template?.project?.id) {
          formData.value.template = _.omit(formData.value.template, 'project');
        }
        if (dataType.value === ServiceDataType.service) {
          formData.value.type = null as any;
        }
        formData.value.draft = draft;
        if (dataType.value === ServiceDataType.resource) {
          formData.value.template = null as any;
        }
        copyFormData = _.cloneDeep(formData.value);
        const data = _.cloneDeep(formData.value);
        data.attributes = {
          ...data.attributes,
          ...hiddenFormData
        };
        if (id) {
          await upgradeApplicationInstance(data);
        } else {
          await handleCreate(data);
          router.replace({
            name: PROJECT.EnvDetail,
            params: {
              projectId: route.params.projectId,
              environmentId: route.params.environmentId,
              action: PageAction.VIEW
            },
            query: {
              id: route.params.environmentId
            }
          });
          return;
        }
        if (props.pgType !== 'page') {
          emits('save');
        } else {
          router.back();
        }
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
      }
    } else {
      scrollToView();
    }
  };
  const handleOkCallback = () => {
    setTimeout(() => {
      handleOk();
    }, 100);
  };
  const handleAddSelector = (value) => {
    setTimeout(() => {
      if (value === 'deploy') {
        handleOk();
      }
      if (value === 'draft') {
        handleOk(true);
      }
    }, 100);
  };

  onBeforeRouteLeave(async (to, from) => {
    if (!_.isEqual(copyFormData, formData.value)) {
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
  const initData = async () => {
    const list = await initBreadValues(['env']);
    breadCrumbList.value = [
      ...list,
      {
        type: 'menu.applicationManagement.resource',
        label: title()
      }
    ] as BreadcrumbOptions[];

    await init();

    setBreadCrumbList();

    getLabelList();
    getEnvironmentConnectors();
    setTimeout(() => {
      copyFormData = _.cloneDeep(formData.value);
      if (id) {
        setFormDataAttributeCache();
      }
    }, 100);
  };

  initData();
</script>

<script lang="ts">
  export default {
    name: PROJECT.ServiceEdit
  };
</script>

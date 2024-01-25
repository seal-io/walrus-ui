<template>
  <div>
    <div>
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
            }
          ]"
        >
          <seal-input
            v-model.trim="formData.name"
            allow-clear
            :required="true"
            :placeholder="$t('common.table.name')"
            :style="{ width: `${InputWidth.LARGE}px` }"
            :max-length="validateInputLength.NAME"
            show-word-limit
          ></seal-input>
        </a-form-item>
        <a-form-item hide-label>
          <SealFormItemWrap
            :label="$t('applications.applications.form.useTemplate')"
            :style="{ width: `${InputWidth.LARGE}px` }"
          >
            <a-switch
              :model-value="dataType === ServiceDataType.service"
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
          v-if="
            dataType === ServiceDataType.service &&
            !!formData.template?.template
          "
          hide-label
          field="template.template.id"
          :label="$t('applications.applications.table.module')"
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
          v-if="dataType === ServiceDataType.service && !!formData.template"
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
              @change="(val) => handleVersionChange(val)"
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
          field="labels"
          :validate-trigger="['change']"
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
              message: i18n.global.t('common.rule.object.key')
            }
          ]"
        >
          <SealFormItemWrap
            :label="$t('applications.projects.form.label')"
            :style="{ width: `${InputWidth.LARGE}px` }"
          >
            <keyValueLabels
              v-model:value="formData.labels"
              v-model:label-list="labelsData.list"
              :validate-trigger="validateTrigger"
              :labels="labelsData.labels"
              :page-action="pageAction"
            ></keyValueLabels>
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
    </div>
    <div>
      <div style="display: flex; justify-content: flex-start">
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
              <a-tooltip position="top">
                <template #content>
                  <div>
                    <div>{{
                      $t('applications.applications.modules.params.title')
                    }}</div>
                    <div>{{
                      $t('applications.applications.modules.params.tips2')
                    }}</div>
                    <div>{{
                      $t('applications.applications.modules.params.tips4')
                    }}</div>
                    <div
                      >3.
                      {{
                        $t('applications.applications.modules.params.flowvar')
                      }}</div
                    >
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
          :schema="schemaVariables"
          @render-end="handleRenderEnd"
        ></GroupForm>
      </a-spin>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import i18n from '@/locale';
  import keyValueLabels from '@/components/form-create/custom-components/key-value-labels.vue';
  import { PROJECT } from '@/router/config';
  import _, { get, find, cloneDeep, toString } from 'lodash';
  import { createAxiosToken } from '@/api/axios-chunk-request';
  import {
    ref,
    computed,
    provide,
    watch,
    reactive,
    PropType,
    onMounted,
    inject,
    nextTick,
    onBeforeUnmount
  } from 'vue';
  import { onBeforeRouteLeave } from 'vue-router';
  import useCallCommon from '@/hooks/use-call-common';
  import useScrollToView from '@/hooks/use-scroll-to-view';
  import GroupForm from '@/components/dynamic-form/group-form.vue';
  import GroupTitle from '@/components/group-title/index.vue';
  import {
    validateLabelNameRegx,
    validateInputLength,
    PageAction,
    InputWidth,
    HintKeyMaps,
    InjectCompleteDataKey,
    InjectProjectEnvironmentKey,
    InjectShowInputHintKey,
    InjectSchemaFormStatusKey
  } from '@/views/config';
  import { queryEnvironmentConnector } from '@/views/application-management/environments/api';
  import { projectEnvCtxInjectionKey } from '@/components/dynamic-form/widgets/config';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import { InjectWorkflowKey } from '@/views/application-management/workflows/config';
  import useServiceData from '../hooks/use-service-data';
  import { ServiceDataType } from '../config';

  const props = defineProps({
    // when in detail page
    pgType: {
      type: String as PropType<'page' | 'com'>,
      default() {
        return 'page';
      }
    },
    action: {
      type: String as PropType<'edit' | 'view' | 'create'>,
      default() {
        return PageAction.CREATE;
      }
    },
    flow: {
      type: Object,
      default() {
        return {};
      }
    },
    flowStepInfo: {
      type: Object as PropType<{ enable: boolean; info: any }>,
      default() {
        return {
          enable: false,
          info: null
        };
      }
    }
  });

  const emits = defineEmits(['cancel', 'save']);
  const { scrollToView } = useScrollToView();
  const flowProps = reactive({
    ..._.cloneDeep(props)
  });

  const {
    id,
    init,
    getTemplateSchemaByVersion,
    setTemplateVersionList,
    getTemplateVersions,
    setTemplateInfo,
    getItemResourceDefinition,
    serviceInfo,
    toggleDataType,
    schemaVariables,
    formData,
    uiFormData,
    pageAction,
    templateVersionList,
    serviceDataList,
    templateList,
    completeData,
    dataType,
    asyncLoading
  } = useServiceData(flowProps);

  let copyFormData: any = null;
  const { route, router, t } = useCallCommon();
  const flowId = route.query.flowId as string;
  const formref = ref();
  const groupForm = ref();
  const validateTrigger = ref(false);
  const formAction = ref(props.action);
  const schemaFormCache = ref<any>({});
  let connectorAxiosToken: any = null;
  const projectEnvCtx = ref({
    projectID: route.params.projectId as string,
    environmentID: route.params.environmentId as string,
    connectors: []
  });
  const labelsData = ref<any>({
    labels: {},
    list: []
  });
  const workflowVariables = inject(InjectWorkflowKey, ref({}));
  provide(InjectSchemaFormStatusKey, ref(formAction));
  provide(InjectShowInputHintKey, true);
  provide(
    InjectProjectEnvironmentKey,
    ref({
      projectID: route.params.projectId,
      environmentID: route.params.environmentId
    })
  );
  provide(projectEnvCtxInjectionKey, projectEnvCtx);

  const completeDataObj = computed(() => {
    return {
      ...completeData.value,
      ...workflowVariables.value
    };
  });

  const virtualListProps = computed(() => {
    if (templateList.value.length > 20) {
      return {
        height: 200
      };
    }
    return undefined;
  });

  provide(InjectCompleteDataKey, completeDataObj);

  const handleRenderEnd = () => {
    setTimeout(() => {
      asyncLoading.value = false;
    }, 100);
  };
  const getEnvironmentConnectors = async () => {
    try {
      connectorAxiosToken?.cancel();
      connectorAxiosToken = createAxiosToken();
      const params = {
        environmentID:
          props.flow.environmentId || (route.params.environmentId as string),
        projectID: route.params.projectId as string
      };
      if (!params.environmentID || !params.projectID) return;
      const { data } = await queryEnvironmentConnector(
        params,
        connectorAxiosToken.token
      );
      projectEnvCtx.value.connectors = data.connectors || [];
    } catch (error) {
      // ingore
      projectEnvCtx.value.connectors = [];
    }
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
        props.action === PageAction.EDIT
      ) {
        formData.value.attributes = _.cloneDeep(copyFormData.attributes);
        formAction.value = PageAction.EDIT;
      } else if (
        _.get(schemaFormCache.value, [formData.value.template.version])
      ) {
        formData.value.attributes = _.cloneDeep(
          _.get(schemaFormCache.value, [formData.value.template.version], {})
        );
      } else {
        formData.value.attributes = {};
      }

      uiFormData.value = _.cloneDeep(formData.value.attributes);

      console.log('schemaFormCache===11', {
        data: formData.value,
        copy: copyFormData,
        action: formAction.value
      });
    }
  };

  // cache the user inputs when change the module version

  const execVersionChangeCallback = async () => {
    setTimeout(async () => {
      const moduleData = await getTemplateSchemaByVersion();
      setTemplateInfo(moduleData);
    });
  };

  const handleVersionChange = (val?: string) => {
    if (val && props.action === PageAction.EDIT) {
      formAction.value = PageAction.EDIT;
    } else {
      schemaFormCache.value = {};
      formData.value.attributes = {};
      uiFormData.value = {};
    }
    formData.value.template.id =
      _.find(
        templateVersionList.value,
        (item) => item.value === formData.value.template.version
      )?.id || '';
    execVersionChangeCallback();
  };

  const setFormDataAttributeCache = () => {
    if (dataType.value === ServiceDataType.service) {
      schemaFormCache.value[formData.value.template.version] = _.cloneDeep(
        formData.value.attributes
      );
    }
  };

  const formatTemplateLael = (data) => {
    if (!data.project?.id && ServiceDataType.service === dataType.value) {
      return `${data.name} (${t('applications.variable.scope.global')})`;
    }
    return data.name;
  };
  // template change: exec version change
  const handleTemplateChange = async (val) => {
    formAction.value = PageAction.CREATE;
    schemaFormCache.value = {};
    formData.value.attributes = {};
    uiFormData.value = {};
    if (dataType.value === ServiceDataType.resource) {
      const data = await getItemResourceDefinition();
      setTemplateInfo(data);
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

  const handleDataTypeChange = (val) => {
    const originDataType = flowProps.flowStepInfo?.info?.type
      ? ServiceDataType.resource
      : ServiceDataType.service;
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

    if (
      flowId &&
      dataType.value === originDataType &&
      props.action === PageAction.EDIT
    ) {
      flowProps.flowStepInfo.enable = true;
    } else {
      flowProps.flowStepInfo.enable = false;
    }

    setTimeout(() => {
      toggleDataType();
    }, 100);
  };

  const cancel = async (callback) => {
    beforeLeaveCallback({
      isCancel: true,
      onOk: () => {
        copyFormData = cloneDeep(formData.value);
        callback?.();
      }
    });
  };
  const submit = async () => {
    const res = await formref.value?.validate();
    const groupFormRes = await groupForm.value?.validate();
    const hiddenFormData = groupForm.value?.getHiddenData();
    validateTrigger.value = true;
    if (!res && !groupFormRes) {
      if (!formData.value.template?.project?.id) {
        formData.value.template = _.omit(formData.value.template, 'project');
      }
      if (dataType.value === ServiceDataType.service) {
        formData.value.type = null as any;
      }
      if (dataType.value === ServiceDataType.resource) {
        formData.value.template = null as any;
      }
      copyFormData = _.cloneDeep(formData.value);

      const resultData = _.cloneDeep(formData.value);
      resultData.attributes = {
        ...resultData.attributes,
        ...hiddenFormData
      };

      return resultData;
    }
    scrollToView();
    return false;
  };
  const getData = () => {
    const hiddenFormData = groupForm.value?.getHiddenData();
    if (!formData.value.template?.project?.id) {
      formData.value.template = _.omit(formData.value.template, 'project');
    }
    if (dataType.value === ServiceDataType.service) {
      formData.value.type = null as any;
    }
    if (dataType.value === ServiceDataType.resource) {
      formData.value.template = null as any;
    }
    copyFormData = _.cloneDeep(formData.value);

    const resultData = _.cloneDeep(formData.value);
    resultData.attributes = {
      ...resultData.attributes,
      ...hiddenFormData
    };

    return resultData;
  };
  const axiosTokenCancel = () => {
    connectorAxiosToken?.cancel();
  };

  onBeforeRouteLeave(async (to, from) => {
    if (!_.isEqual(copyFormData, formData.value)) {
      beforeLeaveCallback({
        to,
        from,
        onOk: () => {
          copyFormData = cloneDeep(formData.value);
          router.push({
            path: to.path as string
          });
        }
      });
      return false;
    }
    return true;
  });
  defineExpose({
    submit,
    getData,
    cancel
  });
  onBeforeUnmount(() => {
    axiosTokenCancel();
  });
  const initData = async () => {
    await init();
    copyFormData = _.cloneDeep(formData.value);
    getEnvironmentConnectors();
    if (props.action === PageAction.EDIT) {
      setFormDataAttributeCache();
    }
    labelsData.value.labels = _.cloneDeep(formData.value.labels);
  };

  initData();
</script>

<script lang="ts">
  export default {
    name: PROJECT.ServiceEdit
  };
</script>

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
        @change="handleBasicFormChange"
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
        </a-form-item>
        <a-form-item
          v-if="
            dataType === ServiceDataType.service && !!formData.template.template
          "
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
    </ComCard>
    <ComCard
      :padding="pgType === 'page' ? '0px var(--card-content-padding) 20px' : 0"
    >
      <div
        v-if="_.keys(schemaVariables?.properties).length"
        style="display: flex; justify-content: flex-start"
      >
        <GroupTitle
          :bordered="false"
          style="margin-bottom: 10px"
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
          :custom-data="serviceInfo.attributes"
          @render-end="handleRenderEnd"
          @change="handleFormChange"
        ></GroupForm>
      </a-spin>

      <div
        :style="{
          'display': 'flex',
          'width': '100%',
          'margin-top': '40px',
          'padding': '20px 0',
          'align-items': 'flex-end',
          'border-top': '1px solid var(--color-border-2)'
        }"
      >
        <a-textarea
          v-model="formData.changeComment"
          :placeholder="$t('common.table.mark')"
          allow-clear
          :bordered="false"
          :style="{
            'width': `${InputWidth.LARGE}px`,
            'background': 'var(--color-white-1)',
            'margin-right': '40px'
          }"
          :auto-size="{ minRows: 5, maxRows: 5 }"
        >
        </a-textarea>
        <a-space :size="40">
          <GroupButtonMenu
            trigger="hover"
            position="tr"
            :loading="submitLoading"
            :actions="actionList"
            @select="handleActionSelect"
          >
            <template #default>
              <a-button
                :bordered="false"
                :loading="submitLoading"
                type="primary"
                @click="() => handleActionSelect(ResourceSaveAction.Deploy)"
              >
                {{ $t(_.get(_.head(SaveActions), 'label') || '') }}
              </a-button>
            </template>
          </GroupButtonMenu>
          <a-button
            type="outline"
            style="color: rgba(var(--arcoblue-5))"
            :disabled="!isFormChange && pgType === 'com'"
            class="cap-title cancel-btn"
            @click="handleCancel"
            >{{ $t('common.button.cancel') }}</a-button
          >
        </a-space>
      </div>
    </ComCard>
    <CommentModal
      v-model:show="showCommentModal"
      :title="$t('common.button.saveDeploy')"
      @confirm="handleComfirmComment"
      @cancel="() => (submitLoading = false)"
    ></CommentModal>
  </div>
</template>

<script lang="ts" setup>
  import { PROJECT } from '@/router/config';
  import { useAppStore } from '@/store';
  import _, { get, find, cloneDeep, toString } from 'lodash';
  import { ref, computed, provide, PropType, nextTick, onMounted } from 'vue';
  import i18n from '@/locale';
  import { execSucceed } from '@/utils/monitor';
  import { useSetChunkRequest } from '@/api/axios-chunk-request';
  import CommentModal from '@/views/commons/components/comment-modal/index.vue';
  import { onBeforeRouteLeave } from 'vue-router';
  import GroupButtonMenu from '@/components/drop-button-group/group-button-menu.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import useScrollToView from '@/hooks/use-scroll-to-view';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import GroupForm from '@/components/dynamic-form/group-form.vue';
  import GroupTitle from '@/components/group-title/index.vue';
  import {
    validateLabelNameRegx,
    validateInputLength,
    PageAction,
    InputWidth,
    InjectCompleteDataKey,
    InjectProjectEnvironmentKey,
    SaveActions,
    InjectSchemaFormStatusKey,
    InjectTraceKey,
    websocketEventType,
    ResourceSaveAction
  } from '@/views/config';
  import keyValueLabels from '@/components/form-create/custom-components/key-value-labels.vue';
  import { queryEnvironmentConnector } from '@/views/application-management/environments/api';
  import { projectEnvCtxInjectionKey } from '@/components/dynamic-form/widgets/config';
  import { BreadcrumbOptions } from '@/views/config/interface';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import RunDetailModal from '../components/runs/detail-modal/index.vue';
  import useProjectBreadcrumbData from '../../projects/hooks/use-project-breadcrumb-data';
  import {
    createService,
    upgradeApplicationInstance,
    SERVICE_API,
    SERVICE_API_PREFIX
  } from '../api';
  import useServiceData from '../hooks/use-service-data';
  import {
    ServiceDataType,
    ServiceStatus,
    ProvideServiceInfoKey
  } from '../config';

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
    updateServiceCompleteData,
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
  const appStore = useAppStore();
  const { setChunkRequest } = useSetChunkRequest();
  let copyFormData: any = null;
  const showPreviewModal = ref(false);
  const isFormChange = ref(false);
  const showCommentModal = ref(false);
  const formref = ref();
  const groupForm = ref();
  const submitLoading = ref(false);
  const labelsData = ref<any>({
    labels: {},
    list: []
  });
  const deletedIds = ref<string[]>([]);
  const validateTrigger = ref(false);
  const breadCrumbList = ref<BreadcrumbOptions[]>([]);
  const schemaFormCache = ref<any>({});
  const formAction = ref(!id ? PageAction.CREATE : PageAction.EDIT);
  const traceKey = ref(Date.now());
  const projectID = route.params.projectId as string;
  const projectEnvCtx = ref({
    projectID: route.params.projectId as string,
    environmentID: route.params.environmentId as string,
    connectors: []
  });
  const serviceRes = ref<any>({});
  provide(InjectCompleteDataKey, completeData);
  provide(ProvideServiceInfoKey, serviceRes);
  provide(
    InjectProjectEnvironmentKey,
    ref({
      projectID: route.params.projectId,
      environmentID: route.params.environmentId
    })
  );
  provide(projectEnvCtxInjectionKey, projectEnvCtx);

  provide(InjectSchemaFormStatusKey, formAction);
  provide(InjectTraceKey, traceKey);

  const actionList = computed(() => {
    return _.filter(SaveActions, (item) => {
      if (
        _.get(serviceInfo.value, 'status.summaryStatus') ===
          ServiceStatus.Undeployed ||
        _.get(serviceInfo.value, 'status.summaryStatus') ===
          ServiceStatus.Stopped ||
        !id
      ) {
        return true;
      }
      return item.value !== ResourceSaveAction.Draft;
    });
  });
  const virtualListProps = computed(() => {
    if (templateList.value.length > 20) {
      return {
        height: 200
      };
    }
    return undefined;
  });

  const handleBasicFormChange = (e) => {
    isFormChange.value = !_.isEqual(copyFormData, formData.value);
  };
  const handleFormChange = (val) => {
    isFormChange.value = !_.isEqual(copyFormData, formData.value);
  };
  const handleRenderEnd = () => {
    setTimeout(() => {
      isFormChange.value = false;
      asyncLoading.value = false;
    }, 100);
  };
  const getEnvironmentConnectors = async () => {
    try {
      const { data } = await queryEnvironmentConnector({
        environmentID: route.params.environmentId as string,
        projectID: route.params.projectId as string
      });
      projectEnvCtx.value.connectors = data.connectors || [];
    } catch (error) {
      // ingore
      projectEnvCtx.value.connectors = [];
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
      (item) =>
        get(item, 'name') === val && !_.includes(deletedIds.value, item.id)
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
        formData.value.attributes = _.cloneDeep(copyFormData.attributes || {});
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
    setTimeout(() => {
      toggleDataType();
    }, 100);
  };

  const handleVersionChange = () => {
    if (id) {
      formAction.value = PageAction.EDIT;
    } else {
      formAction.value = PageAction.CREATE;
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

  const formatTemplateLael = (data) => {
    if (!data.project?.id && ServiceDataType.service === dataType.value) {
      return `${data.name} (${t('applications.variable.scope.global')})`;
    }
    return data.name;
  };
  // template change: exec version change
  const handleTemplateChange = async (val) => {
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

  const handleCancel = async () => {
    if (!_.isEqual(copyFormData, formData.value)) {
      beforeLeaveCallback({
        isCancel: true,
        onOk: () => {
          if (props.pgType !== 'page') {
            setTimeout(() => {
              formData.value = _.cloneDeep(copyFormData);
              uiFormData.value = _.cloneDeep(copyFormData.attributes);
              groupForm.value?.refreshkey();
              isFormChange.value = false;
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
    return createService(formData);
  };

  const doneCallback = () => {
    if (formData.value.draft) {
      router.back();
      return;
    }
    if (!id) {
      router.replace({
        name: PROJECT.ServiceDetail,
        params: {
          ...route.params
        },
        query: {
          id: serviceRes.value?.id
        }
      });
      return;
    }

    if (props.pgType !== 'page') {
      emits('save');
      return;
    }
    router.back();
  };
  const saveCallback = async () => {
    const hiddenFormData = groupForm.value?.getHiddenData();
    copyFormData = _.cloneDeep(formData.value);
    const submitdata = _.cloneDeep(formData.value);
    submitdata.attributes = {
      ...submitdata.attributes,
      ...hiddenFormData
    };
    let res: any = null;
    if (id) {
      const { data } = await upgradeApplicationInstance(submitdata);
      res = data;
    } else {
      const { data } = await handleCreate(submitdata);
      res = data;
    }
    serviceRes.value = res;

    doneCallback();
  };
  const handleOk = async (draft?: boolean) => {
    const res = await formref.value?.validate();
    const groupres = await groupForm.value?.validate();
    validateTrigger.value = true;
    console.log(
      'formdata=============',
      formData.value,
      formData.value.attributes
    );
    if (!res && !groupres) {
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
        await saveCallback();
        execSucceed();
      } finally {
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
  const handleComfirmComment = (val) => {
    formData.value.changeComment = val;
    saveCallback();
  };

  const handlePreview = () => {
    showPreviewModal.value = true;
  };

  const handleActionSelect = (value) => {
    setTimeout(() => {
      formData.value.preview = false;

      if (value === ResourceSaveAction.Deploy) {
        handleOk();
      }
      if (value === ResourceSaveAction.Draft) {
        handleOk(true);
      }

      if (value === ResourceSaveAction.Preview) {
        formData.value.preview = true;
        handleOk();
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

    getEnvironmentConnectors();
    copyFormData = _.cloneDeep(formData.value);
    if (id) {
      setFormDataAttributeCache();
      console.log(
        'dataType=====',
        dataType.value,
        schemaFormCache.value,
        copyFormData
      );
    }
    labelsData.value.labels = _.cloneDeep(formData.value.labels);
  };

  const updateServiceList = (data) => {
    const ids = data?.ids || [];

    // DELETE
    if (data?.type === websocketEventType.DELETE) {
      deletedIds.value = _.uniq([...deletedIds.value, ...ids]);
      serviceDataList.value = _.filter(
        serviceDataList.value,
        (item) => !_.includes(ids, item.id)
      );
      updateServiceCompleteData();
    }
  };

  const updateHandler = (list) => {
    _.each(list, (data) => {
      updateServiceList(data);
    });
  };

  const createServiceChunkRequest = () => {
    try {
      setChunkRequest({
        url: `${SERVICE_API_PREFIX()}${SERVICE_API}`,
        params: {
          extract: ['-attributes', '-description']
        },
        handler: updateHandler
      });
    } catch (error) {
      // ignore
    }
  };
  onMounted(() => {
    nextTick(() => {
      createServiceChunkRequest();
    });
  });
  initData();
</script>

<script lang="ts">
  export default {
    name: PROJECT.ServiceEdit
  };
</script>

<style lang="less">
  .arco-popconfirm-popup-content.deploy-comment-popup {
    background-color: var(--color-white-1);
    border: none;
    border-radius: var(--border-radius-small);

    .arco-popconfirm-body {
      padding: 0;
    }

    .arco-popconfirm-footer {
      display: none !important;
    }

    .arco-popconfirm-body {
      margin-bottom: 0;
    }

    .arco-popconfirm-icon {
      display: none;
    }
  }
</style>

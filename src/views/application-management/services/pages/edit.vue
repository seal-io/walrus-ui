<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :items="breadCrumbList"
        :menu="{ icon: 'icon-apps' }"
        @change="handleSelectChange"
      ></Breadcrumb>
    </BreadWrapper>
    <ComCard padding="16px 16px 0 16px">
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
        <!-- <a-form-item>
          <KuberSelect
            v-model="Kubernamespace"
            v-model:branch="branch"
            v-model:repository="repository"
            widget="GitHubRepository"
            label="GitHubRepository"
            @change="handleNamespaceChange"
          ></KuberSelect>
        </a-form-item> -->
        <a-form-item
          field="name"
          hide-label
          :label="$t('common.table.name')"
          :disabled="pageAction === PageAction.EDIT && !!id"
          :rules="[
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
            v-model="formData.name"
            allow-clear
            :required="true"
            :placeholder="$t('common.table.name')"
            :style="{ width: `${InputWidth.LARGE}px` }"
            :max-length="63"
            show-word-limit
          ></seal-input>
          <template #extra>
            <div
              class="tips"
              :style="{ 'max-width': `${InputWidth.LARGE}px` }"
              >{{ $t('common.validate.labelName') }}</div
            >
          </template>
        </a-form-item>
        <a-form-item
          id="moduleId"
          hide-label
          field="template.template.id"
          :label="
            route.params.dataType === ServiceDataType.service
              ? $t('applications.applications.table.module')
              : $t('resource.definition.list.name')
          "
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
              :label="
                route.params.dataType === ServiceDataType.service
                  ? $t('applications.applications.table.module')
                  : $t('resource.definition.list.name')
              "
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
                    !data.project?.id &&
                    route.params.dataType === ServiceDataType.service
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
          v-if="route.params.dataType === ServiceDataType.service"
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
        <a-form-item :label="$t(`applications.projects.form.label`)" hide-label>
          <SealFormItemWrap
            :label="$t('applications.projects.form.label')"
            :style="{ width: `${InputWidth.LARGE}px` }"
          >
            <a-space
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
            </a-space>
            <template v-else>
              <thumbButton
                :size="24"
                font-size="14px"
                @click="handleAddLabel(labelItem, labelList)"
              ></thumbButton>
            </template>
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
    <a-divider
      style="margin: 0; border-color: var(--color-fill-2); border-radius: 1px"
      :size="4"
    ></a-divider>
    <ComCard>
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
          :field-list="templateInfo"
          :async-loading="asyncLoading"
          :original-form-data="serviceInfo.attributes || {}"
        ></GroupForm>
      </a-spin>
      <EditPageFooter>
        <template #save>
          <a-button
            :loading="submitLoading"
            type="primary"
            class="cap-title cancel-btn"
            @click="handleOk"
            >{{ $t('common.button.save') }}</a-button
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
  import KuberSelect from '@/components/form-create/bussiness-components/source-code-repository.vue';
  import { PROJECT } from '@/router/config';
  import _, {
    get,
    find,
    cloneDeep,
    pull,
    keys,
    reduce,
    includes,
    pickBy,
    toString
  } from 'lodash';
  import {
    ref,
    ComponentPublicInstance,
    computed,
    provide,
    watch,
    reactive,
    nextTick,
    PropType,
    onMounted
  } from 'vue';
  import { onBeforeRouteLeave } from 'vue-router';
  import useCallCommon from '@/hooks/use-call-common';
  import thumbButton from '@/components/buttons/thumb-button.vue';
  import useScrollToView from '@/hooks/use-scroll-to-view';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import xInputGroup from '@/components/form-create/custom-components/x-input-group.vue';
  import SingleForm from '@/components/form-create/single-form.vue';
  import GroupForm from '@/components/form-create/group-form.vue';
  import GroupTitle from '@/components/group-title/index.vue';
  import {
    validateLabelNameRegx,
    PageAction,
    InputWidth
  } from '@/views/config';
  import { queryEnvironmentConnector } from '@/views/application-management/environments/api';
  import { projectEnvCtxInjectionKey } from '@/components/form-create/bussiness-components/config';
  import { BreadcrumbOptions } from '@/views/config/interface';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import useLabelsActions from '@/components/form-create/hooks/use-labels-action';
  import useProjectBreadcrumbData from '../../projects/hooks/use-project-breadcrumb-data';
  import {
    createService,
    createResourceBatch,
    upgradeApplicationInstance
  } from '../api';
  import useServiceData from '../hooks/use-service-data';
  import { ServiceDataType } from '../config';

  const props = defineProps({
    // when in detail page
    pgType: {
      type: String as PropType<'page' | 'com'>,
      default() {
        return 'page';
      }
    }
  });

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
    getTemplateSchemaByVersion,
    setTemplateVersionList,
    getTemplateVersions,
    setTemplateInfo,
    serviceInfo,
    formData,
    pageAction,
    templateInfo,
    templateVersionList,
    templateVersionFormCache,
    serviceDataList,
    templateList,
    completeData,
    title,
    asyncLoading
  } = useServiceData(props);
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
  const { route, router, t } = useCallCommon();
  const formref = ref();
  const groupForm = ref();
  const submitLoading = ref(false);
  const breadCrumbList = ref<BreadcrumbOptions[]>([]);
  const versionMap = ref({ nv: '', ov: '' });
  const dataType = route.params.dataType as string;
  const projectEnvCtx = reactive({
    projectID: route.params.projectId as string,
    environmentID: route.params.environmentId as string,
    connectors: []
  });

  provide('showHintInput', true);
  provide('completeData', completeData);
  provide('ProjectEnvironment', {
    projectID: route.params.projectId,
    environmentID: route.params.environmentId
  });
  provide(projectEnvCtxInjectionKey, projectEnvCtx);
  const Kubernamespace = ref('');
  const repository = ref('');
  const branch = ref('');

  const handleNamespaceChange = (val) => {
    console.log('handleNamespaceChange===', val);
  };

  const virtualListProps = computed(() => {
    if (templateList.value.length > 20) {
      return {
        height: 200
      };
    }
    return undefined;
  });

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
        type: 'menu.applicationManagement.serivce',
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

  // cache the user inputs when change the module version
  const setModuleVersionFormCache = async () => {
    if (!versionMap.value.ov) return;
    const moduleFormList = await groupForm.value?.getData();
    const inputs = reduce(
      moduleFormList,
      (obj, s) => {
        obj = _.merge(obj, s.formData);
        return obj;
      },
      {}
    );
    templateVersionFormCache.value[versionMap.value.ov] = {
      ...pickBy(inputs, (val) => toString(val))
    };
  };

  const execVersionChangeCallback = async () => {
    await setModuleVersionFormCache();
    const moduleData = await getTemplateSchemaByVersion();
    setTemplateInfo(moduleData);
    formData.attributes = {};

    groupForm.value?.clearFormValidStatus?.();
  };

  const handleVersionChange = () => {
    formData.template.id =
      _.find(
        templateVersionList.value,
        (item) => item.value === formData.template.version
      )?.id || '';
    setTimeout(() => {
      execVersionChangeCallback();
    }, 100);
  };

  const formatTemplateLael = (data) => {
    if (
      !data.project?.id &&
      ServiceDataType.service === route.params.dataType
    ) {
      return `${data.name} (${t('applications.variable.scope.global')})`;
    }
    return data.name;
  };
  // template change: exec version change
  const handleTemplateChange = async (val) => {
    const data = _.find(templateList.value, (item) => item.id === val);
    formData.template.name = data?.name || '';
    formData.template.project = data?.project || {};

    if (dataType === ServiceDataType.resource) {
      setTemplateInfo(data);
      formData.attributes = {};
      groupForm.value?.clearFormValidStatus?.();
    } else {
      await getTemplateVersions(formData.template, true);
      await setTemplateVersionList();

      formData.template.version = get(
        templateVersionList.value,
        '0.template.version',
        ''
      );
      templateVersionFormCache.value = {};
      setTimeout(() => {
        versionMap.value = { ov: '', nv: '' };
      }, 20);
      handleVersionChange();
    }
  };

  const handleCancel = async () => {
    beforeLeaveCallback({
      isCancel: true,
      onOk: () => {
        if (props.pgType !== 'page') {
          emits('cancel');
        } else {
          copyFormData = cloneDeep(formData);
          cancelCallback();
        }
      }
    });
  };
  const handleCreate = async (formData) => {
    if (dataType === ServiceDataType.service) {
      const data = await createService(formData);
      return data;
    }
    const data = await createResourceBatch(formData);
    return data;
  };
  const handleOk = async () => {
    console.log(
      'kube===',
      Kubernamespace.value,
      repository.value,
      branch.value
    );
    validateLabel();
    const res = await formref.value?.validate();
    const groupFormRes = await groupForm.value?.getData();
    if (!res && groupFormRes && !validateTrigger.value) {
      try {
        submitLoading.value = true;
        formData.attributes = {
          ...reduce(
            groupFormRes,
            (obj, s) => {
              obj = _.merge(obj, s.formData);
              return obj;
            },
            {}
          )
        };
        // omit template project if value is empty
        if (!formData.template.project?.id) {
          formData.template = _.omit(formData.template, 'project');
        }
        copyFormData = _.cloneDeep(formData);
        if (id) {
          await upgradeApplicationInstance(formData);
        } else {
          const { data } = await handleCreate(formData);
          router.replace({
            name: PROJECT.ServiceDetail,
            params: {
              ...route.params
            },
            query: {
              id: data.id
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
  watch(
    () => formData.template.version,
    (nv, ov) => {
      versionMap.value = {
        nv,
        ov: ov || ''
      };
    },
    {
      immediate: true
    }
  );
  onBeforeRouteLeave(async (to, from) => {
    if (!_.isEqual(copyFormData, formData)) {
      beforeLeaveCallback({
        to,
        from,
        onOk: () => {
          copyFormData = cloneDeep(formData);
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
        type: 'menu.applicationManagement.serivce',
        label: title()
      }
    ] as BreadcrumbOptions[];

    await init();
    setBreadCrumbList();
    copyFormData = _.cloneDeep(formData);
    getLabelList();
    getEnvironmentConnectors();
  };

  initData();
</script>

<script lang="ts">
  export default {
    name: PROJECT.ServiceEdit
  };
</script>

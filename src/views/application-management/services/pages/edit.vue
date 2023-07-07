<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :items="breadCrumbList"
        :menu="{ icon: 'icon-apps' }"
        @change="handleSelectChange"
      ></Breadcrumb>
    </BreadWrapper>
    <ComCard top-gap padding="16px 16px 0 16px">
      <a-form ref="formref" :model="formData" auto-label-width>
        <a-form-item
          :label="$t('common.table.name')"
          field="name"
          :disabled="pageAction === PageAction.EDIT && !!id"
          :rules="[
            {
              required: true,
              message: $t('applications.module.rule.name.tips')
            },
            {
              match: validateLabelNameRegx,
              message: $t('common.validate.labelName')
            },
            {
              validator: validateNameuniq,
              message: $t('applications.applications.rule.modules.name')
            }
          ]"
        >
          <a-input
            v-model="formData.name"
            style="width: 380px"
            :max-length="63"
            show-word-limit
          ></a-input>
          <template #extra>
            <div class="tips" style="max-width: 380px">{{
              $t('common.validate.labelName')
            }}</div>
          </template>
        </a-form-item>
        <a-form-item
          id="moduleId"
          :label="$t('applications.applications.table.module')"
          field="template.id"
          :disabled="pageAction === PageAction.EDIT && !!id"
          :rules="[
            {
              required: true,
              message: $t('applications.applications.rules.modules')
            }
          ]"
        >
          <div>
            <a-select
              v-model="formData.template.id"
              style="width: 380px"
              allow-search
              @change="handleTemplateChange"
            >
              <a-option
                v-for="item in templateList"
                :key="item.id"
                :value="item.id"
                >{{ item.id }}</a-option
              >
            </a-select>
          </div>
        </a-form-item>
        <a-form-item
          :label="$t('applications.applications.history.version')"
          field="template.version"
          :rules="[
            {
              required: true,
              message: $t('applications.applications.rules.versions')
            }
          ]"
        >
          <div>
            <a-select
              v-model="formData.template.version"
              style="width: 380px"
              :loading="asyncLoading"
              @change="handleVersionChange"
            >
              <a-option
                v-for="item in templateVersionList"
                :key="item.id"
                :value="item.value"
                >{{ item.label }}</a-option
              >
            </a-select>
          </div>
        </a-form-item>
        <a-form-item :label="$t(`applications.projects.form.label`)">
          <a-space
            v-if="labelList?.length"
            style="display: flex; flex-direction: column; width: 443px"
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
        <a-form-item :label="$t('common.table.description')">
          <a-textarea
            v-model="formData.description"
            :max-length="200"
            show-word-limit
            style="width: 380px"
            :auto-size="{ minRows: 4, maxRows: 6 }"
          ></a-textarea>
        </a-form-item>
      </a-form>
    </ComCard>
    <a-divider
      style="margin: 0; border-color: var(--color-fill-2); border-radius: 1px"
      :size="4"
    ></a-divider>
    <ComCard>
      <div
        style="display: flex; justify-content: flex-start; margin-bottom: 10px"
      >
        <GroupTitle
          iconed
          :bordered="false"
          style="margin-bottom: 0"
          :title="$t('applications.applications.detail.configuration')"
        >
        </GroupTitle>
        <div>
          <a-tooltip position="tl">
            <template #content>
              <div>
                <div>{{
                  $t('applications.applications.modules.params.title')
                }}</div>
                <div>{{
                  $t('applications.applications.modules.params.tips1')
                }}</div>
                <div>{{
                  $t('applications.applications.modules.params.tips3')
                }}</div>
              </div>
            </template>
            <icon-question-circle class="mleft-5" />
          </a-tooltip>
        </div>
      </div>
      <a-spin class="variables" style="width: 100%" :loading="asyncLoading">
        <a-tabs
          v-if="formTabs.length > 1"
          class="page-line-tabs"
          :active-key="activeKey"
          @change="handleTabChange"
        >
          <a-tab-pane
            v-for="(group, index) in formTabs"
            :key="`schemaForm${index}`"
            :title="variablesGroup[group]?.label"
          >
            <formCreate
              :ref="(el: refItem) => setRefMap(el, `schemaForm${index}`)"
              :form-id="`schemaForm${index}`"
              layout="vertical"
              action="post"
              api=""
              :show-footer="false"
              :submit="() => {}"
              :model="variablesGroupForm[group]?.attributes"
              :form-schema="variablesGroup[group]?.variables"
            >
            </formCreate>
          </a-tab-pane>
        </a-tabs>
        <formCreate
          v-if="formTabs.length < 2"
          ref="schemaForm"
          form-id="schemaForm"
          layout="vertical"
          action="post"
          api=""
          :show-footer="false"
          :submit="() => {}"
          :model="variablesGroupForm[defaultGroupKey]?.attributes"
          :form-schema="variablesGroup[defaultGroupKey]?.variables"
        >
        </formCreate>
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
  import { PROJECT } from '@/router/config';
  import _, {
    get,
    find,
    cloneDeep,
    each,
    assignIn,
    pull,
    set,
    keys,
    reduce,
    map,
    includes,
    pickBy,
    toString,
    filter,
    split
  } from 'lodash';
  import {
    ref,
    ComponentPublicInstance,
    computed,
    provide,
    watch,
    nextTick,
    onMounted
  } from 'vue';
  import { onBeforeRouteLeave } from 'vue-router';
  import { useProjectStore } from '@/store';
  import useCallCommon from '@/hooks/use-call-common';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import xInputGroup from '@/components/form-create/custom-components/x-input-group.vue';
  import formCreate from '@/components/form-create/index.vue';
  import GroupTitle from '@/components/group-title/index.vue';
  import {
    TemplateRowData,
    TemplateVersionData
  } from '@/views/operation-hub/templates/config/interface';
  import VariableLit from '@/views/application-management/variables/components/table-list.vue';
  import { validateLabelNameRegx, PageAction } from '@/views/config';
  import { BreadcrumbOptions } from '@/views/config/interface';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import useLabelsActions from '@/components/form-create/hooks/use-labels-action';
  import useProjectBreadcrumbData from '../../projects/hooks/use-project-breadcrumb-data';
  import { createService, upgradeApplicationInstance } from '../api';
  import useServiceData from '../hooks/use-service-data';

  interface Group {
    variables: object[];
    label: string;
  }
  type refItem = Element | ComponentPublicInstance | null;
  interface TemplateVersion extends TemplateVersionData {
    label: string;
    value: string;
  }
  const props = defineProps({
    action: {
      type: String,
      default() {
        return 'edit';
      }
    },
    pgType: {
      type: String,
      default() {
        return 'page';
      }
    }
  });

  const emits = defineEmits(['cancel', 'save']);
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
    generateVariablesGroup,
    getTemplateSchemaByVersion,
    getTemplateVersionList,
    getTemplatesVersions,
    formData,
    pageAction,
    defaultGroupKey,
    templateInfo,
    variablesGroup,
    variablesGroupForm,
    templateVersionList,
    templateVersionFormCache,
    serviceDataList,
    templateList,
    completeData,
    title,
    refMap,
    asyncLoading,
    setRefMap
  } = useServiceData(props);
  const {
    labelList,
    handleAddLabel,
    handleDeleteLabel,
    validateLabel,
    getLabelList,
    validateTrigger
  } = useLabelsActions(formData);
  let copyFormData: any = null;
  const { route, router, t } = useCallCommon();
  const formref = ref();
  const loading = ref(false);
  const activeKey = ref('schemaForm0');
  const schemaForm = ref();
  const submitLoading = ref(false);
  const breadCrumbList = ref<BreadcrumbOptions[]>([]);

  const versionMap = ref({ nv: '', ov: '' });

  provide('showHintInput', true);
  provide('completeData', completeData);

  const formTabs = computed(() => {
    const list = keys(variablesGroup.value);
    if (includes(list, defaultGroupKey)) {
      const res = [defaultGroupKey, ...pull(list, defaultGroupKey)];
      return res;
    }
    return list;
  });

  const getContainer = (id) => {
    return document.getElementById(id);
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
        label: title.value
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

  const handleTabChange = (val) => {
    activeKey.value = val;
  };

  const setFormData = (schemas) => {
    const variablesList = filter(get(schemas, 'variables'), (v) => {
      return !v.hidden;
    });
    each(variablesList, (item) => {
      formData.attributes[item.name] = item.default;
    });
  };

  const clearFormValidStatus = () => {
    keys(refMap.value).map(async (key) => {
      const refEL = refMap.value[key];
      refEL?.clearFormValidStatus?.();
    });
  };
  // get group form data
  const getRefFormData = async (noValidate?: boolean) => {
    const resultList: any[] = [];
    await Promise.all(
      keys(refMap.value).map(async (key) => {
        const refEL = refMap.value[key];
        const moduleForm = await refEL?.getFormData?.(noValidate);
        resultList.push({
          tab: key,
          formData: moduleForm
        });
      })
    );
    return resultList;
  };
  // cache the user inputs when change the module version
  const setModuleVersionFormCache = async () => {
    console.log('versionMap==3=', versionMap.value);
    if (!versionMap.value.ov) return;
    const moduleFormList = await getRefFormData();
    const inputs = reduce(
      moduleFormList,
      (obj, s) => {
        obj = {
          ...obj,
          ...s.formData
        };
        return obj;
      },
      {}
    );
    templateVersionFormCache.value[versionMap.value.ov] = {
      ...pickBy(inputs, (val) => toString(val))
    };
    console.log('templateVersionFormCache===', templateVersionFormCache.value);
  };
  const execVersionChangeCallback = async () => {
    await setModuleVersionFormCache();
    const moduleData = getTemplateSchemaByVersion();
    templateInfo.value = cloneDeep(get(moduleData, 'schema')) || {};
    formData.attributes = {};
    console.log('version args...', moduleData, templateVersionFormCache.value);

    clearFormValidStatus();
    generateVariablesGroup(pageAction.value);
  };
  const handleVersionChange = () => {
    console.log('formData===', formData);
    setTimeout(() => {
      execVersionChangeCallback();
    }, 100);
  };
  // module change: exec version change
  const handleTemplateChange = async (val) => {
    await getTemplatesVersions(val);
    await getTemplateVersionList();
    formData.template.version = get(templateVersionList.value, '0.version');
    templateVersionFormCache.value = {};
    versionMap.value = { ov: '', nv: '' };
    handleVersionChange();
    nextTick(() => {
      handleTabChange('schemaForm0');
    });
  };
  const getFormData = async (noValidate?: boolean) => {
    let moduleFormList: any[] = [];
    if (keys(variablesGroup.value).length > 1) {
      moduleFormList = await getRefFormData(noValidate);
    } else {
      const result = await schemaForm.value?.getFormData(noValidate);
      moduleFormList = [{ formData: result }];
    }
    return moduleFormList;
  };

  const validateFormData = async () => {
    const moduleFormList = await getFormData();
    const validFailedForm = find(moduleFormList, (item) => !item.formData);
    if (validFailedForm && validFailedForm.tab) {
      activeKey.value = validFailedForm.tab;
    }
    return { validFailedForm, moduleFormList };
  };
  const getCurrentFormData = async () => {
    const noValidate = true;
    const moduleFormList = await getFormData(noValidate);
    const latestFormData = _.cloneDeep(formData);
    latestFormData.attributes = {
      ...reduce(
        moduleFormList,
        (obj, s) => {
          obj = {
            ...obj,
            ...s.formData
          };
          return obj;
        },
        {}
      )
    };
    return latestFormData;
  };
  const handleCancel = async () => {
    const latestFormData = await getCurrentFormData();
    if (!_.isEqual(copyFormData, latestFormData)) {
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
    } else if (props.pgType !== 'page') {
      emits('cancel');
    } else {
      cancelCallback();
    }
  };
  const handleOk = async () => {
    // validateLabel();
    const res = await formref.value?.validate();
    const { validFailedForm, moduleFormList } = await validateFormData();
    if (!res && !validFailedForm) {
      try {
        submitLoading.value = true;
        formData.attributes = {
          ...reduce(
            moduleFormList,
            (obj, s) => {
              obj = {
                ...obj,
                ...s.formData
              };
              return obj;
            },
            {}
          )
        };
        copyFormData = _.cloneDeep(formData);
        if (id) {
          await upgradeApplicationInstance(formData);
        } else {
          const { data } = await createService(formData);
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
        label: title.value
      }
    ] as BreadcrumbOptions[];

    await init();
    setBreadCrumbList();
    copyFormData = _.cloneDeep(formData);
    getLabelList();
  };

  initData();
</script>

<script lang="ts">
  export default {
    name: PROJECT.ServiceEdit
  };
</script>

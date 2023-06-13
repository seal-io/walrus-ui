<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :items="breadCrumbList"
        :menu="{ icon: 'icon-apps' }"
      ></Breadcrumb>
    </BreadWrapper>
    <ComCard top-gap>
      <a-form ref="formref" :model="formData" auto-label-width>
        <a-form-item
          :label="$t('common.table.name')"
          field="name"
          :disabled="pageAction === 'edit' && !!id"
          :rules="[
            {
              required: true,
              message: $t('applications.module.rule.name.tips')
            },
            {
              match: validateAppNameRegx,
              message: $t('applications.module.rule.name.tips')
            },
            {
              validator: validateNameuniq,
              message: $t('applications.applications.rule.modules.name')
            }
          ]"
        >
          <a-input
            v-model="formData.name"
            :max-length="30"
            show-word-limit
          ></a-input>
          <template #extra>
            <span class="tips">{{
              $t('applications.module.rule.name.tips')
            }}</span>
          </template>
        </a-form-item>
        <a-form-item
          id="moduleId"
          :label="$t('applications.applications.table.module')"
          field="template.id"
          :disabled="pageAction === 'edit' && !!id"
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
              allow-search
              @change="handleModuleChange"
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
      </a-form>
    </ComCard>
    <a-divider style="margin: 0; border-radius: 1px" :size="4"></a-divider>
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
      <div class="variables">
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
      </div>
      <EditPageFooter v-if="pageAction === 'edit'">
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
    reactive,
    PropType,
    ComponentPublicInstance,
    computed,
    provide,
    watch,
    nextTick,
    toRefs
  } from 'vue';
  import { onBeforeRouteLeave } from 'vue-router';
  import useCallCommon from '@/hooks/use-call-common';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import formCreate from '@/components/form-create/index.vue';
  import GroupTitle from '@/components/group-title/index.vue';
  import {
    TemplateRowData,
    TemplateVersionData
  } from '@/views/operation-hub/templates/config/interface';
  import { validateAppNameRegx } from '@/views/config';
  import usePageAction from '@/hooks/use-page-action';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
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
    id,
    init,
    generateVariablesGroup,
    getTemplateSchemaByVersion,
    getTemplateVersionList,
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
    refMap,
    title,
    breadCrumbList: CurrentBreadList
  } = useServiceData(props);
  let copyFormData: any = null;

  const { route, router, t } = useCallCommon();
  const formref = ref();
  const loading = ref(false);
  const activeKey = ref('schemaForm0');
  const schemaForm = ref();
  const submitLoading = ref(false);

  const versionMap = ref({ nv: '', ov: '' });

  provide('showHintInput', true);
  provide('completeData', completeData);

  const breadCrumbList = computed(() => {
    if (!CurrentBreadList.value.length) return [];
    return [
      CurrentBreadList.value[0],
      CurrentBreadList.value[1],
      {
        label: title.value
      }
    ];
  });
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
  const cancelCallback = () => {
    // if (pageAction.value === 'edit' && route.params.action === 'view') {
    //   pageAction.value = 'view';
    //   return;
    // }
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
  const setRefMap = (el: refItem, name) => {
    if (el) {
      refMap[`${name}`] = el;
    }
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
    keys(refMap).map(async (key) => {
      const refEL = refMap[key];
      refEL?.clearFormValidStatus?.();
    });
  };
  // get group form data
  const getRefFormData = async (noValidate?: boolean) => {
    const resultList: any[] = [];
    console.log('refMap==1212====', keys(refMap));
    await Promise.all(
      keys(refMap).map(async (key) => {
        const refEL = refMap[key];
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
  const handleModuleChange = async (val) => {
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
    console.log('moduleFormList===', refMap, moduleFormList, variablesGroup);
    const validFailedForm = find(moduleFormList, (item) => !item.formData);
    if (validFailedForm && validFailedForm.tab) {
      activeKey.value = validFailedForm.tab;
    }

    return { validFailedForm, moduleFormList };
  };
  const handleCancel = async () => {
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
    console.log('cancel=====', { copyFormData, latestFormData });
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
    // if (props.pgType !== 'page') {
    //   emits('save');
    //   return;
    // }
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
        if (id) {
          await upgradeApplicationInstance(formData);
        } else {
          await createService(formData);
        }
        if (props.pgType !== 'page') {
          emits('save');
        } else {
          copyFormData = _.cloneDeep(formData);
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
      console.log('versionMap===', versionMap.value);
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
    await init();
    copyFormData = _.cloneDeep(formData);
  };
  initData();
</script>

<script lang="ts">
  export default {
    name: PROJECT.ServiceEdit
  };
</script>

<style lang="less"></style>
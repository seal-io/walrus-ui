<template>
  <div>
    <div padding="16px 16px 0 16px">
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
          field="template.name"
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
              v-model="formData.template.name"
              :placeholder="$t('applications.applications.table.module')"
              :required="true"
              :virtual-list-props="virtualListProps"
              :options="templateList"
              :style="{ width: `${InputWidth.LARGE}px` }"
              allow-search
              @change="handleTemplateChange"
            >
            </seal-select>
          </div>
        </a-form-item>
        <a-form-item
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
    </div>
    <!-- <a-divider
      style="margin: 0; border-color: var(--color-fill-2); border-radius: 1px"
      :size="4"
    ></a-divider> -->
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
              :show-footer="false"
              :submit="() => {}"
              :attributes="variableAttributes"
              :model="variablesGroupForm[group]?.attributes"
              :form-schema="variablesGroup[group]?.variables"
            >
            </formCreate>
          </a-tab-pane>
        </a-tabs>
        <formCreate
          v-if="formTabs.length === 1"
          ref="schemaForm"
          form-id="schemaForm"
          layout="vertical"
          :show-footer="false"
          :submit="() => {}"
          :model="variablesGroupForm[formTabs[0]]?.attributes"
          :form-schema="variablesGroup[formTabs[0]]?.variables"
        >
        </formCreate>
      </a-spin>
    </div>
  </div>
</template>

<script lang="ts" setup>
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
    nextTick,
    PropType,
    onMounted
  } from 'vue';
  import { onBeforeRouteLeave } from 'vue-router';
  import useCallCommon from '@/hooks/use-call-common';
  import thumbButton from '@/components/buttons/thumb-button.vue';
  import useScrollToView from '@/hooks/use-scroll-to-view';
  import xInputGroup from '@/components/form-create/custom-components/x-input-group.vue';
  import formCreate from '@/components/form-create/index.vue';
  import GroupTitle from '@/components/group-title/index.vue';
  import {
    validateLabelNameRegx,
    PageAction,
    InputWidth
  } from '@/views/config';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import useLabelsActions from '@/components/form-create/hooks/use-labels-action';
  import useServiceData from '../hooks/use-service-data';

  interface Group {
    variables: object[];
    label: string;
  }
  type refItem = Element | ComponentPublicInstance | null;

  const props = defineProps({
    // when in detail page
    pgType: {
      type: String as PropType<'page' | 'com'>,
      default() {
        return 'page';
      }
    },
    flow: Object
  });

  const emits = defineEmits(['cancel', 'save']);
  const { scrollToView } = useScrollToView();

  const {
    id,
    init,
    generateVariablesGroup,
    getTemplateSchemaByVersion,
    getTemplateVersionList,
    getTemplateVersionByItem,
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
  const loading = ref(false);
  const activeKey = ref('schemaForm0');
  const schemaForm = ref();
  const submitLoading = ref(false);
  const variableAttributes = ref<any>({});
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

  const virtualListProps = computed(() => {
    if (templateList.value.length > 20) {
      return {
        height: 200
      };
    }
    return undefined;
  });

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

  // update all the form data
  const setVariableAttributes = async () => {
    const moduleFormList = await getFormData(true);
    variableAttributes.value = reduce(
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
  };

  const handleTabChange = (val) => {
    activeKey.value = val;
    setVariableAttributes();
  };

  const clearFormValidStatus = () => {
    keys(refMap.value).map(async (key) => {
      const refEL = refMap.value[key];
      refEL?.clearFormValidStatus?.();
    });
  };

  // cache the user inputs when change the module version
  const setModuleVersionFormCache = async () => {
    if (!versionMap.value.ov) return;
    const moduleFormList = await getFormData(true);
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
  };

  const execVersionChangeCallback = async () => {
    await setModuleVersionFormCache();
    const moduleData = getTemplateSchemaByVersion();
    templateInfo.value = cloneDeep(get(moduleData, 'schema')) || {};
    formData.attributes = {};

    clearFormValidStatus();
    generateVariablesGroup(pageAction.value);
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

  // template change: exec version change
  const handleTemplateChange = async (val) => {
    await getTemplateVersionByItem(val, true);
    await getTemplateVersionList();
    formData.template.version =
      get(templateVersionList.value, '0.version') || '';
    templateVersionFormCache.value = {};
    setTimeout(() => {
      versionMap.value = { ov: '', nv: '' };
    }, 20);
    handleVersionChange();
    nextTick(() => {
      handleTabChange('schemaForm0');
      // in the execVersionChangeCallback would set cache, when change the template, should clear the cache
    });
  };

  const validateFormData = async () => {
    const moduleFormList = await getFormData();
    const validFailedForm = find(moduleFormList, (item) => !item.formData);
    if (validFailedForm && validFailedForm.tab) {
      activeKey.value = validFailedForm.tab;
    }
    return { validFailedForm, moduleFormList };
  };

  const cancel = async (callback) => {
    beforeLeaveCallback({
      isCancel: true,
      onOk: () => {
        copyFormData = cloneDeep(formData);
        callback?.();
      }
    });
  };

  const submit = async () => {
    validateLabel();
    const res = await formref.value?.validate();
    const { validFailedForm, moduleFormList } = await validateFormData();
    if (!res && !validFailedForm && !validateTrigger.value) {
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
      return formData;
    }
    scrollToView();
    return false;
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
  defineExpose({
    submit,
    cancel
  });
  const initData = async () => {
    await init();
    copyFormData = _.cloneDeep(formData);
    getLabelList();
  };

  initData();
</script>
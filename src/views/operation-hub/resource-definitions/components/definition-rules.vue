<template>
  <ModuleWrapper
    :status="true"
    :show-delete="showDelete"
    @delete="handleDelete"
  >
    <template #title>
      <slot name="title"></slot>
    </template>
    <div>
      <div padding="16px 16px 0 16px">
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
          <GroupTitle :bordered="false" title="选择器" flex-start>
            <template #title>
              <span>选择器</span>
              <primaryButtonGroup
                :action-list="actionList"
                @select="handleAddSelector"
              >
                <a-link class="m-l-10">
                  <icon-plus class="size-14" style="stroke-width: 4" />
                  <span class="mleft-5">添加</span>
                  <!-- <icon-down class="mleft-5" /> -->
                </a-link>
              </primaryButtonGroup>
            </template>
          </GroupTitle>
          <a-form-item
            v-if="selectors.has('projectName')"
            field="selector.projectName"
            hide-label
            label="项目名称"
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
              v-model="formData.selector.projectName"
              allow-clear
              :required="true"
              label="项目名称"
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
            <a-button type="text" @click="handleDeleteSelector('projectName')">
              <template #icon>
                <icon-minus-circle class="size-20" />
              </template>
            </a-button>
          </a-form-item>
          <a-form-item
            v-if="selectors.has('environmentName')"
            field="selector.environmentName"
            hide-label
            label="环境名称"
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
              v-model="formData.selector.environmentName"
              allow-clear
              :required="true"
              label="环境名称"
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
            <a-button
              type="text"
              status="danger"
              @click="handleDeleteSelector('environmentName')"
            >
              <template #icon>
                <icon-delete class="size-20" />
              </template>
            </a-button>
          </a-form-item>
          <a-form-item
            v-if="selectors.has('environmentType')"
            hide-label
            field="selector.environmentType"
            label="环境类型"
            :rules="[
              {
                required: true,
                message: $t('applications.applications.rules.versions')
              }
            ]"
          >
            <div>
              <seal-select
                v-model="formData.selector.environmentType"
                :options="[]"
                :required="true"
                label="环境类型"
                :style="{ width: `${InputWidth.LARGE}px` }"
              >
                <a-option
                  v-for="item in _.keys(EnvironmentTypeMap)"
                  :key="item"
                  :value="item"
                  >{{ $t(EnvironmentTypeMap[item]) }}</a-option
                >
              </seal-select>
            </div>
            <a-button
              type="text"
              @click="handleDeleteSelector('environmentType')"
            >
              <template #icon>
                <icon-delete class="size-20" />
              </template>
            </a-button>
          </a-form-item>
          <a-form-item
            v-if="selectors.has('environmentLabels')"
            field="selector.environmentLabels"
            label="环境标签"
            hide-label
            :rules="[
              {
                validator: validateLabels,
                message: '标签key不能为空'
              }
            ]"
          >
            <SealFormItemWrap
              label="环境标签"
              :style="{ width: `${InputWidth.LARGE}px` }"
            >
              <keyValueLabels
                v-model:value="formData.selector.environmentLabels"
                labels-key="environmentLabels"
                :validate-trigger="validateTrigger"
                :labels="formData.selector"
              ></keyValueLabels>
            </SealFormItemWrap>
            <a-button
              type="text"
              status="danger"
              @click="handleDeleteSelector('environmentLabels')"
            >
              <template #icon>
                <icon-delete class="size-20" />
              </template>
            </a-button>
          </a-form-item>
          <a-form-item
            v-if="selectors.has('resourceLabels')"
            field="selector.resourceLabels"
            label="资源标签"
            hide-label
            :rules="[
              {
                validator: validateLabels,
                message: '标签key不能为空'
              }
            ]"
          >
            <SealFormItemWrap
              label="资源标签"
              :style="{ width: `${InputWidth.LARGE}px` }"
            >
              <keyValueLabels
                v-model:value="formData.selector.resourceLabels"
                labels-key="resourceLabels"
                :validate-trigger="validateTrigger"
                :labels="formData.selector"
              ></keyValueLabels>
            </SealFormItemWrap>
            <a-button
              type="text"
              status="danger"
              @click="handleDeleteSelector('resourceLabels')"
            >
              <template #icon>
                <icon-delete class="size-20" />
              </template>
            </a-button>
          </a-form-item>

          <div style="display: flex; justify-content: flex-start">
            <GroupTitle
              :bordered="false"
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
          <a-form-item
            hide-label
            field="template.id"
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
                v-model="formData.template.id"
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
                  :key="item.value"
                  :value="item.label"
                  >{{ item.label }}</a-option
                >
              </seal-select>
            </div>
          </a-form-item>
        </a-form>
      </div>
      <div>
        <a-spin class="variables" style="width: 100%" :loading="asyncLoading">
          <GroupForm
            ref="groupForm"
            :field-list="fieldSchemaList"
            :async-loading="asyncLoading"
            :original-form-data="originFormData.attributes || {}"
          ></GroupForm>
        </a-spin>
      </div>
    </div>
  </ModuleWrapper>
</template>

<script lang="ts" setup>
  import _, { get, find, cloneDeep, reduce, toString } from 'lodash';
  import { ref, computed, provide, watch, PropType } from 'vue';
  import ModuleWrapper from '@/components/module-wrapper/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import useScrollToView from '@/hooks/use-scroll-to-view';
  import GroupTitle from '@/components/group-title/index.vue';
  import {
    validateLabelNameRegx,
    PageAction,
    InputWidth,
    EnvironmentTypeMap
  } from '@/views/config';
  import GroupForm from '@/components/form-create/group-form.vue';
  import ViewForm from '@/components/form-create/view-form.vue';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import { initFormState } from '@/components/dynamic-form/utils/init-form-state';
  import keyValueLabels from '@/components/form-create/custom-components/key-value-labels.vue';
  import primaryButtonGroup from '@/components/drop-button-group/primary-button-group.vue';
  import semverEq from 'semver/functions/eq';
  import semverGt from 'semver/functions/gt';
  import { SelectorAction } from '../config';
  import { MatchingRule } from '../config/interface';
  import { queryItemTemplatesVersions } from '../../templates/api';

  type SelectorType =
    | 'environmentLabels'
    | 'resourceLabels'
    | 'environmentName'
    | 'environmentType'
    | 'projectName';

  const props = defineProps({
    originFormData: {
      type: Object as PropType<MatchingRule>,
      default() {
        return {};
      }
    },
    action: {
      type: String,
      default() {
        return PageAction.CREATE;
      }
    },
    templateList: {
      type: Array as PropType<{ value: string; label: string }[]>,
      default() {
        return [];
      }
    },
    ruleList: {
      type: Array,
      default() {
        return [];
      }
    },
    showDelete: {
      type: Boolean,
      default() {
        return false;
      }
    },
    dataId: {
      type: String,
      default() {
        return '';
      }
    }
  });
  const emits = defineEmits(['cancel', 'save', 'versionChange', 'delete']);
  const { scrollToView } = useScrollToView();
  const formData = ref<MatchingRule>({
    attributes: {},
    name: '',
    selector: {
      environmentLabels: {},
      environmentName: '',
      environmentType: '',
      projectName: '',
      resourceLabels: {}
    },
    template: {
      id: '',
      name: '',
      version: ''
    }
  });
  let copyFormData: any = null;
  const { route, router, t } = useCallCommon();
  const formref = ref();
  const groupForm = ref();
  const asyncLoading = ref(false);
  const validateTrigger = ref(false);
  const versionMap = ref({ nv: '', ov: '' });
  const templateVersionList = ref<any[]>([]);
  const fieldSchemaList = ref<any[]>([]);
  const templateVersionFormCache = ref<any>({});
  const uiSchema = ref<any>({});
  const selectors = ref<Set<string>>(new Set());

  provide('showHintInput', true);

  const actionList = computed(() => {
    return _.map(SelectorAction, (item) => {
      return {
        ...item,
        disabled: selectors.value.has(item.value)
      };
    });
  });
  const virtualListProps = computed(() => {
    if (props.templateList.length > 20) {
      return {
        height: 200
      };
    }
    return undefined;
  });

  const handleDelete = () => {
    emits('delete');
  };
  const validateLabels = (val, callback) => {
    if (_.keys(val).length) {
      callback();
      return;
    }
    const valid = _.some(_.keys(val), (key) => {
      return !key;
    });
    if (valid) {
      callback('请输入标签');
      return;
    }
    callback();
  };
  const validateNameuniq = (val, callback) => {
    if ([PageAction.EDIT, PageAction.VIEW]) {
      callback();
      return;
    }
    const data = find(props.ruleList, (item) => get(item, 'name') === val);
    if (data) {
      callback(t('applications.applications.rule.modules.name'));
      return;
    }
    callback();
  };
  const handleAddSelector = (selector) => {
    selectors.value.add(selector);
  };
  const handleDeleteSelector = (selector: SelectorType) => {
    formData.value.selector = _.omit(formData.value.selector, [selector]);
    selectors.value.delete(selector);
  };
  const setTemplateInfo = (moduleData) => {
    const variables =
      _.cloneDeep(
        _.get(moduleData, 'uiSchema.openAPISchema.components.schemas.variables')
      ) || {};
    const result = initFormState(variables);
    fieldSchemaList.value = result.fieldSchemaList;
  };
  const getTemplateVersions = async () => {
    try {
      const params = {
        templateID: formData.value.template.id,
        extract: ['-uiSchema', '-schema']
      };
      const { data } = await queryItemTemplatesVersions(params);
      templateVersionList.value = _.map(data.items || [], (item) => ({
        label: item.version,
        value: item.id,
        template: item
      })).sort((v1, v2) => {
        if (semverEq(v1.label, v2.label)) {
          return 0;
        }
        if (semverGt(v1.label, v2.label)) {
          return -1;
        }
        return 1;
      });
    } catch (error) {
      templateVersionList.value = [];
    }
  };
  const getTemplateSchemaByVersion = async () => {
    if (!formData.value.template.version) {
      return {};
    }
    try {
      asyncLoading.value = true;
      const params = {
        templateID: formData.value.template.id,
        query: formData.value.template.version,
        isProjectContext: false
      };
      const { data } = await queryItemTemplatesVersions(params);
      return get(data, 'items[0]', {});
    } catch (error) {
      return {};
    } finally {
      asyncLoading.value = false;
    }
  };

  const handleVersionChange = async () => {
    uiSchema.value = await getTemplateSchemaByVersion();
    setTemplateInfo(uiSchema.value);
    formData.value.attributes = {};
    groupForm.value?.clearFormValidStatus?.();
    setTimeout(() => {
      emits('versionChange');
    }, 100);
  };

  const handleTemplateChange = async () => {
    await getTemplateVersions();

    formData.value.template.version = get(
      templateVersionList.value,
      '0.label',
      ''
    );
    await handleVersionChange();
    templateVersionFormCache.value = {};
    setTimeout(() => {
      versionMap.value = { ov: '', nv: '' };
    }, 20);
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
  const getSchema = () => {
    return uiSchema.value;
  };
  const submit = async () => {
    const res = await formref.value?.validate();
    const groupFormRes = await groupForm.value?.getData();
    validateTrigger.value = true;
    if (!res && groupFormRes) {
      formData.value.attributes = {
        ...reduce(
          groupFormRes,
          (obj, s) => {
            obj = _.merge(obj, s.formData);
            return obj;
          },
          {}
        )
      };

      return formData.value;
    }
    scrollToView();
    return false;
  };

  const init = async () => {
    if (props.action === PageAction.EDIT && props.dataId) {
      formData.value = _.cloneDeep(props.originFormData);
      const moduleData = await getTemplateSchemaByVersion();
      setTemplateInfo(moduleData);
      templateVersionFormCache.value = {};
    } else {
      formData.value.template.id = get(props.templateList, '0.value', '');
      await handleTemplateChange();
    }
  };
  watch(
    () => formData.value.template.version,
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
  watch(
    () => props.templateList,
    () => {
      if (!props.templateList.length) {
        return;
      }
      init();
    },
    {
      immediate: true
    }
  );

  defineExpose({
    submit,
    cancel,
    getSchema
  });
  const initData = async () => {
    copyFormData = _.cloneDeep(formData);
  };

  initData();
</script>

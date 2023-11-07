<template>
  <ModuleWrapper :status="true">
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
          <a-form-item
            hide-label
            field="templateVersion.template.id"
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
                v-model="formData.templateVersion.template.id"
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
            field="templateVersion.id"
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
                v-model="formData.templateVersion.id"
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
                  :value="item.value"
                  >{{ item.label }}</a-option
                >
              </seal-select>
            </div>
          </a-form-item>
          <GroupTitle :bordered="false" title="选择器" flex-start> </GroupTitle>
          <a-form-item
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
          </a-form-item>
          <a-form-item
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
          </a-form-item>
          <a-form-item
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
          </a-form-item>
          <a-form-item
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
          </a-form-item>
          <a-form-item
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
  import _, { get, find, cloneDeep, reduce, toString, template } from 'lodash';
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
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import { initFormState } from '@/components/dynamic-form/utils/init-form-state';
  import keyValueLabels from '@/components/form-create/custom-components/key-value-labels.vue';
  import semverEq from 'semver/functions/eq';
  import semverGt from 'semver/functions/gt';
  import { MatchingRule } from '../config/interface';
  import {
    queryTemplateSchemaByVersionId,
    queryItemTemplatesVersions
  } from '../../templates/api';

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
    dataId: {
      type: String,
      default() {
        return '';
      }
    }
  });
  const emits = defineEmits(['cancel', 'save']);
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
    templateVersion: {
      id: '',
      name: '',
      version: '',
      project: {
        id: '',
        name: ''
      },
      template: {
        id: ''
      }
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

  provide('showHintInput', true);

  const virtualListProps = computed(() => {
    if (props.templateList.length > 20) {
      return {
        height: 200
      };
    }
    return undefined;
  });

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

  const setTemplateInfo = (moduleData) => {
    const variables =
      _.cloneDeep(_.get(moduleData, 'uiSchema.components.schemas.variables')) ||
      {};
    const result = initFormState(variables);
    fieldSchemaList.value = result.fieldSchemaList;
  };
  const getTemplateVersions = async () => {
    try {
      const params = {
        templateID: formData.value.templateVersion?.template?.id,
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
    try {
      asyncLoading.value = true;
      const params = {
        templateVersionID: formData.value.templateVersion?.id
      };
      const { data } = await queryTemplateSchemaByVersionId(params);
      return data;
    } catch (error) {
      return {};
    } finally {
      asyncLoading.value = false;
    }
  };

  const handleVersionChange = async () => {
    const moduleData = await getTemplateSchemaByVersion();
    setTemplateInfo(moduleData);
    formData.value.attributes = {};
    groupForm.value?.clearFormValidStatus?.();
  };

  const handleTemplateChange = async () => {
    await getTemplateVersions();

    formData.value.templateVersion.version = get(
      templateVersionList.value,
      '0.label',
      ''
    );
    formData.value.templateVersion.id = get(
      templateVersionList.value,
      '0.value',
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
      formData.value.templateVersion.template.id = get(
        props.templateList,
        '0.value',
        ''
      );
      await handleTemplateChange();
    }
  };
  watch(
    () => formData.value.templateVersion.version,
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
    cancel
  });
  const initData = async () => {
    copyFormData = _.cloneDeep(formData);
  };

  initData();
</script>

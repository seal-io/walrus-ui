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
      <div>
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
              v-if="pageAction === PageAction.EDIT"
              v-model="formData.name"
              allow-clear
              :required="true"
              :placeholder="$t('common.table.name')"
              :style="{ width: `${InputWidth.LARGE}px` }"
              :max-length="63"
              show-word-limit
            ></seal-input>
            <SealFormItemWrap
              v-else
              :label="$t('common.table.name')"
              :style="{ width: `${InputWidth.LARGE}px` }"
            >
              {{ formData.name }}
            </SealFormItemWrap>
            <template #extra>
              <div
                class="tips"
                :style="{ 'max-width': `${InputWidth.LARGE}px` }"
                >{{ $t('common.validate.labelName') }}</div
              >
            </template>
          </a-form-item>
          <GroupTitle
            :bordered="false"
            :title="$t('resource.definition.detail.seletor')"
            flex-start
          >
            <template #title>
              <span>{{ $t('resource.definition.detail.seletor') }}</span>
              <primaryButtonGroup
                v-if="pageAction === PageAction.EDIT"
                :action-list="actionList"
                @select="handleAddSelector"
              >
                <a-link class="m-l-10">
                  <icon-plus class="size-14" style="stroke-width: 4" />
                  <span class="mleft-5">{{ $t('common.button.add') }}</span>
                </a-link>
              </primaryButtonGroup>
            </template>
          </GroupTitle>
          <a-form-item
            v-if="selectors.has('projectName')"
            field="selector.projectName"
            hide-label
            :label="$t('resource.definition.detail.projectName')"
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
            <div v-if="pageAction === PageAction.EDIT">
              <seal-input
                v-model="formData.selector.projectName"
                allow-clear
                :required="true"
                :label="$t('resource.definition.detail.projectName')"
                :style="{ width: `${InputWidth.LARGE}px` }"
                :max-length="63"
                show-word-limit
              ></seal-input>
              <a-button
                type="text"
                status="danger"
                @click="handleDeleteSelector('projectName')"
              >
                <template #icon>
                  <icon-delete class="size-16" />
                </template>
              </a-button>
            </div>
            <SealFormItemWrap
              v-else
              :label="$t('resource.definition.detail.projectName')"
              :style="{ width: `${InputWidth.LARGE}px` }"
            >
              {{ formData.selector.projectName }}
            </SealFormItemWrap>
            <template #extra>
              <div
                class="tips"
                :style="{ 'max-width': `${InputWidth.LARGE}px` }"
                >{{ $t('common.validate.labelName') }}</div
              >
            </template>
          </a-form-item>
          <a-form-item
            v-if="selectors.has('environmentName')"
            field="selector.environmentName"
            hide-label
            :label="$t('resource.definition.detail.envName')"
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
            <div v-if="pageAction === PageAction.EDIT">
              <seal-input
                v-model="formData.selector.environmentName"
                allow-clear
                :required="true"
                :label="$t('resource.definition.detail.envName')"
                :style="{ width: `${InputWidth.LARGE}px` }"
                :max-length="63"
                show-word-limit
              ></seal-input>
              <a-button
                type="text"
                status="danger"
                @click="handleDeleteSelector('environmentName')"
              >
                <template #icon>
                  <icon-delete class="size-16" />
                </template>
              </a-button>
            </div>
            <SealFormItemWrap
              v-else
              :label="$t('resource.definition.detail.envName')"
              :style="{ width: `${InputWidth.LARGE}px` }"
            >
              {{ formData.selector.environmentName }}
            </SealFormItemWrap>
            <template #extra>
              <div
                class="tips"
                :style="{ 'max-width': `${InputWidth.LARGE}px` }"
                >{{ $t('common.validate.labelName') }}</div
              >
            </template>
          </a-form-item>
          <a-form-item
            v-if="selectors.has('environmentType')"
            hide-label
            field="selector.environmentType"
            :label="$t('applications.environment.type')"
            :rules="[
              {
                required: true,
                message: $t('applications.applications.rules.versions')
              }
            ]"
          >
            <div v-if="pageAction === PageAction.EDIT">
              <seal-select
                v-model="formData.selector.environmentType"
                :options="[]"
                :required="true"
                :label="$t('applications.environment.type')"
                :style="{ width: `${InputWidth.LARGE}px` }"
              >
                <a-option
                  v-for="item in _.keys(EnvironmentTypeMap)"
                  :key="item"
                  :value="item"
                  >{{ $t(EnvironmentTypeMap[item]) }}</a-option
                >
              </seal-select>
              <a-button
                type="text"
                status="danger"
                @click="handleDeleteSelector('environmentType')"
              >
                <template #icon>
                  <icon-delete class="size-16" />
                </template>
              </a-button>
            </div>
            <SealFormItemWrap
              v-else
              :label="$t('applications.environment.type')"
              :style="{ width: `${InputWidth.LARGE}px` }"
              >{{
                $t(
                  _.get(
                    EnvironmentTypeMap,
                    formData.selector.environmentType || '',
                    ''
                  )
                )
              }}</SealFormItemWrap
            >
          </a-form-item>
          <a-form-item
            v-if="selectors.has('environmentLabels')"
            field="selector.environmentLabels"
            :label="$t('resource.definition.detail.envTag')"
            hide-label
            :rules="[
              {
                validator: validateLabels,
                message: $t('resource.definition.detail.rules.labelKey')
              }
            ]"
          >
            <SealFormItemWrap
              :label="$t('resource.definition.detail.envTag')"
              :style="{ width: `${InputWidth.LARGE}px` }"
            >
              <keyValueLabels
                v-model:value="formData.selector.environmentLabels"
                labels-key="environmentLabels"
                :validate-trigger="validateTrigger"
                :labels="formData.selector"
                :page-action="pageAction"
              ></keyValueLabels>
            </SealFormItemWrap>
            <a-button
              v-if="pageAction === PageAction.EDIT"
              type="text"
              status="danger"
              @click="handleDeleteSelector('environmentLabels')"
            >
              <template #icon>
                <icon-delete class="size-16" />
              </template>
            </a-button>
          </a-form-item>
          <a-form-item
            v-if="selectors.has('resourceLabels')"
            field="selector.resourceLabels"
            :label="$t('resource.definition.detail.resourceTag')"
            hide-label
            :rules="[
              {
                validator: validateLabels,
                message: $t('resource.definition.detail.rules.labelKey')
              }
            ]"
          >
            <SealFormItemWrap
              :label="$t('resource.definition.detail.resourceTag')"
              :style="{ width: `${InputWidth.LARGE}px` }"
            >
              <keyValueLabels
                v-model:value="formData.selector.resourceLabels"
                labels-key="resourceLabels"
                :validate-trigger="validateTrigger"
                :labels="formData.selector"
                :page-action="pageAction"
              ></keyValueLabels>
            </SealFormItemWrap>
            <a-button
              v-if="pageAction === PageAction.EDIT"
              type="text"
              status="danger"
              @click="handleDeleteSelector('resourceLabels')"
            >
              <template #icon>
                <icon-delete class="size-16" />
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
                  <span>{{ $t('menu.operatorHub.module') }}</span>
                  <!-- <a-tooltip position="tl">
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
                  </a-tooltip> -->
                </div>
              </template>
            </GroupTitle>
          </div>
          <a-form-item
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
            <div v-if="pageAction === PageAction.EDIT">
              <seal-select
                v-model="formData.template.template.id"
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
            <SealFormItemWrap
              v-else
              :label="$t('applications.applications.table.module')"
              :style="{ width: `${InputWidth.LARGE}px` }"
            >
              {{ formData.template.name }}
            </SealFormItemWrap>
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
            <div v-if="pageAction === PageAction.EDIT">
              <seal-select
                v-model="formData.template.version"
                :options="[]"
                :required="true"
                :placeholder="$t('applications.applications.history.version')"
                :style="{ width: `${InputWidth.LARGE}px` }"
                :loading="asyncLoading"
                allow-search
                @popup-visible-change="handleVersionPopupVisibleChange"
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
            <SealFormItemWrap
              v-else
              :label="$t('applications.applications.history.version')"
              :style="{ width: `${InputWidth.LARGE}px` }"
            >
              {{ formData.template.version }}
            </SealFormItemWrap>
          </a-form-item>
        </a-form>
      </div>
      <ModuleWrapper :show-delete="false" class="config-wrapper">
        <template #title>
          <span>{{ $t('common.title.config') }}</span>
        </template>
        <a-spin class="variables" style="width: 100%" :loading="asyncLoading">
          <GroupForm
            v-if="pageAction === PageAction.EDIT"
            ref="groupForm"
            :field-list="fieldSchemaList"
            :async-loading="asyncLoading"
            :original-form-data="originFormData.attributes || {}"
          ></GroupForm>
          <ViewForm
            v-if="pageAction === PageAction.VIEW"
            style="width: 100%; padding: 0"
            :form-data="originFormData.attributes"
            :field-list="fieldSchemaList"
          ></ViewForm>
        </a-spin>
      </ModuleWrapper>
    </div>
  </ModuleWrapper>
</template>

<script lang="ts" setup>
  import _, { get, find, cloneDeep, reduce, toString } from 'lodash';
  import { ref, computed, provide, watch, PropType, onMounted } from 'vue';
  import ModuleWrapper from '@/components/module-wrapper/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import useScrollToView from '@/hooks/use-scroll-to-view';
  import GroupTitle from '@/components/group-title/index.vue';
  import {
    validateLabelNameRegx,
    PageAction,
    InputWidth,
    EnvironmentTypeMap,
    InjectShowInputHintKey
  } from '@/views/config';
  import GroupForm from '@/components/form-create/group-form.vue';
  import ViewForm from '@/components/form-create/view-form.vue';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import { initFormState } from '@/components/dynamic-form/utils/init-form-state';
  import keyValueLabels from '@/components/form-create/custom-components/key-value-labels.vue';
  import primaryButtonGroup from '@/components/drop-button-group/primary-button-group.vue';
  import labelsList from '@/views/application-management/services/components/labels-list.vue';
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
    pageAction: {
      type: String,
      default() {
        return PageAction.EDIT;
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
      version: '',
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
  const uiSchema = ref<any>({});
  const selectors = ref<Set<string>>(new Set());

  provide(InjectShowInputHintKey, true);

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

  const initSelectors = () => {
    selectors.value = new Set();
    if (formData.value.selector.projectName) {
      selectors.value.add('projectName');
    }
    if (formData.value.selector.environmentName) {
      selectors.value.add('environmentName');
    }
    if (formData.value.selector.environmentType) {
      selectors.value.add('environmentType');
    }
    if (_.keys(formData.value.selector.environmentLabels).length) {
      selectors.value.add('environmentLabels');
    }
    if (_.keys(formData.value.selector.resourceLabels).length) {
      selectors.value.add('resourceLabels');
    }
  };
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
      callback(t('resource.definition.detail.rules.labelKey'));
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
    _.each(fieldSchemaList.value, (item) => {
      item.uiSchema.required = false;
      _.each(item.uiSchema.rules, (rule) => {
        if (rule.required) {
          rule.required = false;
        }
      });
    });
  };
  const getTemplateVersions = async () => {
    try {
      const params = {
        templateID: formData.value.template.template.id,
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
        templateID: formData.value.template.template.id,
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

  const handleVersionPopupVisibleChange = (visible) => {
    if (visible && !templateVersionList.value.length) {
      getTemplateVersions();
    }
  };
  const handleVersionChange = async () => {
    formData.value.template.id = _.get(
      _.find(
        templateVersionList.value,
        (item) => item.label === formData.value.template.version
      ),
      'value',
      ''
    );
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
    formData.value.template.name = _.get(
      _.find(
        props.templateList,
        (item) => item.value === formData.value.template.template.id
      ),
      'label',
      ''
    );
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
    if (!props.templateList.length) {
      return;
    }
    if (props.dataId) {
      formData.value = _.cloneDeep(props.originFormData);
      const moduleData = await getTemplateSchemaByVersion();
      setTemplateInfo(moduleData);
      templateVersionFormCache.value = {};
      initSelectors();
    } else {
      formData.value.template.template.id = get(
        props.templateList,
        '0.value',
        ''
      );
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

  defineExpose({
    submit,
    cancel,
    getSchema
  });
  const initData = async () => {
    copyFormData = _.cloneDeep(formData);
  };
  onMounted(() => {
    init();
  });
  initData();
</script>

<style lang="less" scoped>
  .config-wrapper {
    &.mo-wrap {
      border: none;

      :deep(.content) {
        padding: 10px 0;
      }
    }
  }
</style>

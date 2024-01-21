<template>
  <div>
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
            :validate-trigger="['change', 'input']"
            :rules="[
              {
                required: true,
                message: $t('resource.definition.detail.rules.ruleName')
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
              :view-status="pageAction === PageAction.VIEW"
              allow-clear
              :required="true"
              :placeholder="$t('common.table.name')"
              :style="{ width: `${InputWidth.LARGE}px` }"
              :max-length="validateInputLength.NAME"
              show-word-limit
              @change="handleNameChange"
            ></seal-input>
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
                :actions="actionList"
                item-type="text"
                @select="handleAddSelector"
              >
                <a-link class="m-l-10">
                  <icon-plus class="size-14" style="stroke-width: 4" />
                  <span class="mleft-5 font-13" style="line-height: 1">{{
                    $t('common.button.add')
                  }}</span>
                </a-link>
              </primaryButtonGroup>
            </template>
          </GroupTitle>
          <a-form-item
            v-if="selectors.has('projectNames')"
            field="selector.projectNames"
            hide-label
            :label="$t('resource.definition.detail.projectName')"
            :validate-trigger="['change']"
            :rules="[
              {
                required: true,
                message: $t('resource.definition.detail.rules.projectName')
              }
            ]"
          >
            <seal-select
              v-model="formData.selector.projectNames"
              :view-status="pageAction === PageAction.VIEW"
              :options="projectList"
              :required="true"
              :multiple="true"
              :max-tag-count="2"
              :label="$t('resource.definition.detail.projectName')"
              :style="{ width: `${InputWidth.LARGE}px` }"
              @change="handleProjectChange"
            >
            </seal-select>
            <a-button
              v-if="pageAction === PageAction.EDIT"
              type="text"
              status="danger"
              @click="handleDeleteSelector('projectNames')"
            >
              <template #icon>
                <icon-delete class="size-16" />
              </template>
            </a-button>
          </a-form-item>
          <a-form-item
            v-if="selectors.has('projectLabels')"
            field="selector.projectLabels"
            :label="$t('resource.definition.detail.projectTag')"
            hide-label
            :rules="[
              {
                validator(val, callback) {
                  if (!projectLabels.list.length) {
                    callback();
                    return;
                  }
                  const valid = _.some(projectLabels.list, (item) => {
                    return !_.trim(item.key);
                  });
                  if (valid) {
                    callback(t('resource.definition.detail.rules.labelKey'));
                    return;
                  }
                  callback();
                },
                message: $t('resource.definition.detail.rules.labelKey')
              }
            ]"
          >
            <SealFormItemWrap
              :label="$t('resource.definition.detail.projectTag')"
              :style="{ width: `${InputWidth.LARGE}px` }"
            >
              <keyValueLabels
                v-model:value="formData.selector.projectLabels"
                v-model:label-list="projectLabels.list"
                :validate-trigger="validateTrigger"
                :labels="projectLabels.labels"
                :page-action="pageAction"
              ></keyValueLabels>
            </SealFormItemWrap>
            <a-button
              v-if="pageAction === PageAction.EDIT"
              type="text"
              status="danger"
              @click="handleDeleteSelector('projectLabels')"
            >
              <template #icon>
                <icon-delete class="size-16" />
              </template>
            </a-button>
          </a-form-item>
          <a-form-item
            v-if="selectors.has('environmentNames')"
            field="selector.environmentNames"
            hide-label
            :label="$t('resource.definition.detail.envName')"
            :validate-trigger="['change']"
            :rules="[
              {
                required: true,
                message: $t('resource.definition.detail.rules.envName')
              }
            ]"
          >
            <SealFormItemWrap
              :style="{ width: `${InputWidth.LARGE}px` }"
              :label="$t('resource.definition.detail.envName')"
            >
              <CommonList
                style="width: 100%"
                :label="$t('resource.definition.detail.envName')"
                :model-value="formData.selector.environmentNames"
                :view-status="pageAction === PageAction.EDIT"
                @update:model-value="
                  (val) => {
                    formData.selector.environmentNames = val;
                  }
                "
              ></CommonList>
            </SealFormItemWrap>

            <a-button
              v-if="pageAction === PageAction.EDIT"
              type="text"
              status="danger"
              @click="handleDeleteSelector('environmentNames')"
            >
              <template #icon>
                <icon-delete class="size-16" />
              </template>
            </a-button>
          </a-form-item>
          <a-form-item
            v-if="selectors.has('environmentTypes')"
            hide-label
            field="selector.environmentTypes"
            :label="$t('applications.environment.type')"
            :style="{ width: `${InputWidth.LARGE}px` }"
            :rules="[
              {
                required: true,
                message: $t('resource.definition.detail.rules.envType')
              }
            ]"
          >
            <seal-select
              v-model="formData.selector.environmentTypes"
              :view-status="pageAction === PageAction.VIEW"
              :options="
                _.map(EnvironmentTypeList, (item) => {
                  return {
                    label: t(item.label),
                    value: item.value
                  };
                })
              "
              :multiple="true"
              :required="true"
              :max-tag-count="3"
              :label="$t('applications.environment.type')"
              :style="{ width: `${InputWidth.LARGE}px` }"
            >
            </seal-select>
            <a-button
              v-if="pageAction === PageAction.EDIT"
              type="text"
              status="danger"
              @click="handleDeleteSelector('environmentTypes')"
            >
              <template #icon>
                <icon-delete class="size-16" />
              </template>
            </a-button>
          </a-form-item>
          <a-form-item
            v-if="selectors.has('environmentLabels')"
            field="selector.environmentLabels"
            :label="$t('resource.definition.detail.envTag')"
            hide-label
            :rules="[
              {
                validator(val, callback) {
                  if (!environmentLabels.list.length) {
                    callback();
                    return;
                  }
                  const valid = _.some(environmentLabels.list, (item) => {
                    return !_.trim(item.key);
                  });
                  if (valid) {
                    callback(t('resource.definition.detail.rules.labelKey'));
                    return;
                  }
                  callback();
                },
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
                v-model:label-list="environmentLabels.list"
                :style="{ width: `100%` }"
                :validate-trigger="validateTrigger"
                :labels="environmentLabels.labels"
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
                validator(val, callback) {
                  if (!resourceLabels.list.length) {
                    callback();
                    return;
                  }
                  const valid = _.some(resourceLabels.list, (item) => {
                    return !_.trim(item.key);
                  });
                  if (valid) {
                    callback(t('resource.definition.detail.rules.labelKey'));
                    return;
                  }
                  callback();
                },
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
                v-model:label-list="resourceLabels.list"
                :validate-trigger="validateTrigger"
                :labels="resourceLabels.labels"
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
            <seal-select
              v-model="formData.template.template.id"
              :view-status="pageAction === PageAction.VIEW"
              :placeholder="$t('applications.applications.table.module')"
              :required="true"
              :virtual-list-props="virtualListProps"
              :options="templateList"
              :style="{ width: `${InputWidth.LARGE}px` }"
              allow-search
              @change="handleTemplateChange"
            >
            </seal-select>
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
            <seal-select
              v-model="formData.template.version"
              :view-status="pageAction === PageAction.VIEW"
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
          </a-form-item>
        </a-form>
      </div>
      <ModuleWrapper :show-delete="false" class="config-wrapper">
        <template #title>
          <span>{{ $t('common.title.config') }}</span>
        </template>
        <a-spin
          class="variables"
          style="width: 100%"
          :loading="asyncLoading"
          fill
        >
          <GroupForm
            ref="groupForm"
            v-model:form-data="formData.attributes"
            :ui-form-data="uiFormData"
            class="group-form"
            style="width: 100%"
            :schema="schemaVariables"
            @change="handleAttributeChange"
          ></GroupForm>
        </a-spin>
      </ModuleWrapper>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import _, { get, find, toString } from 'lodash';
  import {
    ref,
    computed,
    provide,
    watch,
    PropType,
    onMounted,
    nextTick,
    h
  } from 'vue';
  import { createAxiosToken } from '@/api/axios-chunk-request';
  import ModuleWrapper from '@/components/module-wrapper/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import useScrollToView from '@/hooks/use-scroll-to-view';
  import GroupTitle from '@/components/group-title/index.vue';
  import {
    validateLabelNameRegx,
    validateInputLength,
    PageAction,
    InputWidth,
    EnvironmentTypeMap,
    EnvironmentTypeList,
    InjectShowInputHintKey,
    InjectTraceKey,
    InjectSchemaFormStatusKey,
    InjectSchemaCustomMetaKey
  } from '@/views/config';
  import CommonList from '@/components/common-list/index.vue';
  import GroupForm from '@/components/dynamic-form/group-form.vue';
  import keyValueLabels from '@/components/form-create/custom-components/key-value-labels.vue';
  import primaryButtonGroup from '@/components/drop-button-group/primary-button-group.vue';
  import { queryEnvironmentsList } from '@/views/application-management/environments/api';
  import semverEq from 'semver/functions/eq';
  import semverGt from 'semver/functions/gt';
  import { SelectorAction } from '../config';
  import { MatchingRule } from '../config/interface';
  import { queryItemTemplatesVersions } from '../../templates/api';

  type SelectorType =
    | 'environmentLabels'
    | 'resourceLabels'
    | 'environmentNames'
    | 'environmentTypes'
    | 'projectNames'
    | 'projectLabels';

  const props = defineProps({
    title: {
      type: String,
      default() {
        return '';
      }
    },
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
    schemaFormAction: {
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
    },
    traceId: {
      type: String,
      default() {
        return '';
      }
    },
    projectList: {
      type: Array,
      default() {
        return [];
      }
    }
  });
  const emits = defineEmits(['cancel', 'save', 'update:title']);
  const { scrollToView } = useScrollToView();
  const formData = ref<MatchingRule>({
    attributes: {},
    name: '',
    selector: {
      projectNames: [],
      projectLabels: {},
      environmentLabels: {},
      environmentNames: [],
      environmentTypes: [],
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
  const { route, router, t } = useCallCommon();
  const envLoading = ref(false);
  const formref = ref();
  const groupForm = ref();
  const asyncLoading = ref(false);
  const validateTrigger = ref(false);
  const templateVersionList = ref<any[]>([]);
  const id = route.query.id as string;
  const environmentList = ref<any[]>([]);
  const uiSchema = ref<any>({});
  const environmentLabels = ref<any>({
    labels: {},
    list: []
  });
  const projectLabels = ref<any>({
    labels: {},
    list: []
  });
  const resourceLabels = ref<any>({
    labels: {},
    list: []
  });
  const selectors = ref<Set<string>>(new Set());
  const formDataAttributeCache = ref<any>({});
  const formAction = ref(props.schemaFormAction);
  const uiFormData = ref<any>({});

  provide(InjectShowInputHintKey, false);
  provide(
    InjectSchemaCustomMetaKey,
    ref({
      immutable: false
    })
  );

  const schemaVariables = ref<any>({});

  const actionList = computed(() => {
    return _.map(SelectorAction, (item) => {
      return {
        ...item,
        disabled: selectors.value.has(item.value)
      };
    });
  });
  const traceKey = computed(() => {
    return `${props.traceId}-${formAction.value}`;
  });

  const virtualListProps = computed(() => {
    if (props.templateList.length > 20) {
      return {
        height: 200
      };
    }
    return undefined;
  });

  provide(InjectSchemaFormStatusKey, ref(formAction));
  provide(InjectTraceKey, traceKey);

  const handleAttributeChange = () => {
    formDataAttributeCache.value[formData.value.template.version] = _.cloneDeep(
      formData.value.attributes
    );
  };
  const initSelectors = () => {
    selectors.value = new Set();
    if (formData.value.selector.projectNames) {
      selectors.value.add('projectNames');
    }
    if (formData.value.selector?.environmentNames?.length) {
      selectors.value.add('environmentNames');
    }
    if (formData.value.selector?.environmentTypes?.length) {
      selectors.value.add('environmentTypes');
    }
    if (_.keys(formData.value.selector.environmentLabels).length) {
      selectors.value.add('environmentLabels');
    }
    if (_.keys(formData.value.selector.resourceLabels).length) {
      selectors.value.add('resourceLabels');
    }
    if (_.keys(formData.value.selector.projectLabels).length) {
      selectors.value.add('projectLabels');
    }
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

  const handleNameChange = (val) => {
    emits('update:title', val);
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

    schemaVariables.value = variables;
  };

  const handleProjectChange = () => {
    if (formData.value.selector.environmentNames) {
      formData.value.selector.environmentNames = [];
    }
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
      return get(data, 'items.0', {});
    } catch (error) {
      return {};
    } finally {
      asyncLoading.value = false;
    }
  };

  const handleVersionPopupVisibleChange = (visible) => {
    if (!formData.value.template?.template?.id) {
      return;
    }
    if (visible && !templateVersionList.value.length) {
      getTemplateVersions();
    }
  };

  const getFormDataAttributeCache = () => {
    if (
      formData.value.template.version ===
        props.originFormData.template.version &&
      formData.value.template?.template?.id ===
        props.originFormData.template?.template?.id
    ) {
      formData.value.attributes = _.cloneDeep(props.originFormData.attributes);
      formAction.value = PageAction.EDIT;
    } else if (
      _.get(formDataAttributeCache.value, [formData.value.template.version])
    ) {
      formData.value.attributes = _.cloneDeep(
        _.get(formDataAttributeCache.value, [formData.value.template.version])
      );
    } else {
      formData.value.attributes = {};
    }
    uiFormData.value = _.cloneDeep(formData.value.attributes);
  };
  const handleVersionChange = async () => {
    formAction.value = PageAction.CREATE;
    formData.value.template.id = _.get(
      _.find(
        templateVersionList.value,
        (item) => item.label === formData.value.template.version
      ),
      'value',
      ''
    );

    getFormDataAttributeCache();

    setTimeout(async () => {
      uiSchema.value = await getTemplateSchemaByVersion();
      setTemplateInfo(uiSchema.value);
    });
  };

  const handleTemplateChange = async () => {
    formDataAttributeCache.value = {};
    await getTemplateVersions();
    formData.value.template.name = _.get(
      _.find(
        props.templateList,
        (item) => item.value === formData.value.template?.template?.id
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
  };

  const getSchema = () => {
    return uiSchema.value;
  };
  const submit = async () => {
    const res = await formref.value?.validate();
    const hiddenFormData = groupForm.value?.getHiddenData?.();
    validateTrigger.value = true;
    if (!res) {
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

  const setLabels = () => {
    environmentLabels.value.labels = _.cloneDeep(
      formData.value.selector?.environmentLabels
    );
    resourceLabels.value.labels = _.cloneDeep(
      formData.value.selector?.resourceLabels
    );
    projectLabels.value.labels = _.cloneDeep(
      formData.value.selector?.projectLabels
    );
  };
  const init = async () => {
    if (!props.templateList.length) {
      return;
    }
    formData.value.name = props.originFormData.name;
    if (props.dataId) {
      formData.value = _.cloneDeep(props.originFormData);
      uiFormData.value = _.cloneDeep(props.originFormData?.attributes || {});
      const moduleData = await getTemplateSchemaByVersion();

      setTemplateInfo(moduleData);
      initSelectors();
    } else {
      formData.value.template.template.id = get(
        props.templateList,
        '0.value',
        ''
      );
      await handleTemplateChange();
    }
    setLabels();
  };

  defineExpose({
    submit,
    getSchema
  });

  onMounted(() => {
    init();
  });
</script>

<style lang="less" scoped>
  .config-wrapper {
    &.mo-wrap {
      :deep(.content) {
        padding: 20px;
      }
    }

    .group-form {
      :deep(.label) {
        .star {
          display: none;
        }
      }
    }
  }
</style>

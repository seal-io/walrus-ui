<template>
  <div>
    <div ref="wrapper" class="wrap" :class="{ fullscreen: fullscreen }">
      <div class="flex">
        <a-space>
          <a-button
            v-if="activeKey === 'form'"
            type="text"
            style="color: rgb(var(--link-6))"
            @click="handleToggleMode('editor')"
          >
            <template #icon><icon-code /></template>
            Schema</a-button
          >
          <a-button
            v-if="activeKey === 'editor'"
            type="text"
            style="color: rgb(var(--link-6))"
            @click="handleToggleMode('form')"
          >
            <template #icon><icon-eye /></template>
            {{ $t('common.button.perview') }}</a-button
          >
        </a-space>
        <a-space
          v-if="
            page === 'template'
              ? projectID
                ? userStore.hasProjectResourceActions({
                    resource: Resources.TemplateVersions,
                    projectID,
                    actions: [Actions.PUT]
                  })
                : userStore.hasRolesActionsPermission({
                    resource: Resources.TemplateVersions,
                    actions: [Actions.PUT]
                  })
              : editable
          "
          :size="16"
        >
          <a-button
            v-if="readOnly"
            type="text"
            style="color: rgb(var(--link-6))"
            @click="handleEdit"
          >
            <template #icon><icon-edit /></template>
            {{ $t('common.button.edit') }}
          </a-button>
          <a-button
            v-if="!readOnly"
            type="primary"
            @click="handlePutTemplateSchema"
            >{{ $t('common.button.save') }}</a-button
          >
          <a-button v-if="!readOnly" type="outline" @click="handleCancel">{{
            $t('common.button.cancel')
          }}</a-button>
          <div id="btns-wrap" class="btns-wrapp">
            <MoreButtonActions
              trigger="hover"
              :actions="actionList"
              container-id="#btns-wrap"
              style="top: 45px; right: 6px; left: auto"
              @select="(value) => handleClickAction(value)"
            ></MoreButtonActions>
          </div>
        </a-space>
      </div>
      <a-tabs
        v-model:active-key="activeKey"
        size="mini"
        class="edit-tab"
        lazy-load
      >
        <a-tab-pane key="editor" :title="$t('common.button.edit')">
          <div class="editor">
            <AceEditor
              ref="aceEditor"
              v-model="code"
              lang="yaml"
              :height="isFullscreen ? 'calc(100vh - 60px)' : `800px`"
              :read-only="readOnly"
              :editor-default-value="defaultCode"
            >
            </AceEditor>
          </div>
        </a-tab-pane>
        <a-tab-pane
          key="form"
          :title="$t('common.button.preview')"
          class="group-form-tab"
        >
          <div class="form" :class="{ isFullscreen }">
            <seal-spin :loading="loading" style="width: 100%">
              <groupForm
                v-if="!loading"
                :key="formKey"
                v-model:form-data="originFormData"
                :schema="schemaVariables"
              ></groupForm>
            </seal-spin>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { useUserStore } from '@/store';
  import { InjectSchemaFormStatusKey, PageAction } from '@/views/config';
  import { Resources, Actions } from '@/permissions/config';
  import { useFullscreen } from '@vueuse/core';
  import { Message } from '@arco-design/web-vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { PropType, ref, provide, watch, computed, nextTick } from 'vue';
  import AceEditor from '@/components/ace-editor/index.vue';
  import groupForm from '@/components/dynamic-form/group-form.vue';
  import {
    validateYaml,
    json2Yaml,
    yaml2Json
  } from '@/components/form-create/config/yaml-parse';
  import { FieldSchema } from '@/components/dynamic-form/config/interface';
  import { execSucceed, deleteModal } from '@/utils/monitor';
  import MoreButtonActions from '@/components/drop-button-group/more-button-actions.vue';
  import {
    putTemplateSchemaByVersionId,
    resetTemplateSchemaByVersionId
  } from '../api';
  import { schemaActionList } from '../config/index';

  const props = defineProps({
    schema: {
      type: Object as PropType<any>,
      default() {
        return null;
      }
    },
    height: {
      type: String,
      default() {
        return '100%';
      }
    },
    versionId: {
      type: String,
      default() {
        return '';
      }
    },
    templateInfo: {
      type: Object as PropType<any>,
      default() {
        return {};
      }
    },
    page: {
      type: String as PropType<'template' | 'definition'>,
      default() {
        return 'template';
      }
    },
    editable: {
      type: Boolean,
      default() {
        return true;
      }
    }
  });

  provide(InjectSchemaFormStatusKey, ref(PageAction.CREATE));
  const emits = defineEmits(['update', 'reset']);
  const userStore = useUserStore();
  const { route } = useCallCommon();
  const readOnly = ref(true);
  const wrapper = ref();
  const aceEditor = ref();
  const activeKey = ref('editor');
  const code = ref('');
  const defaultCode = ref('');
  const theme = ref('twilight');
  const fieldList = ref<FieldSchema[]>([]);
  const formData = ref({});
  const originFormData = ref({});
  const schemaVariables = ref<any>({});
  const projectID = route.params.projectId || '';
  const formKey = ref(Date.now());
  const fullscreen = ref(false);
  const loading = ref(true);
  const { isFullscreen, toggle } = useFullscreen(wrapper);

  const actionList = computed((row) => {
    const list = _.filter(schemaActionList, (item) => {
      return item.filterFun ? item.filterFun({ projectID }) : true;
    });
    const res = _.map(list, (o) => {
      const item = _.cloneDeep(o);
      item.disabled = _.isFunction(item.disabled)
        ? item.disabled?.(row)
        : item.disabled;
      return item;
    });
    return res;
  });

  const handleEdit = () => {
    readOnly.value = false;
    activeKey.value = 'editor';
  };

  const handleCancel = () => {
    readOnly.value = true;
    activeKey.value = 'editor';
    code.value = defaultCode.value;
    aceEditor.value?.setValue(defaultCode.value);
  };

  const handleToggleMode = (mode) => {
    activeKey.value = mode;
  };

  const previewForm = () => {
    const jsonCode = yaml2Json(code.value);
    const variables = _.get(jsonCode, 'components.schemas.variables');
    originFormData.value = {};
    formKey.value = Date.now();
    schemaVariables.value = variables;
    return {
      jsonCode,
      formData: formData.value
    };
  };

  const updateTemplateSchema = async () => {
    if (!props.versionId && props.page === 'template') return;

    const codeData = yaml2Json(code.value);
    await putTemplateSchemaByVersionId({
      templateVersionID: props.versionId,
      data: {
        uiSchema: {
          openAPISchema: codeData
        }
      }
    });
  };
  const updateDefinitionSchema = async () => {
    const codeData = yaml2Json(code.value);

    emits('reset', {
      openAPISchema: codeData
    });
  };
  const handlePutTemplateSchema = async () => {
    const valid = validateYaml(code.value);
    if (valid.error) {
      Message.error(valid.error.message);
      return;
    }
    try {
      if (props.page === 'template') {
        await updateTemplateSchema();
        execSucceed();
        emits('update');
      } else {
        await updateDefinitionSchema();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
    }
  };
  const handleResetTemplateSchema = async () => {
    if (!props.versionId && props.page === 'template') return;
    try {
      if (props.page === 'template') {
        await resetTemplateSchemaByVersionId({
          templateVersionID: props.versionId
        });
        execSucceed();
        emits('update');
      } else {
        emits('reset');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
    }
  };
  const handleClickAction = (val) => {
    if (val === 'reset') {
      deleteModal({
        title: 'operation.templates.detail.resetTitle',
        content: 'operation.templates.detail.resetTips',
        okText: 'common.button.confirm',
        style: {
          zIndex: 2000
        },
        onOk: handleResetTemplateSchema
      });
    }
    if (val === 'edit') {
      handleEdit();
    }
  };
  const initData = () => {
    const copyCustomSchema = _.cloneDeep(props.schema?.uiSchema?.openAPISchema);
    const info = _.get(copyCustomSchema, 'info');
    const openapi = _.get(copyCustomSchema, 'openapi');
    const originData = _.omit(copyCustomSchema, ['paths']);
    const schemaData = {
      openapi,
      info,
      ...originData
    };
    code.value = json2Yaml(schemaData);
    defaultCode.value = json2Yaml(schemaData);
  };

  watch(
    () => props.schema,
    (val) => {
      if (val) {
        initData();
        nextTick(() => {
          previewForm();
        });
      }
    },
    {
      immediate: true,
      deep: true
    }
  );
  watch(
    () => activeKey.value,
    () => {
      if (activeKey.value === 'form') {
        const valid = validateYaml(code.value);
        if (valid.error) {
          Message.error(valid.error.message);
          return;
        }
        setTimeout(() => {
          previewForm();
        });
        if (loading.value) {
          setTimeout(() => {
            loading.value = false;
          }, 500);
        }
      }
    },
    {
      immediate: true
    }
  );
</script>

<style lang="less" scoped>
  :not(:root):fullscreen::backdrop {
    z-index: 100;
  }

  .doc-refs {
    margin-bottom: 10px;
    padding: 20px;
    background-color: var(--color-fill-1);
    border-radius: var(--border-radius-small);

    .tips-wrap {
      margin: 0;
    }

    .title {
      margin-bottom: 10px;
    }

    .content {
      margin-left: 30px;
    }
  }

  .wrap {
    position: relative;

    &.fullscreen {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1500;
    }

    :deep(.arco-tabs-nav-tab) {
      display: none;
    }

    :deep(.arco-tabs-content) {
      padding-top: 0;
    }

    .group-form-tab {
      :deep(.arco-tabs-nav-tab) {
        display: flex;
      }

      :deep(.arco-tabs-content) {
        padding-top: var(--container-padding);
      }
    }

    .ace-wrapper {
      border-radius: 0 0 4px 4px;
    }

    .flex {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      background-color: var(--color-white);
      border: 1px solid var(--color-border-2);
      border-bottom: 0;
      border-radius: var(--border-radius-small) var(--border-radius-small) 0 0;

      .title {
        color: var(--color-text-2);
        font-weight: var(--font-weight-medium);
        font-size: var(--font-size-large);
      }
    }

    .editor {
      width: 100%;
      height: 100%;
    }

    .form {
      flex: 1;
      padding: 10px;
      overflow: auto;
      background-color: var(--color-white);
      border: 1px solid var(--color-border-2);
      border-radius: 0 0 var(--border-radius-small) var(--border-radius-small);

      &.isFullscreen {
        height: calc(100vh - 60px);
      }
    }
  }
</style>

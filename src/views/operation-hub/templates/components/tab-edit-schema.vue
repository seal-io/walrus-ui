<template>
  <div ref="wrapper" class="wrap" :style="{ height }">
    <div class="flex">
      <a-space>
        <span class="title">schema.yaml</span>
        <a-divider direction="vertical"></a-divider>
        <a-button type="text" size="small" @click="handleToggleFullScreen">
          <template #icon>
            <i
              class="icon iconfont"
              :class="{
                'icon-fullscreen': !isFullscreen,
                'icon-fullscreen-exit': isFullscreen
              }"
            ></i>
          </template>
          <span>{{
            isFullscreen
              ? $t('applications.environment.graph.cancelfullscreen')
              : $t('applications.environment.graph.fullscreen')
          }}</span>
        </a-button>
        <a-button
          v-if="activeKey === 'form'"
          size="small"
          type="text"
          @click="handleToggleMode('editor')"
        >
          <template #icon><icon-edit /></template>
          {{ $t('common.button.editmode') }}</a-button
        >
        <a-button
          v-if="activeKey === 'editor'"
          type="text"
          @click="handleToggleMode('form')"
        >
          <template #icon><icon-eye /></template>
          {{ $t('common.button.perview') }}</a-button
        >
      </a-space>
      <a-space
        v-if="
          projectID
            ? userStore.hasProjectResourceActions({
                resource: Resources.TemplateVersions,
                projectID,
                actions: [Actions.PUT]
              })
            : userStore.hasRolesActionsPermission({
                resource: Resources.TemplateVersions,
                actions: [Actions.PUT]
              })
        "
        :size="16"
      >
        <!-- <a-button
          v-if="readOnly"
          size="small"
          type="primary"
          @click="handleEdit"
        >
          <template #icon>
            <icon-edit></icon-edit>
          </template>
          {{ $t('common.button.edit') }}</a-button
        > -->
        <a-button
          v-if="!readOnly"
          size="small"
          type="primary"
          @click="handlePutTemplateSchema"
          >{{ $t('common.button.save') }}</a-button
        >
        <a-button
          v-if="!readOnly"
          size="small"
          type="outline"
          @click="handleCancel"
          >{{ $t('common.button.cancel') }}</a-button
        >
        <MoreButtonActions
          :actions="actionList"
          @select="(value) => handleClickAction(value)"
        ></MoreButtonActions>
      </a-space>
    </div>
    <a-tabs v-model:active-key="activeKey" size="mini" class="edit-tab">
      <a-tab-pane key="editor" :title="$t('common.button.edit')">
        <div class="editor">
          <AceEditor
            v-model="code"
            lang="yaml"
            :read-only="readOnly"
            :editor-default-value="defaultCode"
          >
          </AceEditor>
        </div>
      </a-tab-pane>
      <a-tab-pane key="form" :title="$t('common.button.preview')">
        <div class="form">
          <groupForm
            :show-filter="false"
            :field-list="fieldList"
            :original-form-data="formData"
          ></groupForm>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { useUserStore } from '@/store';
  import { Resources, Actions } from '@/permissions/config';
  import { useFullscreen } from '@vueuse/core';
  import useCallCommon from '@/hooks/use-call-common';
  import { PropType, ref, watch, computed } from 'vue';
  import AceEditor from '@/components/ace-editor/index.vue';
  import groupForm from '@/components/form-create/group-form.vue';
  import {
    json2Yaml,
    yaml2Json
  } from '@/components/form-create/config/yaml-parse';
  import { initFormState } from '@/components/dynamic-form/utils/init-form-state';
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
        return {};
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
    }
  });

  const emits = defineEmits(['update']);
  const userStore = useUserStore();
  const { route } = useCallCommon();
  const readOnly = ref(true);
  const wrapper = ref();
  const activeKey = ref('editor');
  const code = ref('');
  const defaultCode = ref('');
  const fieldList = ref<FieldSchema[]>([]);
  const formData = ref({});
  const projectID = route.params.projectId as string;
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
  };

  const handleToggleMode = (mode) => {
    activeKey.value = mode;
  };

  const handleToggleFullScreen = () => {
    toggle();
  };
  const handlePutTemplateSchema = async () => {
    if (!props.versionId) return;
    try {
      const codeData = yaml2Json(code.value);
      const variables = _.get(codeData, 'components.schemas.variables');
      const copyCustomSchema = _.cloneDeep(props.schema.customizeOpenAPISchema);
      const data = _.set(
        copyCustomSchema,
        'components.schemas.variables',
        variables
      );
      await putTemplateSchemaByVersionId({
        templateVersionID: props.versionId,
        data: {
          customizeOpenAPISchema: data
        }
      });
      execSucceed();
      emits('update');
    } catch (error) {
      // eslint-disable-next-line no-console
    }
  };
  const handleResetTemplateSchema = async () => {
    if (!props.versionId) return;
    try {
      await resetTemplateSchemaByVersionId({
        templateVersionID: props.versionId
      });
      execSucceed();
      emits('update');
    } catch (error) {
      // eslint-disable-next-line no-console
    }
  };
  const handleClickAction = (val) => {
    if (val === 'reset') {
      deleteModal({
        title: 'common.button.resetdefault',
        content: 'operation.templates.detail.resetTips',
        okText: 'common.button.continue',
        onOk: handleResetTemplateSchema
      });
    }
    if (val === 'edit') {
      handleEdit();
    }
  };
  const initData = () => {
    const copyCustomSchema = _.cloneDeep(props.schema.customizeOpenAPISchema);
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

  const previewForm = () => {
    const jsonCode = yaml2Json(code.value);
    const variables = _.get(jsonCode, 'components.schemas.variables');
    const res = initFormState(variables);
    fieldList.value = res.fieldSchemaList;
    formData.value = res.formData;
  };

  watch(
    () => props.schema,
    (val) => {
      if (val) {
        initData();
        previewForm();
      }
    },
    {
      immediate: true
    }
  );
  watch(
    () => activeKey.value,
    () => {
      if (activeKey.value === 'form') {
        previewForm();
      }
    },
    {
      immediate: true
    }
  );
</script>

<style lang="less" scoped>
  .wrap {
    :deep(.arco-tabs-nav-tab) {
      display: none;
    }

    :deep(.arco-tabs-content) {
      padding-top: 0;
    }

    .ace-wrapper {
      border-radius: 0 0 4px 4px;
    }

    .flex {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      background-color: #fff;
      border: 1px solid var(--color-border-2);
      border-bottom: 0;
      border-radius: 4px 4px 0 0;

      .title {
        color: var(--color-text-2);
        font-weight: 500;
        font-size: 16px;
      }
    }

    .editor {
      width: 100%;
      height: 100%;
    }

    .form {
      flex: 1;
      height: 100vh;
      padding: 10px;
      overflow: auto;
      background-color: #fff;
      border: 1px solid var(--color-border-2);
      border-radius: 0 0 var(--border-radius-small) var(--border-radius-small);
    }
  }
</style>

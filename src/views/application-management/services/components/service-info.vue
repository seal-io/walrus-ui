<template>
  <div class="service">
    <GroupForm
      ref="groupForm"
      style="padding: 10px 20px"
      :form-data="serviceInfo.attributes"
      :schema="schema"
    ></GroupForm>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import useCallCommon from '@/hooks/use-call-common';
  import { onMounted, nextTick, provide, ref, watch, inject } from 'vue';
  import { InjectSchemaFormStatusKey, PageAction } from '@/views/config';
  import GroupForm from '@/components/dynamic-form/group-form.vue';
  import { queryItemResourceDefinition } from '@/views/operation-hub/resource-definitions/api';
  import { queryItemTemplatesVersions } from '@/views/operation-hub/templates/api';
  import { ServiceDataType, ProvideServiceInfoKey } from '../config';

  const props = defineProps({
    isCollapsed: {
      type: Boolean,
      default: false
    }
  });
  const { route } = useCallCommon();
  const serviceInfo = inject(ProvideServiceInfoKey, ref<any>({}));
  const schema = ref<any>({});
  const action = ref<any>('view');
  const dataType = route.params.dataType as string;
  const loaded = ref(false);
  provide(InjectSchemaFormStatusKey, ref(PageAction.VIEW));

  const setTemplateInfo = (moduleData) => {
    const variables =
      _.cloneDeep(
        _.get(moduleData, 'uiSchema.openAPISchema.components.schemas.variables')
      ) || {};
    schema.value = variables;
  };
  const getItemResourceDefinitionSchema = async () => {
    if (!serviceInfo.value.type) return;
    const { data } = await queryItemResourceDefinition({
      id: serviceInfo.value.type
    });
    setTemplateInfo(data);
  };

  const getItemTemplatesVersionsSchema = async () => {
    if (!serviceInfo.value.template) return;
    const params = {
      templateID: serviceInfo.value.template.template.id,
      isProjectTemplate: !!serviceInfo.value.template?.project?.id,
      query: serviceInfo.value.template.version
    };
    const { data } = await queryItemTemplatesVersions(params);

    setTemplateInfo(_.get(data, 'items.0', {}));
  };
  const getSchema = async () => {
    try {
      if (dataType === ServiceDataType.resource) {
        await getItemResourceDefinitionSchema();
      } else {
        await getItemTemplatesVersionsSchema();
      }
      loaded.value = true;
    } catch (error) {
      // console.log('error', error);
    }
  };
  watch(
    () => props.isCollapsed,
    (val) => {
      if (val) {
        console.log('serviceInfo.value====', val);
        getSchema();
      }
    },
    {
      immediate: true
    }
  );
  onMounted(() => {
    schema.value = {};
    nextTick(() => {
      getSchema();
    });
  });
</script>

<style lang="less">
  .app-module-modal.arco-modal {
    .arco-tabs-tab {
      margin-right: 30px;
      margin-left: 0;
    }

    .arco-modal-body {
      padding-bottom: 0;
    }

    .arco-modal-footer {
      border-top: 1px solid var(--color-neutral-3);
    }
  }
</style>

<style lang="less" scoped>
  @import url('@/components/form-create/style/side-menu.less');

  .service {
    :deep(.arco-tabs-nav-tab-list) {
      padding-left: 10px;
    }

    :deep(.arco-form-item) {
      .arco-form-item-label {
        font-size: 14px;
      }
    }

    :deep(.arco-tabs-content) {
      padding: 16px 0 0 0;
    }

    :deep(.arco-descriptions-layout-inline-vertical) {
      .arco-descriptions-body {
        border: none;
      }

      .arco-descriptions-table {
        border-collapse: separate;
        border-spacing: 10px;

        .arco-descriptions-item {
          padding: 10px;
          border: 1px solid var(--color-border-2);
          border-radius: var(--border-radius-small);
        }
      }

      .arco-textarea-wrapper {
        background-color: var(--color-fill-2);
        border: none;
      }
    }
  }
</style>

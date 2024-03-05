<template>
  <div class="service">
    <a-spin :loading="loading" style="width: 100%">
      <GroupForm
        ref="groupForm"
        style="padding: 0"
        :ui-form-data="serviceInfo.attributes"
        :form-data="serviceInfo.attributes"
        :schema="schema"
        :layout="{
          direction: 'vertical',
          type: 'rounded'
        }"
      ></GroupForm>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import {
    onMounted,
    nextTick,
    toRef,
    provide,
    ref,
    watch,
    inject,
    onBeforeUnmount,
    computed
  } from 'vue';
  import { createAxiosToken } from '@/api/axios-chunk-request';
  import useCallCommon from '@/hooks/use-call-common';
  import { InjectSchemaFormStatusKey, PageAction } from '@/views/config';
  import GroupForm from '@/components/dynamic-form/group-form.vue';
  import { queryItemResourceDefinition } from '@/views/operation-hub/resource-definitions/api';
  import { queryEnvironmentAvailableDefinitions } from '@/views/application-management/environments/api';
  import {
    queryItemTemplatesVersions,
    queryTemplates
  } from '@/views/operation-hub/templates/api';
  import { ServiceDataType, ProvideServiceInfoKey } from '../config';

  const props = defineProps({
    detailInfo: {
      type: Object,
      default() {
        return {};
      }
    }
  });

  const { route } = useCallCommon();
  const schema = ref<any>({});
  const loaded = ref(false);
  const templateList = ref<any[]>([]);
  const requestFlag = ref(true);
  const loading = ref(false);
  let templateToken = createAxiosToken();
  let schemaToken = createAxiosToken();

  provide(InjectSchemaFormStatusKey, ref(PageAction.VIEW));

  const serviceInfo = computed(() => {
    return props.detailInfo;
  });

  // template options
  const getTemplates = async () => {
    try {
      const params = {
        page: -1,
        withGlobal: true,
        extract: ['-status']
      };
      const { data } = await queryTemplates(params, templateToken.token);
      templateList.value = _.map(data?.items || [], (item) => {
        return {
          ...item,
          label: item.name,
          value: item.id
        };
      });
    } catch (error) {
      templateList.value = [];
    }
  };

  const getResourceDefinitions = async () => {
    try {
      const environmentID = route.params.environmentId as string;
      const { data } = await queryEnvironmentAvailableDefinitions(
        {
          environmentID
        },
        templateToken.token
      );
      templateList.value = _.map(data || [], (item) => {
        return {
          ...item,
          label: item.type,
          value: item.type
        };
      });
    } catch (error) {
      templateList.value = [];
      // console.log(error)
    }
  };

  const initTemplateList = async () => {
    templateToken?.cancel?.();
    templateToken = createAxiosToken();

    const type = serviceInfo.value.type
      ? ServiceDataType.resource
      : ServiceDataType.service;
    if (type === ServiceDataType.resource) {
      await getResourceDefinitions();
    } else {
      await getTemplates();
    }
  };
  const setTemplateInfo = (moduleData) => {
    const variables =
      _.cloneDeep(
        _.get(moduleData, 'uiSchema.openAPISchema.components.schemas.variables')
      ) || {};
    schema.value = variables;
  };

  const getItemResourceDefinitionSchema = async () => {
    if (!serviceInfo.value.type) return;
    const resourceDefId = _.find(templateList.value, (item) => {
      return item.value === serviceInfo.value.type;
    })?.id;
    if (!resourceDefId) return;
    const { data } = await queryItemResourceDefinition(
      {
        id: resourceDefId as string
      },
      schemaToken.token
    );
    setTemplateInfo(data);
  };

  const getItemTemplatesVersionsSchema = async () => {
    if (!serviceInfo.value.template) return;
    const params = {
      templateID: serviceInfo.value.template.template.id,
      isProjectTemplate: !!serviceInfo.value.template?.project?.id,
      query: serviceInfo.value.template.version
    };
    const { data } = await queryItemTemplatesVersions(
      params,
      schemaToken.token
    );

    setTemplateInfo(_.get(data, 'items.0', {}));
  };
  const getSchema = async () => {
    schemaToken?.cancel?.();
    schemaToken = createAxiosToken();

    const type = serviceInfo.value.type
      ? ServiceDataType.resource
      : ServiceDataType.service;
    try {
      if (type === ServiceDataType.resource) {
        await getItemResourceDefinitionSchema();
      } else {
        await getItemTemplatesVersionsSchema();
      }
      loaded.value = true;
    } catch (error) {
      // console.log('error', error);
    }
  };
  const init = async () => {
    schema.value = {};
    loading.value = true;
    await initTemplateList();
    await getSchema();
    loading.value = false;
  };

  watch(
    () => serviceInfo.value.id,
    () => {
      if (serviceInfo.value.id) {
        init();
      }
    },
    {
      immediate: true
    }
  );
  onBeforeUnmount(() => {
    templateToken?.cancel?.();
    schemaToken?.cancel?.();
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
    min-height: 160px;
    text-align: left;

    :deep(.arco-tabs-nav-tab-list) {
      padding-left: 0;
    }

    :deep(.arco-form-item) {
      .arco-form-item-label {
        font-size: var(--font-size-small);
      }
    }

    :deep(.arco-tabs-content) {
      padding: 0;
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

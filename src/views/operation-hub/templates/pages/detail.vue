<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :menu="route.params.projectName ? { icon: 'icon-apps' } : null"
        :items="
          route.params.projectName
            ? [
                ...breadCrumbList,
                {
                  type: 'menu.operatorHub.module',
                  label: title
                }
              ]
            : [
                {
                  ...operationRootBread,
                  label: $t(operationRootBread.label)
                },
                {
                  label: title
                }
              ]
        "
        @change="handleSelectChange"
      ></Breadcrumb>
    </BreadWrapper>
    <ComCard>
      <div ref="extraWrapper">
        <GroupTitle
          :bordered="false"
          :title="$t('common.title.basicInfo')"
          flex-start
          :show-edit="
            pageAction === PageAction.VIEW &&
            loaded &&
            !isCatalogTemplate &&
            userStore.hasRolesActionsPermission({
              resource: Resources.Templates,
              actions: [Actions.PUT]
            })
          "
          @edit="handleEdit"
        >
        </GroupTitle>
        <div class="flex flex-justify-between">
          <a-form
            ref="formref"
            :model="formData"
            auto-label-width
            label-align="left"
          >
            <TemplateBasic
              v-model:formData="formData"
              :action="pageAction"
            ></TemplateBasic>
            <a-form-item
              v-if="
                templateName &&
                pageAction === PageAction.VIEW &&
                isCatalogTemplate
              "
              hide-label
            >
              <seal-input
                :view-status="true"
                :model-value="
                  _.find(
                    _.get(formData, 'metadata.ownerReferences', []),
                    (item) => item.kind === ResourceKinds.Catalog
                  )?.name
                "
                :label="$t('operation.templates.table.catalog')"
                :style="{ width: `${InputWidth.LARGE}px` }"
              ></seal-input>
            </a-form-item>
            <a-form-item
              v-if="templateName && pageAction === PageAction.VIEW"
              hide-label
              :style="{ width: `${InputWidth.LARGE}px` }"
            >
              <SealFormItemWrap
                :style="{ width: `100%`, color: 'var(--color-text-3)' }"
              >
                <div class="flex flex-align-center">
                  <span class="m-r-10 font-12">{{
                    $t('operation.connectors.table.status')
                  }}</span>
                  <StatusLabel
                    :status="get(formData, 'status', {})"
                  ></StatusLabel>
                </div>
              </SealFormItemWrap>
            </a-form-item>
          </a-form>
          <QuestionPopup
            v-if="pageAction === PageAction.VIEW"
            :link="QAlinkMap.UISchema"
            :group-list="schemaHelps"
            class="m-l-20 relative"
            title="UI Schema"
            style="top: -40px"
          >
          </QuestionPopup>
        </div>
      </div>
      <a-tabs
        v-if="
          templateName &&
          pageAction === PageAction.VIEW &&
          userStore.hasRolesActionsPermission({
            resource: Resources.Templates,
            actions: [Actions.GET]
          })
        "
        :active-key="activeKey"
        lazy-load
        class="page-line-tabs"
        @change="handleTabChange"
      >
        <a-tab-pane
          v-for="item in tabList"
          :key="item.com"
          :title="$t(item.label)"
        >
          <template #title>
            <span>
              <span v-if="item.icon" class="m-r-5">
                <component :is="item.icon"></component>
              </span>
              <span>{{ $t(item.label) }}</span>
            </span>
          </template>
          <component
            :is="tabMap[item.com]"
            :height="tabContentHeight"
            :wrap-size="height"
            :version-id="version"
            :schema="templateSchema"
            :ui-schema="templateUISchema"
            :schema-data="schemaData"
            :template-info="formData"
            @update="handleUpdateSchema"
          ></component>
        </a-tab-pane>
        <template #extra>
          <div style="display: flex; line-height: 34px">
            <a-select
              v-model="version"
              style="width: 200px"
              :options="versionList"
              allow-search
              @change="handleVersonChange"
            >
              <template #prefix>
                <span>{{ $t('operation.templates.detail.version') }}</span>
              </template>
            </a-select>
          </div>
        </template>
      </a-tabs>

      <EditPageFooter v-if="pageAction === PageAction.EDIT">
        <template #save>
          <a-button
            type="primary"
            class="cap-title cancel-btn"
            :loading="submitLoading"
            @click="handleSubmit"
            >{{ $t('common.button.save') }}</a-button
          >
        </template>
        <template #cancel>
          <a-button
            type="outline"
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
  import {
    PageAction,
    validateLabelNameRegx,
    validateLabelNameRegxFor63,
    validateInputLength,
    InputWidth,
    apiVersion,
    ResourceKinds,
    QAlinkMap
  } from '@/views/config';
  import QuestionPopup from '@/components/question-popup/index.vue';
  import { OPERATIONHUB } from '@/router/config';
  import { Resources, Actions } from '@/permissions/config';
  import { useUserStore, useTabBarStore } from '@/store';
  import _, { assignIn, find, get, map, isEqual, cloneDeep } from 'lodash';
  import { ref, reactive, onMounted, computed, markRaw } from 'vue';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import useScrollToView from '@/hooks/use-scroll-to-view';
  import { onBeforeRouteLeave } from 'vue-router';
  import GroupTitle from '@/components/group-title/index.vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import usePageAction from '@/hooks/use-page-action';
  import { useElementSize } from '@vueuse/core';
  import semverEq from 'semver/functions/eq';
  import semverGt from 'semver/functions/gt';
  import StatusLabel from '../../connectors/components/status-label.vue';
  import { tabList } from '../config';
  import { TemplateFormData } from '../config/interface';
  import { operationRootBread } from '../../connectors/config';
  import tabReadme from '../components/tab-readme.vue';
  import tabInput from '../components/tab-input.vue';
  import tabOutput from '../components/tab-output.vue';
  import tabProvider from '../components/tab-provider.vue';
  import tabEditSchema from '../components/tab-edit-schema.vue';
  import useConnectorBread from '../../connectors/hooks/use-connector-bread';
  import { schemaHelps } from '../../resource-definitions/config';
  import TemplateBasic from '../components/template-basic.vue';

  import {
    queryItemTemplate,
    createTemplate,
    updateTemplate,
    queryTemplatesVersions,
    queryTemplateSchema,
    GlobalNamespace
  } from '../api';

  const tabMap = {
    tabReadme: markRaw(tabReadme),
    tabInput: markRaw(tabInput),
    tabOutput: markRaw(tabOutput),
    tabConnector: markRaw(tabProvider),
    tabEditSchema: markRaw(tabEditSchema)
  };

  const { breadCrumbList, handleSelectChange, setBreadCrumbList } =
    useConnectorBread();
  const { scrollToView } = useScrollToView();
  const userStore = useUserStore();
  const versionList = ref<{ label: string; value: string; schema: object }[]>(
    []
  );
  const tabBarStore = useTabBarStore();
  const { pageAction, handleEdit } = usePageAction();
  const version = ref('');
  const extraWrapper = ref();
  const activeKey = ref('tabReadme');
  const { router, route, t } = useCallCommon();
  const formref = ref();
  const templateName = route.query.name as string;
  const projectName = route.params.projectName as string;
  const templateNameSpace = route.query.namespace as string;
  const submitLoading = ref(false);
  const loaded = ref(false);
  const templateSchema = ref({});
  const templateUISchema = ref({});
  const schemaData = ref({});
  let copyFormData: any = {};
  const formData = ref<TemplateFormData>({
    apiVersion,
    kind: ResourceKinds.Template,
    metadata: {
      name: '',
      namespace: projectName || GlobalNamespace
    },
    spec: {
      templateFormat: 'terraform',
      description: '',
      vcsRepository: {
        platform: 'Github',
        url: ''
      }
    }
  });

  const { height } = useElementSize(extraWrapper);

  const isCatalogTemplate = computed(() => {
    return _.some(
      _.get(formData.value, 'metadata.ownerReferences', []),
      (item) => item.kind === ResourceKinds.Catalog
    );
  });

  const tabContentHeight = computed(() => {
    return `calc(100vh - ${height.value + 150}px)`;
  });
  const title = computed(() => {
    if (!templateName) {
      return 'operation.templates.detail.add';
    }
    if (templateName && pageAction.value === PageAction.VIEW) {
      return 'operation.templates.detail.view';
    }
    return 'operation.templates.detail.edit';
  });

  const getTemplateSchema = async (versionData) => {
    if (!versionData || !versionData.templateSchemaName) {
      templateSchema.value = {};
      return;
    }
    try {
      const { data } = await queryTemplateSchema({
        name: versionData.templateSchemaName,
        namespace: templateNameSpace
      });
      templateSchema.value = data.status?.value;
      console.log('templateSchema++', templateSchema.value);
    } catch (error) {
      templateSchema.value = {};
    }
  };

  const getTemplateUISchema = async (versionData) => {
    if (!versionData || !versionData.uiSchemaName) {
      templateUISchema.value = {};
      return;
    }
    try {
      const { data } = await queryTemplateSchema({
        name: versionData.uiSchemaName,
        namespace: templateNameSpace
      });
      templateUISchema.value = data.status?.value;
      schemaData.value = data;
      console.log('templateSchema+++value+++', templateUISchema.value);
    } catch (error) {
      templateUISchema.value = {};
      schemaData.value = {};
    }
  };

  const getTemplateSchemaByName = async () => {
    if (!version.value) return;
    try {
      const versionData = _.find(versionList.value, { value: version.value });
      Promise.all([
        getTemplateSchema(versionData),
        getTemplateUISchema(versionData)
      ]);
    } catch (error) {
      // ingore
    }
  };

  const getTemplateVersions = async () => {
    if (!templateName) return;
    const list: any[] = _.get(formData.value, 'status.versions', []);
    versionList.value = map(list, (item) => {
      return {
        ...item,
        value: item.version,
        label: item.version
      };
    }).sort((v1, v2) => {
      if (semverEq(v1.label, v2.label)) {
        return 0;
      }
      if (semverGt(v1.label, v2.label)) {
        return -1;
      }
      return 1;
    });
    if (versionList.value.length) {
      version.value = versionList.value[0].value;
    }
  };
  const getItemTemplate = async () => {
    copyFormData = cloneDeep(formData.value);
    if (!templateName) return;
    try {
      loaded.value = false;
      const params = {
        name: templateName,
        namespace: templateNameSpace
      };
      const { data } = await queryItemTemplate(params);
      assignIn(formData.value, data);
      copyFormData = cloneDeep(formData.value);
    } catch (error) {
      formref.value.resetFields();
    } finally {
      loaded.value = true;
    }
  };
  const handleVersonChange = () => {
    getTemplateSchemaByName();
  };
  const handleUpdateSchema = () => {
    const versionData = _.find(versionList.value, { value: version.value });
    if (!versionData) return;

    try {
      getTemplateUISchema(versionData);
    } catch (error) {
      // error
    }
  };
  const handleSubmit = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        submitLoading.value = true;
        copyFormData = cloneDeep(formData.value);
        if (templateName) {
          await updateTemplate(formData.value);
        } else {
          await createTemplate(formData.value);
        }
        tabBarStore.deleteTag(0, {
          title: '',
          name: OPERATIONHUB.TemplateList,
          fullPath: ''
        });
        router.back();
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
      }
    } else {
      scrollToView();
    }
  };
  const cancelCallback = () => {
    if (
      pageAction.value === PageAction.EDIT &&
      route.params.action === PageAction.VIEW
    ) {
      pageAction.value = PageAction.VIEW;
      getItemTemplate();
      return;
    }
    router.back();
  };
  const handleCancel = () => {
    if (!isEqual(copyFormData, formData.value)) {
      beforeLeaveCallback({
        isCancel: true,
        onOk: () => {
          copyFormData = cloneDeep(formData.value);
          cancelCallback();
        }
      });
    } else {
      cancelCallback();
    }
  };
  const handleTabChange = (val) => {
    activeKey.value = val;
  };
  onBeforeRouteLeave(async (to, from) => {
    if (!isEqual(copyFormData, formData.value)) {
      beforeLeaveCallback({
        to,
        from,
        onOk: () => {
          copyFormData = cloneDeep(formData.value);
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
    await getItemTemplate();
    await getTemplateVersions();
    await getTemplateSchemaByName();
    setBreadCrumbList();
  };
  initData();
</script>

<script lang="ts">
  export default {
    name: OPERATIONHUB.TemplateDetail
  };
</script>

<style></style>

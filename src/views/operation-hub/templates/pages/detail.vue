<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :menu="route.params.projectId ? { icon: 'icon-apps' } : null"
        :items="
          route.params.projectId
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
            !_.get(formData, 'catalog.id') &&
            userStore.hasRolesActionsPermission({
              resource: Resources.Templates,
              actions: [Actions.PUT]
            })
          "
          @edit="handleEdit"
        ></GroupTitle>
        <a-form
          ref="formref"
          :model="formData"
          auto-label-width
          label-align="left"
        >
          <a-form-item
            :label="$t('operation.connectors.table.name')"
            field="name"
            hide-asterisk
            hide-label
            :disabled="!!id"
            :validate-trigger="['change', 'input']"
            :style="{ maxWidth: `${InputWidth.LARGE}px` }"
            :rules="[
              {
                required: true,
                message: $t('common.rule.name')
              },
              {
                required: true,
                match: validateLabelNameRegx,
                message: $t('common.validate.labelName')
              }
            ]"
          >
            <seal-input
              v-model.trim="formData.name"
              :view-status="pageAction === PageAction.VIEW"
              :label="$t('operation.connectors.table.name')"
              :required="true"
              :style="{ width: `${InputWidth.LARGE}px` }"
              :max-length="63"
              show-word-limit
            ></seal-input>

            <!-- <template v-if="pageAction === PageAction.EDIT" #extra>
              <div class="tips">{{ $t('common.validate.labelName') }}</div>
            </template> -->
          </a-form-item>
          <a-form-item
            :label="$t('operation.environments.table.description')"
            hide-asterisk
            hide-label
            field="description"
          >
            <seal-textarea
              v-model="formData.description"
              :view-status="pageAction === PageAction.VIEW"
              :label="$t('operation.environments.table.description')"
              :style="{ width: `${InputWidth.LARGE}px` }"
              :auto-size="{ minRows: 4, maxRows: 6 }"
              :max-length="200"
              show-word-limit
            ></seal-textarea>
          </a-form-item>
          <a-form-item
            field="source"
            :label="$t('operation.templates.detail.source')"
            :disabled="!!id"
            hide-asterisk
            :hide-label="true"
            :validate-trigger="['change']"
            :rules="[
              {
                required: true,
                message: $t('operation.templates.rules.source')
              }
            ]"
          >
            <seal-input
              v-model.trim="formData.source"
              :view-status="pageAction === PageAction.VIEW"
              :label="$t('operation.templates.detail.source')"
              :required="true"
              :style="{ width: `${InputWidth.LARGE}px` }"
            ></seal-input>

            <template v-if="pageAction === PageAction.EDIT" #extra>
              <div
                :style="{
                  'line-height': '20px',
                  'width': `${InputWidth.LARGE}px`
                }"
              >
                <div>{{ $t('operation.templates.source.description') }}</div>
                <div
                  >https://github.com/terraform-aws-modules/terraform-aws-vpc</div
                >
              </div>
              <div
                >https://github.com/terraform-aws-modules/terraform-aws-vpc?ref=master</div
              >
            </template>
          </a-form-item>
          <a-form-item
            v-if="
              id &&
              pageAction === PageAction.VIEW &&
              _.get(formData, 'catalog.id')
            "
            hide-label
          >
            <seal-input
              :view-status="true"
              :model-value="route.query.catalog"
              :label="$t('operation.templates.table.catalog')"
              :style="{ width: `${InputWidth.LARGE}px` }"
            ></seal-input>
          </a-form-item>
          <a-form-item
            v-if="id && pageAction === PageAction.VIEW"
            hide-label
            :style="{ width: `${InputWidth.LARGE}px` }"
          >
            <SealFormItemWrap
              :label="$t('operation.connectors.table.status')"
              :style="{ width: `100%` }"
            >
              <StatusLabel
                :status="{
                  status: get(formData, 'status.summaryStatus') || '',
                  text: get(formData, 'status.summaryStatus'),
                  message: get(formData, 'status.summaryStatusMessage') || '',
                  transitioning: get(formData, 'status.transitioning'),
                  error: get(formData, 'status.error')
                }"
              ></StatusLabel>
            </SealFormItemWrap>
          </a-form-item>
        </a-form>
      </div>
      <a-tabs
        v-if="
          id &&
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
    InputWidth
  } from '@/views/config';
  import { OPERATIONHUB } from '@/router/config';
  import { Resources, Actions } from '@/permissions/config';
  import { useUserStore, useTabBarStore } from '@/store';
  import _, { assignIn, find, get, map, isEqual, cloneDeep } from 'lodash';
  import { urlReg } from '@/utils/validate';
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
  import { operationRootBread } from '../../connectors/config';
  import tabReadme from '../components/tab-readme.vue';
  import tabInput from '../components/tab-input.vue';
  import tabOutput from '../components/tab-output.vue';
  import tabProvider from '../components/tab-provider.vue';
  import tabEditSchema from '../components/tab-edit-schema.vue';
  import useConnectorBread from '../../connectors/hooks/use-connector-bread';

  import {
    queryItemTemplate,
    createTemplate,
    updateTemplate,
    queryTemplatesVersions,
    queryTemplateSchemaByVersionId
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
  const id = route.query.id as string;
  const submitLoading = ref(false);
  const loaded = ref(false);
  const templateSchema = ref({});
  let copyFormData: any = {};
  const formData = reactive<any>({
    name: '',
    description: '',
    source: ''
    // version: '',
    // icon: ''
  });

  const { height } = useElementSize(extraWrapper);

  const tabContentHeight = computed(() => {
    return `calc(100vh - ${height.value + 150}px)`;
  });
  const title = computed(() => {
    if (!id) {
      return 'operation.templates.detail.add';
    }
    if (id && pageAction.value === PageAction.VIEW) {
      return 'operation.templates.detail.view';
    }
    return 'operation.templates.detail.edit';
  });

  const getTemplateSchemaByVersionId = async () => {
    if (!version.value) return;
    try {
      const params = {
        templateVersionID: version.value,
        isProjectContext: !!formData.project?.id
      };
      // const { data } = await queryTemplatesVersions(params);
      // return data.items?.[0];
      const { data } = await queryTemplateSchemaByVersionId(params);
      templateSchema.value = data;
    } catch (error) {
      // ingore
    }
  };

  const setVersion = (list) => {
    versionList.value = map(list, (item) => {
      return {
        schema: item.schema,
        label: item.version,
        value: item.id,
        version: item.version,
        template: item.template
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
  };

  const getTemplateVersions = async () => {
    if (!id) return;
    try {
      const params = {
        templateID: id,
        page: -1,
        extract: ['-uiSchema', '-schema']
      };
      const { data } = await queryTemplatesVersions(params);
      const list = data.items || [];
      setVersion(list);
      version.value = get(versionList.value, '0.value', '');
    } catch (error) {
      versionList.value = [];
    }
  };
  const getItemTemplate = async () => {
    copyFormData = cloneDeep(formData);
    if (!id) return;
    try {
      loaded.value = false;
      const params = {
        id
      };
      const { data } = await queryItemTemplate(params);
      assignIn(formData, data);
      copyFormData = cloneDeep(formData);
    } catch (error) {
      formref.value.resetFields();
    } finally {
      loaded.value = true;
    }
  };
  const handleVersonChange = () => {
    getTemplateSchemaByVersionId();
  };
  const handleUpdateSchema = () => {
    getTemplateSchemaByVersionId();
  };
  const handleSubmit = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        submitLoading.value = true;
        copyFormData = cloneDeep(formData);
        if (id) {
          await updateTemplate(formData);
        } else {
          await createTemplate(formData);
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
    if (!isEqual(copyFormData, formData)) {
      beforeLeaveCallback({
        isCancel: true,
        onOk: () => {
          copyFormData = cloneDeep(formData);
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
    if (!isEqual(copyFormData, formData)) {
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
  const initData = async () => {
    await getItemTemplate();
    await getTemplateVersions();
    await getTemplateSchemaByVersionId();
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

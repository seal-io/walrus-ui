<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :items="[
          {
            ...operationRootBread,
            label: $t(operationRootBread.label)
          },
          {
            label: title
          }
        ]"
      ></Breadcrumb>
    </BreadWrapper>
    <ComCard>
      <GroupTitle
        :bordered="false"
        :title="$t('common.title.basicInfo')"
        flex-start
        :show-edit="
          pageAction === PageAction.VIEW &&
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
          :hide-label="pageAction === PageAction.EDIT"
          :disabled="!!id"
          :validate-trigger="['change']"
          :rules="[
            {
              required: true,
              match: validateLabelNameRegx,
              message: $t('common.validate.labelName')
            }
          ]"
        >
          <seal-input
            v-if="pageAction === PageAction.EDIT"
            v-model="formData.name"
            :label="$t('operation.connectors.table.name')"
            :required="true"
            :style="{ width: `${InputWidth.LARGE}px` }"
            :max-length="63"
            show-word-limit
          ></seal-input>
          <span v-else class="readonly-view-label">{{
            formData.name || '-'
          }}</span>
          <template v-if="pageAction === PageAction.EDIT" #extra>
            <span class="tips">{{ $t('common.validate.labelName') }}</span>
          </template>
        </a-form-item>
        <a-form-item
          :label="$t('operation.environments.table.description')"
          hide-asterisk
          :hide-label="pageAction === PageAction.EDIT"
          field="description"
        >
          <seal-textarea
            v-if="pageAction === PageAction.EDIT"
            v-model="formData.description"
            :label="$t('operation.environments.table.description')"
            :style="{ width: `${InputWidth.LARGE}px` }"
            :auto-size="{ minRows: 6, maxRows: 10 }"
            :max-length="200"
            show-word-limit
          ></seal-textarea>
          <div v-else class="description-content readonly-view-label">{{
            formData.description || '-'
          }}</div>
        </a-form-item>
        <a-form-item
          field="source"
          :label="$t('operation.templates.detail.source')"
          hide-asterisk
          :hide-label="pageAction === PageAction.EDIT"
          :validate-trigger="['change']"
          :rules="[
            {
              required: true,
              message: $t('operation.templates.rules.source')
            }
          ]"
        >
          <seal-input
            v-if="pageAction === PageAction.EDIT"
            v-model="formData.source"
            :label="$t('operation.templates.detail.source')"
            :required="true"
            :style="{ width: `${InputWidth.LARGE}px` }"
          ></seal-input>
          <span v-else class="readonly-view-label">{{
            formData.source || '-'
          }}</span>
          <template #extra>
            <span
              >{{
                $t('common.help.eg')
              }}
              https://github.com/terraform-seal-modules/rds-seeder</span
            >
          </template>
        </a-form-item>

        <a-form-item
          v-if="id && pageAction === PageAction.VIEW"
          :label="$t('operation.connectors.table.status')"
        >
          <StatusLabel
            style="margin-left: 12px"
            :status="{
              status: get(formData, 'status.summaryStatus') || '',
              text: get(formData, 'status.summaryStatus'),
              message: get(formData, 'status.summaryStatusMessage') || '',
              transitioning: get(formData, 'status.transitioning'),
              error: get(formData, 'status.error')
            }"
          ></StatusLabel>
        </a-form-item>
      </a-form>
      <a-tabs
        v-if="
          id &&
          pageAction === PageAction.VIEW &&
          userStore.hasRolesActionsPermission({
            resource: Resources.TemplateVersions,
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
          <component
            :is="tabMap[item.com]"
            :schema="templateSchema"
          ></component>
        </a-tab-pane>
        <template #extra>
          <div style="display: flex; line-height: 34px">
            <a-select
              v-model="version"
              style="width: 200px"
              :options="versionList"
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
  import StatusLabel from '../../connectors/components/status-label.vue';
  import { templateTypeList, tabList } from '../config';
  import { Schema } from '../config/interface';
  import { operationRootBread } from '../../connectors/config';
  import tabReadme from '../components/tab-readme.vue';
  import tabInput from '../components/tab-input.vue';
  import tabOutput from '../components/tab-output.vue';
  import tabConnector from '../components/tab-connector.vue';
  import {
    queryItemTemplate,
    createTemplate,
    updateTemplate,
    queryTemplatesVersions
  } from '../api';

  const tabMap = {
    tabReadme: markRaw(tabReadme),
    tabInput: markRaw(tabInput),
    tabOutput: markRaw(tabOutput),
    tabConnector: markRaw(tabConnector)
  };

  const { scrollToView } = useScrollToView();
  const userStore = useUserStore();
  const versionList = ref<{ label: string; value: string; schema: object }[]>(
    []
  );
  const tabBarStore = useTabBarStore();
  const { pageAction, handleEdit } = usePageAction();
  const version = ref('');
  const activeKey = ref('tabReadme');
  const { router, route, t } = useCallCommon();
  const formref = ref();
  const id = route.query.id as string;
  const templateName = route.query.name as string;
  const submitLoading = ref(false);
  const templateSchema = ref({});
  let copyFormData: any = {};
  const formData = reactive({
    name: '',
    description: '',
    source: '',
    // version: '',
    icon: ''
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
  const getTemplateVersions = async () => {
    if (!templateName) return;
    try {
      const params = {
        templateID: id
      };
      const { data } = await queryTemplatesVersions(params);
      const list = data.items || [];
      versionList.value = map(list, (item) => {
        return {
          schema: item.schema,
          label: item.version,
          value: item.id
        };
      });
      version.value = get(list, '0.id');
      templateSchema.value = get(list, '0.schema') || {};
    } catch (error) {
      versionList.value = [];
    }
  };
  const getItemTemplate = async () => {
    copyFormData = cloneDeep(formData);
    if (!id) return;
    try {
      const params = {
        id
      };
      const { data } = await queryItemTemplate(params);
      assignIn(formData, data);
      copyFormData = cloneDeep(formData);
    } catch (error) {
      formref.value.resetFields();
    }
  };
  const handleVersonChange = (value) => {
    const data = find(versionList.value, (item) => item.value === value);
    templateSchema.value = data?.schema || {};
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
  onMounted(() => {
    getItemTemplate();
    getTemplateVersions();
  });
</script>

<script lang="ts">
  export default {
    name: OPERATIONHUB.TemplateDetail
  };
</script>

<style></style>

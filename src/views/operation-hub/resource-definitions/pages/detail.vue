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
      <div ref="extraWrapper">
        <GroupTitle
          :bordered="false"
          :title="$t('common.title.basicInfo')"
          flex-start
          :show-edit="
            pageAction === PageAction.VIEW &&
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
            :style="{ maxWidth: `${InputWidth.LARGE}px` }"
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
              v-model.trim="formData.name"
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
              <div class="tips">{{ $t('common.validate.labelName') }}</div>
            </template>
          </a-form-item>
          <a-form-item
            :label="$t('common.table.type')"
            field="type"
            hide-asterisk
            :hide-label="pageAction === PageAction.EDIT"
            :disabled="!!id"
            :validate-trigger="['change']"
            :style="{ maxWidth: `${InputWidth.LARGE}px` }"
          >
            <seal-input
              v-if="pageAction === PageAction.EDIT"
              v-model.trim="formData.type"
              :label="$t('common.table.type')"
              :required="true"
              :style="{ width: `${InputWidth.LARGE}px` }"
              :rules="[
                {
                  required: true,
                  message: $t('common.form.rule.input', {
                    name: $t('common.table.type')
                  })
                }
              ]"
            ></seal-input>
            <span v-else class="readonly-view-label">{{
              formData.type || '-'
            }}</span>
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
            v-if="
              id &&
              pageAction === PageAction.VIEW &&
              _.get(formData, 'catalog.id')
            "
            :label="$t('operation.templates.table.catalog')"
          >
            <span class="readonly-view-label">{{
              route.query.catalog || ''
            }}</span>
          </a-form-item>
        </a-form>
        <div v-if="pageAction === PageAction.EDIT">
          <GroupTitle
            :bordered="false"
            :title="$t('resource.definition.detail.matchRule')"
            flex-start
          >
            <template #title>
              <span>{{ $t('resource.definition.detail.matchRule') }}</span>
              <a-link class="m-l-10" @click="handleAddRule">
                <icon-plus class="size-14" style="stroke-width: 4" />
                <span class="mleft-5">{{ $t('common.button.add') }}</span>
              </a-link>
            </template>
          </GroupTitle>
          <DefinitionRules
            v-for="(item, index) in formData.matchingRules"
            :ref="(el) => setRefMap(el, `rules${index}`)"
            :key="index"
            :title="
              item.name ||
              $t('resource.definition.detail.rule', { name: index + 1 })
            "
            :data-id="id"
            :origin-form-data="item"
            :page-action="pageAction"
            :show-delete="formData.matchingRules.length > 1"
            :template-list="templateList"
            class="m-b-20"
            @delete="handleDeleteDefinition(index)"
          >
          </DefinitionRules>
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
            key="matchRules"
            :title="$t('resource.definition.detail.matchRule')"
          >
            <DefinitionRules
              v-for="(item, index) in formData.matchingRules"
              :key="index"
              :title="item.name"
              :data-id="id"
              :origin-form-data="item"
              :page-action="pageAction"
              :show-delete="formData.matchingRules.length > 1"
              :template-list="templateList"
              class="m-b-20"
              @delete="handleDeleteDefinition(index)"
            >
            </DefinitionRules>
          </a-tab-pane>
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
              :schema="deinitionSchema"
              :template-info="formData"
              page="definition"
              @update="handleUpdateSchema"
            ></component>
          </a-tab-pane>
        </a-tabs>
      </div>
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
  import { ref, onMounted, computed, provide, markRaw } from 'vue';
  import {
    PageAction,
    validateLabelNameRegx,
    InputWidth
  } from '@/views/config';
  import { useElementSize } from '@vueuse/core';
  import moduleWrapper from '@/components/module-wrapper/index.vue';
  import { OPERATIONHUB } from '@/router/config';
  import { Resources, Actions } from '@/permissions/config';
  import { useUserStore, useTabBarStore } from '@/store';
  import _, { get, isEqual, cloneDeep } from 'lodash';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import useScrollToView from '@/hooks/use-scroll-to-view';
  import { onBeforeRouteLeave } from 'vue-router';
  import GroupTitle from '@/components/group-title/index.vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import usePageAction from '@/hooks/use-page-action';
  import { queryVariables } from '@/views/application-management/variables/api';
  import MoreButtonActions from '@/components/drop-button-group/more-button-actions.vue';
  import { operationRootBread } from '../../connectors/config';
  import StatusLabel from '../../connectors/components/status-label.vue';
  import {
    createResourceDefinition,
    queryItemResourceDefinition,
    upateResourceDefinition
  } from '../api';
  import { queryTemplates } from '../../templates/api';
  import {
    ResourceDefinitionFormData,
    definitionFormData
  } from '../config/interface';
  import { tabList } from '../config';
  import DefinitionRules from '../components/definition-rules.vue';
  import tabInput from '../../templates/components/tab-input.vue';
  import tabOutput from '../../templates/components/tab-output.vue';
  import tabEditSchema from '../../templates/components/tab-edit-schema.vue';

  const { scrollToView } = useScrollToView();
  const userStore = useUserStore();

  const tabBarStore = useTabBarStore();
  const { pageAction, handleEdit } = usePageAction();

  const { router, route, t } = useCallCommon();
  const formref = ref();
  const id = route.query.id as string;
  const submitLoading = ref(false);
  const loaded = ref(false);
  const refMap = ref<Record<string, any>>({});
  let copyFormData: any = {};
  const templateList = ref<any[]>([]);
  const schema = ref<any>({});
  const extraWrapper = ref();
  const readOnly = ref(true);
  const deinitionSchema = ref<any>({});
  const completeData = ref<any>({
    var: null
  });
  const formData = ref<ResourceDefinitionFormData>({
    name: '',
    description: '',
    type: '',
    matchingRules: []
  });
  const activeKey = ref('tabEditSchema');

  const tabMap = {
    tabInput: markRaw(tabInput),
    tabOutput: markRaw(tabOutput),
    tabEditSchema: markRaw(tabEditSchema)
  };
  provide('completeData', completeData);

  const { height } = useElementSize(extraWrapper);

  const tabContentHeight = computed(() => {
    return `calc(100vh - ${height.value + 150}px)`;
  });
  const title = computed(() => {
    if (!id) {
      return 'resource.definition.list.create';
    }
    if (id && pageAction.value === PageAction.VIEW) {
      return 'resource.definition.detail.view';
    }
    return 'resource.definition.detail.edit';
  });

  const setRefMap = (el, name) => {
    refMap.value[name] = el;
  };
  const handleTabChange = (val) => {
    activeKey.value = val;
  };
  const handleUpdateSchema = () => {};
  const getRefFormData = async () => {
    const resultList: any[] = [];
    await Promise.all(
      _.keys(refMap.value).map(async (key) => {
        const refEL = refMap.value[key];
        const moduleForm = await refEL?.submit?.();
        resultList.push({
          tab: key,
          formData: moduleForm
        });
      })
    );
    return resultList;
  };
  const getRefUISchema = async () => {
    const resultList: any[] = [];
    await Promise.all(
      _.keys(refMap.value).map(async (key) => {
        const refEL = refMap.value[key];
        const schema = await refEL?.getSchema?.();
        resultList.push(schema);
      })
    );
    return resultList;
  };
  const setVariablesCompleteData = (list) => {
    const vars = _.map(list, (item) => {
      return {
        value: item.name,
        label: item.name,
        tips: item.value,
        showTips: true,
        sensitive: item.sensitive
      };
    });
    return vars;
  };
  const getVariablesCompleteData = async () => {
    try {
      const { data } = await queryVariables({ page: -1 });
      completeData.value.var = setVariablesCompleteData(data.items || []);
    } catch (error) {
      // ignore
      completeData.value.var = null;
    }
  };
  const getTemplateList = async () => {
    try {
      const { data } = await queryTemplates({ page: -1 });
      templateList.value = _.map(data.items, (item) => {
        return {
          label: item.name,
          value: item.id
        };
      });
    } catch (error) {
      templateList.value = [];
    }
  };
  const getItemResourceDefinition = async () => {
    copyFormData = cloneDeep(formData.value);
    if (!id) {
      formData.value.matchingRules.push({
        ..._.cloneDeep(definitionFormData)
      });
      return;
    }
    try {
      loaded.value = false;
      const params = {
        id
      };
      const { data } = await queryItemResourceDefinition(params);
      formData.value = data;
      deinitionSchema.value = data;
      copyFormData = cloneDeep(formData.value);
    } catch (error) {
      formref.value.resetFields();
    } finally {
      loaded.value = true;
    }
  };

  const handleSubmit = async () => {
    const res = await formref.value?.validate();
    const matchRules = await getRefFormData();
    console.log('matchRules', matchRules);
    if (!res || !_.some(matchRules, (item) => !item.formData)) {
      try {
        submitLoading.value = true;
        formData.value.matchingRules = _.map(matchRules, (item) => {
          return {
            ...item.formData
          };
        });
        copyFormData = cloneDeep(formData.value);
        if (id) {
          await upateResourceDefinition({ id, data: formData.value });
        } else {
          await createResourceDefinition(formData.value);
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
      getItemResourceDefinition();
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

  const handleSelectAction = (val) => {
    if (val === 'edit') {
      readOnly.value = false;
    }
    if (val === 'refresh') {
      getRefUISchema();
    }
  };
  const handleConfirm = () => {};
  const handleCancelEdit = () => {};
  const handleAddRule = () => {
    formData.value.matchingRules.unshift({
      ..._.cloneDeep(definitionFormData)
    });
  };

  const handleDeleteDefinition = (index) => {
    formData.value.matchingRules.splice(index, 1);
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
    await getTemplateList();
    getItemResourceDefinition();
    getVariablesCompleteData();
  };
  initData();
</script>

<script lang="ts">
  export default {
    name: OPERATIONHUB.ResourceDefinitionDetail
  };
</script>

<style></style>
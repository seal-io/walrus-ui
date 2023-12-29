<template>
  <div class="def-detail">
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
              resource: Resources.ResourceDefinitions,
              actions: [Actions.PUT]
            })
          "
          @edit="handleEditPage"
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
            :label="$t('common.table.type')"
            field="type"
            hide-asterisk
            hide-label
            :disabled="!!id"
            :validate-trigger="['change', 'input']"
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
              v-model.trim="formData.type"
              :view-status="pageAction === PageAction.VIEW"
              :label="$t('common.table.type')"
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
        <div v-if="pageAction !== PageAction.VIEW">
          <GroupTitle
            :bordered="false"
            :title="$t('resource.definition.detail.matchRule')"
            flex-start
          >
            <template #title>
              <span>{{ $t('resource.definition.detail.matchRule') }}</span>
              <a-link class="m-l-10" @click="handleAddRule">
                <icon-plus class="size-14" style="stroke-width: 4" />
                <span class="mleft-5 font-12">{{
                  $t('common.button.add')
                }}</span>
              </a-link>
            </template>
          </GroupTitle>
          <a-tabs
            v-if="formData.matchingRules.length"
            v-model:active-key="activeRule"
            :default-active-key="activeRule"
            :editable="formData.matchingRules.length > 1"
            type="rounded"
            direction="vertical"
            class="page-line-tabs"
            @delete="handleDeleteRule"
          >
            <a-tab-pane
              v-for="(item, index) in formData.matchingRules"
              :key="item.id"
              :title="
                item.name ||
                $t('resource.definition.detail.rule', { name: index + 1 })
              "
            >
              <!-- <template #title>
                <span class="title">{{
                  item.name ||
                  $t('resource.definition.detail.rule', { name: index + 1 })
                }}</span>
              </template> -->
              <DefinitionRules
                :ref="
                  (el) =>
                    setRefMap(el, `${definitionRulePrefix}${item.id}`, item)
                "
                :key="item.id"
                v-model:title="item.name"
                :trace-id="item.id"
                :data-id="id"
                :origin-form-data="item"
                :page-action="pageAction"
                :schema-form-action="item.pageAction || schemaFormAction"
                :show-delete="formData.matchingRules.length > 1"
                :template-list="templateList"
                :project-list="projectList"
                class="m-b-20"
              >
              </DefinitionRules>
            </a-tab-pane>
          </a-tabs>
        </div>
        <a-tabs
          v-if="
            id &&
            pageAction === PageAction.VIEW &&
            userStore.hasRolesActionsPermission({
              resource: Resources.ResourceDefinitions,
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
            <a-tabs
              v-if="formData.matchingRules.length"
              v-model:active-key="activeViewRule"
              :default-active-key="activeViewRule"
              type="rounded"
              direction="vertical"
            >
              <a-tab-pane
                v-for="(item, index) in formData.matchingRules"
                :key="item.id"
                :title="
                  item.name ||
                  $t('resource.definition.detail.rule', { name: index + 1 })
                "
              >
                <DefinitionRules
                  :key="`${index}-view`"
                  :trace-id="item.id"
                  :title="item.name"
                  :data-id="id"
                  :origin-form-data="item"
                  :page-action="pageAction"
                  :schema-form-action="schemaFormAction"
                  :show-delete="false"
                  :template-list="templateList"
                  :project-list="projectList"
                  class="m-b-20"
                >
                </DefinitionRules>
              </a-tab-pane>
            </a-tabs>
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
              @reset="handleResetUISchema"
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
    InputWidth,
    InjectCompleteDataKey,
    HintKeyMaps
  } from '@/views/config';
  import { HintKey } from '@/views/config/interface';
  import { useElementSize } from '@vueuse/core';
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
  import { execSucceed, deleteModal } from '@/utils/monitor';
  import usePageAction from '@/hooks/use-page-action';
  import { queryVariables } from '@/views/application-management/variables/api';
  import { queryProjects } from '@/views/application-management/projects/api';
  import { operationRootBread } from '../../connectors/config';
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

  const definitionRulePrefix = 'rule';
  const { router, route, t } = useCallCommon();
  const formref = ref();
  const id = route.query.id as string;
  const submitLoading = ref(false);
  const loaded = ref(false);
  const refMap = ref<Record<string, any>>({});
  let copyFormData: any = {};
  const templateList = ref<any[]>([]);
  const extraWrapper = ref();
  const deinitionSchema = ref<any>({});
  const activeRule = ref('');
  const activeViewRule = ref('');
  const projectList = ref<any[]>([]);
  const completeData = ref<Partial<HintKey>>({
    [HintKeyMaps.var]: null
  });
  const formData = ref<ResourceDefinitionFormData>({
    name: '',
    description: '',
    type: '',
    matchingRules: []
  });
  const activeKey = ref('matchRules');

  const tabMap = {
    tabInput: markRaw(tabInput),
    tabOutput: markRaw(tabOutput),
    tabEditSchema: markRaw(tabEditSchema)
  };
  provide(InjectCompleteDataKey, completeData);

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

  const schemaFormAction = computed(() => {
    if (!id) {
      return PageAction.CREATE;
    }
    return pageAction.value;
  });

  const getProjectList = async () => {
    try {
      const params = {
        page: -1
      };
      const { data } = await queryProjects(params);
      projectList.value = _.map(data.items || [], (item) => {
        return {
          label: item.name,
          value: item.id
        };
      });
    } catch (error) {
      console.log(error);
      projectList.value = [];
    }
  };
  const handleEditPage = () => {
    handleEdit();
    activeRule.value = _.get(formData.value, 'matchingRules.0.id', '');
  };
  const setRefMap = (el, name, item) => {
    refMap.value[name] = {
      ref: el,
      id: item.id
    };
  };
  const handleTabChange = (val) => {
    activeKey.value = val;
  };
  const getRefFormData = async () => {
    const resultList: any[] = [];
    await Promise.all(
      _.keys(refMap.value).map(async (key) => {
        const refEL = refMap.value[key];
        if (refEL) {
          const moduleForm = await refEL?.ref?.submit?.();
          resultList.push({
            tab: key,
            id: refEL.id,
            formData: moduleForm
          });
        }
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
      completeData.value[HintKeyMaps.var] = setVariablesCompleteData(
        data.items || []
      );
    } catch (error) {
      // ignore
      completeData.value[HintKeyMaps.var] = null;
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
      const itemId = `${Date.now()}`;
      formData.value.matchingRules.push({
        ..._.cloneDeep(definitionFormData),
        id: itemId
      });
      activeRule.value = itemId;
      return;
    }
    try {
      loaded.value = false;
      const params = {
        id
      };
      const { data } = await queryItemResourceDefinition(params);
      formData.value = data;
      activeViewRule.value = _.get(formData.value, 'matchingRules.0.id', '');
      activeRule.value = activeViewRule.value;
      deinitionSchema.value = data;
      copyFormData = cloneDeep(formData.value);
    } catch (error) {
      formref.value.resetFields();
    } finally {
      loaded.value = true;
    }
  };

  const handleResetUISchema = async (codeData?: object) => {
    try {
      const data = _.cloneDeep(formData.value);
      data.uiSchema = codeData || {};
      await upateResourceDefinition({ id, data });
      execSucceed();
      getItemResourceDefinition();
    } catch (error) {
      // ignore
    }
  };
  const handleSubmit = async () => {
    const res = await formref.value?.validate();
    const matchRules = await getRefFormData();
    console.log('matchRules', matchRules, res);
    if (!res && _.every(matchRules, (item) => !!item.formData)) {
      try {
        submitLoading.value = true;

        formData.value.matchingRules = _.map(matchRules, (item) => {
          return {
            ...item.formData,
            id: item.id
          };
        });
        copyFormData = cloneDeep(formData.value);
        if (id) {
          await upateResourceDefinition({
            id,
            data: { ..._.omit(formData.value, 'uiSchema') }
          });
        } else {
          await createResourceDefinition(formData.value);
        }
        tabBarStore.deleteTag(0, {
          title: '',
          name: OPERATIONHUB.ResourceDefinitionDetail,
          fullPath: ''
        });
        router.back();
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
      }
    } else {
      const invalidTab = _.find(matchRules, (item) => !item.formData);
      if (invalidTab) {
        activeRule.value = invalidTab.id;
      }
      scrollToView();
    }
  };
  const cancelCallback = async () => {
    if (
      pageAction.value === PageAction.EDIT &&
      route.params.action === PageAction.VIEW
    ) {
      pageAction.value = PageAction.VIEW;
      await getItemResourceDefinition();
      activeViewRule.value = _.get(formData.value, 'matchingRules.0.id', '');
      return;
    }
    router.back();
  };
  const handleCancel = () => {
    beforeLeaveCallback({
      isCancel: true,
      onOk: () => {
        copyFormData = cloneDeep(formData.value);
        cancelCallback();
      }
    });
  };

  const handleAddRule = () => {
    const itemId = `${Date.now()}`;
    formData.value.matchingRules.push({
      ..._.cloneDeep(definitionFormData),
      id: itemId,
      pageAction: PageAction.CREATE
    });
    activeRule.value = itemId;
  };

  const handleDeleteDefinition = (index, name) => {
    formData.value.matchingRules.splice(index, 1);
    setTimeout(() => {
      refMap.value[name] = null;
    }, 100);
  };
  const setActiveRule = (index) => {
    if (index - 1 > 0) {
      activeRule.value = _.get(
        formData.value,
        `matchingRules.${index - 1}.id`,
        ''
      );
    } else {
      activeRule.value = _.get(formData.value, 'matchingRules.0.id', '');
    }
  };

  const handleDeleteRuleCallback = (key) => {
    const index = _.findIndex(formData.value.matchingRules, (item) => {
      return item.id === key;
    });
    const item = _.get(formData.value.matchingRules, `${index}`);
    handleDeleteDefinition(index, `${definitionRulePrefix}${item.id}`);
    setActiveRule(index);
  };

  const handleDeleteRule = (key) => {
    deleteModal({
      onOk: () => {
        handleDeleteRuleCallback(key);
      }
    });
  };

  onBeforeRouteLeave(async (to, from) => {
    if (!isEqual(copyFormData, formData.value)) {
      beforeLeaveCallback({
        to,
        from,
        onOk: () => {
          copyFormData = cloneDeep(formData.value);
          router.push({
            path: to.path as string
          });
        }
      });
      return false;
    }
    return true;
  });

  const initData = async () => {
    await getTemplateList();
    await getProjectList();
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

<style lang="less" scoped>
  .def-detail {
    :deep(.arco-tabs) {
      &.arco-tabs-vertical {
        .arco-tabs-nav-tab-list {
          .arco-tabs-tab {
            &.arco-tabs-tab-closable {
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
          }
        }
      }
    }
  }
</style>

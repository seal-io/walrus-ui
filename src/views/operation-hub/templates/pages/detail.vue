<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :items="[
          { ...operationRootBread, label: $t(operationRootBread.label) },
          {
            label: title
          }
        ]"
      ></Breadcrumb>
    </BreadWrapper>
    <ComCard top-gap>
      <GroupTitle
        :bordered="false"
        :show-edit="
          pageAction === 'view' &&
          userStore.hasRolesActionsPermission({
            resource: Resources.Modules,
            actions: [Actions.PUT]
          })
        "
        @edit="handleEdit"
      ></GroupTitle>
      <a-form ref="formref" :model="formData" auto-label-width>
        <a-form-item
          :label="$t('operation.connectors.table.name')"
          field="id"
          :disabled="!!id"
          :validate-trigger="['change']"
          :rules="[
            {
              required: pageAction === 'edit',
              message: $t('operation.templates.rules.name')
            },
            {
              match: validateAppNameRegx,
              message: $t('applications.applications.rule.allName')
            }
          ]"
        >
          <a-input
            v-if="pageAction === 'edit'"
            v-model="formData.id"
            style="width: 500px"
            :max-length="50"
            show-word-limit
          ></a-input>
          <span v-else class="readonly-view-label">{{
            formData.id || '-'
          }}</span>
          <template v-if="pageAction === 'edit'" #extra>
            <span class="tips">{{
              $t('applications.applications.rule.allName')
            }}</span>
          </template>
        </a-form-item>
        <a-form-item
          :label="$t('operation.environments.table.description')"
          field="description"
        >
          <a-textarea
            v-if="pageAction === 'edit'"
            v-model="formData.description"
            style="width: 500px"
            :auto-size="{ minRows: 6, maxRows: 10 }"
            :max-length="200"
            show-word-limit
          ></a-textarea>
          <div v-else class="description-content readonly-view-label">{{
            formData.description || '-'
          }}</div>
        </a-form-item>
        <!-- <a-form-item :label="$t('operation.connectors.table.type')" field="type">
        <a-select v-model="formData.description">
          <a-option
            v-for="item in templateTypeList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          >
          </a-option>
        </a-select>
      </a-form-item> -->
        <a-form-item
          field="source"
          :label="$t('operation.templates.detail.source')"
          :validate-trigger="['change']"
          :rules="[
            {
              required: pageAction === 'edit',
              message: $t('operation.templates.rules.source')
            }
          ]"
        >
          <a-input
            v-if="pageAction === 'edit'"
            v-model="formData.source"
            style="width: 500px"
          ></a-input>
          <span v-else class="readonly-view-label">{{
            formData.source || '-'
          }}</span>
        </a-form-item>
        <a-form-item
          field="icon"
          :label="$t('operation.templates.detail.icon')"
          :rules="[
            {
              match: urlReg,
              message: $t('system.rules.url')
            }
          ]"
        >
          <a-input
            v-if="pageAction === 'edit'"
            v-model="formData.icon"
            style="width: 500px"
          ></a-input>
          <span v-else class="readonly-view-label">{{
            formData.icon || '-'
          }}</span>
        </a-form-item>
        <a-form-item
          v-if="id && pageAction === 'view'"
          :label="$t('operation.connectors.table.status')"
        >
          <StatusLabel
            style="margin-left: 12px"
            :status="{
              status: get(formData, 'status'),
              text: get(formData, 'status'),
              message: get(formData, 'statusMessage'),
              transitioning: get(formData, 'status') === 'Initializing',
              error: get(formData, 'status') === 'Error'
            }"
          ></StatusLabel>
        </a-form-item>
      </a-form>
      <a-tabs
        v-if="
          id &&
          pageAction === 'view' &&
          userStore.hasRolesActionsPermission({
            resource: Resources.ModuleVersions,
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
      <EditPageFooter v-if="pageAction === 'edit'">
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
  import { Resources, Actions } from '@/permissions/config';
  import { useUserStore, useTabBarStore } from '@/store';
  import { assignIn, find, get, map, isEqual, cloneDeep } from 'lodash';
  import { urlReg } from '@/utils/validate';
  import { ref, reactive, onMounted, computed } from 'vue';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import { onBeforeRouteLeave } from 'vue-router';
  import GroupTitle from '@/components/group-title/index.vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import usePageAction from '@/hooks/use-page-action';
  import { validateAppNameRegx } from '@/views/config';
  import StatusLabel from '../../connectors/components/status-label.vue';
  import { templateTypeList, tabList } from '../config';
  import { Schema } from '../config/interface';
  import { operationRootBread } from '../../connectors/config';
  import tabReadme from '../components/tab-readme.vue';
  import tabInput from '../components/tab-input.vue';
  import tabOutput from '../components/tab-output.vue';
  import tabConnector from '../components/tab-connector.vue';
  import {
    queryItemModules,
    createModules,
    updateModules,
    queryModulesVersions
  } from '../api';

  const tabMap = {
    tabReadme,
    tabInput,
    tabOutput,
    tabConnector
  };

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
  const submitLoading = ref(false);
  const templateSchema = ref({});
  let copyFormData: any = {};
  const formData = reactive({
    id: '',
    description: '',
    source: '',
    // version: '',
    icon: ''
  });

  const title = computed(() => {
    if (!id) {
      return t('operation.templates.detail.add');
    }
    if (id && pageAction.value === 'view') {
      return t('operation.templates.detail.view');
    }
    return t('operation.templates.detail.edit');
  });
  const getModuleVersions = async () => {
    if (!id) return;
    try {
      const params = {
        moduleID: id
      };
      const { data } = await queryModulesVersions(params);
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
      console.log(error);
    }
  };
  const getItemModules = async () => {
    copyFormData = cloneDeep(formData);
    if (!id) return;
    try {
      const params = {
        id
      };
      const { data } = await queryItemModules(params);
      assignIn(formData, data);
      copyFormData = cloneDeep(formData);
    } catch (error) {
      console.log('error');
      formref.value.resetFields();
    }
  };
  const handleVersonChange = (value) => {
    const data = find(versionList.value, (item) => item.value === value);
    console.log('data======', data);
    templateSchema.value = data?.schema || {};
  };
  const handleSubmit = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        submitLoading.value = true;
        copyFormData = cloneDeep(formData);
        if (id) {
          await updateModules(formData);
        } else {
          await createModules(formData);
        }
        tabBarStore.deleteTag(0, {
          title: '',
          name: 'TemplateList',
          fullPath: ''
        });
        router.back();
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
      }
    }
  };
  const cancelCallback = () => {
    if (pageAction.value === 'edit' && route.params.action === 'view') {
      pageAction.value = 'view';
      getItemModules();
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
    getItemModules();
    getModuleVersions();
  });
</script>

<style></style>

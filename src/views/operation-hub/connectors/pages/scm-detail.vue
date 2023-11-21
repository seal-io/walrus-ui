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
                  type: 'menu.operatorHub.connector',
                  label: title
                }
              ]
            : [
                { ...operationRootBread, label: $t(operationRootBread.label) },
                {
                  label: title
                }
              ]
        "
        @change="handleSelectChange"
      ></Breadcrumb>
    </BreadWrapper>
    <ComCard class="kuber-detail-wrap">
      <GroupTitle
        :bordered="false"
        :title="$t('common.title.basicInfo')"
        flex-start
        :show-edit="
          pageAction === PageAction.VIEW &&
          (route.params.projectId
            ? userStore.hasProjectResourceActions({
                resource: Resources.Connectors,
                connectorID: id,
                projectID: route.params.projectId,
                actions: [Actions.PUT]
              })
            : userStore.hasRolesActionsPermission({
                resource: Resources.Connectors,
                actions: [Actions.PUT]
              }))
        "
        @edit="handleEdit"
      ></GroupTitle>
      <div>
        <a-form
          ref="formref"
          :model="formData"
          auto-label-width
          label-align="left"
        >
          <a-form-item
            :label="$t('operation.connectors.form.name')"
            hide-asterisk
            :hide-label="pageAction === PageAction.EDIT"
            field="name"
            :disabled="!!id"
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
              v-model="formData.name"
              :label="$t('operation.connectors.form.name')"
              :required="true"
              :style="{ width: `${InputWidth.LARGE}px` }"
              :max-length="63"
              show-word-limit
            ></seal-input>
            <span v-else class="readonly-view-label">{{
              formData.name || '-'
            }}</span>
            <template v-if="pageAction === PageAction.EDIT" #extra>
              <div :style="{ maxWidth: `${InputWidth.LARGE}px` }">{{
                $t('common.validate.labelName')
              }}</div>
            </template>
          </a-form-item>
          <a-form-item
            :label="$t('operation.connectors.table.environmentType')"
            :hide-label="pageAction === PageAction.EDIT"
            hide-asterisk
            field="applicableEnvironmentType"
            :disabled="!!id"
            :rules="[
              {
                required: true,
                message: $t('operation.connectors.rules.environmentType')
              }
            ]"
          >
            <seal-select
              v-if="pageAction === PageAction.EDIT"
              v-model="formData.applicableEnvironmentType"
              :label="$t('operation.connectors.table.environmentType')"
              :required="true"
              :options="EnvironmentTypeList"
              :style="{ width: `${InputWidth.LARGE}px` }"
            ></seal-select>
            <span v-else class="readonly-view-label">{{
              $t(EnvironmentTypeMap[formData.applicableEnvironmentType] || '')
            }}</span>
          </a-form-item>
          <a-form-item
            :label="$t('operation.connectors.form.type')"
            hide-asterisk
            :hide-label="pageAction === PageAction.EDIT"
            field="type"
            :rules="[
              {
                required: true,
                message: $t('operation.connectors.type.rule')
              }
            ]"
          >
            <seal-select
              v-if="pageAction === PageAction.EDIT"
              v-model="formData.type"
              :required="true"
              :label="$t('operation.connectors.form.type')"
              :style="{ width: `${InputWidth.LARGE}px` }"
            >
              <a-option
                v-for="(item, index) in typeOptions"
                :key="index"
                :value="item.value"
              >
                <ProviderIcon :provider="toLower(item.value)"></ProviderIcon>
                <span style="margin-left: 5px">{{ item.label }}</span>
              </a-option>
              <template #prefix>
                <ProviderIcon :provider="toLower(formData.type)"></ProviderIcon>
              </template>
            </seal-select>
            <span v-else class="readonly-view-label"
              ><ProviderIcon
                :provider="toLower(formData.type)"
                class="mright-5"
              ></ProviderIcon>
              <span>{{ formData.type }}</span>
            </span>
          </a-form-item>
          <a-form-item
            v-if="pageAction === PageAction.EDIT"
            hide-asterisk
            hide-label
            label="Access Token"
            field="configData.token.value"
            :rules="[
              {
                required: true,
                message: $t('operation.connectors.accesstoken.rule')
              }
            ]"
          >
            <seal-input-password
              v-model="formData.configData.token.value"
              label="Access Token"
              :required="true"
              :style="{ width: `${InputWidth.LARGE}px` }"
              style="width: 500px"
            ></seal-input-password>
          </a-form-item>
          <a-form-item
            v-if="pageAction === PageAction.VIEW"
            hide-asterisk
            :label="$t('operation.connectors.table.status')"
          >
            <span class="readonly-view-label">
              <StatusLabel
                :status="{
                  status: get(formData, 'status.summaryStatus') || '',
                  text: get(formData, 'status.summaryStatus'),
                  message: get(formData, 'status.summaryStatusMessage') || '',
                  transitioning: get(formData, 'status.transitioning'),
                  error: get(formData, 'status.error')
                }"
              ></StatusLabel>
            </span>
          </a-form-item>
        </a-form>
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
        <a-button
          type="outline"
          class="cap-title cancel-btn"
          @click="handleCancel"
          >{{ $t('common.button.cancel') }}</a-button
        >
      </EditPageFooter>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import {
    PageAction,
    validateLabelNameRegx,
    InputWidth,
    EnvironmentTypeMap,
    EnvironmentTypeOrder
  } from '@/views/config';
  import _, { assignIn, toLower, get, isEqual, cloneDeep } from 'lodash';
  import { OPERATIONHUB } from '@/router/config';
  import { Resources, Actions } from '@/permissions/config';
  import { useUserStore } from '@/store';
  import { ref, reactive, onMounted, computed } from 'vue';
  import GroupTitle from '@/components/group-title/index.vue';
  import readBlob from '@/utils/readBlob';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import useScrollToView from '@/hooks/use-scroll-to-view';
  import { onBeforeRouteLeave } from 'vue-router';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import usePageAction from '@/hooks/use-page-action';
  import ProviderIcon from '@/components/provider-icon/index.vue';
  import useGetBreadState from '@/views/application-management/projects/hooks/use-get-breadstate';
  import StatusLabel from '../components/status-label.vue';
  import { ConnectorFormData } from '../config/interface';
  import { operationRootBread, ConnectorCategory } from '../config';
  import { createConnector, updateConnector, queryItemConnector } from '../api';
  import useConnectorBread from '../hooks/use-connector-bread';

  const { scrollToView } = useScrollToView();
  const { getProjectState } = useGetBreadState();
  const { breadCrumbList, handleSelectChange, setBreadCrumbList } =
    useConnectorBread();
  const userStore = useUserStore();
  const { t, router, route } = useCallCommon();
  const { pageAction, handleEdit } = usePageAction();
  const id = route.query.id as string;
  const formref = ref();
  const submitLoading = ref(false);
  let copyFormData: any = {};
  const formData: ConnectorFormData = reactive({
    name: '',
    configData: {
      token: {
        value: '',
        visiable: false,
        type: 'string'
      }
    },
    description: '',
    configVersion: 'v1',
    applicableEnvironmentType: '',
    type: 'Github',
    category: ConnectorCategory.VersionControl,
    enableFinOps: false
  });

  const typeOptions = [
    { label: 'GitHub', value: 'Github' }
    // { label: 'GitLab', value: 'Gitlab' }
  ];

  const EnvironmentTypeList = computed(() => {
    return _.map(userStore.applicableEnvironmentTypes, (item) => {
      return {
        label: t(EnvironmentTypeMap[item] || ''),
        value: item,
        order: EnvironmentTypeOrder[item]
      };
    }).sort((a, b) => a.order - b.order);
  });

  const title = computed(() => {
    if (!id) {
      return t('operation.connectors.title.new', {
        type: t('operation.connectors.table.versioncontrol')
      });
    }
    if (id && pageAction.value === PageAction.EDIT) {
      return t('operation.connectors.title.edit', {
        type: t('operation.connectors.table.versioncontrol')
      });
    }
    if (id && pageAction.value === PageAction.EDIT) {
      return t('operation.connectors.title.view', {
        type: t('operation.connectors.table.versioncontrol')
      });
    }
    return t('operation.connectors.title.edit', {
      type: t('operation.connectors.table.versioncontrol')
    });
  });
  const handleBeforeUpload = async (file) => {
    return true;
  };
  const handleSubmit = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        submitLoading.value = true;
        copyFormData = cloneDeep(formData);
        if (id) {
          await updateConnector(formData);
        } else {
          await createConnector(formData);
        }
        router.back();
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
      }
      return true;
    }
    scrollToView();

    return false;
  };
  const getConnectorInfo = async () => {
    copyFormData = cloneDeep(formData);
    if (!id) return;
    try {
      const { data } = await queryItemConnector({ id });
      assignIn(formData, data);
      copyFormData = cloneDeep(formData);
    } catch (error) {
      // ignore
    }
  };
  const cancelCallback = () => {
    if (
      pageAction.value === PageAction.EDIT &&
      route.params.action === PageAction.VIEW
    ) {
      pageAction.value = PageAction.VIEW;
      getConnectorInfo();
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
  defineExpose({
    getConnectorInfo,
    handleSubmit
  });
  const init = () => {
    getConnectorInfo();
    setBreadCrumbList();
  };
  init();
</script>

<script lang="ts">
  export default {
    name: OPERATIONHUB.ConnectorScmDetail
  };
</script>

<style lang="less" scoped>
  .kuber-detail-wrap {
    .label-wrap {
      display: flex;
      align-items: center;

      .text {
        margin-right: 8px;
      }
    }

    :deep(.arco-select-view-single) {
      .arco-select-view-prefix {
        padding-right: 5px;
      }
    }
  }
</style>

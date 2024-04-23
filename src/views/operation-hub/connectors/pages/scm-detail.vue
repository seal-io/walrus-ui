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
          (route.params.projectName
            ? userStore.hasProjectResourceActions({
                resource: Resources.Connectors,
                connectorID: connectorName,
                projectID: route.params.projectName,
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
            :hide-label="true"
            field="metadata.name"
            :disabled="!!connectorName"
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
              v-model.trim="formData.metadata.name"
              :view-status="pageAction === PageAction.VIEW"
              :label="$t('operation.connectors.form.name')"
              :required="true"
              :style="{ width: `${InputWidth.LARGE}px` }"
              :max-length="validateInputLength.NAME"
              show-word-limit
            ></seal-input>
          </a-form-item>
          <a-form-item
            :label="$t('operation.connectors.table.environmentType')"
            :hide-label="true"
            hide-asterisk
            field="spec.applicableEnvironmentType"
            :disabled="!!connectorName"
            :rules="[
              {
                required: true,
                message: $t('operation.connectors.rules.environmentType')
              }
            ]"
          >
            <seal-select
              v-model="formData.spec.applicableEnvironmentType"
              :view-status="pageAction === PageAction.VIEW"
              :label="$t('operation.connectors.table.environmentType')"
              :required="true"
              :options="EnvironmentTypeList"
              :style="{ width: `${InputWidth.LARGE}px` }"
            ></seal-select>
          </a-form-item>
          <a-form-item
            :label="$t('operation.connectors.form.type')"
            hide-asterisk
            :hide-label="true"
            field="spec.type"
            :rules="[
              {
                required: true,
                message: $t('operation.connectors.type.rule')
              }
            ]"
          >
            <seal-select
              v-model="formData.spec.type"
              :view-status="pageAction === PageAction.VIEW"
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
                <ProviderIcon
                  :provider="toLower(formData.spec.type)"
                ></ProviderIcon>
              </template>
            </seal-select>
          </a-form-item>
          <a-form-item
            v-if="pageAction === PageAction.EDIT"
            hide-asterisk
            hide-label
            label="Access Token"
            field="spec.config.data.token.value"
            :rules="[
              {
                required: true,
                message: $t('operation.connectors.accesstoken.rule')
              }
            ]"
          >
            <seal-input-password
              v-model="formData.spec.config.data.token.value"
              label="Access Token"
              :required="true"
              :style="{ width: `${InputWidth.LARGE}px` }"
            ></seal-input-password>
          </a-form-item>
          <a-form-item
            v-if="pageAction === PageAction.VIEW"
            hide-asterisk
            hide-label
            :label="$t('operation.connectors.table.status')"
          >
            <SealFormItemWrap
              :label="$t('operation.connectors.table.status')"
              :style="{ width: `${InputWidth.LARGE}px` }"
            >
              <StatusLabel :status="get(formData, 'status', {})"></StatusLabel>
            </SealFormItemWrap>
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
    validateInputLength,
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
  import {
    createConnector,
    updateConnector,
    queryItemConnector,
    apiVersion,
    ResourKinds,
    GlobalNamespace
  } from '../api';
  import useConnectorBread from '../hooks/use-connector-bread';

  const { scrollToView } = useScrollToView();
  const { getProjectState } = useGetBreadState();
  const { breadCrumbList, handleSelectChange, setBreadCrumbList } =
    useConnectorBread();
  const userStore = useUserStore();
  const { t, router, route } = useCallCommon();
  const { pageAction, handleEdit } = usePageAction();
  const connectorName = route.query.name as string;
  const projectName = route.params.projectName as string;
  const formref = ref();
  const submitLoading = ref(false);
  let copyFormData: any = {};
  const formData = ref<ConnectorFormData>({
    apiVersion,
    kind: ResourKinds.Connector,
    metadata: {
      name: '',
      namespace: projectName || GlobalNamespace
    },
    spec: {
      type: 'Github',
      description: '',
      applicableEnvironmentType: '',
      category: ConnectorCategory.VersionControl,
      enableFinOps: false,
      config: {
        version: 'v1',
        data: {
          token: {
            value: '',
            sensitive: true,
            type: 'string'
          }
        }
      }
    }
  });

  const typeOptions = [
    { label: 'GitHub', value: 'Github' }
    // { label: 'GitLab', value: 'Gitlab' }
  ];

  const EnvironmentTypeList = computed(() => {
    // userStore.applicableEnvironmentTypes
    return _.map(_.keys(EnvironmentTypeMap), (item) => {
      return {
        label: t(EnvironmentTypeMap[item] || ''),
        value: item,
        order: EnvironmentTypeOrder[item]
      };
    }).sort((a, b) => a.order - b.order);
  });

  const title = computed(() => {
    if (!connectorName) {
      return t('operation.connectors.title.new', {
        type: t('operation.connectors.table.versioncontrol')
      });
    }
    if (connectorName && pageAction.value === PageAction.EDIT) {
      return t('operation.connectors.title.edit', {
        type: t('operation.connectors.table.versioncontrol')
      });
    }
    if (connectorName && pageAction.value === PageAction.EDIT) {
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
        if (connectorName) {
          await updateConnector({
            name: connectorName,
            data: formData.value,
            namespace: formData.value.metadata.namespace
          });
        } else {
          await createConnector({
            data: formData.value,
            name: formData.value.metadata.name,
            namespace: formData.value.metadata.namespace
          });
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
    copyFormData = cloneDeep(formData.value);
    if (!connectorName) return;
    try {
      const { data } = await queryItemConnector({
        name: connectorName,
        namespace: projectName || GlobalNamespace
      });
      formData.value = data;
      copyFormData = cloneDeep(formData.value);
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

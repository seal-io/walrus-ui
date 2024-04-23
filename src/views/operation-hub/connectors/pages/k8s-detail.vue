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
            :label="$t('operation.connectors.detail.clusterName')"
            :hide-label="true"
            hide-asterisk
            field="metadata.name"
            :disabled="!!connectorName"
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
              v-model.trim="formData.metadata.name"
              :view-status="pageAction === PageAction.VIEW"
              :label="$t('operation.connectors.detail.clusterName')"
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
            v-if="pageAction === PageAction.EDIT"
            field="spec.config.data.kubeconfig.value"
            hide-label
            label="KubeConfig"
            class="kube"
            :validate-trigger="['change']"
            :rules="[
              {
                required: true,
                message: $t('operation.connectors.rules.kubeconfig')
              },
              {
                validator: credentialsValidator
              }
            ]"
          >
            <AutoReadfile
              ref="credentialsRef"
              v-model="formData.spec.config.data.kubeconfig.value"
              lang="yaml"
              label="KubeConfig"
              placeholder="KubeConfig"
              required
              :min-width="InputWidth.LARGE"
              :min-height="200"
              :tips="$t('operation.connectors.detail.fileformat')"
              :view-status="false"
              @change="handleKubeConfigChange"
            ></AutoReadfile>
          </a-form-item>
          <a-form-item
            v-if="pageAction === PageAction.VIEW"
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
  import _, { assignIn, get, find, isEqual, cloneDeep } from 'lodash';
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
  import ResizeableContainer from '@/components/resizeable-container/index.vue';
  import AutoReadfile from '@/components/seal-form/form-components/auto-readfile.vue';
  import { ConnectorFormData } from '../config/interface';
  import { operationRootBread, ConnectorCategory } from '../config';
  import StatusLabel from '../components/status-label.vue';
  import {
    createConnector,
    updateConnector,
    queryItemConnector,
    ResourKinds,
    apiVersion,
    GlobalNamespace
  } from '../api';
  import useConnectorBread from '../hooks/use-connector-bread';

  const { breadCrumbList, handleSelectChange, setBreadCrumbList } =
    useConnectorBread();
  const { scrollToView } = useScrollToView();
  const userStore = useUserStore();
  const { t, router, route } = useCallCommon();
  const { pageAction, handleEdit } = usePageAction();
  const connectorName = route.query.name as string;
  const projectName = route.params.projectName as string;
  const formref = ref();
  const submitLoading = ref(false);
  const textareaWidth = ref(InputWidth.LARGE);
  const textareaHeight = ref(180);
  const credentialsRef = ref();
  let copyFormData: any = {};
  const formData = ref<ConnectorFormData>({
    apiVersion,
    kind: ResourKinds.Connector,
    metadata: {
      name: '',
      namespace: projectName || GlobalNamespace
    },
    spec: {
      enableFinOps: false,
      applicableEnvironmentType: '',
      category: ConnectorCategory.Kubernetes,
      type: 'Kubernetes',
      config: {
        version: 'v1',
        data: {
          kubeconfig: {
            visible: false,
            value: '',
            type: 'string'
          }
        }
      }
    }
  });

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
      return t('operation.connectors.title.new', { type: 'Kubernetes' });
    }
    if (connectorName && pageAction.value === PageAction.EDIT) {
      return t('operation.connectors.title.edit', { type: 'Kubernetes' });
    }
    if (connectorName && pageAction.value === PageAction.VIEW) {
      return t('operation.connectors.title.view', { type: 'Kubernetes' });
    }
    return t('operation.connectors.title.edit', { type: 'Kubernetes' });
  });

  const handleResize = ({ width, height }) => {
    textareaHeight.value = height;
    textareaWidth.value = width;
  };

  const credentialsValidator = (val, callback) => {
    const errors = credentialsRef.value?.validate?.();
    if (errors) {
      callback(errors[0]?.text);
    } else {
      callback();
    }
  };

  const handleKubeConfigChange = () => {
    setTimeout(() => {
      formref.value.validateField('configData.kubeconfig.value');
    }, 100);
  };
  const getCostStatus = (conditions) => {
    const d = find(conditions, (item) => {
      return item.type === 'CostSynced';
    });
    return d?.message;
  };
  const handleUploadSuccess = async (list, fileItem) => {
    const res = await readBlob(fileItem.file);
    const kubeValue = formData.value.spec.config.data.kubeconfig;
    formData.value.spec.config.data.kubeconfig = {
      ...kubeValue,
      value: res as string
    };
    formref.value.validateField('spec.config.data.kubeconfig.value');
  };
  const handleBeforeUpload = async (file) => {
    return true;
  };
  const handleSubmit = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        submitLoading.value = true;
        copyFormData = cloneDeep(formData.value);
        if (connectorName) {
          await updateConnector({
            name: connectorName,
            namespace: formData.value.metadata.namespace,
            data: formData.value
          });
        } else {
          await createConnector({
            name: connectorName,
            namespace: formData.value.metadata.namespace,
            data: formData.value
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
    name: OPERATIONHUB.ConnectorK8sDetail
  };
</script>

<style lang="less" scoped>
  .kuber-detail-wrap {
    :deep(.arco-form) {
      .arco-form-item.kube {
        &.arco-form-item-status-error .arco-form-item-extra {
          display: block;
        }
      }
    }

    .label-wrap {
      display: flex;
      align-items: center;

      .text {
        margin-right: 8px;
      }
    }

    .textarea-wrap {
      position: relative;
      overflow: hidden;
      border: 1px solid var(--color-border-2);
      border-radius: var(--border-radius-small);
      transition: border 0.2s, box-shadow 0.2s;

      :deep(.arco-textarea-wrapper) {
        overflow-y: auto;
      }

      :deep(.seal-relative.wrapper) {
        &.is-focused {
          .label {
            top: 0;
            right: 16px;
            padding: 4px 0;
            background-color: var(--color-white);
          }
        }
      }

      &:hover {
        border: 1px solid var(--color-primary-light-2);
        box-shadow: 0 0 2px 0 var(--color-primary-light-2);
        transition: border 0.2s, box-shadow 0.2s;
      }

      &::after {
        position: absolute;
        right: -1px;
        bottom: -5px;
        display: inline-block;
        color: var(--color-text-3);
        transform: rotate(45deg);
        opacity: 0.6;
        content: '||';
      }
    }
  }
</style>

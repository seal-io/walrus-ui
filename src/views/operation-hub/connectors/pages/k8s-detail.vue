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
          (route.params.projectId
            ? userStore.hasProjectResourceActions({
                resource: Resources.Connectors,
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
            :label="$t('operation.connectors.detail.clusterName')"
            :hide-label="pageAction === PageAction.EDIT"
            hide-asterisk
            field="name"
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
              :label="$t('operation.connectors.detail.clusterName')"
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
            v-if="pageAction === PageAction.EDIT"
            field="configData.kubeconfig.value"
            hide-label
            label="KubeConfig"
            :validate-trigger="['change']"
            :rules="[
              {
                required: true,
                message: $t('operation.connectors.rules.kubeconfig')
              }
            ]"
          >
            <ResizeableContainer
              :min-height="140"
              :min-width="InputWidth.LARGE"
              wrapper="parentNode"
              :act-edges="{ right: true, bottom: true }"
              @change="handleResize"
            >
              <div
                class="textarea-wrap"
                :style="{
                  width: `${textareaWidth}px`,
                  height: `${textareaHeight}px`
                }"
              >
                <seal-textarea
                  v-model="formData.configData.kubeconfig.value"
                  label="KubeConfig"
                  :required="true"
                  :spellcheck="false"
                  :style="{
                    border: 'none',
                    width: `100%`,
                    height: `${textareaHeight}px`
                  }"
                  :placeholder="$t('operation.connectors.rules.kubeconfigTips')"
                  :auto-size="{ minRows: 6 }"
                />
              </div>
            </ResizeableContainer>
            <template v-if="pageAction === PageAction.EDIT" #extra>
              <div>
                <a-upload
                  action="/"
                  :auto-upload="false"
                  :show-file-list="false"
                  :on-before-upload="handleBeforeUpload"
                  @change="handleUploadSuccess"
                >
                  <template #upload-button>
                    <div>
                      <a-button type="primary" size="small">
                        <template #icon><icon-file /></template>
                        {{
                          $t('operation.connectors.detail.readfile')
                        }}</a-button
                      >
                      <span style="margin-left: 5px">{{
                        $t('operation.connectors.detail.fileformat')
                      }}</span>
                    </div>
                  </template>
                </a-upload>
              </div>
            </template>
          </a-form-item>
          <a-form-item label="" :hide-label="pageAction === PageAction.EDIT">
            <template #label>
              <div class="label-wrap">
                <span class="text">{{
                  $t('operation.connectors.form.finopsenable')
                }}</span>
              </div>
            </template>
            <seal-checkbox
              v-if="pageAction == PageAction.EDIT"
              v-model="formData.enableFinOps"
              :style="{ width: `${InputWidth.LARGE - 20}px` }"
              :label="$t('operation.connectors.rules.enable')"
            ></seal-checkbox>
            <span v-else class="readonly-view-label">{{
              formData.enableFinOps
                ? $t('operation.connectors.finops.enable')
                : $t('operation.connectors.finops.disable')
            }}</span>
          </a-form-item>
          <a-form-item
            v-if="pageAction === PageAction.VIEW"
            :label="$t('operation.connectors.table.status')"
          >
            <span class="readonly-view-label">
              <StatusLabel
                :status="{
                  status: get(formData, 'status.summaryStatus'),
                  text: get(formData, 'status.summaryStatus'),
                  message: get(formData, 'status.summaryStatusMessage'),
                  transitioning: get(formData, 'status.transitioning'),
                  error: get(formData, 'status.error')
                }"
              ></StatusLabel>
            </span>
          </a-form-item>
          <a-form-item
            v-if="pageAction === PageAction.VIEW"
            :label="$t('operation.connectors.table.coststatus')"
          >
            <div class="readonly-view-label description-content">
              <span>{{
                getCostStatus(get(formData, 'status.conditions') || [])
              }}</span>
            </div>
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
    InputWidth
  } from '@/views/config';
  import { OPERATIONHUB } from '@/router/config';
  import { Resources, Actions } from '@/permissions/config';
  import { useUserStore } from '@/store';
  import { assignIn, get, find, isEqual, cloneDeep } from 'lodash';
  import { ref, reactive, onMounted, computed, defineExpose } from 'vue';
  import GroupTitle from '@/components/group-title/index.vue';
  import readBlob from '@/utils/readBlob';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import useScrollToView from '@/hooks/use-scroll-to-view';
  import { onBeforeRouteLeave } from 'vue-router';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import usePageAction from '@/hooks/use-page-action';
  import useProjectData from '@/views/application-management/projects/hooks/use-project-breadcrumb-data';
  import { BreadcrumbOptions } from '@/views/config/interface';
  import ResizeableContainer from '@/components/resizeable-container/index.vue';
  import { ConnectorFormData } from '../config/interface';
  import { operationRootBread } from '../config';
  import StatusLabel from '../components/status-label.vue';
  import { createConnector, updateConnector, queryItemConnector } from '../api';
  import useConnectorBread from '../hooks/use-connector-bread';

  // const props = defineProps({
  //   id: {
  //     type: String,
  //     default() {
  //       return '';
  //     }
  //   }
  // });

  const { breadCrumbList, handleSelectChange, setBreadCrumbList } =
    useConnectorBread();
  const { scrollToView } = useScrollToView();
  const userStore = useUserStore();
  const { t, router, route } = useCallCommon();
  const { pageAction, handleEdit } = usePageAction();
  const id = route.query.id as string;
  const formref = ref();
  const submitLoading = ref(false);
  const textareaWidth = ref(InputWidth.LARGE);
  const textareaHeight = ref(180);
  let copyFormData: any = {};
  const formData: ConnectorFormData = reactive({
    projectID: route.params.projectId as string,
    name: '',
    configData: {
      kubeconfig: {
        visible: false,
        value: '',
        type: 'string'
      }
    },
    configVersion: 'v1',
    type: 'Kubernetes',
    category: 'Kubernetes',
    enableFinOps: true
  });

  const title = computed(() => {
    if (!id) {
      return t('operation.connectors.title.new', { type: 'Kubernetes' });
    }
    if (id && pageAction.value === PageAction.EDIT) {
      return t('operation.connectors.title.edit', { type: 'Kubernetes' });
    }
    if (id && pageAction.value === PageAction.VIEW) {
      return t('operation.connectors.title.view', { type: 'Kubernetes' });
    }
    return t('operation.connectors.title.edit', { type: 'Kubernetes' });
  });

  const handleResize = ({ width, height }) => {
    textareaHeight.value = height;
    textareaWidth.value = width;
  };
  const getCostStatus = (conditions) => {
    const d = find(conditions, (item) => {
      return item.type === 'CostSynced';
    });
    return d?.message;
  };
  const handleUploadSuccess = async (list, fileItem) => {
    const res = await readBlob(fileItem.file);
    const kubeValue = formData.configData.kubeconfig;
    formData.configData.kubeconfig = {
      ...kubeValue,
      value: res as string
    };
    formref.value.validateField('configData.kubeconfig.value');
  };
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
      formData.enableFinOps = data.enableFinOps || false;
      copyFormData = cloneDeep(formData);
    } catch (error) {
      console.log(error);
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
    name: OPERATIONHUB.ConnectorK8sDetail
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

    .textarea-wrap {
      position: relative;
      overflow: hidden;
      border: 1px solid var(--color-border-2);
      border-radius: var(--border-radius-small);
      transition: border box-shadow 0.2s;

      :deep(.arco-textarea-wrapper) {
        overflow-y: auto;
      }

      :deep(.seal-relative.wrapper) {
        &.is-focused {
          .label {
            top: 0;
            right: 16px;
            padding: 4px 0;
            background-color: #fff;
          }
        }
      }

      &:hover {
        border: 1px solid var(--color-primary-light-2);
        box-shadow: 0 0 2px 0 var(--color-primary-light-2);
        transition: border box-shadow 0.2s;
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

<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :menu="route.params.projectId ? { icon: 'icon-apps' } : null"
        :items="
          route.params.projectId
            ? breadCrumbList
            : [
                { ...operationRootBread, label: $t(operationRootBread.label) },
                {
                  label: title
                }
              ]
        "
      ></Breadcrumb>
    </BreadWrapper>
    <ComCard top-gap class="kuber-detail-wrap">
      <GroupTitle
        :bordered="false"
        :show-edit="
          pageAction === 'view' &&
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
        <a-form ref="formref" :model="formData" auto-label-width>
          <a-form-item
            :label="$t('operation.connectors.form.name')"
            field="name"
            :rules="[
              {
                required: pageAction === 'edit',
                message: $t('operation.connectors.rule.name')
              }
            ]"
          >
            <a-input
              v-if="pageAction === 'edit'"
              v-model="formData.name"
              style="width: 500px"
              :max-length="30"
              show-word-limit
            ></a-input>
            <span v-else class="readonly-view-label">{{
              formData.name || '-'
            }}</span>
          </a-form-item>
          <a-form-item
            :label="$t('operation.connectors.form.type')"
            field="type"
            :rules="[
              {
                required: pageAction === 'edit',
                message: $t('operation.connectors.type.rule')
              }
            ]"
          >
            <a-select
              v-if="pageAction === 'edit'"
              v-model="formData.type"
              style="width: 500px"
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
            </a-select>
            <span v-else class="readonly-view-label"
              ><ProviderIcon
                :provider="toLower(formData.type)"
                class="mright-5"
              ></ProviderIcon>
              <span>{{ formData.type }}</span>
            </span>
          </a-form-item>
          <a-form-item
            v-if="pageAction === 'edit'"
            label="Access Token"
            field="configData.token.value"
            :rules="[
              {
                required: pageAction === 'edit',
                message: $t('operation.connectors.accesstoken.rule')
              }
            ]"
          >
            <a-input-password
              v-model="formData.configData.token.value"
              style="width: 500px"
            ></a-input-password>
          </a-form-item>
          <a-form-item
            v-if="pageAction === 'view'"
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
        </a-form>
      </div>
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
  import { OPERATIONHUB } from '@/router/config';
  import { Resources, Actions } from '@/permissions/config';
  import { useUserStore } from '@/store';
  import { assignIn, toLower, get, isEqual, cloneDeep } from 'lodash';
  import { ref, reactive, onMounted, computed, defineExpose } from 'vue';
  import GroupTitle from '@/components/group-title/index.vue';
  import readBlob from '@/utils/readBlob';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import { onBeforeRouteLeave } from 'vue-router';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import usePageAction from '@/hooks/use-page-action';
  import ProviderIcon from '@/components/provider-icon/index.vue';
  import useGetBreadState from '@/views/application-management/projects/hooks/use-get-breadstate';
  import StatusLabel from '../components/status-label.vue';
  import { ConnectorFormData } from '../config/interface';
  import { operationRootBread } from '../config';
  import { createConnector, updateConnector, queryItemConnector } from '../api';

  // const props = defineProps({
  //   id: {
  //     type: String,
  //     default() {
  //       return '';
  //     }
  //   }
  // });
  const { getProjectState } = useGetBreadState();
  const userStore = useUserStore();
  const { t, router, route } = useCallCommon();
  const { pageAction, handleEdit } = usePageAction();
  const id = route.query.id || '';
  const formref = ref();
  const submitLoading = ref(false);
  let copyFormData: any = {};
  const formData: ConnectorFormData = reactive({
    projectID: route.params.projectId as string,
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
    type: 'Github',
    category: 'VersionControl',
    enableFinOps: false
  });

  const typeOptions = [
    { label: 'GitHub', value: 'Github' }
    // { label: 'GitLab', value: 'Gitlab' }
  ];
  const title = computed(() => {
    if (!id) {
      return t('operation.connectors.title.new', {
        type: t('operation.connectors.table.versioncontrol')
      });
    }
    if (id && pageAction.value === 'edit') {
      return t('operation.connectors.title.edit', {
        type: t('operation.connectors.table.versioncontrol')
      });
    }
    if (id && pageAction.value === 'view') {
      return t('operation.connectors.title.view', {
        type: t('operation.connectors.table.versioncontrol')
      });
    }
    return t('operation.connectors.title.edit', {
      type: t('operation.connectors.table.versioncontrol')
    });
  });
  const breadCrumbList = computed(() => {
    return [
      {
        ...getProjectState({
          id: route.params.projectId,
          name: ''
        })
      },
      {
        type: 'menu.operatorHub.connector',
        label: title.value
      }
    ];
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
      console.log(error);
    }
  };
  const cancelCallback = () => {
    if (pageAction.value === 'edit' && route.params.action === 'view') {
      pageAction.value = 'view';
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
  getConnectorInfo();
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

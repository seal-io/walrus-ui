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
              style="width: 470px"
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
              style="width: 470px"
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
          <template v-if="pageAction === 'edit'">
            <div
              v-for="item in providerKeys"
              :key="item.key"
              style="display: inline-flex; justify-content: flex-start"
            >
              <a-form-item
                :label="item.label"
                :field="`configData.${item.key}.value`"
                validate-trigger="change"
                :rules="[
                  {
                    required: pageAction === 'edit',
                    message: $t('common.form.rule.input', { name: item.label })
                  }
                ]"
              >
                <div>
                  <a-input
                    v-if="item.visible"
                    v-model="formData.configData[item.key].value"
                    style="width: 470px"
                  />
                  <a-input-password
                    v-else
                    v-model="formData.configData[item.key].value"
                    style="width: 470px"
                  ></a-input-password>
                </div>
              </a-form-item>
            </div>
          </template>
          <a-form-item
            v-if="pageAction === 'view'"
            :label="$t('operation.connectors.form.attribute')"
          >
            <DescriptionTable
              style="width: 600px; margin-left: 12px"
              :data-list="providerKeys"
            >
              <template #value="{ row }">
                <AutoTip
                  style="width: 350px"
                  :tooltip-props="{
                    content: get(formData, `configData.${row.key}.value`)
                  }"
                >
                  <span>{{
                    !row.visible
                      ? '******'
                      : get(formData, `configData.${row.key}.value`)
                  }}</span>
                </AutoTip>
              </template>
            </DescriptionTable>
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
  import DescriptionTable from '@/components/description-table/index.vue';
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
  const providerKeys = [
    { label: 'AccessKey', value: '', key: 'access_key', visible: true },
    { label: 'SecretKey', value: '', key: 'secret_key', visible: false },
    { label: 'Region', value: '', key: 'region', visible: true }
  ];
  const { getProjectState } = useGetBreadState();
  const userStore = useUserStore();
  const { t, router, route } = useCallCommon();
  const { pageAction, handleEdit } = usePageAction();
  const id = route.query.id as string;
  const formref = ref();
  const submitLoading = ref(false);
  let copyFormData: any = {};
  const formData: ConnectorFormData = reactive({
    projectID: route.params.projectId as string,
    name: '',
    configData: {
      access_key: {
        value: '',
        visible: true,
        type: 'string'
      },
      secret_key: {
        value: '',
        visible: false,
        type: 'string'
      },
      region: {
        value: '',
        visible: true,
        type: 'string'
      }
    },
    description: '',
    configVersion: 'v1',
    type: 'Alibaba',
    category: 'CloudProvider',
    enableFinOps: false
  });

  const typeOptions = [
    { label: 'Alibaba', value: 'Alibaba' },
    { label: 'AWS', value: 'AWS' }
  ];
  const title = computed(() => {
    if (!id) {
      return t('operation.connectors.title.new', {
        type: t('operation.connectors.reinstall.cloudProvider')
      });
    }
    if (id && pageAction.value === 'edit') {
      return t('operation.connectors.title.edit', {
        type: t('operation.connectors.reinstall.cloudProvider')
      });
    }
    if (id && pageAction.value === 'view') {
      return t('operation.connectors.title.view', {
        type: t('operation.connectors.reinstall.cloudProvider')
      });
    }
    return t('operation.connectors.title.edit', {
      type: t('operation.connectors.reinstall.cloudProvider')
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
        label: title.value
      }
    ];
  });
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
    name: OPERATIONHUB.ConnectorProviderDetail
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

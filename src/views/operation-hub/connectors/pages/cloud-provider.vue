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
              :label="$t('operation.connectors.form.type')"
              :required="true"
              :style="{ width: `${InputWidth.LARGE}px` }"
              @change="handleTypeChange"
            >
              <a-option
                v-for="(item, index) in cutomeTypeOptions"
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
          <template v-if="pageAction === PageAction.EDIT">
            <div
              v-for="item in providerKeys"
              :key="item.key"
              style="display: inline-flex; justify-content: flex-start"
            >
              <a-form-item
                :label="item.label"
                :field="`configData.${item.key}.value`"
                :hide-label="pageAction === PageAction.EDIT"
                hide-asterisk
                validate-trigger="change"
                :rules="[
                  {
                    required: true,
                    message: $t('common.form.rule.input', { name: item.label })
                  }
                ]"
              >
                <div>
                  <seal-select
                    v-if="item.key === 'region'"
                    ref="regionSelect"
                    v-model="formData.configData[item.key].value"
                    allow-create
                    allow-search
                    :label="$t('operation.connectors.table.region')"
                    :required="true"
                    :popup-info="$t('operation.connectors.form.region.tips')"
                    :style="{ width: `${InputWidth.LARGE}px` }"
                  >
                    <a-option
                      v-for="(sItem, sIndex) in regionOptions"
                      :key="sIndex"
                      :value="sItem.value"
                    >
                      <span>
                        <span class="mright-5">{{ sItem.icon }}</span>
                        {{ `${sItem.label}` }}</span
                      >
                    </a-option>
                  </seal-select>
                  <seal-input
                    v-else-if="item.visible"
                    v-model="formData.configData[item.key].value"
                    :label="item.label"
                    :required="true"
                    :style="{ width: `${InputWidth.LARGE}px` }"
                  />
                  <seal-input-password
                    v-else
                    v-model="formData.configData[item.key].value"
                    :label="item.label"
                    :required="true"
                    :style="{ width: `${InputWidth.LARGE}px` }"
                  ></seal-input-password>
                </div>
              </a-form-item>
            </div>
          </template>
          <a-form-item
            v-if="pageAction === PageAction.VIEW"
            :label="$t('operation.connectors.form.attribute')"
            :hide-asterisk="true"
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
  import { assignIn, toLower, get, isEqual, cloneDeep } from 'lodash';
  import { ref, reactive, onMounted, computed, h, compile } from 'vue';
  import GroupTitle from '@/components/group-title/index.vue';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import useScrollToView from '@/hooks/use-scroll-to-view';
  import { onBeforeRouteLeave } from 'vue-router';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import usePageAction from '@/hooks/use-page-action';
  import { getListLabel } from '@/utils/func';
  import ProviderIcon from '@/components/provider-icon/index.vue';
  import DescriptionTable from '@/components/description-table/index.vue';
  import { ConnectorFormData } from '../config/interface';
  import {
    operationRootBread,
    CloudProviderType,
    cutomeTypeOptions,
    ConnectorCategory
  } from '../config';
  import { awsRegions, alibabaCloudRegions } from '../config/region';
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

  const providerKeys = [
    { label: 'AccessKey', value: '', key: 'access_key', visible: true },
    { label: 'SecretKey', value: '', key: 'secret_key', visible: false },
    { label: 'Region', value: '', key: 'region', visible: true }
  ];
  const { breadCrumbList, handleSelectChange, setBreadCrumbList } =
    useConnectorBread();
  const { scrollToView } = useScrollToView();
  const userStore = useUserStore();
  const { t, locale, router, route } = useCallCommon();
  const { pageAction, handleEdit } = usePageAction();
  const id = route.query.id as string;
  const formref = ref();
  const submitLoading = ref(false);
  const allowCreate = ref(false);
  const regionSelect = ref();
  let copyFormData: any = {};
  const formData: ConnectorFormData = reactive({
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
    type: CloudProviderType.Alibaba,
    category: ConnectorCategory.CloudProvider,
    enableFinOps: false
  });

  const regionOptions = computed(() => {
    const list =
      formData.type === CloudProviderType.AWS
        ? awsRegions
        : alibabaCloudRegions;
    return list.map((item) => {
      const label =
        locale.value === 'zh-CN'
          ? `${item.cnName}(${item.code})`
          : `${item.enName}(${item.code})`;
      return {
        label,
        value: item.code,
        icon: item.emoji
      };
    });
  });
  const title = computed(() => {
    if (!id) {
      return t('operation.connectors.title.new', {
        type: t('operation.connectors.reinstall.cloudProvider')
      });
    }
    if (id && pageAction.value === PageAction.EDIT) {
      return t('operation.connectors.title.edit', {
        type: t('operation.connectors.reinstall.cloudProvider')
      });
    }
    if (id && pageAction.value === PageAction.VIEW) {
      return t('operation.connectors.title.view', {
        type: t('operation.connectors.reinstall.cloudProvider')
      });
    }
    return t('operation.connectors.title.edit', {
      type: t('operation.connectors.reinstall.cloudProvider')
    });
  });
  const handleAllowCreate = () => {
    allowCreate.value = !allowCreate.value;
    setTimeout(() => {
      regionSelect.value?.focus();
    }, 50);
  };
  const handleTypeChange = () => {
    // reset region
    formData.configData.region.value = '';
  };
  const formatRegionLabel = ({ value }) => {
    const item = regionOptions.value.find((item) => item.value === value);
    return item?.label;
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

<template>
  <comCard top-gap class="kuber-detail-wrap">
    <GroupTitle
      :title="title"
      show-back
      :show-edit="
        pageAction === 'view' &&
        userStore.hasRolesActionsPermission({
          resource: Resources.Connectors,
          actions: ['PUT']
        })
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
        <!-- <a-form-item
          field="description"
          :hide-asterisk="false"
          label="描述"
          :validate-trigger="['change']"
        >
          <a-textarea
            v-model="formData.description"
            style="width: 500px"
            :spellcheck="false"
            :auto-size="{ minRows: 4, maxRows: 6 }"
          />
        </a-form-item> -->
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
  </comCard>
</template>

<script lang="ts" setup>
  import { Resources } from '@/permissions/config';
  import { useUserStore } from '@/store';
  import { assignIn, toLower, get, isEqual, cloneDeep } from 'lodash';
  import { ref, reactive, onMounted, computed } from 'vue';
  import GroupTitle from '@/components/group-title/index.vue';
  import readBlob from '@/utils/readBlob';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import { onBeforeRouteLeave } from 'vue-router';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import usePageAction from '@/hooks/use-page-action';
  import ProviderIcon from '@/components/provider-icon/index.vue';
  import StatusLabel from '../components/status-label.vue';
  import { ConnectorFormData } from '../config/interface';
  import { createConnector, updateConnector, queryItemConnector } from '../api';

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
    }
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
  getConnectorInfo();
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

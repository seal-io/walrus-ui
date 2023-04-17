<template>
  <comCard top-gap class="kuber-detail-wrap">
    <GroupTitle
      :title="title"
      show-back
      :show-edit="pageAction === 'view'"
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
              message: t('operation.connectors.rule.name')
            },
            {
              match: /^[A-Za-z0-9]([A-Za-z0-9-_]*[A-Za-z0-9])?$/,
              message: $t('operation.environments.name.tips')
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
          <a-input
            v-if="pageAction === 'edit'"
            v-model="formData.type"
            style="width: 500px"
          ></a-input>
          <span v-else class="readonly-view-label">{{
            formData.type || '-'
          }}</span>
        </a-form-item>
        <a-form-item
          :label="$t('operation.connectors.form.attribute')"
          field="configData.attributes"
          :rules="[
            {
              validator: validatorAttribute,
              required: pageAction === 'edit',
              message: $t('operation.connectors.attribute.rule')
            }
          ]"
        >
          <a-space
            v-if="labelList?.length && pageAction === 'edit'"
            style="display: flex; flex-direction: column"
            direction="vertical"
          >
            <xInputGroup
              v-for="(sItem, sIndex) in labelList"
              :key="sIndex"
              v-model:dataKey="sItem.key"
              v-model:dataValue="sItem.value"
              v-model:value="formData.configData.attributes"
              show-password
              :trigger-validate="triggerValidate"
              width="500px"
              class="group-item"
              :max-length="null"
              :label-list="labelList"
              :position="sIndex"
              @add="(obj) => handleAddLabel(obj, labelList)"
              @delete="handleDeleteLabel(labelList, sIndex)"
            ></xInputGroup>
          </a-space>
          <template v-if="pageAction === 'view' && labelList?.length">
            <labelsList
              style="margin-left: 12px"
              :labels="formData.configData.attributes"
            ></labelsList>
          </template>
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
          >{{ $t('common.button.confirm') }}</a-button
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
  import {
    assignIn,
    toLower,
    keys,
    map,
    get,
    isEqual,
    cloneDeep
  } from 'lodash';
  import { ref, reactive, onMounted, computed } from 'vue';
  import GroupTitle from '@/components/group-title/index.vue';
  import readBlob from '@/utils/readBlob';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import { onBeforeRouteLeave } from 'vue-router';
  import usePageAction from '@/hooks/use-page-action';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import xInputGroup from '@/components/form-create/custom-components/x-input-group.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import ProviderIcon from '@/components/provider-icon/index.vue';
  import labelsList from '@/views/application-management/applications/components/app-info/labels-list.vue';
  import { ConnectorFormData } from '../config/interface';
  import { createConnector, updateConnector, queryItemConnector } from '../api';

  const { t, router, route } = useCallCommon();
  const { pageAction, handleEdit } = usePageAction();
  const id = route.query.id as string;
  const formref = ref();
  const submitLoading = ref(false);
  const triggerValidate = ref(false);
  let copyFormData: any = {};
  const formData: ConnectorFormData = reactive({
    name: '',
    configData: {
      attributes: {}
    },
    description: '',
    configVersion: 'v1',
    type: '',
    category: 'Custom',
    enableFinOps: false
  });

  const labelList = ref<{ key: string; value: string }[]>([
    { key: '', value: '' }
  ]);
  const title = computed(() => {
    if (id) {
      return t('operation.connectors.title.edit', {
        type: t('operation.connectors.reinstall.custom')
      });
    }
    return t('operation.connectors.title.new', {
      type: t('operation.connectors.reinstall.custom')
    });
  });
  const handleAddLabel = (obj, list) => {
    list?.push(obj);
  };
  const handleDeleteLabel = (list, index) => {
    const len = list.length || 0;
    if (len < 2) return;
    list?.splice(index, 1);
  };
  const validatorAttribute = (val, callback) => {
    if (!keys(formData.configData.attributes).length) {
      callback(t('operation.connectors.attribute.rule'));
    } else {
      callback();
    }
  };
  const setLabelList = () => {
    const attributes = keys(formData.configData.attributes) || [];

    labelList.value = map(attributes, (key) => {
      return {
        key,
        value: get(formData, `configData.attributes.${key}`)
      };
    });
    if (!labelList.value.length) {
      labelList.value = [{ key: '', value: '' }];
    }
  };
  const handleSubmit = async () => {
    const res = await formref.value?.validate();
    triggerValidate.value = !res;
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
      setLabelList();
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

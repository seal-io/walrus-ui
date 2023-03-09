<template>
  <ComCard top-gap>
    <GroupTitle
      show-back
      :title="
        id
          ? $t('operation.environments.edit')
          : $t('operation.environments.create')
      "
    ></GroupTitle>
    <a-form ref="formref" :model="formData" auto-label-width>
      <a-form-item
        :label="$t('operation.environments.table.name')"
        field="name"
        :validate-trigger="['change']"
        :rules="[{ required: true, message: '环境名称必填' }]"
      >
        <a-input
          v-model="formData.name"
          style="width: 500px"
          :max-length="50"
          show-word-limit
        ></a-input>
      </a-form-item>
      <a-form-item
        :label="$t('operation.environments.table.description')"
        field="description"
      >
        <a-textarea
          v-model="formData.description"
          style="width: 500px"
          :max-length="200"
          show-word-limit
          :auto-size="{ minRows: 6, maxRows: 10 }"
        ></a-textarea>
      </a-form-item>
      <a-form-item
        :label="$t('operation.connectors.menu')"
        field="connectorIDs"
        :validate-trigger="['change']"
        :rules="[{ required: true, message: '请添加连接器' }]"
      >
        <connectorsTable
          :list="formData?.edges?.connectors || []"
          @delete="handleDeleteConnector"
        ></connectorsTable>
        <template #extra>
          <div style="display: flex">
            <a-button
              type="primary"
              size="small"
              style="margin-right: 8px; padding: 0 6px"
              @click.stop="handleAddConnector"
            >
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('operation.environments.detail.addConnector') }}</a-button
            >
            <ConnectorSelector
              v-if="showModal"
              v-model:show="showModal"
              v-model:selected="formData.connectorIDs"
              :list="connectorList"
              @confirm="handleConnectorChange"
            ></ConnectorSelector>
          </div>
        </template>
      </a-form-item>
    </a-form>
    <EditPageFooter>
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
  </ComCard>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { assignIn, concat, each, includes, map, remove, get } from 'lodash';
  import GroupTitle from '@/components/group-title/index.vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { queryConnectors } from '@/views/operation-hub/connectors/api';
  import { EnvironFormData, EnvironmentRow } from '../config/interface';
  import connectorsTable from '../components/connectors.vue';
  import ConnectorSelector from '../components/connector-selector.vue';
  import {
    createEnvironment,
    updateEnvironment,
    queryItemEnvironments
  } from '../api';

  const { router, route } = useCallCommon();
  const id = route.query.id as string;
  const formref = ref();
  const connectorList = ref<{ label: string; value: string }[]>([]);
  const showModal = ref(false);
  const submitLoading = ref(false);
  const formData = ref<EnvironFormData>({
    name: '',
    description: '',
    connectorIDs: [],
    connectors: [],
    edges: {
      connectors: []
    }
  });
  const setFormDataConnectors = (values) => {
    each(connectorList.value, (item) => {
      if (includes(values, item.value)) {
        formData.value?.edges?.connectors?.push(item);
      }
    });
    formData.value.connectors = map(formData.value.connectorIDs, (val) => {
      return {
        connector: {
          id: val
        }
      };
    });
  };
  const getItemEnvironmentInfo = async () => {
    if (!id) return;
    try {
      const { data } = await queryItemEnvironments({ id });
      formData.value = data;
      formData.value.edges.connectors = [];
      setFormDataConnectors(get(data, 'connectorIDs') || []);
      console.log('formData======', formData.value);
    } catch (error) {
      formData.value = {
        name: '',
        description: '',
        connectorIDs: [],
        connectors: [],
        edges: {
          connectors: []
        }
      };
      console.log(error);
    }
  };
  const getConnectors = async () => {
    try {
      const params = {
        page: 1,
        perPage: 1000
      };
      const { data } = await queryConnectors(params);
      const list = data?.items || [];
      connectorList.value = map(list, (item) => {
        item.value = item.id;
        item.label = item.name;
        return item;
      }) as Array<{ label: string; value: string }>;
    } catch (error) {
      connectorList.value = [];
      console.log(error);
    }
  };
  const handleAddConnector = () => {
    showModal.value = true;
  };

  const handleConnectorChange = (values) => {
    formData.value.connectorIDs = concat(formData.value.connectorIDs, values);
    setFormDataConnectors(values);
    console.log('formData.connectorIDs', formData.value.connectorIDs);
  };
  const handleDeleteConnector = (record, index) => {
    formData.value?.edges?.connectors?.splice(index, 1);
    remove(formData.value.connectorIDs, (val) => record.id === val);
    console.log('formData.connectorIDs', formData.value.connectorIDs);
  };
  const handleSubmit = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        submitLoading.value = true;
        // TODO
        if (id) {
          await updateEnvironment(formData.value);
        } else {
          await createEnvironment(formData.value);
        }
        router.back();
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
      }
    }
  };
  const handleCancel = () => {
    router.back();
  };
  const init = async () => {
    await getConnectors();
    getItemEnvironmentInfo();
  };
  init();
</script>

<style></style>

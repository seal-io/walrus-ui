<template>
  <ComCard top-gap>
    <GroupTitle
      show-back
      :title="
        id
          ? $t('operation.templates.detail.edit')
          : $t('operation.templates.detail.add')
      "
    ></GroupTitle>
    <a-form ref="formref" :model="formData" auto-label-width>
      <a-form-item
        :label="$t('operation.connectors.table.name')"
        field="id"
        :disabled="!!id"
        :validate-trigger="['change']"
        :rules="[
          { required: true, message: $t('operation.templates.rules.name') }
        ]"
      >
        <a-input
          v-model="formData.id"
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
          style="width: 360px"
          :auto-size="{ minRows: 6, maxRows: 10 }"
          :max-length="500"
          show-word-limit
        ></a-textarea>
      </a-form-item>
      <!-- <a-form-item :label="$t('operation.connectors.table.type')" field="type">
        <a-select v-model="formData.description">
          <a-option
            v-for="item in templateTypeList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          >
          </a-option>
        </a-select>
      </a-form-item> -->
      <a-form-item
        field="source"
        :label="$t('operation.templates.detail.source')"
        :validate-trigger="['change']"
        :rules="[
          { required: true, message: $t('operation.templates.rules.source') }
        ]"
      >
        <a-input v-model="formData.source"></a-input>
      </a-form-item>
      <a-form-item
        field="version"
        :label="$t('operation.templates.detail.version')"
      >
        <a-input v-model="formData.version"></a-input>
      </a-form-item>
      <!-- <a-form-item>
        <a-tabs
          :active-key="activeKey"
          lazy-load
          class="page-line-tabs"
          @change="handleTabChange"
        >
          <a-tab-pane
            v-for="item in tabList"
            :key="item.com"
            :title="item.label"
          >
            <component
              :is="tabMap[item.com]"
              :schema="templateSchema"
            ></component>
          </a-tab-pane>
        </a-tabs>
      </a-form-item> -->
    </a-form>
    <a-tabs
      :active-key="activeKey"
      lazy-load
      class="page-line-tabs"
      @change="handleTabChange"
    >
      <a-tab-pane v-for="item in tabList" :key="item.com" :title="item.label">
        <component :is="tabMap[item.com]" :schema="templateSchema"></component>
      </a-tab-pane>
    </a-tabs>
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
  import { assignIn, get } from 'lodash';
  import { ref, reactive, onMounted, markRaw } from 'vue';
  import GroupTitle from '@/components/group-title/index.vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { templateTypeList, tabList } from '../config';
  import { Schema } from '../config/interface';
  import tabReadme from '../components/tab-readme.vue';
  import tabInput from '../components/tab-input.vue';
  import tabOutput from '../components/tab-output.vue';
  import tabResource from '../components/tab-resource.vue';
  import tabConnector from '../components/tab-connector.vue';
  import { queryItemModules, createModules, updateModules } from '../api';

  const tabMap = {
    tabReadme,
    tabInput,
    tabOutput,
    tabResource,
    tabConnector
  };
  const activeKey = ref('tabReadme');
  const { router, route } = useCallCommon();
  const formref = ref();
  const id = route.query.id as string;
  const submitLoading = ref(false);
  const templateSchema = reactive({});
  const formData = reactive({
    id: '',
    description: '',
    source: '',
    version: ''
  });

  const getItemModules = async () => {
    if (!id) return;
    try {
      const params = {
        id
      };
      const { data } = await queryItemModules(params);
      assignIn(formData, data);
      assignIn(templateSchema, get(data, 'schema') || {});
      console.log('templateSchema==', templateSchema);
    } catch (error) {
      console.log('error');
      formref.value.resetFields();
    }
  };

  const handleSubmit = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        submitLoading.value = true;
        if (id) {
          await updateModules(formData);
        } else {
          await createModules(formData);
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
  const handleTabChange = (val) => {
    activeKey.value = val;
  };
  onMounted(() => {
    getItemModules();
  });
</script>

<style></style>

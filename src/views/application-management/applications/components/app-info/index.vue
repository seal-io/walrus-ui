<template>
  <div class="detail-info">
    <ModuleCard title="基本信息">
      <template #title>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
          "
        >
          <span>基本信息</span>
          <a-button
            type="primary"
            size="small"
            style="width: 98px"
            @click="handleDeployApp"
            >部署</a-button
          >
        </div>
      </template>
      <BasicInfo ref="basicform" :data-info="appInfo"></BasicInfo>
    </ModuleCard>
    <ModuleCard title="Moudles">
      <div class="content">
        <instanceThumb
          v-for="item in appInfo.modules"
          :key="item?.module?.id"
          :active="item?.module?.id === active"
          :data-info="item"
          :size="130"
          :actions="instanceActions"
          @edit="handleEditApp"
          @click="handleClickInstance(item)"
        >
          <template #description>
            <span>Type: {{ item?.module?.id }}</span>
          </template>
        </instanceThumb>
        <a-tooltip content="Add Module">
          <thumbButton :size="60" @click="handleAddModule"></thumbButton>
        </a-tooltip>
      </div>
    </ModuleCard>
    <ModuleCard title="Variables">
      <a-dropdown @select="handleSelect">
        <a-button size="small" type="outline" style="margin-bottom: 8px"
          >Add a variabel<icon-down style="margin-left: 5px"
        /></a-button>
        <template #content>
          <a-doption
            v-for="item in moduleTemplates"
            :key="item.id"
            :value="item.schema"
            >{{ item.id }}</a-doption
          >
        </template>
      </a-dropdown>
      <moduleWrapper
        v-for="(item, index) in variableList"
        :key="index"
        style="margin-bottom: 10px"
        title="Variable Name"
        :status="collapseStatus === index"
        @delete="handleDeleteVariable(index)"
      >
        <variableForm :key="index" :data-info="item"></variableForm>
      </moduleWrapper>
    </ModuleCard>
    <EditPageFooter>
      <template #save>
        <a-button
          type="primary"
          class="cap-title cancel-btn"
          :loading="submitLoading"
          @click="handleOk"
          >{{ $t('common.button.save') }}</a-button
        >
      </template>
      <template #cancel>
        <a-button
          type="outline"
          class="cap-title cancel-btn"
          @click="handleCancel"
          >{{ $t('common.button.cancel') }}</a-button
        >
      </template>
    </EditPageFooter>
    <editModule
      v-model:show="showEditModal"
      :templates="moduleTemplates"
    ></editModule>
    <createInstance
      v-model:show="showInstanceModal"
      title="部署应用"
      @save="handleSaveInstanceInfo"
    ></createInstance>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import thumbButton from '@/components/buttons/thumb-button.vue';
  import { queryModules } from '@/views/operation-hub/templates/api';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { TemplateRowData } from '@/views/operation-hub/templates/config/interface';
  import createInstance from '../create-instance.vue';
  import instanceThumb from '../instance-thumb.vue';
  import variableForm from './variable-form.vue';
  import moduleWrapper from '../module-wrapper.vue';
  import editModule from './edit-module.vue';
  import BasicInfo from './basic-info.vue';
  import { AppFormData } from '../../config/interface';
  import { instanceActions } from '../../config';
  import { createApplication } from '../../api';

  const { router, route } = useCallCommon();
  const basicform = ref();
  const appInfo = reactive({
    name: '',
    description: '',
    labels: {},
    project: {
      id: route.params.projectId
    },
    modules: []
  }) as AppFormData;

  const variableList = ref([{ name: '', value: '', description: '' }]);
  const submitLoading = ref(false);
  const moduleTemplates = ref<TemplateRowData[]>([]);
  const active = ref('');
  const showInstanceModal = ref(false);
  const showEditModal = ref(false);

  const collapseStatus = computed(() => {
    return variableList.value.length - 1;
  });
  const handleEditApp = () => {};
  const handleAddModule = () => {
    showEditModal.value = true;
  };
  const handleClickInstance = (data) => {};
  const handleDeleteVariable = (index) => {
    variableList.value.splice(index, 1);
  };
  const getModules = async () => {
    try {
      const params = {
        page: 1,
        perPage: 1000
      };
      const { data } = await queryModules(params);
      moduleTemplates.value = data?.items || [];
    } catch (error) {
      moduleTemplates.value = [];
      console.log(error);
    }
  };
  const handleSelect = () => {
    variableList.value.push({
      name: '',
      value: '',
      description: ''
    });
  };
  const handleSaveInstanceInfo = () => {};
  const handleDeployApp = () => {
    showInstanceModal.value = true;
  };
  const handleOk = async () => {
    const result = await basicform.value.getFormData();
    if (!result) return;
    try {
      const data = {
        ...appInfo,
        ...result
      };
      submitLoading.value = true;
      await createApplication(data);
      submitLoading.value = false;
      router.back();
    } catch (error) {
      submitLoading.value = false;
      console.log(error);
    }
  };
  const handleCancel = () => {
    router.back();
  };
  getModules();
</script>

<style lang="less" scoped>
  .detail-info {
    .content {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      min-height: 110px;

      .thumb-item {
        margin-right: 12px;
        margin-bottom: 12px;
      }
    }
  }
</style>

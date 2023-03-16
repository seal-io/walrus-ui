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
            v-if="id"
            type="primary"
            size="small"
            style="width: 98px"
            @click="handleDeployApp"
          >
            部署</a-button
          >
        </div>
      </template>
      <BasicInfo
        ref="basicform"
        :data-info="appInfo"
        :default-value="defaultBasicInfo"
      ></BasicInfo>
    </ModuleCard>
    <ModuleCard title="Modules">
      <div class="content">
        <instanceThumb
          v-for="(item, index) in appInfo.modules"
          :key="item?.module?.id"
          :active="item?.module?.id === active"
          :data-info="item"
          :size="[200, 100]"
          :actions="moduleActions"
          @edit="handleEditModule(item)"
          @delete="handleDeleteModule(index)"
          @click="handleClickInstance(item)"
        >
          <template #description>
            <div
              style="
                width: 180px;
                overflow: hidden;
                font-weight: 700;
                white-space: nowrap;
                text-align: center;
                text-overflow: ellipsis;
              "
              >{{ item?.module?.id }}</div
            >
          </template>
        </instanceThumb>
        <a-tooltip content="Add Module">
          <thumbButton :size="60" @click="handleAddModule"></thumbButton>
        </a-tooltip>
      </div>
    </ModuleCard>
    <ModuleCard title="Variables">
      <a-button
        size="small"
        type="outline"
        style="margin-bottom: 8px"
        @click="handleSelect"
        ><icon-plus style="margin-right: 5px" />Add a variable</a-button
      >
      <!-- <a-dropdown @select="handleSelect">
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
      </a-dropdown> -->
      <moduleWrapper
        v-for="(item, index) in get(appInfo, 'variables') || []"
        :key="index"
        style="margin-bottom: 10px"
        :title="item.name || 'Variable Name'"
        :status="collapseStatus === index"
        @delete="handleDeleteVariable(index)"
      >
        <variableForm
          :key="index"
          v-model:data-info="appInfo.variables[index]"
        ></variableForm>
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
      v-model:action="moduleAction"
      :data-info="moduleInfo"
      :templates="moduleTemplates"
      @save="handleSaveModule"
    ></editModule>
    <createInstance
      v-model:show="showInstanceModal"
      :variables="appInfoVariables"
      :environment-list="environmentList"
      title="部署应用"
      @save="handleSaveInstanceInfo"
    ></createInstance>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed, provide, inject } from 'vue';
  import { cloneDeep, assignIn, omit, pick, get, concat, map } from 'lodash';
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
  import { AppFormData, Variables } from '../../config/interface';
  import { moduleActions } from '../../config';
  import {
    createApplication,
    queryItemApplication,
    updateApplication
  } from '../../api';

  const environmentList = inject(
    'environmentList',
    ref<{ label: string; value: string }[]>([])
  );
  const { router, route } = useCallCommon();
  const basicform = ref();
  const appInfo = reactive({
    name: '',
    description: '',
    labels: {},
    variables: [],
    project: {
      id: route.params.projectId
    },
    environment: {
      id: 'test'
    },
    modules: []
  }) as AppFormData;

  const emits = defineEmits(['deploy', 'save']);
  const submitLoading = ref(false);
  const id = route.query.id as string;
  const cloneId = route.query.cloneId as string;
  const moduleTemplates = ref<TemplateRowData[]>([]);
  const appInfoVariables = ref<Variables[]>([]);
  const active = ref('');
  const moduleInfo = ref({}); // item module
  const defaultBasicInfo = ref({});
  const moduleAction = ref('create');
  const showInstanceModal = ref(false);
  const showEditModal = ref(false);

  const collapseStatus = computed(() => {
    return appInfo?.variables?.length - 1;
  });
  const handleEditModule = (item) => {
    moduleAction.value = 'edit';
    moduleInfo.value = item;
    setTimeout(() => {
      showEditModal.value = true;
    }, 100);
  };
  const handleDeleteModule = (index) => {
    appInfo.modules.splice(index, 1);
  };
  const handleAddModule = () => {
    moduleAction.value = 'create';
    setTimeout(() => {
      showEditModal.value = true;
    }, 100);
  };
  const handleClickInstance = (data) => {};
  const handleDeleteVariable = (index) => {
    appInfo.variables.splice(index, 1);
  };
  const getModules = async () => {
    try {
      const params = {
        page: 1,
        perPage: -1
      };
      const { data } = await queryModules(params);
      moduleTemplates.value = data?.items || [];
    } catch (error) {
      moduleTemplates.value = [];
      console.log(error);
    }
  };
  const handleSelect = () => {
    appInfo.variables = concat(appInfo.variables, {
      name: '',
      default: '',
      description: '',
      type: 'string'
    });
  };
  const handleSaveInstanceInfo = () => {
    emits('deploy');
  };
  const handleDeployApp = () => {
    showInstanceModal.value = true;
    appInfoVariables.value = cloneDeep(appInfo.variables);
  };
  const handleOk = async () => {
    const result = await basicform.value.getFormData();
    if (!result) return;
    try {
      const data = {
        ...appInfo,
        ...result
      };
      console.log('submit:', appInfo, result);
      submitLoading.value = true;
      if (id) {
        await updateApplication(data);
      } else {
        console.log('submit:', data);
        await createApplication(data);
      }
      submitLoading.value = false;
      emits('save');
    } catch (error) {
      submitLoading.value = false;
      console.log(error);
    }
  };
  const handleSaveModule = (data) => {
    console.log('saveModule===', data, moduleAction.value);
    if (moduleAction.value === 'create') {
      appInfo.modules.push({
        ...cloneDeep(data)
      });
    } else {
      assignIn(moduleInfo.value, data);
    }
  };
  const getApplicationDetail = async () => {
    if (!id && !cloneId) return;
    const queryId = id || cloneId;
    try {
      const params = {
        id: queryId
      };
      const { data } = await queryItemApplication(params);
      if (cloneId) {
        data.name = `${data.name}(clone)`;
      }
      defaultBasicInfo.value = pick(data, [
        'name',
        'description',
        'labels',
        'createTime',
        'updateTime'
      ]);

      assignIn(appInfo, data);

      console.log('appInfo===', appInfo);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    router.back();
  };
  const init = async () => {
    getModules();
    getApplicationDetail();
  };
  init();
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

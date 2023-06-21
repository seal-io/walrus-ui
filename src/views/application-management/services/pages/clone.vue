<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :items="breadCrumbList"
        :menu="{ icon: 'icon-apps' }"
        @change="handleSelectChange"
      ></Breadcrumb>
    </BreadWrapper>
    <ComCard top-gap>
      <a-form ref="formref" :model="formData" auto-label-width>
        <a-form-item
          :label="$t('applications.environment.clone.target')"
          field="targetEnv"
          :validate-trigger="['change']"
          :rules="[
            {
              required: true,
              message: $t('operation.environments.rule.name')
            }
          ]"
        >
          <a-select
            v-model="formData.targetEnv"
            style="width: 400px"
            multiple
            :max-tag-count="2"
            allow-search
          >
            <a-option
              v-for="item in environments"
              :key="item.id"
              :label="item.name"
            ></a-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('applications.applications.table.service')">
          <cloneService
            :show-check="false"
            :service-list="selectServices"
            style="width: 800px"
          ></cloneService>
        </a-form-item>
      </a-form>
      <EditPageFooter>
        <template #save>
          <a-button
            type="primary"
            class="cap-title cancel-btn"
            @click="handleOk"
            >{{ $t('common.button.save') }}</a-button
          >
        </template>
        <template #cancel>
          <a-button
            :type="'outline'"
            class="cap-title cancel-btn"
            @click="handleCancel"
            >{{ $t('common.button.cancel') }}</a-button
          >
        </template>
      </EditPageFooter>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { PROJECT } from '@/router/config';
  import { ref, computed, reactive } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { BreadcrumbOptions } from '@/views/config/interface';
  import cloneService from '../../environments/components/clone-service.vue';
  import useProjectBreadcrumbData from '../../projects/hooks/use-project-breadcrumb-data';

  const emits = defineEmits(['cancel', 'save']);
  const {
    getProjectList,
    getEnvironmentList,
    setProjectList,
    getServiceList,
    setEnvironmentList,
    handleBreadChange,
    initBreadValues
  } = useProjectBreadcrumbData();
  const { t, route } = useCallCommon();
  const ids = route.query.source as string;
  const breadCrumbList = ref<BreadcrumbOptions[]>([]);
  const selectServices = ref<any[]>([]);
  const environments = ref<any[]>([]);
  const formref = ref();
  const formData = reactive({
    targetEnv: [],
    services: []
  });

  const setBreadCrumbList = async () => {
    const [projectList, environmentList] = await Promise.all([
      getProjectList(),
      getEnvironmentList()
    ]);
    const projectRes = await setProjectList(projectList);
    const environmentRes = setEnvironmentList(environmentList);
    breadCrumbList.value = [
      { ...projectRes },
      { ...environmentRes },
      {
        type: 'menu.applicationManagement.serivce',
        label: t('applications.service.clone')
      }
    ] as BreadcrumbOptions[];
    environments.value = environmentList;
  };
  const handleSelectChange = ({ value, item }) => {
    handleBreadChange(value, item);
  };
  const getSelectServices = async () => {
    const list = await getServiceList();
    const cloneIds = _.concat(ids);
    selectServices.value = _.filter(list, (item) => {
      return _.includes(cloneIds, item.id);
    });
  };
  const handleOk = () => {
    emits('save');
  };

  const handleCancel = () => {
    emits('cancel');
  };

  const initData = async () => {
    const list = await initBreadValues(['env']);
    breadCrumbList.value = [
      ...list,
      {
        type: 'menu.applicationManagement.serivce',
        label: t('applications.service.clone')
      }
    ] as BreadcrumbOptions[];
    setBreadCrumbList();
    getSelectServices();
  };
  initData();
</script>

<script lang="ts">
  export default {
    name: PROJECT.ServiceEdit
  };
</script>

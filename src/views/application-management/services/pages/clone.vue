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
      <a-form
        ref="formref"
        :model="formData"
        auto-label-width
        layout="vertical"
      >
        <a-form-item
          :label="$t('applications.environment.clone.target')"
          field="environmentIDs"
          hide-label
          :validate-trigger="['change']"
          :rules="[
            {
              required: true,
              message: $t('applications.environment.clone.env.rules')
            }
          ]"
        >
          <seal-select
            v-model="formData.environmentIDs"
            :style="{ width: `${InputWidth.LARGE}px` }"
            multiple
            :required="true"
            :label="$t('applications.environment.clone.target')"
            :max-tag-count="2"
            allow-search
          >
            <a-option
              v-for="item in environments"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></a-option>
          </seal-select>
        </a-form-item>
        <a-form-item :label="$t('applications.applications.table.service')">
          <cloneService
            ref="servicesRef"
            :show-check="false"
            :service-list="selectServices"
            :async-loading="asyncLoading"
            style="width: 800px"
          ></cloneService>
        </a-form-item>
      </a-form>
      <EditPageFooter>
        <template #save>
          <a-button
            :loading="submitLoading"
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
  import xInputGroup from '@/components/form-create/custom-components/x-input-group.vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { PROJECT } from '@/router/config';
  import { InputWidth } from '@/views/config';
  import { ref, computed, reactive } from 'vue';
  import { onBeforeRouteLeave } from 'vue-router';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import useScrollToView from '@/hooks/use-scroll-to-view';
  import useCallCommon from '@/hooks/use-call-common';
  import { BreadcrumbOptions } from '@/views/config/interface';
  import useLabelsActions from '@/components/form-create/hooks/use-labels-action';
  import cloneService from '../../environments/components/clone-service.vue';
  import useProjectBreadcrumbData from '../../projects/hooks/use-project-breadcrumb-data';
  import { cloneServices, queryServices } from '../api';

  const {
    getProjectList,
    getEnvironmentList,
    setProjectList,
    getServiceList,
    setEnvironmentList,
    handleBreadChange,
    initBreadValues
  } = useProjectBreadcrumbData();
  const { scrollToView } = useScrollToView();
  const { t, route, router } = useCallCommon();
  const ids = route.query.source as string;
  const breadCrumbList = ref<BreadcrumbOptions[]>([]);
  const selectServices = ref<any[]>([]);
  const environments = ref<any[]>([]);
  const validateTrigger = ref(false);
  const submitLoading = ref(false);
  const asyncLoading = ref(false);
  const formref = ref();
  const servicesRef = ref();
  let copyFormData: any = {};
  const formData = reactive({
    environmentIDs: [],
    services: []
  });
  const { labelList, handleAddLabel, handleDeleteLabel } =
    useLabelsActions(formData);
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
    console.log('environmentList===', environmentList);
  };
  const handleSelectChange = ({ value, item }) => {
    handleBreadChange(value, item);
  };
  const getSelectServices = async () => {
    try {
      const params = {
        projectID: route.params.projectId as string,
        environmentID: route.params.environmentId as string,
        page: -1
      };
      asyncLoading.value = true;
      const { data } = await queryServices(params);
      const list = data.items || [];
      const cloneIds = _.concat(ids);
      selectServices.value = _.filter(list, (item) => {
        return _.includes(cloneIds, item.id);
      });
      asyncLoading.value = false;
    } catch (error) {
      asyncLoading.value = false;
    }
  };
  const handleCloneServices = async () => {
    const services = servicesRef.value.getSelectServiceData();
    formData.services = _.cloneDeep(services);
    await cloneServices({
      projectID: route.params.projectId as string,
      formData
    });
  };
  const validateLabel = () => {
    const valid = _.some(labelList.value, (item) => !item.value && item.key);
    return valid;
  };
  const handleOk = async () => {
    const res = await formref.value?.validate();
    validateTrigger.value = validateLabel();
    if (!res && !validateTrigger.value) {
      try {
        submitLoading.value = true;
        await handleCloneServices();
        copyFormData = _.cloneDeep(formData);

        router.back();
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
      }
    } else {
      scrollToView();
    }
  };

  const handleCancel = () => {
    if (!_.isEqual(copyFormData, formData)) {
      beforeLeaveCallback({
        isCancel: true,
        onOk: () => {
          copyFormData = _.cloneDeep(formData);
          router.back();
        }
      });
    } else {
      router.back();
    }
  };
  onBeforeRouteLeave(async (to, from) => {
    if (!_.isEqual(copyFormData, formData)) {
      beforeLeaveCallback({
        to,
        from,
        onOk: () => {
          copyFormData = _.cloneDeep(formData);
          router.push({
            name: to.name as string
          });
        }
      });
      return false;
    }
    return true;
  });
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

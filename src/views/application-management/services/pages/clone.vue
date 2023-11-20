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
            :style="{ width: `${InputWidth.LARGE + 98}px` }"
            :required="true"
            allow-clear
            multiple
            :label="$t('applications.environment.clone.target')"
            :max-tag-count="2"
            allow-search
          >
            <a-option
              v-for="item in environments"
              :key="item.id"
              :value="item.id"
              :label="item.name"
              :disabled="succeedList.has(item.id) || item.disabled"
            ></a-option>
          </seal-select>
        </a-form-item>
        <div v-if="selectedEnvList.length && trigger" class="selected-env">
          <div
            v-for="item in selectedEnvList"
            :key="item.name"
            class="selected-env-item"
          >
            <span class="selected-env-item-name">{{ item.name }}</span>
            <span class="selected-env-item-desc">
              <a-link
                type="text"
                size="mini"
                :loading="formData.environmentID === item.id && submitLoading"
                :status="setStatus(item.id)"
              >
                <icon-check-circle-fill v-if="succeedList.has(item.id)" />
                <span v-if="failedList.has(item.id) && !submitLoading">
                  <a-tooltip :content="errorMap.get(item.id)">
                    <i class="iconfont icon-warning-filling mleft-5"></i>
                  </a-tooltip>
                </span>
              </a-link>
            </span>
          </div>
        </div>
        <a-form-item
          :label="$t('applications.applications.table.service')"
          no-style
        >
          <div>
            <cloneService
              ref="servicesRef"
              v-model:hint-data="completeData"
              clone-type="service"
              :title="$t('applications.applications.table.service')"
              :show-check="false"
              :data-list="serviceList"
              :service-ids="selectServices"
              :resource-type="ServiceDataType.service"
              style="width: 800px"
            ></cloneService>
            <cloneService
              ref="resourceRef"
              v-model:hint-data="completeData"
              :title="$t('applications.applications.table.resource')"
              clone-type="service"
              :show-check="false"
              :data-list="resourceList"
              :service-ids="selectResources"
              :resource-type="ServiceDataType.resource"
              style="width: 800px"
            ></cloneService>
          </div>
        </a-form-item>
      </a-form>
      <EditPageFooter>
        <template #save>
          <!-- <a-button
            :loading="submitLoading"
            type="primary"
            class="cap-title cancel-btn"
            @click="handleOk"
            >{{
              failedList.size
                ? $t('common.button.retry')
                : $t('common.button.save')
            }}</a-button
          > -->
          <GroupButtonMenu
            :loading="submitLoading"
            :actions="SaveActions"
            @select="handleSelect"
          >
          </GroupButtonMenu>
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
  import GroupButtonMenu from '@/components/drop-button-group/group-button-menu.vue';
  import { Resources, Actions } from '@/permissions/config';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { PROJECT } from '@/router/config';
  import { InputWidth, SaveActions } from '@/views/config';
  import { ref, computed, reactive } from 'vue';
  import { useUserStore } from '@/store';
  import { onBeforeRouteLeave } from 'vue-router';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import useScrollToView from '@/hooks/use-scroll-to-view';
  import useCallCommon from '@/hooks/use-call-common';
  import { BreadcrumbOptions } from '@/views/config/interface';
  import useLabelsActions from '@/components/form-create/hooks/use-labels-action';
  import cloneService from '../../environments/components/clone-service.vue';
  import useProjectBreadcrumbData from '../../projects/hooks/use-project-breadcrumb-data';
  import useCompleteData from '../hooks/use-complete-data';
  import { cloneServices } from '../api';
  import { ServiceDataType } from '../config';

  const {
    getProjectList,
    getEnvironmentList,
    setProjectList,
    setEnvironmentList,
    handleBreadChange,
    initBreadValues
  } = useProjectBreadcrumbData();
  const {
    setCompleteData,
    getProjectVariables,
    getServiceList,
    serviceDataList,
    completeData,
    setAllTemplateVersions,
    getAllResourceDefinitions
  } = useCompleteData();
  const userStore = useUserStore();
  const { scrollToView } = useScrollToView();
  const { t, route, router } = useCallCommon();
  const ids = route.query.services as string;
  const rIds = route.query.resources as string;
  const projectID = route.params.projectId as string;
  const breadCrumbList = ref<BreadcrumbOptions[]>([]);
  const selectServices = ref<any[]>(_.concat(ids));
  const selectResources = ref<any[]>(_.concat(rIds));
  const environments = ref<any[]>([]);
  const submitLoading = ref(false);
  const trigger = ref(false);
  const formref = ref();
  const servicesRef = ref();
  const resourceRef = ref();
  const serviceList = ref<any[]>([]);
  const resourceList = ref<any[]>([]);
  const succeedList = ref<Set<string>>(new Set());
  const failedList = ref<Set<string>>(new Set());
  const stageEnvironmentIDs = ref<string[]>([]);
  const errorMap = ref<Map<string, string>>(new Map());
  let copyFormData: any = {};
  const formData = reactive({
    draft: false,
    environmentID: '',
    environmentIDs: [],
    items: []
  });
  const { labelList, handleAddLabel, handleDeleteLabel } =
    useLabelsActions(formData);

  const selectedEnvList = computed(() => {
    return _.filter(environments.value, (item) =>
      _.includes(formData.environmentIDs, item.id)
    );
  });

  const setStatus = (id) => {
    if (submitLoading.value) return 'normal';
    if (succeedList.value.has(id)) {
      return 'success';
    }
    if (failedList.value.has(id)) {
      return 'danger';
    }
    return 'normal';
  };
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
    environments.value = _.map(environmentList, (item) => {
      return {
        ..._.cloneDeep(item),
        disabled: !userStore.hasProjectResourceActions({
          projectID,
          environmentID: item.id,
          resource: Resources.Environments,
          actions: [Actions.POST]
        })
      };
    });
  };
  const handleSelectChange = ({ value, item }) => {
    handleBreadChange(value, item);
  };
  const handleCloneServices = async () => {
    const services = servicesRef.value.getSelectServiceData();
    const resources = resourceRef.value.getSelectServiceData();
    formData.items = [
      ..._.cloneDeep(services),
      ..._.cloneDeep(resources)
    ] as never[];
  };

  const batchCloneQueue = async () => {
    stageEnvironmentIDs.value = _.filter(formData.environmentIDs, (item) => {
      return !succeedList.value.has(item);
    });
    _.each([...failedList.value], (item) => {
      if (!_.includes(formData.environmentIDs, item)) {
        failedList.value.delete(item);
      }
    });
    for (let i = 0; i < stageEnvironmentIDs.value.length; i += 1) {
      const environmentID = stageEnvironmentIDs.value[i];
      formData.environmentID = environmentID;
      try {
        await cloneServices({
          projectID: route.params.projectId as string,
          ...formData
        });
        succeedList.value.add(environmentID);
        failedList.value.delete(environmentID);
        errorMap.value.delete(environmentID);
      } catch (error: any) {
        failedList.value.add(environmentID);
        succeedList.value.delete(environmentID);
        errorMap.value.set(environmentID, error?.data?.msg || error?.msg);
      }
    }
    stageEnvironmentIDs.value = [...failedList.value];
  };
  const initCloneEnvironmentResource = async () => {
    try {
      const services = await getServiceList({
        isService: true,
        extract: ['-projectId', '-status']
      });
      const resources = await getServiceList({
        isService: false,
        extract: ['-projectId', '-status']
      });
      serviceList.value = _.filter(services, (item) => {
        return selectServices.value.includes(item.id);
      });
      resourceList.value = _.filter(resources, (item) => {
        return selectResources.value.includes(item.id);
      });
      await getProjectVariables();
      await getAllResourceDefinitions();
      serviceDataList.value = [
        ..._.cloneDeep(services),
        ..._.cloneDeep(resources)
      ];
      setAllTemplateVersions(serviceDataList.value);
      setCompleteData();
    } catch (error) {
      // ingore
      console.log(error);
    }
  };
  const handleOk = async (draft: boolean) => {
    const res = await formref.value?.validate();
    if (!res) {
      trigger.value = true;
      try {
        submitLoading.value = true;
        formData.draft = draft;
        await handleCloneServices();
        await batchCloneQueue();
        copyFormData = _.cloneDeep(formData);

        if (!failedList.value.size) {
          router.back();
        }
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
      }
    } else {
      scrollToView();
    }
  };

  const handleSelect = (value) => {
    if (value === 'deploy') {
      handleOk(false);
    } else if (value === 'draft') {
      handleOk(true);
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
    if (!_.isEqual(copyFormData, formData) || failedList.value.size) {
      beforeLeaveCallback({
        to,
        from,
        onOk: () => {
          copyFormData = _.cloneDeep(formData);
          failedList.value.clear();
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
    initCloneEnvironmentResource();
  };
  initData();
</script>

<script lang="ts">
  export default {
    name: PROJECT.ServiceEdit
  };
</script>

<style lang="less" scoped>
  .selected-env {
    min-width: 300px;
    max-width: 598px;
    margin-bottom: 10px;
    padding: 5px 10px;
    background-color: var(--color-fill-2);
    border-radius: var(--border-radius-small);

    .selected-env-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      line-height: 22px;

      .selected-env-item-desc {
        display: flex;
        align-items: center;
      }
    }
  }
</style>

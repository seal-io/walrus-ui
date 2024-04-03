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
              ref="resourceRef"
              v-model:hint-data="completeData"
              :title="$t('menu.applicationManagement.resource')"
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
          <GroupButtonMenu
            trigger="hover"
            position="br"
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
  import { InputWidth, SaveActions, ResourceSaveAction } from '@/views/config';
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
  const rIds = route.query.resources as string;
  const projectID = route.params.projectId as string;
  const breadCrumbList = ref<BreadcrumbOptions[]>([]);
  const selectResources = ref<any[]>(_.concat(rIds));
  const environments = ref<any[]>([]);
  const submitLoading = ref(false);
  const trigger = ref(false);
  const formref = ref();
  const resourceRef = ref();
  const resourceList = ref<any[]>([]);
  const succeedList = ref<Set<string>>(new Set());
  const failedList = ref<Set<string>>(new Set());
  const stageEnvironmentIDs = ref<string[]>([]);
  const errorMap = ref<Map<string, string>>(new Map());
  let copyFormData: any = {};
  const formData = reactive({
    draft: false,
    preview: false,
    environmentID: '',
    environmentIDs: [],
    items: []
  });

  const actionList = computed(() => {
    return _.filter(SaveActions, (item) => {
      return item.value !== ResourceSaveAction.Preview;
    });
  });
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
        type: 'menu.applicationManagement.resource',
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
    console.log('handleSelectChange====', value, item);
    handleBreadChange(value, item);
  };
  const handleCloneServices = async () => {
    const resources = resourceRef.value.getSelectServiceData();
    formData.items = [..._.cloneDeep(resources)] as never[];
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
        console.log('formData====', formData);
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
      const resources = await getServiceList({
        extract: ['-projectId', '-status']
      });

      resourceList.value = _.filter(resources, (item) => {
        return selectResources.value.includes(item.id);
      });
      await getProjectVariables();
      await getAllResourceDefinitions();
      serviceDataList.value = [..._.cloneDeep(resources)];
      setAllTemplateVersions(serviceDataList.value);
      setCompleteData();
    } catch (error) {
      // ingore
      console.log(error);
    }
  };
  const handleOk = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      trigger.value = true;
      try {
        submitLoading.value = true;
        await handleCloneServices();
        await batchCloneQueue();
        copyFormData = _.cloneDeep(formData);

        if (!failedList.value.size) {
          router.back();
        }
        submitLoading.value = false;
      } catch (error) {
        console.log(error);
        submitLoading.value = false;
      }
    } else {
      scrollToView();
    }
  };

  const handleSelect = (value) => {
    formData.preview = false;
    formData.draft = false;
    if (value === 'draft') {
      formData.draft = true;
    } else if (value === 'preview') {
      formData.preview = true;
    }
    handleOk();
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
    console.log('failedList====', to);
    if (!_.isEqual(copyFormData, formData) || failedList.value.size) {
      beforeLeaveCallback({
        to,
        from,
        onOk: () => {
          copyFormData = _.cloneDeep(formData);
          failedList.value.clear();
          router.push({
            path: to.path as string,
            query: to.query
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
        type: 'menu.applicationManagement.resource',
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

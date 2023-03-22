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
    <ModuleCard v-if="showLogs" title="部署日志">
      <DeployLogs
        title="部署实例"
        :revision-id="revisionId"
        @click="handleClostLogs"
      ></DeployLogs>
    </ModuleCard>
    <ModuleCard :title="$t('applications.applications.modules.title')">
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
        <a-tooltip :content="$t('applications.applications.modules.button')">
          <thumbButton :size="60" @click="handleAddModule"></thumbButton>
        </a-tooltip>
      </div>
    </ModuleCard>
    <ModuleCard :title="$t('applications.applications.variables.title')">
      <a-button
        size="small"
        type="outline"
        style="margin-bottom: 8px"
        @click="handleSelect"
        ><icon-plus style="margin-right: 5px" />{{
          $t('applications.applications.variables.button')
        }}</a-button
      >
      <moduleWrapper
        v-for="(item, index) in get(appInfo, 'variables') || []"
        :key="index"
        style="margin-bottom: 10px"
        :title="item.name || $t('applications.applications.variables.label')"
        :status="collapseStatus === index"
        @delete="handleDeleteVariable(index)"
      >
        <variableForm
          :key="index"
          :ref="(el: refItem) => setRefMap(el, `variableform${index}`)"
          v-model:data-info="appInfo.variables[index]"
          :variables-data="variablesData"
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
  import {
    reactive,
    ref,
    computed,
    provide,
    inject,
    ComponentPublicInstance
  } from 'vue';
  import { onBeforeRouteLeave } from 'vue-router';
  import {
    cloneDeep,
    assignIn,
    omit,
    pick,
    get,
    concat,
    map,
    isEqual,
    reduce,
    uniq,
    uniqBy,
    find,
    keys,
    split
  } from 'lodash';
  import useCallCommon from '@/hooks/use-call-common';
  import thumbButton from '@/components/buttons/thumb-button.vue';
  import { execSucceed } from '@/utils/monitor';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import {
    queryModules,
    queryModulesAllVersions
  } from '@/views/operation-hub/templates/api';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import {
    TemplateRowData,
    ModuleVersionData
  } from '@/views/operation-hub/templates/config/interface';
  import createInstance from '../create-instance.vue';
  import instanceThumb from '../instance-thumb.vue';
  import variableForm from './variable-form.vue';
  import moduleWrapper from '../module-wrapper.vue';
  import editModule from './edit-module.vue';
  import BasicInfo from './basic-info.vue';
  import DeployLogs from '../deploy-logs.vue';
  import { AppFormData, Variables, AppModule } from '../../config/interface';
  import { moduleActions } from '../../config';
  import {
    createApplication,
    queryItemApplication,
    updateApplication,
    queryProjectSecrets
  } from '../../api';

  const environmentList = inject(
    'environmentList',
    ref<{ label: string; value: string }[]>([])
  );
  const { router, route } = useCallCommon();
  const basicform = ref();
  const revisionId = ref('');
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

  type refItem = Element | ComponentPublicInstance | null;
  const refMap: Record<string, refItem> = {};
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
  const projectSecretList = ref<{ name: string }[]>([]);
  const appModuleVersions = ref<any>({});
  const appModules = ref<AppModule[]>([]);
  const completeData = ref<Record<string, any>>({});
  const collapseStatus = ref(0);
  const showLogs = ref(false);
  let copyFormData: any = {};

  provide('completeData', completeData);
  provide('showHintInput', true);

  // const collapseStatus = computed(() => {
  //   return appInfo?.variables?.length - 1;
  // });
  const variablesData = computed(() => {
    const res = map(appInfo?.variables, (item) => {
      return item.name;
    });
    return res;
  });
  const setRefMap = (el: refItem, name) => {
    if (el) {
      refMap[`${name}`] = el;
    }
  };

  const getRefFormData = async () => {
    const resultList: any[] = [];
    await Promise.all(
      keys(refMap).map(async (key) => {
        const refEL = refMap[key];
        const moduleForm = await refEL?.getFormData?.();
        resultList.push({
          tab: key,
          formData: moduleForm
        });
      })
    );
    return resultList;
  };

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
  // modules options
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
    collapseStatus.value = appInfo?.variables?.length - 1 || 0;
  };
  const handleSaveInstanceInfo = (res) => {
    revisionId.value = res?.data?.id;
    showLogs.value = !!revisionId.value;
    emits('deploy');
  };
  const handleClostLogs = () => {
    showLogs.value = false;
  };
  const handleDeployApp = () => {
    showInstanceModal.value = true;
    appInfoVariables.value = cloneDeep(appInfo.variables);
  };
  // apply for edit module config
  const getProjectSecrets = async () => {
    try {
      const params = {
        page: 1,
        perPage: -1,
        projectID: route.params.projectId as string
      };
      const { data } = await queryProjectSecrets(params);
      // const [{ data }, { data: globalData }] = await Promise.all([
      //   querySecrets(params),
      //   querySecrets({ page: 1, perPage: -1 })
      // ]);
      projectSecretList.value = uniqBy(data, (item) => item.name);
    } catch (error) {
      projectSecretList.value = [];
      console.log(error);
    }
  };
  // app module version has added; it's map to a {name: <moduleName>, type: <moduleType>, version: <moduleVersion>}
  const getAppModulesVersionMap = () => {
    const list = map(appModules.value, (item) => {
      return {
        name: item.name,
        type: item.module.id,
        version: item.version
      };
    });
    return list;
  };
  // apply for edit module config
  const getModulesVersions = async () => {
    if (!id && !cloneId) return;
    try {
      const params = {
        moduleID: uniq(
          map(appModules.value, (item) => {
            return item?.module.id;
          })
        )
      };
      if (!params.moduleID.length) {
        return;
      }
      const { data } = await queryModulesAllVersions(params);
      const addedVersionMap = getAppModulesVersionMap();
      appModuleVersions.value = reduce(
        addedVersionMap,
        (obj, item) => {
          // The version corresponding to the module that has been added
          const addedModule = find(data.items || [], (s) => {
            return item.type === s.module.id && s.version === item.version;
          });
          const k = item.name || addedModule?.name;
          obj[k] = [
            ...map(get(addedModule, 'schema.Outputs') || [], (o) => {
              return {
                label: o.Description,
                value: o.Name
              };
            })
          ];
          return obj;
        },
        {}
      );
      console.log('appModuleVersions======', appModuleVersions.value);
    } catch (error) {
      appModuleVersions.value = {};
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
      appModules.value = get(appInfo, 'modules') || [];
      copyFormData = cloneDeep(appInfo);
      console.log('appInfo===', appInfo);
    } catch (error) {
      console.log(error);
    }
  };
  const setCompleteData = () => {
    const variables = reduce(
      get(appInfo, 'variables') || [],
      (obj, item) => {
        obj[item.name] = '';
        return obj;
      },
      {}
    );
    const secret = reduce(
      projectSecretList.value,
      (obj, item) => {
        obj[item.name] = '';
        return obj;
      },
      {}
    );
    completeData.value = {
      secret: {
        ...secret
      },
      module: {
        ...appModuleVersions.value
      },
      var: {
        ...variables
      }
    };
    console.log('completeData.value===', completeData.value);
  };
  const handleOk = async () => {
    const result = await basicform.value.getFormData();
    const variableFormResult = await getRefFormData();
    const validateVariabel = find(variableFormResult, (val) => !val.formData);
    if (!result || validateVariabel) {
      const i = get(split(validateVariabel.tab, 'variableform'), 1);
      collapseStatus.value = +i;
      return;
    }
    try {
      const params = {
        ...appInfo,
        ...result
      };
      console.log('submit:', appInfo, result);
      submitLoading.value = true;
      const res = { id: '' };
      copyFormData = cloneDeep(params);
      if (id) {
        await updateApplication(params);
      } else {
        console.log('submit:', params);
        const { data } = await createApplication(params);
        res.id = data.id;
      }
      submitLoading.value = false;
      if (id) {
        await Promise.all([getModulesVersions(), getApplicationDetail()]);
        setCompleteData();
      }
      execSucceed();
      emits('save', res.id);
    } catch (error) {
      submitLoading.value = false;
      console.log(error);
    }
  };
  const handleCancel = () => {
    router.back();
  };
  // onBeforeRouteLeave(async (to, from) => {
  //   console.log('leave');
  //   if (!isEqual(copyFormData, appInfo)) {
  //     beforeLeaveCallback(to, from, () => {
  //       copyFormData = cloneDeep(appInfo);
  //       router.push({
  //         name: to.name as string
  //       });
  //     });
  //     return false;
  //   }
  //   return true;
  // });
  const init = async () => {
    getModules();
    await getApplicationDetail();
    await Promise.all([getModulesVersions(), getProjectSecrets()]);
    setCompleteData();
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

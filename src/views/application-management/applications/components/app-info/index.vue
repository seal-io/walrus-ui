<template>
  <div class="detail-info">
    <GroupTitle title="基本信息" style="margin-top: 20px"> </GroupTitle>
    <BasicView
      v-if="pageAction === 'view'"
      ref="basicform"
      v-model:data-info="defaultBasicInfo"
    ></BasicView>
    <BasicInfo
      v-else
      ref="basicform"
      :data-info="appInfo"
      :default-value="defaultBasicInfo"
    ></BasicInfo>
    <GroupTitle title="配置" style="margin-top: 20px"></GroupTitle>
    <div>
      <div style="margin-bottom: 20px; color: var(--color-text-3)">
        <span>模块</span>
        <span v-if="pageAction === 'edit'" class="optional-notes"
          >(新建应用必填)</span
        >
      </div>
      <div class="content">
        <instanceThumb
          v-for="(item, index) in appInfo.modules"
          :key="item?.module?.id"
          :active="item?.module?.id === active"
          :data-info="item"
          :size="[200, 100]"
          :actions="pageAction === 'edit' ? moduleActions : []"
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
        <a-tooltip
          v-if="pageAction === 'edit'"
          :content="$t('applications.applications.modules.button')"
        >
          <thumbButton :size="60" @click="handleAddModule"></thumbButton>
        </a-tooltip>
      </div>
      <div v-if="!validateModule && !id && triggerModule" class="tips">
        <span :style="{ 'font-size': '12px', 'color': 'rgb(var(--danger-6))' }"
          >模块不能为空</span
        >
      </div>
    </div>
    <div title="变量">
      <div class="var-title">
        <span>变量</span>
      </div>
      <div
        v-if="get(appInfo, 'variables').length && pageAction === 'edit'"
        class="var-item var-item-title"
      >
        <span class="label">键</span>
        <span class="label">
          <span class="holder"></span>
          <span>值</span>
        </span>
        <span class="label">
          <span class="holder"></span>
          <span>描述</span>
        </span>
        <span class="btn"></span>
      </div>
      <div v-if="pageAction === 'edit'">
        <div
          v-for="(sItem, sIndex) in get(appInfo, 'variables')"
          :key="sIndex"
          class="var-item"
        >
          <xInputGroup
            v-model:dataKey="sItem.name"
            v-model:dataValue="sItem.default"
            v-model:dataDesc="sItem.description"
            show-description
            width="100%"
            class="group-item"
            :label-list="variableList"
            :position="sIndex"
            @add="handleAddVariables"
            @delete="handleDeleteVariable(sIndex)"
          ></xInputGroup>
        </div>
      </div>

      <a-tooltip
        v-if="!get(appInfo, 'variables').length && pageAction === 'edit'"
        :content="$t('applications.applications.variables.button')"
      >
        <thumbButton :size="60" @click="handleAddVariables"></thumbButton>
      </a-tooltip>
      <LabelsList
        v-if="get(appInfo, 'variables').length && pageAction === 'view'"
        :labels="variablesObj"
      ></LabelsList>
    </div>
    <EditPageFooter v-if="pageAction === 'edit'">
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
    <viewModule
      v-model:show="showViewModal"
      action="edit"
      :data-info="viewModuleInfo"
      :templates="moduleTemplates"
    ></viewModule>
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
  import GroupTitle from '@/components/group-title/index.vue';
  import {
    cloneDeep,
    assignIn,
    omit,
    pick,
    get,
    filter,
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
  import { execSucceed, deleteModal } from '@/utils/monitor';
  import { useTabBarStore } from '@/store';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import {
    queryModules,
    queryModulesAllVersions
  } from '@/views/operation-hub/templates/api';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import xInputGroup from '@/components/form-create/custom-components/x-input-group.vue';
  import {
    TemplateRowData,
    ModuleVersionData
  } from '@/views/operation-hub/templates/config/interface';
  import variablesModal from './variables-modal.vue';
  import LabelsList from './labels-list.vue';
  import instanceThumb from '../instance-thumb.vue';
  import editModule from './edit-module.vue';
  import viewModule from './view-module.vue';
  import BasicInfo from './basic-info.vue';
  import BasicView from './basic-view.vue';
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
  const tabBarStore = useTabBarStore();
  const { router, route } = useCallCommon();
  const basicform = ref();
  const appInfo = reactive({
    name: '',
    description: '',
    labels: {},
    variables: [
      {
        name: '',
        default: '',
        description: '',
        type: 'string'
      }
    ],
    project: {
      id: route.params.projectId
    },
    environment: {
      id: 'test'
    },
    modules: []
  }) as AppFormData;

  const pageAction = inject('pageAction', ref('edit'));
  const emits = defineEmits(['save', 'cancelEdit']);
  const submitLoading = ref(false);
  const id = route.query.id as string;
  const cloneId = route.query.cloneId as string;
  const moduleTemplates = ref<TemplateRowData[]>([]);
  const appInfoVariables = ref<Variables[]>([]);
  const active = ref('');
  const moduleInfo = ref({}); // item module
  const viewModuleInfo = ref({});
  const defaultBasicInfo = ref({});
  const moduleAction = ref('create');
  const showViewModal = ref(false);
  const showEditModal = ref(false);
  const projectSecretList = ref<{ name: string }[]>([]);
  const appModuleVersions = ref<any>({});
  const appModules = ref<AppModule[]>([]);
  const completeData = ref<Record<string, any>>({});
  const triggerModule = ref(false);
  let copyFormData: any = {};

  provide('completeData', completeData);
  provide('showHintInput', true);

  const variablesObj = computed(() => {
    const res = reduce(
      appInfo?.variables,
      (obj, item) => {
        if (item.name) {
          obj[item.name] = item.default;
        }
        return obj;
      },
      {}
    );
    return res;
  });
  const variableList = computed(() => {
    const list = map(appInfo.variables || [], (item) => {
      return {
        key: item.name,
        value: item.default
      };
    });
    return list;
  });
  const validateModule = computed(() => {
    return !!appInfo.modules.length;
  });

  const handleEditModule = (item) => {
    moduleAction.value = 'edit';
    moduleInfo.value = item;
    setTimeout(() => {
      showEditModal.value = true;
    }, 100);
  };

  const handleAddModule = () => {
    moduleAction.value = 'create';
    setTimeout(() => {
      showEditModal.value = true;
    }, 150);
  };
  const handleClickInstance = (data) => {
    viewModuleInfo.value = data;
    setTimeout(() => {
      showViewModal.value = true;
    }, 150);
  };
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

  const handleAddVariables = () => {
    console.log('adad');
    appInfo.variables.push({
      name: '',
      default: '',
      description: '',
      type: 'string'
    });
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
    console.log('handleOk====', appInfo);
    const result = await basicform.value.getFormData();
    triggerModule.value = true;
    if (!id && !validateModule.value) {
      return;
    }
    if (!result) {
      return;
    }
    try {
      const params = {
        ...appInfo,
        ...result,
        variables: filter(appInfo.variables, (item) => item.name)
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
        tabBarStore.deleteTag(0, {
          title: '',
          name: 'ApplicationsList',
          fullPath: ''
        });
      }
      submitLoading.value = false;
      execSucceed();
      emits('save', res.id);
    } catch (error) {
      submitLoading.value = false;
      console.log(error);
    }
  };

  const handleCancel = () => {
    if (pageAction.value === 'edit' && route.params.action === 'view') {
      emits('cancelEdit');
      // reset the editing data
      getApplicationDetail();
      return;
    }
    router.back();
  };
  const handleDeleteModule = (index) => {
    deleteModal({
      onOk() {
        appInfo.modules.splice(index, 1);
        setCompleteData();
      }
    });
  };
  const handleSaveModule = async (data) => {
    console.log('saveModule===', data, moduleAction.value);
    if (moduleAction.value === 'create') {
      appInfo.modules.push({
        ...cloneDeep(data)
      });
      await getModulesVersions();
      setCompleteData();
    } else {
      assignIn(moduleInfo.value, data);
    }
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

    .var-title {
      margin-top: 10px;
      margin-bottom: 20px;
      color: var(--color-text-3);
    }

    .var-item {
      width: 50%;
      margin-bottom: 10px;

      &:last-child {
        margin-bottom: 0;
      }

      &.var-item-title {
        display: flex;

        .label {
          flex: 1;
          font-weight: 500;
        }

        .holder {
          padding: 0 4px;
        }

        .btn {
          flex-basis: 54px;
        }
      }
    }
  }
</style>

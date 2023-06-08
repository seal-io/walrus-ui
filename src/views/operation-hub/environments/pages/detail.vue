<template>
  <div>
    <BreadWrapper>
      <Breadcrumb :items="breadCrumbList"></Breadcrumb>
    </BreadWrapper>
    <ComCard top-gap>
      <GroupTitle
        :bordered="false"
        style="margin-bottom: 0"
        :show-edit="
          pageAction === 'view' &&
          userStore.hasProjectResourceActions({
            resource: Resources.Environments,
            projectID: route.params.projectId,
            actions: ['POST']
          })
        "
        @edit="handleEdit"
      ></GroupTitle>
      <a-form ref="formref" :model="formData" auto-label-width>
        <a-form-item
          :label="$t('operation.environments.table.name')"
          field="name"
          :validate-trigger="['change']"
          :rules="[
            {
              required: pageAction === 'edit',
              message: $t('operation.environments.rule.name')
            }
          ]"
        >
          <a-input
            v-if="pageAction === 'edit'"
            v-model="formData.name"
            style="width: 500px"
            :max-length="30"
            show-word-limit
          ></a-input>
          <span v-else class="readonly-view-label">{{
            formData.name || '-'
          }}</span>
        </a-form-item>
        <a-form-item
          :label="$t('operation.environments.table.description')"
          field="description"
        >
          <a-textarea
            v-if="pageAction === 'edit'"
            v-model="formData.description"
            style="width: 500px"
            :max-length="200"
            show-word-limit
            :auto-size="{ minRows: 6, maxRows: 10 }"
          ></a-textarea>
          <div v-else class="description-content readonly-view-label">{{
            formData.description || '-'
          }}</div>
        </a-form-item>
        <a-form-item
          :label="$t('operation.connectors.menu')"
          field="connectorIDs"
          :validate-trigger="['change']"
        >
          <div>
            <div style="display: flex; margin-bottom: 10px">
              <a-button
                v-if="pageAction === 'edit'"
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
                :selected="formData.connectorIDs"
                :list="connectorList"
                @confirm="handleConnectorChange"
              ></ConnectorSelector>
            </div>
            <connectorsTable
              :style="{ marginLeft: pageAction === 'view' ? '12px' : 0 }"
              :action="pageAction"
              :list="formData?.edges || []"
              @delete="handleDeleteConnector"
            ></connectorsTable>
          </div>
        </a-form-item>
      </a-form>
      <EditPageFooter v-if="pageAction === 'edit'">
        <template #save>
          <a-button
            type="primary"
            class="cap-title cancel-btn"
            :loading="submitLoading"
            @click="handleSubmit"
            >{{ $t('common.button.save') }}</a-button
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
  </div>
</template>

<script lang="ts" setup>
  import { Resources } from '@/permissions/config';
  import { useUserStore, useTabBarStore } from '@/store';
  import { ref, computed, defineExpose } from 'vue';
  import {
    concat,
    each,
    includes,
    map,
    remove,
    get,
    isEqual,
    cloneDeep
  } from 'lodash';
  import GroupTitle from '@/components/group-title/index.vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import { onBeforeRouteLeave } from 'vue-router';
  import { queryConnectors } from '@/views/operation-hub/connectors/api';
  import usePageAction from '@/hooks/use-page-action';
  import useGetBreadState from '@/views/application-management/projects/hooks/use-get-breadstate';
  import { EnvironFormData } from '../config/interface';
  import connectorsTable from '../components/connectors.vue';
  import ConnectorSelector from '../components/connector-selector.vue';
  import {
    createEnvironment,
    updateEnvironment,
    queryItemEnvironments
  } from '../api';

  // const props = defineProps({
  //   id: {
  //     type: String,
  //     default() {
  //       return '';
  //     }
  //   }
  // });
  const { getProjectState } = useGetBreadState();
  const userStore = useUserStore();
  const tabBarStore = useTabBarStore();
  const { router, route, t } = useCallCommon();
  const { pageAction, handleEdit } = usePageAction();
  const id = route.query.id as string;
  const formref = ref();
  const connectorList = ref<{ label: string; value: string }[]>([]);
  const showModal = ref(false);
  const submitLoading = ref(false);
  let copyFormData: any = {};
  const formData = ref<EnvironFormData>({
    projectID: route.params.projectId as string,
    name: '',
    description: '',
    connectorIDs: [],
    connectors: [],
    edges: []
  });

  const title = computed(() => {
    if (!id) {
      return t('operation.environments.create');
    }
    if (id && pageAction.value === 'edit') {
      return t('operation.environments.edit');
    }
    return t('operation.environments.view');
  });
  const breadCrumbList = computed(() => {
    return [
      {
        ...getProjectState({
          id: route.params.projectId,
          name: ''
        })
      },
      {
        label: title.value
      }
    ];
  });
  const setFormDataConnectors = (connectors) => {
    each(connectorList.value, (item) => {
      if (includes(connectors, item.value)) {
        formData.value?.edges?.push(item);
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
    copyFormData = cloneDeep(formData.value);
    if (!id) return;
    try {
      const { data } = await queryItemEnvironments({ id });
      formData.value = data;
      formData.value.edges = [];
      formData.value.connectorIDs = map(get(data, 'connectors') || [], (s) => {
        return s?.connector?.id;
      });
      setFormDataConnectors(formData.value.connectorIDs);
      copyFormData = cloneDeep(formData.value);
    } catch (error) {
      formData.value = {
        projectID: route.params.projectId as string,
        name: '',
        description: '',
        connectorIDs: [],
        connectors: [],
        edges: []
      };
      console.log(error);
    }
  };
  const getConnectors = async () => {
    try {
      const params = {
        page: -1
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
    formref.value.validateField('connectorIDs');
  };
  const handleDeleteConnector = (record, index) => {
    formData.value.edges?.splice(index, 1);
    remove(formData.value.connectorIDs, (val) => record.id === val);
    remove(formData.value.connectors, (o) => o.connector.id === record.id);
    formref.value.validateField('connectorIDs');
  };
  const handleSubmit = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        submitLoading.value = true;
        copyFormData = cloneDeep(formData.value);
        if (id) {
          await updateEnvironment(formData.value);
        } else {
          await createEnvironment(formData.value);
        }
        tabBarStore.deleteTag(0, {
          title: '',
          name: 'EnvironmentList',
          fullPath: ''
        });
        router.back();
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
      }
      return true;
    }
    return false;
  };
  const cancelCallback = () => {
    if (pageAction.value === 'edit' && route.params.action === 'view') {
      pageAction.value = 'view';
      getItemEnvironmentInfo();
      return;
    }
    router.back();
  };
  const handleCancel = () => {
    if (!isEqual(copyFormData, formData.value)) {
      beforeLeaveCallback({
        isCancel: true,
        onOk: () => {
          copyFormData = cloneDeep(formData.value);
          cancelCallback();
        }
      });
    } else {
      cancelCallback();
    }
  };
  onBeforeRouteLeave(async (to, from) => {
    if (!isEqual(copyFormData, formData.value)) {
      beforeLeaveCallback({
        to,
        from,
        onOk: () => {
          copyFormData = cloneDeep(formData.value);
          router.push({
            name: to.name as string
          });
        }
      });
      return false;
    }
    return true;
  });
  const init = async () => {
    await getConnectors();
    await getItemEnvironmentInfo();
  };
  defineExpose({
    handleSubmit,
    init
  });
  init();
</script>

<style></style>

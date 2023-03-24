<template>
  <a-modal
    top="10%"
    :closable="false"
    :align-center="false"
    :width="600"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    :body-style="{ 'max-height': '400px', 'overflow': 'auto' }"
    modal-class="project-modal"
    :title="title"
    @cancel="handleCancel"
    @ok="handleOk"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <a-spin :loading="loading" style="width: 100%; text-align: center">
      <a-form ref="formref" :model="formData" auto-label-width>
        <a-form-item
          label="连接器"
          field="connectorID"
          :rules="[{ required: true, message: '连接器必选' }]"
        >
          <a-select
            v-model="formData.connectorID"
            style="width: 100%"
            @change="handleConnectorChange"
          >
            <a-option
              v-for="(item, index) in connectorList"
              :key="index"
              :value="item.value"
            >
              <ProviderIcon :provider="toLower(item.type)"></ProviderIcon>
              <span style="margin-left: 5px">{{ item.label }}</span>
            </a-option>
            <template #prefix>
              <ProviderIcon :provider="toLower(iconType)"></ProviderIcon>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
          label="代码仓库"
          field="repository"
          :rules="[{ required: true, message: '代码仓库' }]"
        >
          <a-select
            v-model="formData.repository"
            :loading="repoloading"
            style="width: 100%"
            :options="repositories"
            allow-search
            @change="handleRepoChange"
          >
          </a-select>
        </a-form-item>
        <a-form-item
          label="分支"
          field="branch"
          :rules="[{ required: true, message: '分支必选' }]"
        >
          <a-select
            v-model="formData.branch"
            style="width: 100%"
            :options="branchList"
            allow-search
            @change="handleBranchChange"
          >
          </a-select>
        </a-form-item>
        <a-form-item
          label="提交地址"
          field="path"
          validate-trigger="change"
          :rules="[{ required: true, message: '提交地址必填' }]"
        >
          <a-input v-model="formData.path" style="width: 100%"></a-input>
        </a-form-item>
      </a-form>
    </a-spin>
    <template #footer>
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
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, PropType, computed } from 'vue';
  import { map, filter, includes, toLower, find } from 'lodash';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import ProviderIcon from '@/components/provider-icon/index.vue';
  import { queryConnectors } from '../../connectors/api';
  import {
    queryConnectorRepositories,
    queryConnectorRepositoriesBranch,
    FormDataPR,
    postCompletionsPR
  } from '../api';

  const props = defineProps({
    show: {
      type: Boolean,
      default() {
        return false;
      }
    },
    title: {
      type: String,
      default() {
        return '';
      }
    },
    action: {
      type: String as PropType<'create' | 'edit'>,
      default() {
        return 'create';
      }
    },
    content: {
      type: String,
      default() {
        return '';
      }
    }
  });
  const emit = defineEmits(['save', 'update:show']);
  const formref = ref();
  const loading = ref(false);
  const submitLoading = ref(false);
  const formData: FormDataPR = reactive({
    connectorID: '',
    repository: '',
    branch: '',
    path: '',
    content: ''
  });

  const connectorList = ref<{ label: string; value: string; type: string }[]>(
    []
  );
  const repositories = ref<{ label: string; value: string }[]>([]);
  const branchList = ref<{ label: string; value: string }[]>([]);
  const repoloading = ref(false);

  const iconType = computed(() => {
    const d = find(
      connectorList.value,
      (item) => item.value === formData.connectorID
    );
    return d?.type || '';
  });
  const handleCancel = () => {
    emit('update:show', false);
  };
  const getConnectorList = async () => {
    try {
      const { data } = await queryConnectors({ page: 1, perPage: -1 });
      const list = filter(data.items || [], (item) => {
        return includes(['Github', 'Gitlab'], item.type);
      });
      connectorList.value = map(list, (sItem) => {
        return {
          label: sItem.name,
          value: sItem.id,
          type: sItem.type
        };
      });
    } catch (error) {
      connectorList.value = [];
      console.log(error);
    }
  };
  const getRepositories = async () => {
    try {
      repoloading.value = true;
      const params = {
        id: formData.connectorID,
        page: 1,
        perPage: -1
      };
      const { data } = await queryConnectorRepositories(params);
      repositories.value = map(data || [], (item) => {
        return {
          value: `${item.Namespace}/${item.Name}`,
          label: `${item.Namespace}/${item.Name}`
        };
      });
      repoloading.value = false;
    } catch (error) {
      repoloading.value = false;
      console.log(error);
    }
  };
  const getRepositoriesBranch = async () => {
    try {
      const params = {
        id: formData.connectorID,
        repository: formData.repository,
        page: 1,
        perPage: -1
      };
      const { data } = await queryConnectorRepositoriesBranch(params);
      branchList.value = map(data || [], (item) => {
        return {
          value: item.Path,
          label: item.Name
        };
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleConnectorChange = async () => {
    try {
      formData.repository = '';
      formData.branch = '';
      getRepositories();
    } catch (error) {
      console.log(error);
    }
  };
  const handleRepoChange = () => {
    try {
      formData.branch = '';
      getRepositoriesBranch();
    } catch (error) {
      console.log(error);
    }
  };
  const handleBranchChange = () => {};
  const handleOk = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        submitLoading.value = true;
        formData.content = props.content;
        // TODO
        await postCompletionsPR(formData);
        setTimeout(() => {
          emit('save');
        }, 100);
        emit('update:show', false);
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
      }
    }
  };
  const init = async () => {
    getConnectorList();
  };
  const handleBeforeOpen = () => {
    init();
  };
  const handleBeforeClose = () => {
    formref.value.resetFields();
  };
</script>

<style lang="less">
  .arco-modal.project-modal {
    .btn-wrapper {
      margin-left: 12px;

      .arco-icon {
        color: rgb(var(--arcoblue-6));
        cursor: pointer;

        &:hover {
          color: rgb(var(--arcoblue-5));
        }
      }
    }
  }
</style>

<style lang="less" scoped>
  :deep(.arco-select-view-single) {
    .arco-select-view-prefix {
      padding-right: 5px;
    }
  }
</style>

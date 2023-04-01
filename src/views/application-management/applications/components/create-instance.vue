<template>
  <a-modal
    top="10%"
    :closable="false"
    :align-center="false"
    :width="500"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    :body-style="{ 'max-height': '400px', 'overflow': 'auto' }"
    modal-class="oci-modal"
    :title="$t('applications.applications.detail.createInstance')"
    @cancel="handleCancel"
    @ok="handleOk"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <a-spin :loading="loading" style="width: 100%; text-align: center">
      <a-form ref="formref" :model="formData" auto-label-width>
        <a-form-item
          :disabled="status === 'edit'"
          label="名称"
          field="name"
          validate-trigger="change"
          :rules="[{ required: true, message: '实例名称必填' }]"
        >
          <a-input
            v-model="formData.name"
            :max-length="50"
            show-word-limit
          ></a-input>
        </a-form-item>
        <a-form-item
          :disabled="status === 'edit'"
          :label="$t('applications.applications.detail.env')"
          field="environment"
          validate-trigger="change"
          :rules="[{ required: true, message: '实例部署环境必选' }]"
        >
          <a-select
            v-model="formData.environment.id"
            :options="environmentList"
            @change="handleEnvChange"
          ></a-select>
          <template #extra>
            <span class="tips">未添加连接器的环境不可用</span>
          </template>
        </a-form-item>
        <div
          v-if="variablesList?.length"
          style="margin-bottom: 10px; text-align: left"
          >变量</div
        >
        <a-form-item
          v-for="(item, index) in variablesList"
          :key="index"
          :label="item.name"
          :field="`variables.${item.name}`"
          validate-trigger="change"
          :rules="[
            {
              required: item.required,
              message: $t('common.form.rule.input', { name: item.name })
            }
          ]"
        >
          <a-input v-model="formData.variables[item.name]"></a-input>
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
            >{{ $t('common.button.confirm') }}</a-button
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
  import { each, filter, get, find, assignIn, cloneDeep } from 'lodash';
  import { ref, reactive, PropType, watch, inject, computed } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { Variables } from '../config/interface';
  import { deployApplication, upgradeApplicationInstance } from '../api';

  const props = defineProps({
    show: {
      type: Boolean,
      default() {
        return false;
      }
    },
    dataInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    status: {
      type: String,
      default() {
        return 'create';
      }
    },
    variables: {
      type: Array as PropType<Variables[]>,
      default() {
        return [];
      }
    },
    environmentList: {
      type: Array as PropType<{ label: string; value: string }[]>,
      default() {
        return [];
      }
    },

    activeInstanceInfo: {
      type: Object,
      default() {
        return {};
      }
    }
  });
  const emit = defineEmits(['save', 'upgrade', 'update:show', 'update:status']);
  const instanceInfo = inject(
    'instanceInfo',
    ref({
      name: '',
      environment: {
        id: ''
      }
    })
  );
  const { route } = useCallCommon();
  const formref = ref();
  const loading = ref(false);
  const submitLoading = ref(false);
  const formData = reactive({
    name: '',
    variables: {},
    environment: {
      id: '',
      name: ''
    }
  });

  const variablesList = computed(() => {
    const list = filter(props.variables, (item) => {
      return item.name;
    });
    return list as Variables[];
  });
  const handleEnvChange = (val) => {
    const data = find(props.environmentList, (item) => item.value === val);
    formData.environment.name = data?.label || '';
  };
  const handleCancel = () => {
    emit('update:show', false);
  };
  const handleOk = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        submitLoading.value = true;
        // TODO
        if (props.status === 'create') {
          const resData = await deployApplication({
            ...formData,
            application: {
              id: route.query.id || ''
            }
          });
          const environment = cloneDeep(formData.environment);
          setTimeout(() => {
            emit(
              'save',
              {
                ...resData?.data,
                environment
              },
              props.status
            );
          }, 100);
        } else {
          await upgradeApplicationInstance({
            ...formData,
            application: {
              id: route.query.id || ''
            },
            id: props.activeInstanceInfo.id
          });
          setTimeout(() => {
            emit('upgrade', props.activeInstanceInfo.id);
          }, 100);
        }
        emit('update:show', false);
        submitLoading.value = false;
      } catch (error) {
        submitLoading.value = false;
      }
    }
  };
  const resetForm = () => {
    formData.name = '';
    formData.environment.id = '';
    formData.environment.name = '';
    formData.variables = {};
  };
  const setDeployVariables = () => {
    each(props.variables, (item) => {
      formData.variables[item.name] = item.default;
    });
  };
  watch(
    () => props.variables,
    () => {
      // setDeployVariables();
    },
    {
      immediate: true,
      deep: true
    }
  );
  watch(
    () => props.status,
    () => {
      if (props.status === 'edit') {
        formData.name =
          get(props.activeInstanceInfo, 'name') || instanceInfo.value.name;
        formData.environment.id =
          get(props.activeInstanceInfo, 'environment.id') ||
          instanceInfo.value.environment.id;
      }
    },
    {
      immediate: true
    }
  );
  const handleBeforeOpen = () => {
    setDeployVariables();
  };
  const handleBeforeClose = () => {
    emit('update:status', 'create');
    resetForm();
  };
</script>

<style></style>

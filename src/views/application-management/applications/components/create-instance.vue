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
          :label="$t('applications.applications.table.name')"
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
        <!-- <a-form-item
          :disabled="status === 'edit'"
          label="服务地址"
          field="name"
          validate-trigger="change"
          :rules="[{ required: false, message: '服务地址必填' }]"
        >
          <a-input v-model="formData.ServeUrl"></a-input>
        </a-form-item> -->
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
          ></a-select>
        </a-form-item>
        <div
          v-if="variables?.length"
          style="margin-bottom: 10px; text-align: left"
          >Variables</div
        >
        <a-form-item
          v-for="(item, index) in variables"
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
            >{{ $t('common.button.deploy') }}</a-button
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
  import { each, get } from 'lodash';
  import { ref, reactive, PropType, watch, inject } from 'vue';
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
    }
  });
  const emit = defineEmits(['save', 'update:show', 'update:status', 'reset']);
  const instanceId = inject('instanceId', ref(''));
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
      id: ''
    }
  });

  const handleCancel = () => {
    emit('update:show', false);
  };
  const handleOk = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        submitLoading.value = true;
        let resData: any = null;
        // TODO
        if (props.status === 'create') {
          resData = await deployApplication({
            ...formData,
            id: route.query.id || ''
          });
        } else {
          resData = await upgradeApplicationInstance({
            ...formData,
            id: instanceId.value
          });
        }
        setTimeout(() => {
          emit('save', resData);
        }, 200);
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
      setDeployVariables();
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
        formData.name = instanceInfo.value.name;
        formData.environment.id = instanceInfo.value.environment.id;
      }
    },
    {
      immediate: true
    }
  );
  const handleBeforeOpen = () => {};
  const handleBeforeClose = () => {
    emit('update:status', 'create');
    resetForm();
  };
</script>

<style></style>

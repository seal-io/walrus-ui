<template>
  <a-modal
    top="10%"
    :closable="false"
    :align-center="false"
    :width="700"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    :body-style="{ 'max-height': '400px', 'overflow': 'auto' }"
    modal-class="oci-modal"
    unmount-on-close
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
          :label="$t('common.table.name')"
          field="name"
          validate-trigger="change"
          :rules="[
            { required: true, message: $t('applications.module.rule.name') },
            {
              match: validateAppNameRegx,
              message: $t('applications.applications.rule.allName')
            }
          ]"
        >
          <a-input
            v-model="formData.name"
            style="width: 100%"
            :max-length="30"
            show-word-limit
          ></a-input>
          <template #extra>
            <span class="tips">{{
              $t('applications.applications.rule.allName')
            }}</span>
          </template>
        </a-form-item>
        <a-form-item
          :disabled="status === 'edit'"
          :label="$t('applications.applications.detail.env')"
          field="environment.id"
          validate-trigger="change"
          :rules="[
            { required: true, message: $t('applications.instance.rule.env') }
          ]"
        >
          <a-select
            v-model="formData.environment.id"
            style="width: 100%"
            :options="environmentList"
            @change="handleEnvChange"
          ></a-select>
          <template #extra>
            <span class="tips">{{ $t('applications.instance.env.tips') }}</span>
          </template>
        </a-form-item>
        <div
          v-if="variablesList?.length"
          style="margin-bottom: 10px; text-align: left"
          >{{ $t('applications.applications.variables.title') }}</div
        >
        <a-form-item
          v-for="(item, index) in variablesList"
          :key="index"
          :label="item.name"
          :field="`variables.${item.name}`"
          validate-trigger="change"
          :rules="[
            {
              validator(val, callback) {
                validateVariable(item.value, callback, item.type);
              }
            }
          ]"
        >
          <component
            :is="get(internalComponents, componentsMap[item.type])"
            v-model="item.value"
            style="width: 100%"
            show-word-limit
            :show-gutter="true"
            :editor-id="`${item.name}`"
            lang="yaml"
            :editor-default-value="item.default"
          ></component>
        </a-form-item>
      </a-form>
    </a-spin>
    <template #footer>
      <EditPageFooter style="margin-top: 0">
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
  import _, {
    each,
    filter,
    get,
    find,
    assignIn,
    cloneDeep,
    reduce
  } from 'lodash';
  import { ref, reactive, PropType, watch, inject, computed } from 'vue';
  import {
    json2Yaml,
    yaml2Json,
    unknowType,
    validateYaml
  } from '@/components/form-create/config/yaml-parse';
  import useCallCommon from '@/hooks/use-call-common';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { validateAppNameRegx } from '@/views/config';
  import internalComponents from '@/components/form-create/components/internal';
  import { Variables } from '../config/interface';
  import { componentsMap } from '../config';
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
  const variablesList = ref<Variables[]>([]);
  const formData = reactive({
    name: '',
    variables: {},
    environment: {
      id: '',
      name: ''
    }
  });

  const validateVariable = (val, callback, type) => {
    if (type !== unknowType.dynamic) {
      callback();
    }
    const result = validateYaml(val);
    console.log('result=======', result);
    if (!result.empty && result.error) {
      callback(`${result.error?.message}`);
    }
    callback();
  };

  const setVariablesList = () => {
    variablesList.value = _.map(props.variables, (o) => {
      const item = cloneDeep(o);
      if (item.type === unknowType.dynamic) {
        item.value = json2Yaml(item.default);
        item.default = json2Yaml(item.default);
      } else {
        item.value = item.default;
      }
      return item;
    });
  };
  const setFormVariables = () => {
    formData.variables = _.reduce(
      variablesList.value,
      (obj, item) => {
        if (item.type === unknowType.dynamic) {
          obj[item.name] = yaml2Json(item.value);
        } else {
          obj[item.name] = item.value;
        }
        return obj;
      },
      {}
    );
  };
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
        setFormVariables();
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
    formData.variables = _.reduce(
      props.variables,
      (obj, item) => {
        obj[item.name] = item.default;
        return obj;
      },
      {}
    );
  };
  watch(
    () => props.variables,
    () => {
      setTimeout(() => {
        setVariablesList();
      }, 100);
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

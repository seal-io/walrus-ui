<template>
  <a-modal
    top="10%"
    :closable="false"
    :align-center="false"
    :width="700"
    :ok-text="$t('common.button.save')"
    :visible="show"
    unmount-on-close
    :mask-closable="false"
    :body-style="{
      'max-height': '500px',
      'min-height': '400px',
      'overflow': 'auto'
    }"
    modal-class="project-modal"
    :title="title"
    @cancel="handleCancel"
    @ok="handleOk"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <div>
      <div v-for="(item, index) in variableList" :key="index" class="variable">
        <variableItem v-model:variable="variableList[index]"></variableItem>
        <div class="btn-wrapper">
          <icon-minus-circle
            v-if="variableList.length > 1"
            class="size-20"
            @click="handleDeleteVariable(index)"
          ></icon-minus-circle>
          <icon-plus-circle-fill
            v-if="index === variableList.length - 1"
            class="size-20"
            @click="handleAddVariable"
          ></icon-plus-circle-fill>
        </div>
      </div>
    </div>
    <template #footer>
      <EditPageFooter style="margin-top: 0">
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
  import {
    yaml2Json,
    json2Yaml,
    unknowType,
    validateYaml
  } from '@/components/form-create/config/yaml-parse';
  import { ref, reactive, PropType } from 'vue';
  import _, { get, omitBy } from 'lodash';
  import useCallCommon from '@/hooks/use-call-common';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { validateSecretNameRegx } from '@/views/config';
  import xInputGroup from '@/components/form-create/custom-components/x-input-group.vue';
  import { createSecret, updateSecret } from '../api';
  import { SecretFormData, Variable } from '../config/interface';
  import variableItem from './variable-item.vue';

  const props = defineProps({
    show: {
      type: Boolean,
      default() {
        return false;
      }
    },
    projectList: {
      type: Array as PropType<{ label: string; value: string }[]>,
      default() {
        return [];
      }
    },
    title: {
      type: String,
      default() {
        return '';
      }
    },
    info: {
      type: Object as PropType<SecretFormData>,
      default() {
        return {};
      }
    },
    action: {
      type: String as PropType<'create' | 'edit'>,
      default() {
        return 'create';
      }
    },
    projectID: {
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
  const variableList = ref<Variable[]>([
    {
      name: '',
      type: 'string',
      default: '',
      visible: true
    }
  ]);
  const formData = ref<SecretFormData>({
    name: '',
    value: '',
    project: {
      id: ''
    }
  });
  const handleCancel = () => {
    emit('update:show', false);
  };
  const handleAddVariable = () => {
    variableList.value.push({
      name: '',
      type: 'string',
      default: '',
      visible: true
    });
  };
  const handleDeleteVariable = (index) => {
    variableList.value.splice(index, 1);
  };
  const setAppInfoVariables = () => {
    const result = _.map(variableList.value, (o) => {
      const item = _.cloneDeep(o);
      let val = item.default;
      if (item.type === 'dynamic') {
        val = yaml2Json(val);
      }
      if (item.type === 'bool') {
        val = !!val;
      }
      if (item.type === 'number') {
        val = _.isNumber(val) ? val : '';
      }
      return {
        name: item.name,
        type: item.type,
        default: val
      };
    });
    return result;
  };
  const handleOk = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        submitLoading.value = true;
        // TODO
        formData.value.project.id = props.projectID;
        const params: any = {
          ...omitBy(formData.value, (val, key) => {
            return key === 'project' && !get(formData.value, `${key}.id`);
          })
        };
        if (props.action === 'create') {
          await createSecret({
            data: params,
            query: { projectID: props.projectID }
          });
        } else {
          await updateSecret({
            data: params,
            query: { projectID: props.projectID }
          });
        }
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

  const handleBeforeOpen = () => {
    if (props.action === 'create') {
      formData.value = {
        name: '',
        value: '',
        project: {
          id: ''
        }
      };
    } else {
      formData.value = props.info;
      formData.value.project.id = formData.value.project.id || 0;
    }
  };
  const handleBeforeClose = () => {
    formref.value?.resetFields?.();
  };
</script>

<style lang="less">
  .arco-modal.project-modal {
    .btn-wrapper {
      display: flex;
      justify-content: space-between;
      width: 70px;
      margin-left: 12px;

      .arco-icon {
        color: rgb(var(--arcoblue-6));
        cursor: pointer;

        &:hover {
          color: rgb(var(--arcoblue-5));
        }
      }
    }

    .variable {
      display: flex;
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--color-border-2);

      &:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border: none;
      }
    }
  }
</style>

<style lang="less" scoped>
  .arco-form-item-content {
    .tips-wrap {
      padding: 6px;
      color: var(--color-text-3);
      font-size: 13px;
      text-align: left;
      text-align: left;
      background-color: rgb(var(--arcoblue-1));
      border-radius: var(--border-radius-small);

      .content {
        margin-left: 20px;
        opacity: 0.7;
      }
    }
  }
</style>

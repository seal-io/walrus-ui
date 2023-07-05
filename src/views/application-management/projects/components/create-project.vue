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
          :label="$t('common.table.name')"
          field="name"
          validate-trigger="change"
          :rules="[
            { required: true, message: $t('applications.projects.rule.name') },
            {
              match: validateLabelNameRegs,
              message: $t('common.validate.labelName')
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
            <span class="tips">{{ $t('common.validate.labelName') }}</span>
          </template>
        </a-form-item>
        <a-form-item :label="$t('common.table.description')">
          <a-textarea
            v-model="formData.description"
            :max-length="200"
            show-word-limit
            style="width: 100%"
            :auto-size="{ minRows: 4, maxRows: 6 }"
          ></a-textarea>
        </a-form-item>
        <a-form-item :label="$t(`applications.projects.form.label`)">
          <a-space
            v-if="formData?.labelList?.length"
            style="display: flex; flex-direction: column; width: 100%"
            direction="vertical"
          >
            <xInputGroup
              v-for="(sItem, sIndex) in formData.labelList"
              :key="sIndex"
              v-model:dataKey="sItem.key"
              v-model:dataValue="sItem.value"
              v-model:value="formData.labels"
              class="group-item"
              :label-list="formData.labelList"
              :position="sIndex"
              @add="(obj) => handleAddLabel(obj, formData.labelList)"
              @delete="handleDeleteLabel(formData.labelList, sIndex)"
            ></xInputGroup>
          </a-space>
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
  import { useUserStore } from '@/store';
  import { ref, reactive, PropType } from 'vue';
  import { reduce, omit, keys, get } from 'lodash';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import xInputGroup from '@/components/form-create/custom-components/x-input-group.vue';
  import { validateLabelNameRegs } from '@/views/config';
  import { createProject, updateProject } from '../api';
  import { ProjectFormData } from '../config/interface';

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
    info: {
      type: Object as PropType<ProjectFormData>,
      default() {
        return {};
      }
    },
    action: {
      type: String as PropType<'create' | 'edit'>,
      default() {
        return 'create';
      }
    }
  });
  const userStore = useUserStore();
  const emit = defineEmits(['save', 'update:show', 'reset']);
  const formref = ref();
  const loading = ref(false);
  const submitLoading = ref(false);
  const formData = ref<ProjectFormData>({
    name: '',
    description: '',
    labelList: [{ key: '', value: '' }],
    labels: {}
  });
  const handleCancel = () => {
    emit('update:show', false);
  };
  const setLabels = () => {
    if (formData.value?.labelList?.length) {
      formData.value.labels = reduce(
        formData.value.labelList,
        (obj, item) => {
          if (item.key) {
            obj[item.key] = item.value;
          }
          return obj;
        },
        {}
      );
    } else {
      formData.value.labels = {};
    }
  };
  const transformlabels = () => {
    const labelKeys = keys(formData.value.labels);
    if (labelKeys.length) {
      formData.value.labelList = labelKeys.map((k) => {
        return {
          key: k,
          value: get(formData.value, `labels.${k}`)
        };
      });
    } else {
      formData.value.labelList = [{ key: '', value: '' }];
    }
  };
  const handleOk = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        setLabels();
        const data = omit(formData.value, ['labelList']);
        submitLoading.value = true;
        // TODO
        if (props.action === 'create') {
          await createProject(data);
          await userStore.info();
        } else {
          await updateProject(data);
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
  const handleAddLabel = (obj, list) => {
    list?.push(obj);
  };
  const handleDeleteLabel = (list, index) => {
    const len = list.length || 0;
    if (len < 2) return;
    list?.splice(index, 1);
  };
  const handleBeforeOpen = () => {
    if (props.action === 'create') {
      formData.value = {
        name: '',
        description: '',
        labelList: [{ key: '', value: '' }],
        labels: {}
      };
    } else {
      formData.value = props.info;
      transformlabels();
    }
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

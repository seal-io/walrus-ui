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
    <div :loading="loading" style="width: 100%; text-align: center">
      <a-form ref="formref" :model="formData" auto-label-width>
        <a-form-item
          :label="$t('common.table.name')"
          field="name"
          hide-label
          :validate-trigger="['change', 'input']"
          :rules="[
            {
              required: true,
              message: $t('common.rule.name')
            },
            {
              required: true,
              match: validateLabelNameRegx,
              message: $t('common.validate.labelName')
            }
          ]"
        >
          <seal-input
            v-model.trim="formData.name"
            :label="$t('common.table.name')"
            :required="true"
            :disabled="action === 'edit'"
            style="width: 100%"
            :max-length="validateInputLength.NAME"
            show-word-limit
          ></seal-input>
        </a-form-item>
        <a-form-item :label="$t('common.table.description')" hide-label>
          <seal-textarea
            v-model="formData.description"
            :label="$t('common.table.description')"
            :max-length="200"
            show-word-limit
            style="width: 100%"
            :auto-size="{ minRows: 4, maxRows: 6 }"
          ></seal-textarea>
        </a-form-item>
        <a-form-item :label="$t(`applications.projects.form.label`)" hide-label>
          <SealFormItemWrap
            :label="$t(`applications.projects.form.label`)"
            style="width: 100%; text-align: left"
          >
            <a-space
              v-if="labelList.length"
              style="display: flex; flex-direction: column; width: 100%"
              direction="vertical"
            >
              <xInputGroup
                v-for="(sItem, sIndex) in labelList"
                :key="sIndex"
                v-model:dataKey="sItem.key"
                v-model:dataValue="sItem.value"
                v-model:value="formData.labels"
                class="group-item"
                :label-list="labelList"
                :position="sIndex"
                :trigger-validate="validateTrigger"
                always-delete
                should-key
                @add="(obj) => handleAddLabel(obj, labelList)"
                @delete="handleDeleteLabel(labelList, sIndex)"
              ></xInputGroup>
            </a-space>
            <template v-else>
              <a-link
                class="p-0"
                @click="
                  () => {
                    handleAddLabel(labelItem, labelList);
                  }
                "
              >
                <icon-plus-circle-fill :size="24" font-size="14px" />
              </a-link>
            </template>
          </SealFormItemWrap>
        </a-form-item>
      </a-form>
    </div>
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
  import useLabelsActions from '@/components/form-create/hooks/use-labels-action';
  import thumbButton from '@/components/buttons/thumb-button.vue';
  import { validateLabelNameRegx, validateInputLength } from '@/views/config';
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
  const labelItem = { key: '', value: '' };
  const userStore = useUserStore();
  const emit = defineEmits(['save', 'update:show', 'reset']);
  const formref = ref();
  const loading = ref(false);
  const submitLoading = ref(false);
  const formData = ref<ProjectFormData>({
    name: '',
    description: '',
    labels: {}
  });

  const {
    labelList,
    handleAddLabel,
    handleDeleteLabel,
    getLabelList,
    validateLabel,
    resetStatus,
    validateTrigger
  } = useLabelsActions(formData);
  const handleCancel = () => {
    emit('update:show', false);
  };

  const handleOk = async () => {
    const res = await formref.value?.validate();
    validateLabel();
    if (!res && !validateTrigger.value) {
      try {
        submitLoading.value = true;
        // TODO
        if (props.action === 'create') {
          await createProject(formData.value);
          await userStore.info();
        } else {
          await updateProject(formData.value);
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
      labelList.value = [];
      formData.value = {
        name: '',
        description: '',
        labels: {}
      };
    } else {
      formData.value = props.info;
      getLabelList();
    }
  };
  const handleBeforeClose = () => {
    formref.value.resetFields();
    resetStatus();
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

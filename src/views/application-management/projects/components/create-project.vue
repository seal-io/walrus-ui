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
          field="metadata.name"
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
            v-model.trim="formData.metadata.name"
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
            v-model="formData.spec.description"
            :label="$t('common.table.description')"
            :max-length="validateInputLength.DESC"
            show-word-limit
            style="width: 100%"
            :auto-size="{ minRows: 4, maxRows: 6 }"
          ></seal-textarea>
        </a-form-item>
        <a-form-item
          :label="$t(`applications.projects.form.label`)"
          hide-label
          field="metadata.labels"
          :rules="[
            {
              required: false,
              validator(val, callback) {
                if (!labelsData.list.length) {
                  callback();
                  return;
                }
                const valid = _.some(labelsData.list, (item) => {
                  return !_.trim(item.key);
                });
                if (valid) {
                  callback(
                    i18n.global.t('resource.definition.detail.rules.labelKey')
                  );
                  return;
                }
                callback();
              },
              message: i18n.global.t('common.rule.object.key')
            }
          ]"
        >
          <SealFormItemWrap
            :label="$t(`applications.projects.form.label`)"
            style="width: 100%; text-align: left"
          >
            <keyValueLabels
              v-model:value="formData.metadata.labels"
              v-model:label-list="labelsData.list"
              :validate-trigger="validateTrigger"
              :labels="labelsData.labels"
              page-action="edit"
            ></keyValueLabels>
          </SealFormItemWrap>
        </a-form-item>
      </a-form>
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
  import { useUserStore } from '@/store';
  import { ref, PropType } from 'vue';
  import i18n from '@/locale';
  import _ from 'lodash';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import keyValueLabels from '@/components/form-create/custom-components/key-value-labels.vue';
  import { validateLabelNameRegx, validateInputLength } from '@/views/config';
  import {
    createProject,
    updateProject,
    ResourceKinds,
    apiVersion,
    GlobalNamespace
  } from '../api';
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
  const validateTrigger = ref(false);
  const submitLoading = ref(false);
  const labelsData = ref<any>({
    labels: {},
    list: []
  });
  const formData = ref<ProjectFormData>({
    apiVersion,
    kind: ResourceKinds.Project,
    metadata: {
      namespace: GlobalNamespace,
      name: '',
      labels: {}
    },
    spec: {
      description: ''
    }
  });

  const handleCancel = () => {
    emit('update:show', false);
  };

  const handleOk = async () => {
    const res = await formref.value?.validate();
    validateTrigger.value = true;
    if (!res) {
      try {
        submitLoading.value = true;
        // TODO
        if (props.action === 'create') {
          await createProject({
            namespace: GlobalNamespace,
            data: formData.value
          });
          await userStore.info();
        } else {
          await updateProject({
            namespace: GlobalNamespace,
            name: formData.value.metadata.name,
            data: formData.value
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
        apiVersion,
        kind: ResourceKinds.Project,
        metadata: {
          namespace: GlobalNamespace,
          name: '',
          labels: {}
        },
        spec: {
          description: ''
        }
      };
      labelsData.value.labels = {};
      labelsData.value.list = [];
      validateTrigger.value = false;
    } else {
      formData.value = props.info;
      labelsData.value.labels = _.cloneDeep(formData.value.metadata.labels);
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

<template>
  <a-modal
    top="10%"
    :closable="false"
    :align-center="false"
    :width="600"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    :body-style="{ 'max-height': '500px', 'overflow': 'auto' }"
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
          :label="$t('applications.applications.form.name')"
          hide-label
          field="name"
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
            :label="$t('applications.applications.form.name')"
            :required="true"
            style="width: 100%"
            :max-length="validateInputLength.NAME"
            show-word-limit
          ></seal-input>
          <!-- <template #extra>
            <span class="tips">{{ $t('common.validate.labelName') }}</span>
          </template> -->
        </a-form-item>
        <a-form-item
          :label="$t('common.table.description')"
          field="description"
          hide-label
          validate-trigger="change"
        >
          <seal-textarea
            v-model="formData.description"
            :label="$t('common.table.description')"
            :max-length="100"
            show-word-limit
            style="width: 100%"
            :auto-size="{ minRows: 4, maxRows: 5 }"
          ></seal-textarea>
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
  import { ref, reactive, PropType } from 'vue';
  import _ from 'lodash';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { validateLabelNameRegx, validateInputLength } from '@/views/config';

  interface InfoData {
    name: string;
    description: string;
  }
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
      type: Object as PropType<InfoData>,
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
  const emit = defineEmits(['save', 'update:show']);
  const formref = ref();
  const loading = ref(false);
  const submitLoading = ref(false);
  const formData = ref<InfoData>({
    name: '',
    description: ''
  });
  const handleCancel = () => {
    emit('update:show', false);
  };

  const handleOk = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        const data = _.cloneDeep(formData.value);
        emit('save', data);
        setTimeout(() => {
          emit('update:show', false);
        }, 100);
      } catch (error) {
        // eslint-disable-next-line no-console
      }
    }
  };
  const handleInput = (val, key) => {
    formData.value[key] = val;
  };

  const handleBeforeOpen = () => {
    if (props.action === 'create') {
      formData.value = {
        name: '',
        description: ''
      };
    } else {
      formData.value = _.cloneDeep(props.info);
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

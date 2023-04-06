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
          :disabled="!!formData.id && action === 'edit'"
          :label="$t('operation.environments.table.name')"
          field="name"
          validate-trigger="change"
          :rules="[
            { required: true, message: $t('operation.secret.rule.name') },
            {
              match: validateSecretNameRegx,
              message: $t('operation.secret.name.tips')
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
            <span class="tips">{{ $t('operation.secret.name.tips') }}</span>
          </template>
        </a-form-item>
        <!-- <a-form-item
          :disabled="!!formData.id && action === 'edit'"
          label="应用范围"
        >
          <a-select
            v-model="formData.project.id"
            style="width: 100%"
            :options="projectList"
            allow-search
          >
            <a-option :value="0" label="全局"></a-option>
          </a-select>
        </a-form-item> -->
        <a-form-item
          :label="$t('operation.secret.content')"
          field="value"
          validate-trigger="change"
          :rules="[
            { required: true, message: $t('applications.secret.rules.value') }
          ]"
        >
          <a-textarea
            v-model="formData.value"
            style="width: 100%"
            :auto-size="{ minRows: 4, maxRows: 6 }"
          ></a-textarea>
        </a-form-item>
        <!-- <a-form-item>
          <dl class="tips-wrap">
            <dt style="float: left">
              <icon-info-circle-fill style="color: rgb(var(--arcoblue-6))" />
            </dt>
            <dd class="content" v-html="$t('operation.secret.tips')"></dd>
          </dl>
        </a-form-item> -->
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
  import { ref, reactive, PropType } from 'vue';
  import { reduce, omit, keys, get, pickBy, omitBy } from 'lodash';
  import useCallCommon from '@/hooks/use-call-common';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { validateSecretNameRegx } from '@/views/config';
  import xInputGroup from '@/components/form-create/custom-components/x-input-group.vue';
  import { createSecret, updateSecret } from '../api';
  import { SecretFormData } from '../config/interface';

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
    }
  });
  const emit = defineEmits(['save', 'update:show']);
  const { router, route } = useCallCommon();
  const projectID = route.query.projectId as string;
  const formref = ref();
  const loading = ref(false);
  const submitLoading = ref(false);
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

  const handleOk = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        submitLoading.value = true;
        // TODO
        const params: any = {
          ...omitBy(formData.value, (val, key) => {
            return key === 'project' && !get(formData.value, `${key}.id`);
          })
        };
        if (props.action === 'create') {
          await createSecret(params);
        } else {
          await updateSecret(params);
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

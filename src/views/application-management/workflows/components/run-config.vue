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
    modal-class="run-config-modal"
    :title="$t('workflow.table.run.config')"
    @cancel="handleCancel"
    @ok="handleOk"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <a-spin :loading="loading" style="width: 100%; text-align: center">
      <a-form ref="formref" :model="formData" auto-label-width>
        <div v-if="info.variables?.length" class="title">{{
          $t('applications.secret.value')
        }}</div>
        <a-form-item
          v-for="(item, index) in info.variables"
          :key="index"
          :label="$t('common.table.default')"
          :field="item.name"
          hide-label
          validate-trigger="change"
        >
          <seal-textarea
            v-model="formData.variables[item.name]"
            :label="item.name"
            show-word-limit
            style="width: 100%"
            :auto-size="{ minRows: 1, maxRows: 4 }"
          ></seal-textarea>
        </a-form-item>
        <div class="title">{{ $t('common.table.mark') }}</div>
        <a-form-item
          :label="$t('common.table.description')"
          field="description"
          hide-label
          validate-trigger="change"
        >
          <seal-textarea
            v-model="formData.description"
            :label="$t('common.table.description')"
            show-word-limit
            style="width: 100%"
            :auto-size="{ minRows: 4, maxRows: 6 }"
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
  import { ref, reactive, PropType, computed } from 'vue';
  import _ from 'lodash';
  import i18n from '@/locale';
  import AceEditor from '@/components/ace-editor/index.vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { validateLabelNameRegx } from '@/views/config';
  import {
    json2Yaml,
    yaml2Json
  } from '@/components/form-create/config/yaml-parse';

  interface InfoData {
    variables: object;
    description: string;
  }
  const props = defineProps({
    show: {
      type: Boolean,
      default() {
        return false;
      }
    },
    info: {
      type: Object as PropType<any>,
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
  const formData = ref<any>({
    variables: {},
    description: '',
    id: '',
    name: '',
    project: {
      id: '',
      name: ''
    }
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
  const setFormVariables = () => {
    const variables = _.filter(props.info?.variables, (item) => {
      return item.overwrite;
    });
    formData.value.variables = _.reduce(
      variables,
      (result, item) => {
        result[item.name] = item.value;
        return result;
      },
      {}
    );
  };
  const handleBeforeOpen = () => {
    formData.value.id = props.info.id;
    formData.value.name = props.info.name;
    formData.value.project.id = props.info.project?.id;
    formData.value.project.name = props.info.project?.name;
    setFormVariables();
  };
  const handleBeforeClose = () => {
    // formData.value = {
    //   variables: {},
    //   description: '',
    //   id: '',
    //   name: '',
    //   project: {
    //     id: '',
    //     name: ''
    //   }
    // };
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
  .run-config-modal {
    .title {
      margin-bottom: 16px;
      color: var(--color-text-2);
      font-weight: 500;
      font-size: 14px;
      text-align: left;
    }
  }

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

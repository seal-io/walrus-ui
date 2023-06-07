<template>
  <a-modal
    top="10%"
    :closable="false"
    :align-center="false"
    :width="600"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    unmount-on-close
    :body-style="{
      'max-height': '500px',
      'overflow': 'auto',
      'text-align': 'center'
    }"
    modal-class="oci-modal"
    :title="$t(title)"
    @cancel="handleCancel"
    @ok="handleOk"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <div>
      <a-form ref="formref" :model="formData" layout="vertical">
        <a-grid :col-gap="10">
          <a-grid-item v-if="!instanceId" :span="12">
            <a-form-item
              label="选择实例"
              field="serviceID"
              :rules="[{ required: true, message: '请选择实例' }]"
            >
              <a-select
                v-model="formData.serviceID"
                style="width: 100%"
                @change="handleInstanceChange"
              >
                <a-option
                  v-for="item in instanceList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                ></a-option>
              </a-select>
            </a-form-item>
          </a-grid-item>
          <a-grid-item :span="12">
            <a-form-item
              label="选择版本"
              field="id"
              :rules="[{ required: true, message: '请选择版本' }]"
            >
              <a-select
                v-model="formData.id"
                style="width: 100%"
                :loading="loading"
                @change="handleRevisionChange"
              >
                <a-option
                  v-for="item in revisionList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.createTime"
                ></a-option>
              </a-select>
            </a-form-item>
          </a-grid-item>
        </a-grid>
        <a-form-item label="配置对比">
          <AceEditor
            v-show="removeLines.length || addLines.length"
            ref="rollback_editor"
            read-only
            style="width: 100%"
            :remove-lines="removeLines"
            :add-lines="addLines"
            :editor-default-value="codeResult"
            lang="json"
            :height="320"
          ></AceEditor>
          <a-alert v-show="!removeLines.length && !addLines.length">{{
            $t('applications.applications.history.diff.same')
          }}</a-alert>
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
            >{{ $t('common.button.rollback') }}</a-button
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
  import _ from 'lodash';
  import { ref, reactive, PropType } from 'vue';
  import useCodeDiff from '@/hooks/use-code-diff';
  import AceEditor from '@/components/ace-editor/index.vue';
  import { execSucceed } from '@/utils/monitor';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { InstanceData, HistoryData } from '../config/interface';
  import {
    queryApplicationRevisions,
    diffRevisionSpec,
    rollbackApplication,
    rollbackInstance
  } from '../api';
  import { updateApplicationEmitter } from '../hooks/update-application-listener';

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
    instanceId: {
      type: String,
      default() {
        return '';
      }
    },
    instanceList: {
      type: Array as PropType<InstanceData[]>,
      default() {
        return [];
      }
    }
  });
  const {
    removeLines,
    addLines,
    codeResult,
    getDiffCodeResult,
    clearDiffLines
  } = useCodeDiff();
  const emit = defineEmits(['update:show']);
  const revisionList = ref<HistoryData[]>([]);
  const submitLoading = ref(false);
  const loading = ref(false);
  const formref = ref();
  const formData = reactive({
    serviceID: '',
    id: ''
  });

  const handleRollbackApplication = async () => {
    try {
      await rollbackApplication({ id: formData.id });
      execSucceed();
      updateApplicationEmitter();
    } catch (error) {
      console.log(error);
    }
  };
  const handleRollbackInstance = async () => {
    try {
      await rollbackInstance({ id: formData.id });
      execSucceed();
    } catch (error) {
      console.log(error);
    }
  };
  const getRevisionList = async () => {
    if (!formData.serviceID) return;
    try {
      loading.value = true;
      const params = {
        page: -1,
        serviceID: formData.serviceID
      };
      const { data } = await queryApplicationRevisions(params);
      revisionList.value = data?.items || [];
      loading.value = false;
    } catch (error) {
      revisionList.value = [];
      loading.value = false;
      console.log(error);
    }
  };

  const getRevisionDiff = async () => {
    try {
      const params = {
        serviceID: formData.serviceID,
        id: formData.id
      };
      const { data } = await diffRevisionSpec(params);
      const variables = !props.instanceId ? 'variables' : 'inputVariables';
      const diffContent = {
        old: JSON.stringify(_.pick(data.old, [variables, 'modules']), null, 2),
        new: JSON.stringify(_.pick(data.new, [variables, 'modules']), null, 2)
      };
      getDiffCodeResult(diffContent);
    } catch (error) {
      console.log(error);
    }
  };
  const handleRevisionChange = () => {
    clearDiffLines();
    getRevisionDiff();
  };
  const handleInstanceChange = () => {
    clearDiffLines();
    getRevisionList();
  };
  const handleExecRollback = async () => {
    if (!props.instanceId) {
      await handleRollbackApplication();
    } else {
      await handleRollbackInstance();
    }
    emit('update:show', false);
  };
  const handleOk = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        handleExecRollback();
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleCancel = () => {
    emit('update:show', false);
  };
  const handleBeforeOpen = () => {
    formData.serviceID = props.instanceId;
    getRevisionList();
  };
  const handleBeforeClose = () => {
    formref.value.clearValidate();
    formref.value.resetFields();
    clearDiffLines();
    codeResult.value = '';
    revisionList.value = [];
  };
</script>

<style lang="less" scoped></style>

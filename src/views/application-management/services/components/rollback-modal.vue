<template>
  <a-modal
    top="5%"
    :closable="false"
    :align-center="false"
    :width="700"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    unmount-on-close
    :body-style="{
      'max-height': '660px',
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
        <a-form-item
          :label="$t('applications.service.rollback.version.label')"
          hide-label
          field="id"
          :rules="[
            {
              required: true,
              message: $t('applications.service.rollback.version.holder')
            }
          ]"
        >
          <seal-select
            v-model="formData.id"
            :label="$t('applications.service.rollback.version.label')"
            :required="true"
            style="width: 100%"
            :loading="loading"
            @change="handleRevisionChange"
          >
            <a-option
              v-for="item in revisionList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            >
              <span class="flex">
                <span style="width: 100px">
                  <AutoTip> {{ item.createdBy }} </AutoTip>
                </span>
                <span style="width: 120px">{{ item.label }}</span>
                <span style="width: 300px; padding: 0 20px"
                  ><AutoTip>{{ item.changeComment }}</AutoTip></span
                >
              </span>
            </a-option>
          </seal-select>
        </a-form-item>
        <a-form-item hide-label>
          <seal-textarea
            v-model="formData.changeComment"
            style="width: 100%"
            :label="$t('common.table.mark')"
            :max-length="100"
            show-word-limit
          ></seal-textarea>
        </a-form-item>
        <a-form-item
          :label="$t('applications.service.rollback.config.compare')"
        >
          <a-spin style="width: 100%" :loading="compareloading">
            <AceEditor
              ref="rollback_editor"
              read-only
              style="width: 100%; margin-bottom: 10px"
              :remove-lines="removeLines"
              :add-lines="addLines"
              :editor-default-value="codeResult"
              lang="json"
              :height="300"
            >
              <template #label>
                <a-select
                  v-model="compareType"
                  :bordered="false"
                  style="height: 36px; padding-left: 0"
                  @change="handleCompareTypeChange"
                >
                  <a-option
                    v-for="item in compareOptions"
                    :key="item.value"
                    :value="item.value"
                  >
                    {{ $t(item.label) }}
                  </a-option>
                </a-select>
              </template>
            </AceEditor>
            <a-alert
              v-show="!removeLines.length && !addLines.length && formData.id"
              >{{ $t('applications.applications.history.diff.same') }}</a-alert
            >
          </a-spin>
        </a-form-item>
      </a-form>
    </div>
    <template #footer>
      <EditPageFooter style="margin-top: 0; padding-top: 0">
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
  import dayjs from 'dayjs';
  import { ref, reactive, PropType } from 'vue';
  import useCodeDiff from '@/hooks/use-code-diff';
  import AceEditor from '@/components/ace-editor/index.vue';
  import { execSucceed } from '@/utils/monitor';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { HistoryData } from '../config/interface';
  import {
    queryServiceRevisions,
    diffRevisionSpec,
    rollbackService
  } from '../api';

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
    serviceId: {
      type: String,
      default() {
        return '';
      }
    },
    projectID: {
      type: String,
      default() {
        return '';
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
  const revisionList = ref<
    { value: string; label: string; createdBy: string; changeComment: string }[]
  >([]);
  const submitLoading = ref(false);
  const loading = ref(false);
  const compareloading = ref(false);
  const formref = ref();
  const attributesDiffContent = ref({});
  const computedDiffContent = ref({});
  const formData = reactive({
    projectID: props.projectID,
    serviceID: '',
    changeComment: '',
    id: ''
  });

  const compareType = ref('attributes');

  const compareOptions = [
    {
      label: 'applications.service.revision.runtime',
      value: 'computedAttributes'
    },
    { label: 'applications.service.revision.custom', value: 'attributes' }
  ];

  const handleCompareTypeChange = () => {
    if (compareType.value === 'attributes') {
      getDiffCodeResult(attributesDiffContent.value);
    } else {
      getDiffCodeResult(computedDiffContent.value);
    }
  };
  const handleRollbackService = async () => {
    try {
      await rollbackService({
        revisionID: formData.id,
        serviceID: formData.serviceID,
        changeComment: formData.changeComment
      });
      execSucceed();
    } catch (error) {
      //
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
      const { data } = await queryServiceRevisions(params);
      revisionList.value = _.map(data?.items || [], (item) => {
        return {
          ...item,
          value: item.id,
          label: dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
        };
      });
      loading.value = false;
    } catch (error) {
      revisionList.value = [];
      loading.value = false;
    }
  };

  const getRevisionDiff = async () => {
    try {
      compareloading.value = true;
      const params = {
        serviceID: formData.serviceID,
        id: formData.id
      };
      const { data } = await diffRevisionSpec(params);
      attributesDiffContent.value = {
        old: data.old?.attributes
          ? JSON.stringify(_.omit(data.old, 'computedAttributes'), null, 2)
          : '',
        new: JSON.stringify(_.omit(data.new, 'computedAttributes'), null, 2)
      };
      computedDiffContent.value = {
        old: data.old?.computedAttributes
          ? JSON.stringify(data.old.computedAttributes, null, 2)
          : '',
        new: JSON.stringify(data.new.computedAttributes, null, 2)
      };

      handleCompareTypeChange();
      compareloading.value = false;
    } catch (error) {
      compareloading.value = false;
    }
  };
  const handleRevisionChange = () => {
    clearDiffLines();
    getRevisionDiff();
  };

  const handleExecRollback = async () => {
    await handleRollbackService();
    emit('update:show', false);
  };
  const handleOk = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        handleExecRollback();
      } catch (error) {
        //
      }
    }
  };
  const handleCancel = () => {
    emit('update:show', false);
  };
  const handleBeforeOpen = () => {
    formData.serviceID = props.serviceId;
    formData.changeComment = '';
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

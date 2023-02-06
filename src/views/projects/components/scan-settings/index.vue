<template>
  <div id="tagscontainer" class="container tags-container">
    <a-modal
      top="10%"
      :align-center="false"
      :width="600"
      style="min-height: 350px"
      :body-style="{ padding: '15px 20px' }"
      body-class="m-setting-modal"
      popup-container="#tagscontainer"
      :ok-text="$t('common.button.save')"
      :visible="show"
      :mask-closable="false"
      :title="$t('resource.scan.settings.title')"
      @cancel="handleCancel"
      @ok="handleOk"
      @before-open="handleBeforeOpen"
      @before-close="handleBeforeClose"
    >
      <div class="content">
        <div class="setting-item">
          <div class="title">
            <span>{{ $t('resource.scan.settings.scheduled') }}</span>
            <a-switch
              v-model="formData.enableScheduleEvaluation"
              size="small"
              style="margin-left: 5px"
            ></a-switch>
          </div>
          <div>
            <!-- <a-checkbox>{{ $t('intergration.scan.opts3') }}</a-checkbox> -->
            <a-select
              v-model="formData.scheduleEvaluationInterval"
              style="width: 300px"
              :disabled="!formData.enableScheduleEvaluation"
            >
              <a-option
                v-for="item in scanSettinsOptions"
                :key="item.value"
                :value="item.value"
                >{{ $t(item.label) }}</a-option
              >
            </a-select>
          </div>
        </div>
        <div v-if="kind === 'repository'" class="setting-item">
          <div class="title">{{ $t('resource.scan.settings.event') }}</div>
          <div>
            <a-checkbox v-model="formData.enableWebhookDrivenEvaluation">{{
              $t('intergration.scan.opts4')
            }}</a-checkbox>
          </div>
        </div>
      </div>
      <template #footer>
        <EditPageFooter :style="{ 'margin-top': 0 }">
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
  </div>
</template>

<script lang="ts" setup>
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { reactive, ref } from 'vue';
  import { updateFormData } from '@/api/projects';
  import { omit, get } from 'lodash';
  import { scanSettinsOptions } from '../../config';

  const props = defineProps({
    show: {
      type: Boolean,
      default() {
        return false;
      },
    },
    kind: {
      type: String,
      default() {
        return '';
      },
    },
    resourceData: {
      type: Object,
      default() {
        return {};
      },
    },
    resourceId: {
      type: String,
      default() {
        return '';
      },
    },
  });
  const emit = defineEmits(['save', 'update:show']);
  const submitLoading = ref(false);
  const formref = ref();
  const formData = reactive({
    enableWebhookDrivenEvaluation: false,
    enableScheduleEvaluation: false,
    scheduleEvaluationInterval: 86400,
  });
  const handleCancel = () => {
    emit('update:show', false);
  };
  const submitFormData = async () => {
    const params: any = {};
    if (props.kind === 'repository') {
      params.enableWebhookDrivenEvaluation =
        formData.enableWebhookDrivenEvaluation;
    }
    const data = {
      id: props.resourceId,
      ...props.resourceData,
      enableScheduleEvaluation: formData.enableScheduleEvaluation,
      scheduleEvaluationInterval: formData.scheduleEvaluationInterval,
      repositoryConfiguration: {
        ...props.resourceData.repositoryConfiguration,
        ...params,
      },
    };
    await updateFormData(data);
  };

  const handleOk = async () => {
    const res = await formref.value?.validate();
    if (!res) {
      try {
        submitLoading.value = true;
        await submitFormData();
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

  const handleBeforeClose = () => {};
  const handleBeforeOpen = () => {
    formData.enableScheduleEvaluation = get(
      props.resourceData,
      'enableScheduleEvaluation'
    );
    formData.enableWebhookDrivenEvaluation =
      get(
        props.resourceData,
        'repositoryConfiguration.enableWebhookDrivenEvaluation'
      ) || false;
    formData.scheduleEvaluationInterval =
      get(props.resourceData, 'scheduleEvaluationInterval') || 86400;
  };
</script>

<style lang="less">
  .arco-modal-body.m-setting-modal {
    .setting-item {
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;

      .title {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        font-weight: 500;
      }
    }
  }
</style>

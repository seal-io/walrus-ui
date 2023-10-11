<template>
  <a-modal
    top="0"
    :footer="false"
    hide-title
    :closable="false"
    :align-center="false"
    :width="1000"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :fullscreen="false"
    :mask-closable="false"
    :body-style="{
      height: '600px',
      overflow: 'auto',
      position: 'relative',
      padding: 0
    }"
    modal-class="flow-task-modal"
    :title="title"
    @cancel="handleCancel"
    @ok="handleOk"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <div class="task-box">
      <div class="menu">
        <a-steps :current="current" direction="vertical">
          <a-step>选择任务类型</a-step>
          <a-step>填写表单</a-step>
        </a-steps>
      </div>
      <div class="task-content">
        <div class="form">
          <a-space v-if="current === 1" :size="12">
            <TaskCard
              v-for="(item, index) in TaskTypeList"
              :key="index"
              :data-info="item"
              :active="item.value === selectedTask"
              @click="handleClick(item)"
            ></TaskCard>
          </a-space>
          <ManualCheckpoint
            v-else-if="selectedTask === StepTypes.APPROVAL"
          ></ManualCheckpoint>
          <ServiceTask
            v-else-if="selectedTask === StepTypes.SERVICE"
          ></ServiceTask>
        </div>
        <EditPageFooter class="footer-btn">
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
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
  import { toRefs, ref } from 'vue';
  import locale from '@/locale';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import ManualCheckpoint from '../task-types/manual-checkpoint.vue';
  import ServiceTask from '../task-types/service-task.vue';
  import TaskCard from '../task-types/task-cards.vue';
  import { TaskTypeList, StepTypes } from '../task-types/config';

  const props = defineProps({
    dataInfo: {
      type: Object,
      default() {
        return {};
      }
    },
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
    }
  });
  const emits = defineEmits(['submit', 'cancel', 'update:show']);
  const { t } = locale.global;
  const submitLoading = ref(false);
  const current = ref(1);
  const selectedTask = ref('');

  const handleClick = (item) => {
    selectedTask.value = item.value;
    current.value = 2;
  };
  const handleCancel = () => {
    emits('update:show', false);
  };
  const handleOk = () => {};
  const handleBeforeOpen = () => {};
  const handleBeforeClose = () => {
    current.value = 1;
    selectedTask.value = '';
  };
</script>

<style lang="less">
  @width: 180px;

  .flow-task-modal {
    .footer-btn {
      position: absolute;
      right: 0;
      bottom: 0;
      left: @width + 16px;
      width: inherit;
      background: #fff;
      border-top: 1px solid var(--color-border-2);
    }

    .task-box {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      height: 100%;

      .menu {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 16px;
        width: @width;
        height: 100%;
        padding: 16px 0;
        border-right: 1px solid var(--color-border-2);

        .arco-steps-item-title {
          font-size: 14px;
        }

        .arco-steps-icon {
          width: 24px;
          height: 24px;
          font-size: 14px;
          line-height: 22px;
        }
      }

      .task-content {
        flex: 1;
        margin-bottom: 80px;
        margin-left: @width + 16px;

        .form {
          height: 100%;
          padding: 16px;
          overflow: auto;
        }
      }
    }
  }
</style>

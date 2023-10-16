<template>
  <a-modal
    top="10%"
    :footer="false"
    :hide-title="true"
    :closable="false"
    :align-center="false"
    :width="1200"
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
    title="新建任务"
    @cancel="handleCancel"
    @ok="handleOk"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <div class="task-box">
      <div class="menu">
        <a-steps :current="current" direction="vertical">
          <a-step
            v-for="item in steps"
            :key="item.value"
            :description="item.description"
            >{{ item.label }}</a-step
          >
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
              @click="handleSelectTask(item)"
            ></TaskCard>
          </a-space>
          <ManualCheckpoint
            v-else-if="
              selectedTask === TaskTypes.APPROVAL && current === steps.length
            "
            ref="manualRef"
          ></ManualCheckpoint>
          <seal-select
            v-else-if="selectedTask === TaskTypes.SERVICE && current === 2"
            v-model="flow.environmentId"
            label="选择环境"
            :placeholder="$t('applications.applications.table.module')"
            :required="true"
            :style="{ width: `${InputWidth.LARGE}px` }"
            :options="environmentList"
            :loading="loading"
            allow-search
            @change="handleOnSelect"
          >
          </seal-select>
          <ServiceTask
            v-else-if="
              selectedTask === TaskTypes.SERVICE && current === steps.length
            "
            ref="serviceRef"
            :flow="flow"
          ></ServiceTask>
        </div>
        <EditPageFooter class="footer-btn" style="margin-top: 0">
          <template #save>
            <a-button
              v-if="current > 1"
              type="primary"
              class="cap-title cancel-btn"
              @click="handleOnPrev"
              >{{ $t('common.button.prev') }}</a-button
            >
            <a-button
              v-if="current === steps.length"
              :loading="submitLoading"
              type="primary"
              class="cap-title cancel-btn"
              @click="handleOk"
              >{{ $t('common.button.save') }}</a-button
            >
          </template>
          <template #cancel>
            <a-space :size="40">
              <a-button
                v-if="selectedTask && current < steps.length"
                :disabled="!flow.environmentId"
                type="primary"
                class="cap-title cancel-btn"
                @click="handleOnNext"
                >{{ $t('common.button.next') }}</a-button
              >
              <a-button
                :type="'outline'"
                class="cap-title cancel-btn"
                @click="handleCancel"
                >{{ $t('common.button.cancel') }}</a-button
              >
            </a-space>
          </template>
        </EditPageFooter>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
  import { toRefs, reactive, ref, computed, PropType } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { InputWidth } from '@/views/config';
  import { ListItem } from '@/views/config/interface';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { queryEnvironments } from '@/views/application-management/environments/api';
  import ManualCheckpoint from '../task-types/manual-checkpoint.vue';
  import ServiceTask from '../task-types/service-task.vue';
  import TaskCard from '../task-types/task-cards.vue';
  import { TaskTypeList, TaskTypes, stepList } from '../task-types/config';

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
    action: {
      type: String as PropType<'create' | 'edit'>,
      default() {
        return 'create';
      }
    }
  });
  const emits = defineEmits(['save', 'cancel', 'update:show']);
  const { route, t } = useCallCommon();
  const submitLoading = ref(false);
  const current = ref(1);
  const selectedTask = ref('');
  const flow = reactive({
    projectId: route.params.projectId,
    environmentId: ''
  });
  const serviceRef = ref();
  const manualRef = ref();
  const environmentList = ref<ListItem[]>([]);
  const loading = ref(false);

  const title = computed(() => {
    if (!selectedTask.value) {
      return '新建任务';
    }
    const task = TaskTypeList.find((item) => item.value === selectedTask.value);
    const label = task?.title || '';
    return props.action === 'create'
      ? `${t('common.button.create')} - ${label}`
      : `${t('common.button.edit')} - ${label}`;
  });

  const steps = computed(() => {
    return stepList.filter((item) => {
      if (item.taskType) {
        return item.taskType === selectedTask.value;
      }
      return true;
    });
  });

  const getEnvironmentList = async () => {
    try {
      loading.value = true;
      const { data } = await queryEnvironments({ page: -1 });
      const items = data.items || [];
      environmentList.value = items?.map((item) => {
        return {
          label: item.name,
          value: item.id
        };
      });
    } catch (error) {
      environmentList.value = [];
      // ignore
    } finally {
      loading.value = false;
    }
  };
  const handleOnPrev = () => {
    current.value = Math.max(1, current.value - 1);
  };

  const handleOnNext = () => {
    current.value = Math.min(steps.value.length, current.value + 1);
  };

  const handleOnSelect = () => {
    handleOnNext();
  };

  const handleSelectTask = (item) => {
    selectedTask.value = item.value;
    if (selectedTask.value === TaskTypes.SERVICE) {
      getEnvironmentList();
    }
    handleOnNext();
  };

  const handleCancel = () => {
    emits('update:show', false);
  };

  const handleOk = async () => {
    if (current.value === steps.value.length) {
      if (selectedTask.value === TaskTypes.SERVICE) {
        submitLoading.value = true;
        const data = await serviceRef.value?.save();
        submitLoading.value = false;
        if (data) {
          emits('save', data);
        }
      } else if (selectedTask.value === TaskTypes.APPROVAL) {
        submitLoading.value = true;
        const data = await manualRef.value?.save();
        submitLoading.value = false;
        if (data) {
          emits('save', data);
        }
      }
    }
  };
  const handleBeforeOpen = () => {};
  const handleBeforeClose = () => {
    current.value = 1;
    selectedTask.value = '';
    flow.environmentId = '';
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
        width: calc(100% - @width - 16px);
        margin-bottom: 75px;
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

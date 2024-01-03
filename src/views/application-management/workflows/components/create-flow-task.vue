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
    :title="
      action === 'create'
        ? $t('workflow.step.modal.title', {
            action: $t('common.button.create')
          })
        : $t('workflow.step.modal.title', { action: $t('common.button.edit') })
    "
    :unmount-on-close="true"
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
            :description="$t(item.description || '')"
            >{{ $t(item.label) }}</a-step
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
              :active="item.value === taskType"
              @click="handleSelectTask(item)"
            ></TaskCard>
          </a-space>

          <ManualCheckpoint
            v-if="taskType === TaskTypes.APPROVAL && current === steps.length"
            ref="manualRef"
            :show="show"
            :action="action"
            :data-info="dataInfo"
          ></ManualCheckpoint>
          <a-form
            v-if="taskType === TaskTypes.SERVICE && current === 2"
            ref="taskform"
            :model="flow"
            auto-label-width
          >
            <a-form-item
              field="name"
              hide-label
              hide-asterisk
              :rules="[
                {
                  required: true,
                  message: $t('common.form.rule.input', {
                    name: $t('workflow.stage.add.taskName')
                  })
                }
              ]"
            >
              <seal-input
                v-model="flow.name"
                :required="true"
                :label="$t('workflow.stage.add.taskName')"
                :style="{ width: `${InputWidth.LARGE}px` }"
              ></seal-input>
            </a-form-item>
            <a-form-item
              field="environmentId"
              hide-label
              hide-asterisk
              :rules="[
                {
                  required: true,
                  message: $t('common.form.rule.select', {
                    name: $t('workflow.step.form.env')
                  })
                }
              ]"
            >
              <seal-select
                v-model="flow.environmentId"
                :label="$t('workflow.step.form.env')"
                :placeholder="$t('applications.applications.table.module')"
                :required="true"
                :style="{ width: `${InputWidth.LARGE}px` }"
                :options="environmentList"
                :loading="loading"
                allow-search
                @change="handleSelectEnvironment"
              >
              </seal-select>
            </a-form-item>
            <a-form-item field="timeout" hide-label>
              <!-- <seal-select
                v-model="flow.timeout"
                :label="$t('workflow.form.timeout')"
                :required="false"
                :style="{ width: `${InputWidth.LARGE}px` }"
                allow-search
              >
                <a-option
                  v-for="item in workflowTimeoutOptons"
                  :key="item.value"
                  :value="item.value"
                  :label="$t(item.label)"
                ></a-option>
              </seal-select> -->
              <seal-input-number
                v-model="flow.timeout"
                :label="$t('workflow.form.timeout')"
                :required="false"
                :min="1"
                :style="{ width: `${InputWidth.LARGE}px` }"
              >
                <template #suffix>
                  <span>{{ $t('common.time.minute') }}</span>
                </template>
              </seal-input-number>
            </a-form-item>
            <a-form-item field="retryStrategy.limit" hide-label>
              <seal-input-number
                v-model="flow.retryStrategy.limit"
                :label="$t('workflow.task.retry.count')"
                :required="false"
                :min="1"
                :style="{ width: `${InputWidth.LARGE}px` }"
              >
              </seal-input-number>
            </a-form-item>
            <!-- <a-form-item field="retryStrategy.retryPolicy">
              <seal-select
                v-model="flow.retryStrategy.retryPolicy"
                :label="$t('workflow.task.retry.policy')"
                :required="false"
                :style="{ width: `${InputWidth.LARGE}px` }"
                allow-search
                ><a-option
                  v-for="item in retryOptions"
                  :key="item.value"
                  :value="item.value"
                >
                  <a-tooltip
                    :content="`${$t(item.label)}(${$t(item.description)})`"
                  >
                    <span
                      >{{ $t(item.label)
                      }}<span class="m-l-2 font-12 color-text-3">{{
                        `(${$t(item.description)})`
                      }}</span></span
                    >
                  </a-tooltip>
                </a-option>
              </seal-select>
            </a-form-item> -->
          </a-form>
          <ServiceTask
            v-if="taskType === TaskTypes.SERVICE && flow.environmentId"
            v-show="current === steps.length"
            ref="serviceRef"
            :key="flow.environmentId"
            :flow="flow"
            :action="action"
            :flow-step-info="serviceInfo"
            :data-type="ServiceDataType.service"
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
              v-if="current === steps.length && taskType"
              :loading="submitLoading"
              type="primary"
              class="cap-title cancel-btn"
              @click="handleSubmit"
              >{{ $t('common.button.save') }}</a-button
            >
          </template>
          <template #cancel>
            <a-space :size="40">
              <a-button
                v-if="taskType && current < steps.length"
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
        <a-button
          v-if="props.action === 'edit'"
          style="position: absolute; right: 20px; bottom: 20px"
          type="primary"
          status="warning"
          class="cap-title cancel-btn"
          @click="handleDelete"
          >{{ $t('common.button.delete') }}</a-button
        >
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import {
    toRefs,
    reactive,
    ref,
    computed,
    PropType,
    provide,
    nextTick
  } from 'vue';
  import { Resources, Actions } from '@/permissions/config';
  import { useUserStore } from '@/store';
  import useCallCommon from '@/hooks/use-call-common';
  import {
    InputWidth,
    InjectProjectEnvironmentKey,
    InjectSchemaFormStatusKey
  } from '@/views/config';
  import { ListItem } from '@/views/config/interface';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { queryEnvironments } from '@/views/application-management/environments/api';
  import {
    ProvideSetServiceInfoKey,
    ServiceDataType
  } from '@/views/application-management/services/config';
  import ManualCheckpoint from '../task-types/manual-checkpoint.vue';
  import ServiceTask from '../task-types/service-task.vue';
  import TaskCard from '../task-types/task-cards.vue';
  import { TaskTypeList, TaskTypes, stepList } from '../task-types/config';
  import { retryOptions, workflowTimeoutOptons } from '../config';

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

  const TIME_UNIT = 60;
  const emits = defineEmits(['save', 'cancel', 'update:show', 'delete']);
  const userStore = useUserStore();
  const { route, t } = useCallCommon();
  const serviceInfo = reactive({
    enable: false,
    info: null
  });
  const submitLoading = ref(false);
  const current = ref(1);
  const taskType = ref('');
  const taskform = ref();
  const flow: any = reactive({
    projectId: route.params.projectId,
    environmentId: '',
    environmentName: '',
    name: '',
    timeout: null,
    retryStrategy: {
      limit: null,
      retryPolicy: 'Always'
    }
  });
  const serviceRef = ref();
  const manualRef = ref();
  const environmentList = ref<ListItem[]>([]);
  const loading = ref(false);

  provide(ProvideSetServiceInfoKey, serviceInfo);
  provide(InjectSchemaFormStatusKey, props.action);
  provide(InjectProjectEnvironmentKey, {
    projectID: route.params.projectId,
    environmentID: flow.environmentId
  });

  const title = computed(() => {
    if (!taskType.value) {
      return t('workflow.step.modal.title', {
        action: t('common.button.create')
      });
    }
    const task = TaskTypeList.find((item) => item.value === taskType.value);
    const label = task?.title || '';
    return props.action === 'create'
      ? `${t('common.button.create')} - ${label}`
      : `${t('common.button.edit')} - ${label}`;
  });

  const steps = computed(() => {
    return stepList.filter((item) => {
      if (item.taskType) {
        return item.taskType === taskType.value;
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
          value: item.id,
          disabled: !userStore.hasProjectResourceActions({
            projectID: route.params.projectId,
            environmentID: item.id,
            resource: Resources.Environments,
            actions: [Actions.DELETE]
          })
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

  const handleOnNext = async () => {
    if (taskType.value === TaskTypes.SERVICE && current.value === 2) {
      const res = await taskform.value.validate();
      if (res) return;
    }
    current.value = Math.min(steps.value.length, current.value + 1);
  };

  const handleSelectEnvironment = () => {
    const data = environmentList.value.find(
      (item) => item.value === flow.environmentId
    );
    flow.environmentName = data?.label || '';
  };

  const handleSelectTask = (item) => {
    taskType.value = item.value;
    if (taskType.value === TaskTypes.SERVICE) {
      flow.timeout = null;
      getEnvironmentList();
    } else {
      flow.timeout = null;
    }
    handleOnNext();
  };

  const handleCancel = () => {
    emits('update:show', false);
  };

  const handleDelete = () => {
    emits('delete');
  };
  const resetFlow = () => {
    current.value = 1;
    taskType.value = '';
    flow.environmentId = '';
    flow.environmentName = '';
    flow.name = '';
    flow.timeout = null;
    flow.retryStrategy = {
      limit: null,
      retryPolicy: 'Always'
    };

    //  reset service info
    serviceInfo.enable = false;
    serviceInfo.info = null;
  };
  const handleOk = async () => {
    if (current.value !== steps.value.length) {
      return;
    }
    if (taskType.value === TaskTypes.SERVICE) {
      submitLoading.value = true;
      const data = await serviceRef.value?.save();
      if (!data) {
        submitLoading.value = false;
        return;
      }
      submitLoading.value = false;
      let limitInfo: any = flow.retryStrategy;
      if (!limitInfo?.limit) {
        limitInfo = null;
      } else {
        limitInfo = {
          retryStrategy: limitInfo
        };
      }
      const result = {
        type: taskType.value,
        name: flow.name,
        attributes: {
          ...data,
          environment: {
            id: flow.environmentId,
            name: flow.environmentName
          },
          project: {
            id: flow.projectId
          },
          projectID: flow.projectId
        },
        timeout: flow.timeout ? Math.floor(flow.timeout * TIME_UNIT) : null,
        ...limitInfo
      };
      emits('save', result);
    } else if (taskType.value === TaskTypes.APPROVAL) {
      submitLoading.value = true;
      const data = await manualRef.value?.save();
      if (!data) {
        submitLoading.value = false;
        return;
      }
      submitLoading.value = false;
      const result = {
        type: taskType.value,
        name: data.name,
        attributes: {
          ...data
        },
        timeout: flow.timeout ? Math.floor(flow.timeout * TIME_UNIT) : null
      };
      emits('save', result);
    }
  };
  const handleSubmit = () => {
    setTimeout(() => {
      handleOk();
    }, 100);
  };
  const setServiceInfo = () => {
    if (props.action === 'edit' && props.dataInfo.type === TaskTypes.SERVICE) {
      flow.environmentId = props.dataInfo.attributes?.environment?.id;
      flow.environmentName = props.dataInfo.attributes?.environment?.name;
      flow.retryStrategy = _.get(props.dataInfo, 'retryStrategy', {
        limit: null,
        retryPolicy: 'Always'
      });
      flow.timeout = props.dataInfo.timeout
        ? Math.floor(props.dataInfo.timeout / TIME_UNIT)
        : null;
      serviceInfo.info = {
        ..._.cloneDeep(props.dataInfo.attributes)
      };
      serviceInfo.enable = true;
      getEnvironmentList();
    } else if (
      props.action === 'edit' &&
      props.dataInfo.type === TaskTypes.APPROVAL
    ) {
      serviceInfo.enable = false;
      serviceInfo.info = null;
    }
  };
  const initData = () => {
    if (props.action === 'edit') {
      taskType.value = props.dataInfo.type;
      flow.name = props.dataInfo.name;
    } else {
      resetFlow();
    }
    setServiceInfo();
    setTimeout(() => {
      current.value = steps.value.length;
    });
  };
  const handleBeforeOpen = () => {
    initData();
  };

  const handleBeforeClose = () => {};
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
          font-size: var(--font-size-small);
        }

        .arco-steps-icon {
          width: 24px;
          height: 24px;
          font-size: var(--font-size-small);
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
          padding: 20px 26px;
          overflow: auto;
        }
      }
    }
  }
</style>

<script lang="tsx">
  import _ from 'lodash';
  import { validateLabelNameRegx, validateInputLength } from '@/views/config';
  import {
    defineComponent,
    toRefs,
    ref,
    PropType,
    provide,
    computed,
    withModifiers
  } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { deleteModal } from '@/utils/monitor';
  import FlowStep from './flow-step.vue';
  import ParallelButton from './parallel-button.vue';
  import FlowSplitLine from './split-line.vue';
  import CreateFlowTask from './create-flow-task.vue';
  import { Step, Stage } from '../config/interface';

  export default defineComponent({
    emits: ['delete'],
    props: {
      stepList: {
        type: Array as PropType<Step[]>,
        default() {
          return [];
        }
      },
      stageData: {
        type: Object as PropType<Stage>,
        default() {
          return {};
        }
      },
      stageLength: {
        type: Number,
        default() {
          return 0;
        }
      }
    },
    setup(props, { emit }) {
      const { t } = useCallCommon();
      const { stepList, stageData, stageLength } = toRefs(props);
      const hoverable = ref(false);
      const showDelete = ref(false);
      const show = ref(false);
      const nameEditable = ref(false);
      const activeStep = ref({});
      const activeIndex = ref(0);
      const action = ref<'create' | 'edit'>('create');
      const input = ref();
      provide('stageData', stageData);

      const deleteEnabled = computed(() => {
        return stageLength.value > 1 && showDelete.value;
      });
      const handleMouseenter = () => {
        hoverable.value = !!stepList.value.length;
        showDelete.value = true;
      };

      const handleMouseLeave = () => {
        hoverable.value = false;
        showDelete.value = false;
      };

      const handleInputEdit = async () => {
        nameEditable.value = true;
        setTimeout(() => {
          input.value.focus();
        }, 0);
      };

      const handleInputBlur = () => {
        nameEditable.value = !stageData.value.name;
      };

      const renderModal = () => {
        return (
          <CreateFlowTask show={show.value} dataInfo={{}}></CreateFlowTask>
        );
      };

      const handleAddParallel = () => {
        action.value = 'create';
        setTimeout(() => {
          show.value = true;
        }, 100);
      };

      const handleSaveFlowTask = (data) => {
        if (action.value === 'create') {
          stepList.value.push(_.cloneDeep(data));
        } else {
          stepList.value.splice(activeIndex.value, 1, _.cloneDeep(data));
        }
        setTimeout(() => {
          show.value = false;
        }, 100);
      };
      const handleInsertNext = (index) => {
        const data = _.cloneDeep(stepList.value[index]);
        stepList.value.splice(index + 1, 0, data);
      };

      const handleInsertPrev = (index) => {
        const data = _.cloneDeep(stepList.value[index]);
        stepList.value.splice(index, 0, data);
      };

      const handleDeleteStage = () => {
        emit('delete');
      };
      const handleEditTask = (index) => {
        const item = stepList.value[index];
        action.value = 'edit';
        activeStep.value = _.cloneDeep(item);
        activeIndex.value = index;
        setTimeout(() => {
          show.value = true;
        }, 100);
      };

      const handleDeleteTask = () => {
        deleteModal({
          onOk() {
            stepList.value.splice(activeIndex.value, 1);
            show.value = false;
          }
        });
      };
      const handleInputStageName = (val) => {
        stageData.value.name = _.trim(val);
      };

      // render serial steps
      const renderSteps = () => {
        if (!stepList.value.length) return null;
        const isSerialSteps = _.some(stepList.value, (item) => {
          return !!_.get(item, 'when');
        });
        console.log('isSerialSteps', isSerialSteps);
        if (isSerialSteps) {
          return (
            <FlowStep
              stepList={stepList.value}
              isSerial={true}
              onInsertNext={(idx) => handleInsertNext(idx)}
              onInsertPrev={(idx) => handleInsertPrev(idx)}
              onEdit={(idx) => handleEditTask(idx)}
              hoverable={hoverable.value}
            ></FlowStep>
          );
        }
        return stepList.value.map((item, index) => {
          return (
            <>
              <FlowStep
                key={index}
                isSerial={false}
                onInsertNext={(idx) => handleInsertNext(idx)}
                onInsertPrev={(idx) => handleInsertPrev(idx)}
                onEdit={(idx) => handleEditTask(idx)}
                step-data={item}
                stepList={stepList.value}
                index={index}
                position={
                  index === stepList.value.length - 1 &&
                  !hoverable.value &&
                  stepList.value.length > 1
                    ? 'last'
                    : 'middle'
                }
              ></FlowStep>
            </>
          );
        });
      };
      return () => (
        <div
          class="flow-stage"
          onMouseenter={() => handleMouseenter()}
          onMouseleave={() => handleMouseLeave()}
        >
          <div class="stage-header">
            <div class="flex">
              {nameEditable.value ? (
                <a-input
                  model-value={stageData.value.name}
                  onUpdate:modelValue={withModifiers(
                    (val) => {
                      handleInputStageName(val);
                    },
                    ['trim']
                  )}
                  size="small"
                  ref={input}
                  error={!stageData.value.name}
                  max-length={validateInputLength.NAME}
                  show-word-limit={true}
                  class={[{ 'border-less': !nameEditable.value }]}
                  onKeydown={(e) => {
                    if (e.keyCode === 13) {
                      input.value.blur();
                    }
                  }}
                  onBlur={() => handleInputBlur()}
                ></a-input>
              ) : (
                <>
                  <div class="title">{stageData.value.name}</div>
                  <a-link class="mleft-5">
                    <icon-edit onClick={() => handleInputEdit()} />
                  </a-link>
                </>
              )}
              {!stageData.value.name ? (
                <span class="error-msg">
                  {t('workflow.form.rules.stagename')}
                </span>
              ) : null}
            </div>
            {deleteEnabled.value ? (
              <a-link
                status="danger"
                class="mleft-5"
                onClick={() => handleDeleteStage()}
              >
                <icon-delete />
              </a-link>
            ) : (
              <span class="mleft-5 btn-holder"></span>
            )}
          </div>
          <div class="stage-steps flex">
            <div class="stage-content">
              {renderSteps()}
              {(hoverable.value || !stepList.value.length) && (
                <ParallelButton
                  btn-text={
                    !stepList.value.length
                      ? t('workflow.stage.add.task')
                      : t('workflow.stage.add.paratask')
                  }
                  position="middle"
                  class={[{ 'non-step': !hoverable.value }]}
                  onAddParallel={() => handleAddParallel()}
                ></ParallelButton>
              )}
            </div>
            <FlowSplitLine
              btnText="add step"
              position="middle"
              type="internal"
            ></FlowSplitLine>
          </div>
          <CreateFlowTask
            v-model:show={show.value}
            v-model:dataInfo={activeStep.value}
            onSave={handleSaveFlowTask}
            onDelete={handleDeleteTask}
            action={action.value}
          ></CreateFlowTask>
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .flow-stage {
    padding-top: 4px;
    overflow-y: auto;

    .stage-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 40px;
      color: var(--color-text-3);
      font-size: var(--font-size-small);

      .btn-holder {
        padding: 8px 11px;
      }

      .flex {
        position: relative;

        .error-msg {
          position: absolute;
          bottom: -16px;
          left: 0;
          width: max-content;
          color: rgb(var(--danger-6));
        }
      }

      .title {
        height: 28px;
        font-weight: var(--font-weight-medium);
        line-height: 28px;
      }

      :deep(.arco-input) {
        height: 26px;
        font-weight: var(--font-weight-medium);
        font-size: var(--font-size-small);
      }

      .arco-icon {
        stroke-width: 4;
      }
    }

    .stage-content {
      :deep(.flow-step) {
        &:first-child {
          &::before {
            border-right: 0;
            border-left: 0;
          }
        }
      }
    }
  }
</style>

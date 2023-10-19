<script lang="tsx">
  import _ from 'lodash';
  import { validateLabelNameRegx } from '@/views/config';
  import { defineComponent, toRefs, ref, PropType, provide } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import { deleteModal } from '@/utils/monitor';
  import FlowStep from './flow-step.vue';
  import ParallelButton from './parallel-button.vue';
  import CreateFlowTask from './create-flow-task.vue';
  import { Step, Stage } from '../config/interface';
  import { stepSchema, stageSchema } from '../config';

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
      }
    },
    setup(props, { emit }) {
      const { t } = useCallCommon();
      const { stepList, stageData } = toRefs(props);
      const hoverable = ref(false);
      const showDelete = ref(false);
      const show = ref(false);
      const nameEditable = ref(false);
      const activeStep = ref({});
      const activeIndex = ref(0);
      const action = ref<'create' | 'edit'>('create');
      const input = ref();
      const valid = ref(false);
      provide('stageData', stageData);

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
        valid.value = validateLabelNameRegx.test(stageData.value.name);
        if (valid.value) {
          nameEditable.value = false;
        }
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
        });
      };

      const handleSaveFlowTask = (data) => {
        if (action.value === 'create') {
          stepList.value.push(_.cloneDeep(data));
        } else {
          stepList.value.splice(activeIndex.value, 1, _.cloneDeep(data));
        }
        show.value = false;
      };
      const handleInsertNext = (index) => {};

      const handleInsertPrev = (index) => {};

      const handleDeleteStage = () => {
        emit('delete');
      };
      const handleEditTask = (item, index) => {
        action.value = 'edit';
        activeStep.value = item;
        activeIndex.value = index;
        setTimeout(() => {
          show.value = true;
        });
      };

      const handleDeleteTask = () => {
        deleteModal({
          onOk() {
            stepList.value.splice(activeIndex.value, 1);
            show.value = false;
          }
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
                  v-model={stageData.value.name}
                  size="small"
                  ref={input}
                  error={!valid.value}
                  max-length={63}
                  show-word-limit={true}
                  class={[{ 'border-less': !nameEditable.value }]}
                  onBlur={() => handleInputBlur()}
                  v-slots={{
                    prefix: () => (
                      <a-tooltip content={t('common.validate.labelName')}>
                        <i class="iconfont icon-ic-exclamation-circle color-text-3"></i>
                      </a-tooltip>
                    )
                  }}
                ></a-input>
              ) : (
                <>
                  <div class="title">{stageData.value.name}</div>
                  <a-link class="mleft-5">
                    <icon-edit onClick={() => handleInputEdit()} />
                  </a-link>
                </>
              )}
            </div>
            {showDelete.value ? (
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
          <div class="stage-content">
            {stepList.value.length ? (
              stepList.value.map((item, index) => {
                return (
                  <>
                    <FlowStep
                      key={index}
                      onInsertNext={() => handleInsertNext(index)}
                      onInsertPrev={() => handleInsertPrev(index)}
                      onEdit={() => handleEditTask(item, index)}
                      step-data={item}
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
              })
            ) : (
              <ParallelButton
                btn-text={t('workflow.stage.add.task')}
                position="last"
                class={['non-step']}
                onAddParallel={() => handleAddParallel()}
              ></ParallelButton>
            )}
            {hoverable.value ? (
              <ParallelButton
                btn-text={t('workflow.stage.add.paratask')}
                position="last"
                onAddParallel={() => handleAddParallel()}
              ></ParallelButton>
            ) : null}
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
      font-size: 14px;

      .btn-holder {
        padding: 8px 11px;
      }

      .title {
        height: 28px;
        line-height: 28px;
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

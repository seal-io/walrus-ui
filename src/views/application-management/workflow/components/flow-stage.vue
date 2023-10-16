<script lang="tsx">
  import _ from 'lodash';
  import {
    defineComponent,
    toRefs,
    ref,
    PropType,
    provide,
    nextTick
  } from 'vue';
  import FlowStep from './flow-step.vue';
  import ParallelButton from './parallel-button.vue';
  import CreateFlowTask from './create-flow-task.vue';
  import { Step, Stage } from '../config/interface';
  import { stepSchema, stageSchema } from '../config';

  export default defineComponent({
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
    setup(props) {
      const { stepList, stageData } = toRefs(props);
      const hoverable = ref(false);
      const show = ref(false);
      const nameEditable = ref(false);
      const activeStep = ref({});
      const input = ref();
      provide('stageData', stageData);

      const handleMouseenter = () => {
        hoverable.value = !!stepList.value.length;
      };

      const handleMouseLeave = () => {
        hoverable.value = false;
      };

      const handleInputEdit = async () => {
        nameEditable.value = true;
        setTimeout(() => {
          input.value.focus();
        }, 0);
      };

      const handleInputBlur = () => {
        nameEditable.value = false;
      };

      const renderModal = () => {
        return (
          <CreateFlowTask show={show.value} dataInfo={{}}></CreateFlowTask>
        );
      };

      const handleAddParallel = () => {
        show.value = true;
      };

      const handleSaveFlowTask = (data) => {
        stepList.value.push(_.cloneDeep(data));
        show.value = false;
      };
      const handleInsertNext = (index) => {};

      const handleInsertPrev = (index) => {};

      const handleEditTask = (item) => {
        show.value = true;
        activeStep.value = item;
      };

      return () => (
        <div
          class="flow-stage"
          onMouseenter={() => handleMouseenter()}
          onMouseleave={() => handleMouseLeave()}
        >
          <div class="stage-header">
            {nameEditable.value ? (
              <a-input
                v-model={stageData.value.name}
                size="small"
                ref={input}
                class={[{ 'border-less': !nameEditable.value }]}
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
                      onEdit={() => handleEditTask(item)}
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
                btn-text="添加任务"
                position="last"
                class={['non-step']}
                onAddParallel={() => handleAddParallel()}
              ></ParallelButton>
            )}
            {hoverable.value ? (
              <ParallelButton
                btn-text="并行任务"
                position="last"
                onAddParallel={() => handleAddParallel()}
              ></ParallelButton>
            ) : null}
          </div>
          <CreateFlowTask
            v-model:show={show.value}
            onSave={handleSaveFlowTask}
            dataInfo={activeStep.value}
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
      margin-bottom: 40px;
      color: var(--color-text-3);
      font-size: 14px;

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

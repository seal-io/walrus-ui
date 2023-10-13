<script lang="tsx">
  import _ from 'lodash';
  import { defineComponent, toRefs, ref, PropType, provide } from 'vue';
  import FlowStep from './flow-step.vue';
  import ParallelButton from './parallel-button.vue';
  import CreateTask from './create-task.vue';
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
      provide('stageData', stageData);
      const handleInputStageName = (e) => {
        stageData.value.name = e.target.innerText;
      };

      const handleMouseenter = () => {
        hoverable.value = !!stepList.value.length;
      };

      const handleMouseLeave = () => {
        hoverable.value = false;
      };

      const renderModal = () => {
        return <CreateTask show={show.value} dataInfo={{}}></CreateTask>;
      };

      const handleAddParallel = () => {
        show.value = true;

        stepList.value.push(_.cloneDeep(stepSchema));
      };

      const handleInsertNext = (index) => {};

      const handleInsertPrev = (index) => {};

      return () => (
        <div
          class="flow-stage"
          onMouseenter={() => handleMouseenter()}
          onMouseleave={() => handleMouseLeave()}
        >
          <div class="stage-header">
            <div contenteditable onInput={(e) => handleInputStageName(e)}>
              {stageData.value.name}
            </div>
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
          <CreateTask v-model:show={show.value} dataInfo={{}}></CreateTask>
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .flow-stage {
    padding-top: 16px;
    overflow-y: auto;

    .stage-header {
      margin-bottom: 40px;
      color: var(--color-text-3);
      font-size: 14px;
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

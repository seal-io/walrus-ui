<script lang="tsx">
  import { defineComponent, toRefs, ref } from 'vue';
  import FlowStep from './flow-step.vue';
  import ParallelButton from './parallel-button.vue';
  import CreateTask from './create-task.vue';

  export default defineComponent({
    setup(props) {
      const list = ref([]);
      const stageName = ref('新阶段');
      const hoverable = ref(false);
      const show = ref(false);

      const handleInputStageName = (e) => {
        stageName.value = e.target.innerText;
      };

      const handleMouseenter = () => {
        hoverable.value = !!list.value.length;
      };

      const handleMouseLeave = () => {
        hoverable.value = false;
      };

      const renderModal = () => {
        return (
          <CreateTask
            show={show.value}
            title="新建任务"
            dataInfo={{}}
          ></CreateTask>
        );
      };

      const handleAddParallel = () => {
        show.value = true;

        list.value.push(1);
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
              {stageName.value}
            </div>
          </div>
          <div class="stage-content">
            {list.value.length ? (
              list.value.map((item, index) => {
                return (
                  <>
                    <FlowStep
                      key={index}
                      onInsertNext={() => handleInsertNext(index)}
                      onInsertPrev={() => handleInsertPrev(index)}
                      position={
                        index === list.value.length - 1 &&
                        !hoverable.value &&
                        list.value.length > 1
                          ? 'last'
                          : 'middle'
                      }
                    ></FlowStep>
                  </>
                );
              })
            ) : (
              <ParallelButton
                btn-text="任务"
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

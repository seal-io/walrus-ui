<script lang="tsx">
  import { defineComponent, toRefs, ref, onMounted, onUnmounted } from 'vue';
  import FlowStep from './flow-step.vue';
  import ParallelButton from './parallel-button.vue';

  export default defineComponent({
    setup(props) {
      const list = ref([1]);
      const stageName = ref('新阶段');
      const hoverable = ref(false);

      const handleInputStageName = (e) => {
        stageName.value = e.target.innerText;
      };

      const handleMouseenter = () => {
        hoverable.value = !!list.value.length;
      };

      const handleMouseLeave = () => {
        hoverable.value = false;
      };

      const handleAddParallel = () => {
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
              <FlowStep
                onAddTask={() => handleAddParallel()}
                position="middle"
              ></FlowStep>
            )}
            {hoverable.value ? (
              <ParallelButton
                position="last"
                onAddParallel={() => handleAddParallel()}
              ></ParallelButton>
            ) : null}
          </div>
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

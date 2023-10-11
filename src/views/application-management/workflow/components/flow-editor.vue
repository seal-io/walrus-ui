<script lang="tsx">
  import { defineComponent, toRefs, ref } from 'vue';
  import Draggable from 'vuedraggable';
  import FlowStage from './flow-stage.vue';
  import FlowSplitLine from './split-line.vue';
  import FlowAside from './flow-aside.vue';

  export default defineComponent({
    props: {
      height: {
        type: [Number, String],
        default() {
          return '100%';
        }
      }
    },
    setup(props) {
      const { height } = toRefs(props);
      const list = ref([1]);
      const drag = ref(false);

      const setPosition = (index, list) => {
        if (index === 0) {
          return 'first';
        }
        return 'middle';
      };

      const handleInsertStagePrev = (index) => {
        list.value.splice(index, 0, 1);
      };

      const handleInsertStageNext = (index) => {
        list.value.splice(index + 1, 0, 1);
      };

      const handleDragStart = () => {
        drag.value = true;
      };

      const handleDragEnd = () => {
        drag.value = false;
        console.log('drag end 2');
      };

      const renderFlowContent = (data) => {
        const { element, index } = data;
        return (
          <div class="flow-content-group">
            <FlowSplitLine
              onAddStage={() => handleInsertStagePrev(index)}
              position={setPosition(index, list.value)}
            ></FlowSplitLine>
            <FlowStage></FlowStage>
            {index === list.value.length - 1 ? (
              <FlowSplitLine
                onAddStage={() => handleInsertStageNext(index)}
                position="last"
              ></FlowSplitLine>
            ) : null}
          </div>
        );
      };

      // use in no drag
      const renderStage = () => {
        return list.value.map((element, index) => {
          return renderFlowContent({ element, index });
        });
      };

      const content = () => {
        return (
          <Draggable
            style={{ display: 'flex' }}
            v-model={list.value}
            item-key="id"
            onStart={() => handleDragStart()}
            onEnd={() => handleDragEnd()}
            v-slots={{
              item: (data) => {
                return renderFlowContent(data);
              }
            }}
          ></Draggable>
        );
      };

      return () => (
        <div class="flow-wrapper" style={{ height: height.value }}>
          <div class="flow-side">
            <FlowAside></FlowAside>
          </div>
          <div class="flow-content">{content()}</div>
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .flow-wrapper {
    display: flex;
    overflow-x: auto;

    .flow-side {
      flex-basis: 200px;
      height: 100%;
      padding: 16px 0;
    }

    .flow-content {
      display: flex;

      .flow-content-group {
        display: flex;
      }
    }
  }
</style>

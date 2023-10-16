<script lang="tsx">
  import _ from 'lodash';
  import { defineComponent, toRefs, ref } from 'vue';
  import Draggable from 'vuedraggable';
  import dayjs from 'dayjs';
  import i18n from '@/locale';
  import FlowStage from './flow-stage.vue';
  import FlowSplitLine from './split-line.vue';
  import FlowAside from './flow-aside.vue';
  import BasicInfo from './basic-info.vue';
  import { Stage } from '../config/interface';
  import { stageSchema } from '../config';

  export default defineComponent({
    props: {
      height: {
        type: [Number, String],
        default() {
          return '100%';
        }
      }
    },
    setup(props, { expose }) {
      const { t } = i18n.global;
      const { height } = toRefs(props);
      const show = ref(false);
      const flowBasic = ref({
        displayName: `pipeline-${dayjs().format('YYYYMMDDHHmmss')}`,
        name: `pipeline-ID-${dayjs().format('YYYYMMDDHHmmss')}`,
        type: 'default',
        description: '',
        parallelism: 0
      });
      const stageList = ref<Stage[]>([]);
      const drag = ref(false);

      const setPosition = (index, list) => {
        if (index === 0) {
          return 'first';
        }
        return 'middle';
      };

      const handleEditBasicInfo = () => {
        show.value = true;
      };
      const handleInsertStagePrev = (index) => {
        stageList.value.splice(
          index,
          0,
          _.cloneDeep({ ...stageSchema, name: '新阶段' })
        );
      };

      const handleInsertStageNext = (index) => {
        stageList.value.splice(
          index + 1,
          0,
          _.cloneDeep({ ...stageSchema, name: '新阶段' })
        );
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
              position={setPosition(index, stageList.value)}
            ></FlowSplitLine>
            <FlowStage stepList={element.steps} stageData={element}></FlowStage>
            {index === stageList.value.length - 1 ? (
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
        return stageList.value.map((element, index) => {
          return renderFlowContent({ element, index });
        });
      };

      const getData = () => {
        return {
          stages: stageList.value,
          basic: flowBasic.value
        };
      };

      const content = () => {
        return (
          <Draggable
            style={{ display: 'flex' }}
            v-model={stageList.value}
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

      const initData = () => {
        if (!stageList.value.length) {
          stageList.value.push(_.cloneDeep({ ...stageSchema, name: '新阶段' }));
        }
      };

      expose({
        getData
      });

      initData();
      return () => (
        <div class="flow-wrapper" style={{ height: height.value }}>
          <div class="flow-side">
            <FlowAside
              basicInfo={flowBasic}
              onEdit={() => handleEditBasicInfo()}
            ></FlowAside>
          </div>
          <div class="flow-content">{renderStage()}</div>
          <BasicInfo
            v-model:dataInfo={flowBasic.value}
            v-model:show={show.value}
          ></BasicInfo>
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
      padding: 12px 0 16px 0;
    }

    .flow-content {
      display: flex;

      .flow-content-group {
        display: flex;
      }
    }
  }
</style>

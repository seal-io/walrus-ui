<script lang="tsx">
  import _ from 'lodash';
  import { defineComponent, toRefs, ref } from 'vue';
  // import Draggable from 'vuedraggable';
  import useCallCommon from '@/hooks/use-call-common';
  import dayjs from 'dayjs';
  import FlowStage from './flow-stage.vue';
  import FlowSplitLine from './split-line.vue';
  import FlowAside from './flow-aside.vue';
  import BasicInfo from './basic-info.vue';
  import { Stage } from '../config/interface';
  import { stageSchema } from '../config';
  import { queryPipelineDetail } from '../api';

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
      const { t, route } = useCallCommon();
      const id = route.query.pid as string;
      const { height } = toRefs(props);
      const show = ref(false);
      const loading = ref(false);
      const flowBasic = ref({
        displayName: `pipeline-${dayjs().format('YYYYMMDDHHmmss')}`,
        name: `pipeline-id-${dayjs().format('YYYYMMDDHHmmss')}`,
        type: 'default',
        description: '',
        parallelism: 1
      });
      const stageList = ref<Stage[]>([]);
      const drag = ref(false);

      const getPipelineDetail = async () => {
        if (!id) return null;
        try {
          loading.value = true;
          const { data } = await queryPipelineDetail({ id });
          return data;
        } catch (error) {
          // eslint-disable-next-line no-console
        } finally {
          loading.value = false;
        }
        return null;
      };
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
          _.cloneDeep({ ...stageSchema, name: t('workflow.stage.add.title') })
        );
      };

      const handleInsertStageNext = (index) => {
        stageList.value.splice(
          index + 1,
          0,
          _.cloneDeep({ ...stageSchema, name: t('workflow.stage.add.title') })
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

      // const content = () => {
      //   return (
      //     <Draggable
      //       style={{ display: 'flex' }}
      //       v-model={stageList.value}
      //       item-key="id"
      //       onStart={() => handleDragStart()}
      //       onEnd={() => handleDragEnd()}
      //       v-slots={{
      //         item: (data) => {
      //           return renderFlowContent(data);
      //         }
      //       }}
      //     ></Draggable>
      //   );
      // };

      const initData = async () => {
        const data = await getPipelineDetail();
        if (data) {
          flowBasic.value = _.cloneDeep(_.omit(data, ['stages']));
          stageList.value = _.cloneDeep(data.stages || []);
        }
        if (!stageList.value.length) {
          stageList.value.push(
            _.cloneDeep({ ...stageSchema, name: t('workflow.stage.add.title') })
          );
        }
      };

      expose({
        getData
      });

      initData();

      return () => (
        <a-spin loading={loading.value} fill>
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
        </a-spin>
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

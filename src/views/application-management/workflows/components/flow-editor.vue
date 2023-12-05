<script lang="tsx">
  import _ from 'lodash';
  import { defineComponent, toRefs, ref } from 'vue';
  import { validateLabelNameRegx } from '@/views/config';
  import useCallCommon from '@/hooks/use-call-common';
  import { deleteModal, execError } from '@/utils/monitor';
  import FlowStage from './flow-stage.vue';
  import FlowSplitLine from './split-line.vue';
  import { Stage } from '../config/interface';
  import { stageSchema, workflowTimeoutOptons } from '../config';
  import { queryPipelineDetail } from '../api';
  import VariableList from './variable-list.vue';

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
      const TIME_UNIT = 60;
      const { t, route } = useCallCommon();
      const id = route.query.flowId as string;
      const { height } = toRefs(props);
      const formref = ref();
      const show = ref(false);
      const loading = ref(false);
      const unfold = ref(true);

      const flowBasic = ref<any>({
        name: '',
        type: 'default',
        description: '',
        parallelism: 10,
        timeout: null,
        variables: []
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

      const handleToggleForm = () => {
        unfold.value = !unfold.value;
        console.log('formref===', formref.value);
      };
      const handleInsertStagePrev = (index) => {
        stageList.value.splice(
          index,
          0,
          _.cloneDeep({
            ...stageSchema,
            name: t('workflow.stage.add.title', {
              order: stageList.value.length + 1
            })
          })
        );
      };

      const handleInsertStageNext = (index) => {
        stageList.value.splice(
          index + 1,
          0,
          _.cloneDeep({
            ...stageSchema,
            name: t('workflow.stage.add.title', {
              order: stageList.value.length + 1
            })
          })
        );
      };

      const handleDeleteStage = (index) => {
        deleteModal({
          onOk() {
            stageList.value.splice(index, 1);
          }
        });
      };

      const renderFlowContent = (data) => {
        const { element, index } = data;
        return (
          <div class="flow-content-group">
            <FlowSplitLine
              onAddStage={() => handleInsertStagePrev(index)}
              position={setPosition(index, stageList.value)}
            ></FlowSplitLine>
            <FlowStage
              stepList={element.steps}
              stageData={element}
              stageLength={stageList.value.length}
              onDelete={() => handleDeleteStage(index)}
            ></FlowStage>
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

      const getData = async () => {
        const res = await formref.value.validate();
        const stages = _.filter(stageList.value, (item) => !!item.steps.length);
        if (!stages.length) {
          execError('workflow.task.run.stage');
          return null;
        }
        if (res) return null;
        return {
          stages,
          basic: {
            ...flowBasic.value,
            timeout: Math.floor(flowBasic.value?.timeout * TIME_UNIT)
          }
        };
      };

      const initData = async () => {
        const data = await getPipelineDetail();
        if (data) {
          flowBasic.value = _.cloneDeep(_.omit(data, ['stages']));
          flowBasic.value.timeout = flowBasic.value.timeout
            ? Math.floor(flowBasic.value.timeout / TIME_UNIT)
            : null;
          stageList.value = _.cloneDeep(data.stages || []);
        }
        if (!stageList.value.length) {
          stageList.value.push(
            _.cloneDeep({
              ...stageSchema,
              name: t('workflow.stage.add.title', { order: 1 })
            })
          );
        }
      };

      expose({
        getData
      });

      initData();

      return () => (
        <a-spin loading={loading.value} fill style="width: 100%">
          <div class="flow-wrapper" style={{ height: height.value }}>
            <div class="flow-side">
              <div class="form-box">
                <div class="title">
                  {unfold.value ? (
                    <span>{t('common.title.basicInfo')}</span>
                  ) : null}
                  <a-link type="text" onClick={() => handleToggleForm()}>
                    <icon-menu-fold class="size-18" />
                  </a-link>
                </div>
                <div
                  style={{
                    width: unfold.value ? '100%' : '0px',
                    overflow: 'hidden',
                    transition: 'width 0.3s'
                  }}
                >
                  <a-form
                    style={{ width: '460px' }}
                    model={flowBasic.value}
                    layout="vertical"
                    ref={formref}
                  >
                    <a-form-item
                      field="name"
                      hide-label
                      validate-trigger="change"
                      rules={[
                        {
                          required: true,
                          match: validateLabelNameRegx,
                          message: t('common.validate.labelName')
                        }
                      ]}
                      v-slots={{
                        extra: () => (
                          <span class="tips">
                            {t('common.validate.labelName')}
                          </span>
                        )
                      }}
                    >
                      <seal-input
                        v-model={flowBasic.value.name}
                        label={t('common.table.name')}
                        style={{ width: '100%' }}
                        required={true}
                        disabled={!!id}
                        max-length={63}
                        show-word-limit
                      ></seal-input>
                    </a-form-item>
                    <a-form-item
                      field="timeout"
                      hide-label
                      validate-trigger="change"
                    >
                      <seal-input-number
                        v-model={flowBasic.value.timeout}
                        label={t('workflow.form.timeout')}
                        min={0}
                        style={{ width: '100%' }}
                        required={false}
                        hide-button={false}
                        v-slots={{
                          suffix: () => {
                            return <span>{t('common.time.minute')}</span>;
                          }
                        }}
                      ></seal-input-number>
                    </a-form-item>
                    <a-form-item
                      field="parallelism"
                      hide-label
                      validate-trigger="change"
                    >
                      <seal-input-number
                        v-model={flowBasic.value.parallelism}
                        style={{ width: '100%' }}
                        label={t('workflow.stage.add.parallelism')}
                        min={0}
                        required={false}
                        hide-button={false}
                      ></seal-input-number>
                    </a-form-item>
                    <a-form-item hide-label field="description">
                      <seal-textarea
                        v-model={flowBasic.value.description}
                        label={t('common.table.description')}
                        max-length={200}
                        show-word-limit
                        style={{ width: '100%' }}
                        auto-size={{ minRows: 4, maxRows: 6 }}
                      ></seal-textarea>
                    </a-form-item>
                    <VariableList
                      v-model:variables={flowBasic.value.variables}
                    ></VariableList>
                  </a-form>
                </div>
              </div>
            </div>
            <div class="flow-content">{renderStage()}</div>
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
      height: 100%;
      padding: 0 16px 0 0;
      box-shadow: 0 2px 4px var(--color-border-3);

      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        font-weight: 500;
      }
    }

    .flow-content {
      display: flex;
      flex: 1;
      overflow-x: auto;

      .flow-content-group {
        display: flex;
      }
    }
  }
</style>

<script lang="tsx">
  import { defineComponent, ref, computed, provide, watch } from 'vue';
  import _ from 'lodash';
  import i18n from '@/locale';
  import {
    validateLabelNameRegx,
    validateInputLength,
    HintKeyMaps
  } from '@/views/config';
  import useCallCommon from '@/hooks/use-call-common';
  import VariableList from '../../components/variable-list.vue';
  import { InjectWorkflowKey } from '../../config';

  export default defineComponent({
    props: {
      basicInfo: {
        type: Object,
        default: () => ({})
      }
    },
    setup(props, { expose }) {
      const { route } = useCallCommon();
      const { t } = i18n.global;
      const formref = ref();
      const unfold = ref(true);
      const uid = route.query.uid as string;
      const flowBasic = ref<any>({
        name: '',
        type: 'default',
        description: '',
        parallelism: 10,
        timeout: null,
        variables: []
      });

      const workflowVariables = computed(() => {
        const list = _.map(flowBasic.value.variables, (item) => {
          return {
            label: item.name,
            value: item.name
          };
        });
        return {
          [HintKeyMaps.workflow]: {
            var: list
          }
        };
      });

      provide(InjectWorkflowKey, workflowVariables);

      const handleToggleForm = () => {
        unfold.value = !unfold.value;
      };

      const validate = async () => {
        const res = await formref.value.validate();
        return res;
      };
      watch(
        () => props.basicInfo,
        (val) => {
          flowBasic.value = val;
        },
        {
          immediate: true
        }
      );

      expose({
        validate,
        flowBasic
      });

      return () => (
        <div class="flow-side">
          <div class="form-box">
            <div class="title">
              {unfold.value ? <span>{t('common.title.basicInfo')}</span> : null}
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
                ref={(el) => {
                  formref.value = el;
                }}
              >
                <a-form-item
                  field="name"
                  hide-label
                  validate-trigger={['change', 'input']}
                  rules={[
                    {
                      required: true,
                      message: t('common.rule.name')
                    },
                    {
                      required: true,
                      match: validateLabelNameRegx,
                      message: t('common.validate.labelName')
                    }
                  ]}
                >
                  <seal-input
                    v-model={flowBasic.value.name}
                    label={t('common.table.name')}
                    style={{ width: '100%' }}
                    required={true}
                    disabled={!!uid}
                    max-length={validateInputLength.NAME}
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
      );
    }
  });
</script>

<style lang="less" scoped>
  .flow-side {
    height: 100%;
    padding: 0 16px 0 0;
    // box-shadow: 0 2px 4px var(--color-border-3);
    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      font-weight: var(--font-weight-medium);
    }
  }
</style>

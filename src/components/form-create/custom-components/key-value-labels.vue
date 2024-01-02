<script lang="tsx">
  import _ from 'lodash';
  import { InputWidth, PageAction } from '@/views/config';
  import {
    defineComponent,
    PropType,
    ref,
    watchEffect,
    toRefs,
    watch
  } from 'vue';
  import XInputGroup from './x-input-group.vue';
  import useLabelsActions from '../hooks/use-labels-action';
  import LabelsList from './labels-list.vue';

  export default defineComponent({
    emits: ['update:value'],
    props: {
      labels: {
        type: Object as PropType<Record<string, any>>,
        default() {
          return {};
        }
      },
      labelsKey: {
        type: [String, Array] as PropType<string | string[]>,
        default() {
          return 'labels';
        }
      },
      value: {
        type: Object as PropType<Record<string, any>>,
        default() {
          return {};
        }
      },
      validateTrigger: {
        type: Boolean,
        default() {
          return false;
        }
      },
      readonly: {
        type: Boolean,
        default() {
          return false;
        }
      },
      showNumberInput: {
        type: Boolean,
        default() {
          return false;
        }
      },
      showCheckbox: {
        type: Boolean,
        default() {
          return false;
        }
      },
      pageAction: {
        type: String,
        default() {
          return PageAction.EDIT;
        }
      },
      editorId: {
        type: String,
        default() {
          return 'field';
        }
      },
      width: {
        type: Number,
        default() {
          return InputWidth.MIDDLE;
        }
      }
    },
    setup(props, { emit, attrs }) {
      const { labels, labelsKey, validateTrigger } = toRefs(props);
      const {
        labelList,
        labelItem,
        handleAddLabel,
        handleDeleteLabel,
        getLabelList
      } = useLabelsActions(labels, labelsKey.value);
      const handleUpdateValue = (obj) => {
        emit('update:value', obj);
      };

      watch(
        () => props.labels,
        (val) => {
          getLabelList();
        },
        {
          immediate: true,
          deep: true
        }
      );
      const renderEditLabels = () => {
        return (
          <>
            {labelList.value.length ? (
              <a-space
                style={{
                  'display': 'flex',
                  'flex-direction': 'column'
                }}
                direction="vertical"
              >
                {_.map(labelList.value, (sItem, sIndex) => {
                  return (
                    <XInputGroup
                      key={sIndex}
                      v-bind={attrs}
                      v-model:dataKey={sItem.key}
                      v-model:dataValue={sItem.value}
                      readonly={props.readonly}
                      onUpdate:value={(val) => handleUpdateValue(val)}
                      trigger-validate={validateTrigger.value}
                      label-list={labelList.value}
                      position={sIndex}
                      always-delete={true}
                      showCheckbox={props.showCheckbox}
                      should-key={true}
                      formId={props.editorId}
                      onAdd={(obj) => {
                        handleAddLabel(obj, labelList.value);
                      }}
                      onDelete={() =>
                        handleDeleteLabel(labelList.value, sIndex)
                      }
                    ></XInputGroup>
                  );
                })}
              </a-space>
            ) : (
              <a-link>
                <icon-plus-circle-fill
                  size={24}
                  font-size="14px size-24"
                  onClick={() => {
                    handleAddLabel(labelItem, labelList.value);
                  }}
                ></icon-plus-circle-fill>
              </a-link>
            )}
          </>
        );
      };
      const renderViewLabels = () => {
        return <LabelsList labels={props.value}></LabelsList>;
      };
      return () => (
        <>
          {props.pageAction === PageAction.EDIT
            ? renderEditLabels()
            : renderViewLabels()}
        </>
      );
    }
  });
</script>

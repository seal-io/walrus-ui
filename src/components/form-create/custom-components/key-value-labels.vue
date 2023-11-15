<script lang="tsx">
  import _ from 'lodash';
  import { InputWidth, PageAction } from '@/views/config';
  import { defineComponent, PropType, ref, watchEffect, toRefs } from 'vue';
  import ThumbButton from '@/components/buttons/thumb-button.vue';
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
        type: String,
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
      width: {
        type: Number,
        default() {
          return InputWidth.MIDDLE;
        }
      }
    },
    setup(props, { emit, attrs }) {
      const { labels, labelsKey, validateTrigger } = toRefs(props);
      const { labelList, labelItem, handleAddLabel, handleDeleteLabel } =
        useLabelsActions(labels, labelsKey.value);
      const handleUpdateValue = (obj) => {
        emit('update:value', obj);
      };
      const renderEditLabels = () => {
        return (
          <>
            {labelList.value.length ? (
              <a-space
                style={{
                  'display': 'flex',
                  'flex-direction': 'column',
                  'width': `${props.width ? props.width : InputWidth.MIDDLE}px`
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
                      onUpdate:value={(val) => handleUpdateValue(val)}
                      trigger-validate={validateTrigger.value}
                      label-list={labelList.value}
                      position={sIndex}
                      always-delete={true}
                      should-key={true}
                      onAdd={(obj) => handleAddLabel(obj, labelList.value)}
                      onDelete={() =>
                        handleDeleteLabel(labelList.value, sIndex)
                      }
                    ></XInputGroup>
                  );
                })}
              </a-space>
            ) : (
              <ThumbButton
                size={24}
                font-size="14px"
                onClick={() => handleAddLabel(labelItem, labelList.value)}
              ></ThumbButton>
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

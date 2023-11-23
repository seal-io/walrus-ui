<script lang="tsx">
  import {
    defineComponent,
    ref,
    withModifiers,
    onMounted,
    nextTick
  } from 'vue';
  import _ from 'lodash';
  import schemaFieldProps from '../fields/schema-field-props';
  import { FieldSchema } from '../interface';
  import FieldGroup from './field-group.vue';
  import SchemaField from './schema-field.vue';
  import {
    genObjectFieldProperties,
    initFieldDefaultValue,
    getCustomColSpan,
    isRequiredInitField
  } from '../utils';
  import CommonButton from './common-button.vue';

  export default defineComponent({
    props: schemaFieldProps,
    emits: ['change'],
    setup(props, { emit }) {
      const activeItemIndex = ref(-1);
      const items = props.schema.items || [];
      const minItems = props.schema.minItems || 0;
      let itemsProperties: FieldSchema[] = [];
      const propertiesList = ref<FieldSchema[][]>([]);

      const handleChange = (data) => {
        emit('change', data);
      };

      // init field value
      if (
        props.action === 'create' &&
        isRequiredInitField(
          props.schema,
          _.includes(props.requiredFields, props.schema.name)
        )
      ) {
        _.set(
          props.formData,
          props.fieldPath,
          initFieldDefaultValue(props.schema)
        );
        handleChange(props.formData);
      }

      itemsProperties = genObjectFieldProperties({
        schema: props.schema.items as FieldSchema,
        level: props.schema.level + 1,
        grandParentHalfGrid: getCustomColSpan(items)
          ? false
          : props.schema.halfGrid,
        formData: props.formData,
        fieldPath: props.fieldPath,
        parentSpan:
          getCustomColSpan(props.schema) ||
          getCustomColSpan(items) ||
          props.parentSpan
      });

      const handleAddClick = () => {
        const newProperties = _.cloneDeep(itemsProperties);
        propertiesList.value = [
          ..._.cloneDeep(propertiesList.value),
          [...newProperties]
        ];

        // set the fieldpath
        _.each(propertiesList.value, (item, index) => {
          _.each(item, (sItem, sIndex) => {
            sItem.fieldPath = [...props.fieldPath, `${index}`, sItem.name];
          });
        });

        // update formData
        _.each(propertiesList.value, (item, index) => {
          _.each(item, (sItem, sIndex) => {
            if (!_.get(props.formData, sItem.fieldPath)) {
              if (isRequiredInitField(sItem, sItem.isRequired)) {
                _.set(
                  props.formData,
                  sItem.fieldPath,
                  initFieldDefaultValue(sItem)
                );
              } else {
                _.unset(props.formData, sItem.fieldPath);
              }
            }
          });
        });

        handleChange(props.formData);
      };
      // init field value when edit
      const initFieldValue = () => {
        const value = _.get(props.formData, props.fieldPath);
        console.log('value===', props.fieldPath, value);
        if (value && value.length) {
          for (let i = 0; i < value; i += 1) {
            handleAddClick();
          }
        }
      };

      // check array every item is empty or null or undefined
      const filterArrayIsEmpty = (arr) => {
        return _.filter(arr, (item) => {
          return !_.isEmpty(item) || !_.isNull(item) || !_.isUndefined(item);
        });
      };
      const handleDeleteClick = (index) => {
        propertiesList.value.splice(index, 1);

        // update formData
        _.unset(props.formData, [...props.fieldPath, `${index}`]);
        if (
          !_.get(props.formData, props.fieldPath).length ||
          !filterArrayIsEmpty(_.get(props.formData, props.fieldPath).length)
        ) {
          _.unset(props.formData, props.fieldPath);
        }

        handleChange(props.formData);
      };

      const handleButtonEnter = (index) => {
        activeItemIndex.value = index;
      };

      const handleButtoneave = () => {
        activeItemIndex.value = -1;
      };

      onMounted(() => {
        nextTick(() => {
          initFieldValue();
        });
      });
      const renderDeleleButton = (index) => {
        return (
          <span
            onMouseover={withModifiers(
              () => handleButtonEnter(index),
              ['stop', 'prevent']
            )}
            onMouseout={withModifiers(
              () => handleButtoneave(),
              ['stop', 'prevent']
            )}
          >
            <CommonButton
              class="delete-btn"
              onClick={() => handleDeleteClick(index)}
              action="delete"
              title={props.schema.title}
            ></CommonButton>
          </span>
        );
      };

      const renderAddButton = () => {
        return props.schema.items ? (
          <CommonButton
            onClick={() => handleAddClick()}
            action="add"
            title={props.schema.title}
          ></CommonButton>
        ) : null;
      };
      const init = () => {
        if (minItems) {
          for (let i = 0; i < minItems; i += 1) {
            handleAddClick();
          }
        }
      };
      init();

      return () => (
        <FieldGroup
          schema={props.schema}
          level={props.schema.level}
          v-slots={{
            footer: () => {
              return <>{renderAddButton()}</>;
            }
          }}
        >
          {_.map(propertiesList.value, (item, index) => {
            return (
              <>
                <div class={['add-item']}>
                  <div
                    class={[
                      'add-content',
                      { active: activeItemIndex.value === index }
                    ]}
                  >
                    <a-grid cols={12} col-gap={18}>
                      {_.map(item, (sItem, sIndex) => {
                        return (
                          <SchemaField
                            level={sItem.level}
                            key={_.join([props.fieldPath, index, sIndex], '.')}
                            schema={sItem}
                            formData={props.formData}
                            fieldPath={sItem.fieldPath}
                            requiredFields={sItem.parentRequired}
                            parentSpan={props.schema.colSpan}
                            action={props.action}
                          ></SchemaField>
                        );
                      })}
                    </a-grid>
                  </div>

                  {propertiesList.value.length > minItems
                    ? renderDeleleButton(index)
                    : null}
                </div>
                {index === propertiesList.value.length - 1 ? null : (
                  <a-divider size={1} type="dashed" class="divider"></a-divider>
                )}
              </>
            );
          })}
        </FieldGroup>
      );
    }
  });
</script>

<style lang="less" scoped>
  .divider {
    &.arco-divider-horizontal {
      margin-top: 0;
    }
  }

  .add-item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 0;
    border-radius: var(--border-radius-small);
    border-radius: 4px;

    .delete-btn {
      position: relative;
      top: 11px;
      left: 2px;
    }

    .add-content {
      position: relative;
      flex: 1;

      &.active {
        &::before {
          position: absolute;
          top: -20px;
          right: -20px;
          bottom: 0;
          left: -20px;
          display: block;
          padding-bottom: 0;
          background-color: var(--color-fill-2);
          border-radius: 4px;
          transition: background-color 0.3s var(--seal-transition-func);
          content: '';
        }
      }
    }

    .delete-btn {
      padding-left: 10px;
    }
  }
</style>

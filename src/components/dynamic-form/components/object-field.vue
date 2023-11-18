<script lang="tsx">
  import {
    defineComponent,
    h,
    compile,
    PropType,
    toRefs,
    ref,
    reactive,
    computed,
    watch
  } from 'vue';
  import _ from 'lodash';
  import i18n from '@/locale';
  import KeyValueLabels from '@/components/form-create/custom-components/key-value-labels.vue';
  import SealFormItemWrap from '@/components/seal-form/components/seal-form-item-wrap.vue';
  import SealInput from '@/components/seal-form/components/seal-input.vue';
  import schemaFieldProps from '../fields/schema-field-props';
  import { FieldSchema } from '../interface';
  import FieldGroup from './field-group.vue';
  import SchemaField from './schema-field.vue';
  import {
    genObjectFieldProperties,
    initFieldDefaultValue,
    genFieldPropsAndRules
  } from '../utils';
  import CommonButton from './common-button.vue';

  export default defineComponent({
    props: schemaFieldProps,
    emits: ['change'],
    setup(props, { emit }) {
      const { t } = i18n.global;
      let additionalPropertiesList: FieldSchema[] = [];
      let additionalPropertiesKeysObj = {};
      const childProperties = ref<FieldSchema[]>([]);
      const additionalList = ref<any[]>([]);
      const objectAdditionalList = ref<
        { field: string; list: FieldSchema[] }[]
      >([]);

      const handleChange = (data) => {
        emit('change', data);
      };

      //
      const { fieldProps, rules } = genFieldPropsAndRules({
        schema: props.schema,
        requiredFields: props.requiredFields
      });
      additionalPropertiesKeysObj = _.reduce(
        _.keys(props.schema.additionalProperties?.properties),
        (obj, key) => {
          obj[key] = _.get(props.schema.additionalProperties?.properties, [
            key,
            'default'
          ]);
          return obj;
        },
        {}
      );

      // default data
      childProperties.value = genObjectFieldProperties({
        schema: props.schema,
        formData: props.formData,
        fieldPath: props.fieldPath
      });

      console.log('childProperties>>>>>>>>', {
        name: props.schema.name,
        childProperties: childProperties.value
      });

      // init field value
      if (!_.get(props.formData, props.fieldPath)) {
        _.set(
          props.formData,
          props.fieldPath,
          initFieldDefaultValue(props.schema)
        );
        _.each(childProperties.value, (item) => {
          if (!_.get(props.formData, item.fieldPath)) {
            _.set(props.formData, item.fieldPath, initFieldDefaultValue(item));
          }
        });
        handleChange(props.formData);
      }

      // raw data
      additionalPropertiesList = genObjectFieldProperties({
        schema: props.schema.additionalProperties as FieldSchema,
        formData: props.formData,
        fieldPath: props.fieldPath
      });

      // value is any
      const isAnyAdditionalProperties =
        _.isBoolean(props.schema.additionalProperties) &&
        props.schema.additionalProperties;

      // value is string
      const isMapString =
        _.isObject(props.schema.additionalProperties) &&
        props.schema.additionalProperties?.type === 'string';

      // value is number
      const isMapNumber =
        _.isObject(props.schema.additionalProperties) &&
        _.includes(
          ['number', 'integer'],
          props.schema.additionalProperties?.type
        );

      // value is boolean
      const isMapBoolean =
        _.isObject(props.schema.additionalProperties) &&
        props.schema.additionalProperties?.type === 'boolean';

      // value is object or array
      const isMapObjectAdditionalProperties =
        _.isObject(props.schema.additionalProperties) &&
        _.includes(
          ['object', 'array'],
          props.schema.additionalProperties?.type
        );

      // init map(string) value
      if (isAnyAdditionalProperties || isMapString || isMapNumber) {
        const keys = _.keys(_.get(props.formData, props.fieldPath));
        additionalList.value = _.map(keys, (value, key) => {
          return {
            label: value,
            value: _.get(props.formData, `${props.fieldPath}.${value}`)
          };
        });
      }

      const handleAddClick = () => {
        if (isAnyAdditionalProperties || isMapString || isMapNumber) {
          additionalList.value.push({
            label: '',
            value: ''
          });

          // !!! upate formData on component change event !!!
        }
        if (isMapObjectAdditionalProperties) {
          objectAdditionalList.value.push({
            field: '',
            list: _.cloneDeep(additionalPropertiesList)
          });
          _.set(
            props.formData,
            [...props.fieldPath],
            additionalPropertiesKeysObj
          );
        }
        handleChange(props.formData);
      };

      const handleDeleteClick = (index) => {
        if (isAnyAdditionalProperties || isMapString || isMapNumber) {
          const labelKey = additionalList.value[index].label;
          additionalList.value.splice(index, 1);
          _.unset(props.formData, [...props.fieldPath, labelKey]);
        }
        if (isMapObjectAdditionalProperties) {
          const itemField = objectAdditionalList.value[index]?.field;
          objectAdditionalList.value.splice(index, 1);
          _.unset(props.formData, [...props.fieldPath, itemField]);
        }

        handleChange(props.formData);
      };

      const renderAddButton = () => {
        return isMapObjectAdditionalProperties ? (
          <CommonButton
            onClick={() => handleAddClick()}
            action="add"
            title={props.schema.title}
          ></CommonButton>
        ) : null;
      };
      const renderDeleleButton = (index) => {
        return (
          <CommonButton
            onClick={() => handleDeleteClick(index)}
            action="delete"
            title={props.schema.title}
          ></CommonButton>
        );
      };

      const handleAdditionalFieldChange = () => {
        _.each(objectAdditionalList.value, (item) => {
          _.each(item.list, (childSchema) => {
            if (!_.get(props.formData, [...props.fieldPath, item.field])) {
              _.set(
                props.formData,
                [...props.fieldPath, item.field, childSchema.name],
                initFieldDefaultValue(childSchema)
              );
            }
          });
        });
      };
      // additional value is string
      const rendermapStringAdditional = () => {
        if (isAnyAdditionalProperties || isMapString || isMapNumber) {
          return (
            <a-form-item
              hide-label={true}
              rules={rules}
              required={fieldProps.required}
              label={props.schema.title}
              field={_.join(props.fieldPath, '.')}
              validate-trigger={['change']}
            >
              <SealFormItemWrap
                popupInfo={props.schema.description}
                required={props.required}
                label={props.schema.title || props.schema.name}
                style="width: 100%"
              >
                <KeyValueLabels
                  width={800}
                  showNumberInput={isMapNumber}
                  showCheckbox={isMapBoolean}
                  value={_.get(props.formData, props.fieldPath)}
                  labels={additionalList.value}
                  onUpdate:value={(val) => {
                    _.set(props.formData, props.fieldPath, val);
                    handleChange(props.formData);
                  }}
                ></KeyValueLabels>
              </SealFormItemWrap>
            </a-form-item>
          );
        }
        return null;
      };
      // additional value is object
      const renderAddtionalProperties = () => {
        console.log(
          'isMapObjectAdditionalProperties=====',
          isMapObjectAdditionalProperties
        );
        if (!isMapObjectAdditionalProperties) return null;
        return (
          <>
            {_.map(objectAdditionalList.value, (item, index) => {
              return (
                <>
                  <div class="add-item">
                    <div
                      key={_.join([props.fieldPath, index], '.')}
                      class="add-content"
                    >
                      <a-form-item
                        field={_.join([props.fieldPath, index, 'field'], '.')}
                      >
                        <SealInput
                          modelValue={_.get(objectAdditionalList.value, [
                            index,
                            'field'
                          ])}
                          placeholder="enter proerty name"
                          onChange={() => {
                            handleAdditionalFieldChange();
                            handleChange(props.formData);
                          }}
                          onUpdate:modelValue={(val) => {
                            _.set(
                              objectAdditionalList.value,
                              [index, 'field'],
                              val
                            );
                            console.log(
                              'objectAdditionalList.value>>>>>>>>>>>',
                              {
                                objectAdditionalList:
                                  objectAdditionalList.value,
                                index,
                                val
                              }
                            );
                          }}
                        ></SealInput>
                      </a-form-item>
                      {_.map(item.list, (childSchema, cIndex) => {
                        return (
                          <SchemaField
                            formData={props.formData}
                            schema={childSchema}
                            requiredFields={childSchema.required}
                            fieldPath={[
                              ...props.fieldPath,
                              item.field,
                              childSchema.name
                            ]}
                            onChange={(data) => {
                              _.set(
                                props.formData,
                                [
                                  ...props.fieldPath,
                                  item.field,
                                  childSchema.name
                                ],
                                data
                              );
                              handleChange(props.formData);
                            }}
                          />
                        );
                      })}
                    </div>
                    <div class="delete-btn">{renderDeleleButton(index)}</div>
                  </div>
                  {index === objectAdditionalList.value.length - 1 ? null : (
                    <a-divider
                      direction="horizontal"
                      type="dashed"
                      size={2}
                    ></a-divider>
                  )}
                </>
              );
            })}
          </>
        );
      };
      return () => (
        <>
          <FieldGroup
            schema={props.schema}
            level={props.level}
            v-slots={{
              buttons: () => {
                return <>{renderAddButton()}</>;
              }
            }}
          >
            <>
              {_.map(childProperties.value, (childSchema) => {
                return (
                  <SchemaField
                    level={props.level + 1}
                    schema={childSchema}
                    formData={props.formData}
                    fieldPath={childSchema.fieldPath}
                    requiredFields={childSchema.parentRequired}
                    onChange={(data) => {
                      handleChange(data);
                    }}
                  />
                );
              })}
              {renderAddtionalProperties()}
              {rendermapStringAdditional()}
            </>
          </FieldGroup>
        </>
      );
    }
  });
</script>

<style lang="less" scoped>
  .add-item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    .add-content {
      flex: 1;
    }

    .delete-btn {
      padding-left: 10px;
    }
  }
</style>

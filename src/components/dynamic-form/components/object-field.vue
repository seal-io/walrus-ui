<script lang="tsx">
  import { defineComponent, ref, inject } from 'vue';
  import _ from 'lodash';
  import i18n from '@/locale';
  import { InjectSchemaFormStatusKey, PageAction } from '@/views/config';
  import HintInput from '@/components/hint-input/index.vue';
  import schemaFieldProps from '../fields/schema-field-props';
  import { FieldSchema } from '../interface';
  import FieldGroup from './field-group.vue';
  import SchemaField from './schema-field.vue';
  import {
    genObjectFieldProperties,
    initFieldDefaultValue,
    getCustomColSpan,
    isBasicType,
    isRequiredInitField,
    isSelect,
    isSimpleObject
  } from '../utils';
  import CommonButton from './common-button.vue';

  export default defineComponent({
    props: schemaFieldProps,
    emits: ['change'],
    setup(props, { emit }) {
      const { t } = i18n.global;
      const schemaFormStatus = inject(
        InjectSchemaFormStatusKey,
        ref(PageAction.CREATE)
      );
      let additionalPropertiesList: FieldSchema[] = [];
      let additionalPropertiesKeysObj = {};
      const childProperties = ref<FieldSchema[]>([]);
      const objectAdditionalList = ref<
        { field: string; list: FieldSchema[] }[]
      >([]);

      const handleChange = (data) => {
        emit('change', data);
      };

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
        fieldPath: props.fieldPath,
        parentSpan: getCustomColSpan(props.schema) || props.schema.colSpan,
        level: props.level + 1
      });

      console.log(
        'childProperties++++++++++++',
        props.schema,
        childProperties.value
      );
      // init field value
      if (
        schemaFormStatus.value === PageAction.CREATE &&
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
        _.each(childProperties.value, (item) => {
          if (isRequiredInitField(item, item.isRequired)) {
            _.set(props.formData, item.fieldPath, initFieldDefaultValue(item));
          } else {
            _.unset(props.formData, item.fieldPath);
          }
        });
        handleChange(props.formData);
      }

      // raw data
      additionalPropertiesList = genObjectFieldProperties({
        schema: props.schema.additionalProperties as FieldSchema,
        formData: props.formData,
        fieldPath: props.fieldPath,
        level: props.level + 1
      });

      // value is object or array
      const isMapObjectAdditionalProperties =
        _.isObject(props.schema.additionalProperties) &&
        _.includes(
          ['object', 'array'],
          props.schema.additionalProperties?.type
        );

      const handleAddClick = () => {
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
        if (isMapObjectAdditionalProperties) {
          const itemField = objectAdditionalList.value[index]?.field;
          objectAdditionalList.value.splice(index, 1);
          _.unset(props.formData, [...props.fieldPath, itemField]);
        }

        handleChange(props.formData);
      };

      const renderAddButton = () => {
        if (schemaFormStatus.value === PageAction.VIEW) {
          return null;
        }
        return isMapObjectAdditionalProperties ? (
          <CommonButton
            onClick={() => handleAddClick()}
            action="add"
            title={props.schema.title}
          ></CommonButton>
        ) : null;
      };
      const renderDeleleButton = (index) => {
        if (schemaFormStatus.value === PageAction.VIEW) {
          return null;
        }
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

      // additional value is object
      const renderAddtionalProperties = () => {
        if (!isMapObjectAdditionalProperties) return null;
        return (
          <>
            {_.map(objectAdditionalList.value, (item, index) => {
              return (
                <>
                  <div class="add-item">
                    <div class="add-content">
                      <a-form-item
                        field={_.join([props.fieldPath, index, 'field'], '.')}
                      >
                        {schemaFormStatus.value === PageAction.VIEW ? (
                          <span>
                            {_.get(objectAdditionalList.value, [
                              index,
                              'field'
                            ])}
                          </span>
                        ) : (
                          <HintInput
                            modelValue={_.get(objectAdditionalList.value, [
                              index,
                              'field'
                            ])}
                            editorId={_.join(
                              [props.fieldPath, index, 'field'],
                              '.'
                            )}
                            placeholder="enter property name"
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
                            }}
                          ></HintInput>
                        )}
                      </a-form-item>
                      {_.map(item.list, (childSchema, cIndex) => {
                        return (
                          <SchemaField
                            formData={props.formData}
                            schema={childSchema}
                            requiredFields={childSchema.parentRequired}
                            parentSpan={props.schema.colSpan}
                            level={childSchema.level}
                            fieldPath={[
                              ...props.fieldPath,
                              item.field,
                              childSchema.name
                            ]}
                            action={props.action}
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
                </>
              );
            })}
          </>
        );
      };

      const renderBasicTypeFields = () => {
        const list = _.filter(childProperties.value, (item: FieldSchema) => {
          return (
            isBasicType(item.type) || isSimpleObject(item) || isSelect(item)
          );
        });

        return (
          <a-grid cols={12} col-gap={18} row-gap={0} style={{ width: '100%' }}>
            {_.map(list, (childSchema: FieldSchema) => {
              return (
                <SchemaField
                  level={childSchema.level}
                  schema={childSchema}
                  formData={props.formData}
                  fieldPath={childSchema.fieldPath}
                  requiredFields={childSchema.parentRequired}
                  parentSpan={props.schema.colSpan}
                  action={props.action}
                  onChange={(data) => {
                    handleChange(data);
                  }}
                />
              );
            })}
          </a-grid>
        );
      };

      const renderNonBasicTypeFields = () => {
        const list = _.filter(childProperties.value, (item) => {
          return (
            !isBasicType(item.type) && !isSimpleObject(item) && !isSelect(item)
          );
        });
        return (
          <>
            {_.map(list, (childSchema) => {
              return (
                <SchemaField
                  level={childSchema.level}
                  schema={childSchema}
                  formData={props.formData}
                  fieldPath={childSchema.fieldPath}
                  requiredFields={childSchema.parentRequired}
                  parentSpan={props.schema.colSpan}
                  action={props.action}
                  onChange={(data) => {
                    handleChange(data);
                  }}
                />
              );
            })}
          </>
        );
      };

      return () => (
        <FieldGroup
          schema={props.schema}
          level={props.schema.level}
          fieldPath={props.fieldPath}
          v-slots={{
            footer: () => {
              return <>{renderAddButton()}</>;
            }
          }}
        >
          <>
            {renderBasicTypeFields()}
            {renderNonBasicTypeFields()}
            {renderAddtionalProperties()}
          </>
        </FieldGroup>
      );
    }
  });
</script>

<style lang="less" scoped>
  .add-item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 20px 0;
    padding-top: 0;
    padding-bottom: 0;

    .add-content {
      flex: 1;
    }

    .delete-btn {
      padding-left: 10px;
    }
  }
</style>

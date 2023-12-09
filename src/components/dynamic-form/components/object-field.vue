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
    viewFieldValue,
    getCustomColSpan,
    isBasicType,
    isInvalidSchema,
    isRequiredInitField,
    isSelect,
    isSimpleObject,
    initFieldValue,
    unsetFieldValue
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
        { field: string; schema: FieldSchema }[]
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
        defaultFormData: props.defaultFormData,
        uiFormData: props.uiFormData,
        schema: props.schema,
        fieldPath: props.fieldPath,
        parentSpan: getCustomColSpan(props.schema) || props.schema.colSpan,
        level: props.level + 1
      });
      console.log('childProperties++++++++++++', childProperties.value);
      // raw data
      if (
        props.schema.additionalProperties &&
        !_.keys(props.schema.additionalProperties?.properties).length
      ) {
        additionalPropertiesList = [
          {
            ..._.cloneDeep(props.schema.additionalProperties),
            fieldPath: props.fieldPath,
            level: props.level + 1
          }
        ] as FieldSchema[];
      } else if (
        props.schema.additionalProperties &&
        _.keys(props.schema.additionalProperties?.properties).length
      ) {
        additionalPropertiesList = genObjectFieldProperties({
          defaultFormData: props.defaultFormData,
          uiFormData: props.uiFormData,
          schema: props.schema.additionalProperties as FieldSchema,
          parentNullableObj: {
            ..._.pick(props.schema, ['nullable', 'originNullable'])
          },
          fieldPath: props.fieldPath,
          level: props.level + 1
        });
      }

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
            schema: _.cloneDeep(
              props.schema.additionalProperties
            ) as FieldSchema
          });
        }
      };

      const handleDeleteClick = (index) => {
        if (isMapObjectAdditionalProperties) {
          const itemField = objectAdditionalList.value[index]?.field;
          objectAdditionalList.value.splice(index, 1);
          _.unset(props.formData, [...props.fieldPath, itemField]);
          _.unset(props.uiFormData, [...props.fieldPath, itemField]);
          unsetFieldValue({
            FieldPathMap: props.FieldPathMap,
            defaultFormData: props.defaultFormData,
            uiFormData: props.uiFormData,
            schema: props.schema,
            formData: props.formData,
            fieldPath: [...props.fieldPath, itemField],
            required: false
          });
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

      const handleAdditionalMapFieldChange = (index, val) => {
        const fieldValue = _.get(objectAdditionalList.value, [index, 'field']);
        const field = _.cloneDeep(fieldValue);
        const obj = _.get(props.uiFormData, [...props.fieldPath, field]);
        console.log('handleAdditionalMapFieldChange++++++++++++', val, obj);
        _.set(objectAdditionalList.value, [index, 'field'], _.cloneDeep(val));
        _.set(props.formData, [...props.fieldPath, val], _.cloneDeep(obj));
        _.set(props.uiFormData, [...props.fieldPath, val], _.cloneDeep(obj));
        _.unset(props.formData, [...props.fieldPath, field]);
        _.unset(props.uiFormData, [...props.fieldPath, field]);

        console.log(
          'handleAdditionalMapFieldChange++++++++++++',
          props.formData,
          props.uiFormData
        );
        handleChange(props.formData);
      };

      const renderMapAdditionalValue = (index) => {
        const item = _.get(objectAdditionalList.value, [index]);
        return (
          <SchemaField
            formData={props.formData}
            uiFormData={props.uiFormData}
            defaultFormData={props.defaultFormData}
            FieldPathMap={props.FieldPathMap}
            schema={item.schema}
            requiredFields={[]}
            parentSpan={props.schema.colSpan}
            level={props.schema.level}
            fieldPath={[...props.fieldPath, item.field]}
            action={props.action}
            onChange={(data) => {
              handleChange(data);
            }}
          />
        );
      };
      // additional value is object
      const renderAddtionalProperties = () => {
        if (!isMapObjectAdditionalProperties) return null;
        return (
          <>
            {_.map(objectAdditionalList.value, (item, index) => {
              return (
                <>
                  <div class="add-item" key={index}>
                    <div class="add-content">
                      <a-form-item
                        hide-label={true}
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
                          <>
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
                              onChange={(val) => {
                                handleAdditionalMapFieldChange(index, val);
                              }}
                              onInput={(val) => {}}
                            ></HintInput>
                            {renderMapAdditionalValue(index)}
                          </>
                        )}
                      </a-form-item>
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
                  uiFormData={props.uiFormData}
                  defaultFormData={props.defaultFormData}
                  FieldPathMap={props.FieldPathMap}
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
                  uiFormData={props.uiFormData}
                  defaultFormData={props.defaultFormData}
                  FieldPathMap={props.FieldPathMap}
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
          formData={props.formData}
          uiFormData={props.uiFormData}
          defaultFormData={props.defaultFormData}
          FieldPathMap={props.FieldPathMap}
          requiredFields={props.requiredFields}
          onChange={(val) => {
            handleChange(val);
          }}
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
      position: relative;
      top: 15px;
      left: 2px;
      padding-left: 10px;
    }
  }
</style>

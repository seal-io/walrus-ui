<script lang="tsx">
  import {
    defineComponent,
    PropType,
    toRefs,
    ref,
    reactive,
    computed,
    watch
  } from 'vue';
  import _ from 'lodash';
  import KeyValueLabels from '@/components/form-create/custom-components/key-value-labels.vue';
  import SealFormItemWrap from '@/components/seal-form/components/seal-form-item-wrap.vue';
  import SealInput from '@/components/seal-form/components/seal-input.vue';
  import schemaFieldProps from '../fields/schema-field-props';
  import { FieldSchema } from '../interface';
  import FieldGroup from './field-group.vue';
  import SchemaField from './schema-field.vue';
  import { genObjectFieldProperties } from '../utils';
  import CommonButton from './common-button.vue';

  export default defineComponent({
    props: schemaFieldProps,
    emits: ['change'],
    setup(props, { emit }) {
      let additionalPropertiesList: FieldSchema[] = [];
      let additionalPropertiesKeysObj = {};
      const childProperties = ref<FieldSchema[]>([]);
      const objectAdditionalList = ref<
        { field: string; list: FieldSchema[] }[]
      >([]);

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

      // raw data
      additionalPropertiesList = genObjectFieldProperties({
        schema: props.schema.additionalProperties as FieldSchema,
        formData: props.formData,
        fieldPath: props.fieldPath
      });

      const additionalList = ref<any[]>([]);

      const isAnyAdditionalProperties =
        _.isBoolean(props.schema.additionalProperties) &&
        props.schema.additionalProperties;

      const isMapString =
        _.isObject(props.schema.additionalProperties) &&
        props.schema.additionalProperties.type === 'string';

      const isMapObjectAdditionalProperties =
        _.isObject(props.schema.additionalProperties) &&
        props.schema.additionalProperties.type === 'object';

      //
      if (isAnyAdditionalProperties || isMapString) {
        const keys = _.keys(_.get(props.formData, props.fieldPath));
        additionalList.value = _.map(keys, (value, key) => {
          return {
            label: value,
            value: _.get(props.formData, `${props.fieldPath}.${value}`)
          };
        });
      }

      const handleChange = (data) => {
        emit('change', data);
      };

      const handleAddClick = () => {
        if (isAnyAdditionalProperties || isMapString) {
          additionalList.value.push({
            label: '',
            value: ''
          });
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
        console.log(
          'isMapObjectAdditionalProperties=====',
          isMapObjectAdditionalProperties,
          isAnyAdditionalProperties,
          isMapString,
          props.schema.additionalProperties?.type,
          props.schema
        );
        handleChange(props.formData);
      };

      const renderAddButton = () => {
        return props.schema.additionalProperties ? (
          <div>
            <CommonButton onClick={() => handleAddClick()} type="primary">
              添加 {props.schema.title}
            </CommonButton>
          </div>
        ) : null;
      };
      // additional value is string
      const rendermapStringAdditional = () => {
        if (isAnyAdditionalProperties || isMapString) {
          return (
            <>
              <SealFormItemWrap {...props} label={props.schema.title}>
                <KeyValueLabels
                  value={_.get(props.formData, props.fieldPath)}
                  labels={additionalList.value}
                  onUpdate:value={(val) => {
                    _.set(props.formData, props.fieldPath, val);
                    handleChange(props.formData);
                  }}
                ></KeyValueLabels>
              </SealFormItemWrap>
            </>
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
                <div key={_.join([props.fieldPath, index], '-')}>
                  <SealInput
                    modelValue={_.get(props.formData, [
                      ...props.fieldPath,
                      index,
                      'field'
                    ])}
                    onUpdate:modelValue={(val) => {
                      _.set(
                        props.formData,
                        [...props.fieldPath, index, 'field'],
                        val
                      );
                      handleChange(props.formData);
                    }}
                  ></SealInput>
                  {_.map(item.list, (childSchema) => {
                    return (
                      <SchemaField
                        schema={childSchema}
                        formData={props.formData}
                        fieldPath={[...props.fieldPath, item.field]}
                        onChange={(data) => {
                          _.set(
                            props.formData,
                            [...props.fieldPath, item.field, childSchema.name],
                            data
                          );
                          handleChange(props.formData);
                        }}
                      />
                    );
                  })}
                </div>
              );
            })}
          </>
        );
      };
      return () => (
        <>
          <FieldGroup {...props}>
            <>
              {_.map(childProperties.value, (childSchema) => {
                return (
                  <SchemaField
                    schema={childSchema}
                    formData={props.formData}
                    fieldPath={childSchema.fieldPath}
                    onChange={(data) => {
                      handleChange(data);
                    }}
                  />
                );
              })}
              {renderAddtionalProperties()}
              {rendermapStringAdditional()}
              {renderAddButton()}
            </>
          </FieldGroup>
        </>
      );
    }
  });
</script>

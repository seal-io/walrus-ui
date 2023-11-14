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

  export default defineComponent({
    props: schemaFieldProps,
    emits: ['change'],
    setup(props, { emit }) {
      const childProperties = ref<FieldSchema[]>([]);
      const objectAdditionalList = ref<FieldSchema[]>([]);

      childProperties.value = genObjectFieldProperties({
        schema: props.schema,
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

      const getAdditionalPropertiesKeysObj = () => {
        const keys = _.keys(props.schema.additionalProperties?.properties);
        _.reduce(
          keys,
          (obj, key) => {
            obj[key] = _.get(props.schema.additionalProperties?.properties, [
              key,
              'default'
            ]);
            return obj;
          },
          {}
        );
      };
      const handleAddClick = () => {
        if (isAnyAdditionalProperties || isMapString) {
          additionalList.value.push({
            label: '',
            value: ''
          });
        }
        if (isMapObjectAdditionalProperties) {
          const newKey = `key${_.keys(objectAdditionalList.value).length}`;
          objectAdditionalList.value.push({
            title: newKey,
            type: props.schema.type,
            fieldPath: [...props.fieldPath, newKey],
            ...props.schema.additionalProperties
          } as FieldSchema);
          _.set(
            props.formData,
            [...props.fieldPath, newKey],
            getAdditionalPropertiesKeysObj()
          );
        }
        handleChange(props.formData);
      };

      const renderAddButton = () => {
        return props.schema.additionalProperties ? (
          <a-button onClick={() => handleAddClick()}>添加</a-button>
        ) : null;
      };
      const renderAddtionalProperties = () => {
        if (!isMapObjectAdditionalProperties) return null;
        return (
          <>
            {_.map(objectAdditionalList.value, (childSchema) => {
              return (
                <>
                  <SealInput
                    modelValue={_.get(props.formData, childSchema.fieldPath)}
                    onUpdate:modelValue={(val) => {
                      _.set(props.formData, childSchema.fieldPath, val);
                      handleChange(props.formData);
                    }}
                  ></SealInput>
                  <SchemaField
                    schema={childSchema}
                    formData={props.formData}
                    fieldPath={childSchema.fieldPath}
                    onChange={(data) => {
                      handleChange(data);
                    }}
                  />
                </>
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
              {isAnyAdditionalProperties || isMapString ? (
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
              ) : null}
              {renderAddButton()}
            </>
          </FieldGroup>
        </>
      );
    }
  });
</script>

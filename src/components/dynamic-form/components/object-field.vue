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
  import { genObjectFieldProperties } from '../utils';
  import CommonButton from './common-button.vue';

  export default defineComponent({
    props: schemaFieldProps,
    emits: ['change'],
    setup(props, { emit }) {
      const { t } = i18n.global;
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

      console.log('childProperties>>>>>>>>', {
        name: props.schema.name,
        childProperties: childProperties.value
      });
      // raw data
      additionalPropertiesList = genObjectFieldProperties({
        schema: props.schema.additionalProperties as FieldSchema,
        formData: props.formData,
        fieldPath: props.fieldPath
      });

      const additionalList = ref<any[]>([]);

      // value is any
      const isAnyAdditionalProperties =
        _.isBoolean(props.schema.additionalProperties) &&
        props.schema.additionalProperties;

      // value is string
      const isMapString =
        _.isObject(props.schema.additionalProperties) &&
        props.schema.additionalProperties.type === 'string';

      // value is number
      const isMapNumber =
        _.isObject(props.schema.additionalProperties) &&
        _.includes(
          ['number', 'integer'],
          props.schema.additionalProperties.type
        );

      // value is boolean
      const isMapBoolean =
        _.isObject(props.schema.additionalProperties) &&
        props.schema.additionalProperties.type === 'boolean';

      // value is object or array
      const isMapObjectAdditionalProperties =
        _.isObject(props.schema.additionalProperties) &&
        _.includes(['object', 'array'], props.schema.additionalProperties.type);

      //
      if (isAnyAdditionalProperties || isMapString || isMapNumber) {
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
        if (isAnyAdditionalProperties || isMapString || isMapNumber) {
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
        handleChange(props.formData);
      };

      const handleDeleteClick = (index) => {
        if (isAnyAdditionalProperties || isMapString || isMapNumber) {
          const labelKey = additionalList.value[index].label;
          additionalList.value.splice(index, 1);
          _.unset(props.formData, [...props.fieldPath, labelKey]);
        }
        if (isMapObjectAdditionalProperties) {
          objectAdditionalList.value.splice(index, 1);
          _.unset(props.formData, [...props.fieldPath]);
        }
        handleChange(props.formData);
      };

      const renderAddButton = () => {
        return isMapObjectAdditionalProperties ? (
          <div class="add-btn">
            <CommonButton onClick={() => handleAddClick()} type="primary">
              <icon-plus style="stroke-width: 4" class="m-r-5" /> 添加
              {props.schema.title}
            </CommonButton>
          </div>
        ) : null;
      };
      const renderDeleleButton = (index) => {
        return (
          <CommonButton onClick={() => handleDeleteClick(index)} type="text">
            <icon-minus-circle style="stroke-width: 3" class="size-24" />
            {props.schema.title}
          </CommonButton>
        );
      };
      // additional value is string
      const rendermapStringAdditional = () => {
        if (isAnyAdditionalProperties || isMapString || isMapNumber) {
          return (
            <a-form-item>
              <SealFormItemWrap
                {...props}
                label={props.schema.title}
                style="width: 100%"
              >
                <KeyValueLabels
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
                <div>
                  <div key={_.join([props.fieldPath, index], '-')}>
                    <SealInput
                      modelValue={_.get(objectAdditionalList.value, [
                        index,
                        'field'
                      ])}
                      onUpdate:modelValue={(val) => {
                        _.set(
                          objectAdditionalList.value,
                          [index, 'field'],
                          val
                        );
                        handleChange(props.formData);
                      }}
                    ></SealInput>
                    {_.map(item.list, (childSchema, cIndex) => {
                      return (
                        <SchemaField
                          schema={childSchema}
                          formData={props.formData}
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
                  <div>{renderDeleleButton(index)}</div>
                </div>
              );
            })}
          </>
        );
      };
      return () => (
        <>
          <FieldGroup
            {...props}
            class={[`level-${props.level}`]}
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

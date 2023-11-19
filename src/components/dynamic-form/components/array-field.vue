<script lang="tsx">
  import { defineComponent, ref } from 'vue';
  import _ from 'lodash';
  import KeyValueLabels from '@/components/form-create/custom-components/key-value-labels.vue';
  import SealFormItemWrap from '@/components/seal-form/components/seal-form-item-wrap.vue';
  import SealInput from '@/components/seal-form/components/seal-input.vue';
  import schemaFieldProps from '../fields/schema-field-props';
  import { FieldSchema } from '../interface';
  import FieldGroup from './field-group.vue';
  import SchemaField from './schema-field.vue';
  import { genObjectFieldProperties, initFieldDefaultValue } from '../utils';
  import CommonButton from './common-button.vue';

  export default defineComponent({
    props: schemaFieldProps,
    emits: ['change'],
    setup(props, { emit }) {
      const items = props.schema.items || [];
      let itemsProperties: FieldSchema[] = [];
      const propertiesList = ref<FieldSchema[][]>([]);

      const handleChange = (data) => {
        emit('change', data);
      };

      // init field value
      if (!_.get(props.formData, props.fieldPath)) {
        _.set(
          props.formData,
          props.fieldPath,
          initFieldDefaultValue(props.schema)
        );
        handleChange(props.formData);
      }

      itemsProperties = genObjectFieldProperties({
        schema: props.schema.items as FieldSchema,
        grandParentHalfGrid: props.schema.halfGrid,
        formData: props.formData,
        fieldPath: props.fieldPath,
        parentSpan: props.parentSpan
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
              _.set(
                props.formData,
                sItem.fieldPath,
                initFieldDefaultValue(sItem)
              );
            }
          });
        });
        console.log(
          'propertiesList=======',
          propertiesList.value,
          props.formData
        );
        handleChange(props.formData);
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

      const renderDeleleButton = (index) => {
        return (
          <CommonButton
            onClick={() => handleDeleteClick(index)}
            action="delete"
            title={props.schema.title}
          ></CommonButton>
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
      return () => (
        <FieldGroup
          schema={props.schema}
          level={props.level}
          v-slots={{
            buttons: () => {
              return <>{renderAddButton()}</>;
            }
          }}
        >
          {_.map(propertiesList.value, (item, index) => {
            return (
              <>
                <div class="add-item">
                  <div class="add-content">
                    <a-grid cols={24} col-gap={10}>
                      {_.map(item, (sItem, sIndex) => {
                        return (
                          <SchemaField
                            level={props.level + 1}
                            key={_.join([props.fieldPath, index, sIndex], '.')}
                            schema={sItem}
                            formData={props.formData}
                            fieldPath={sItem.fieldPath}
                            requiredFields={sItem.parentRequired}
                            parentSpan={props.schema.colSpan}
                          ></SchemaField>
                        );
                      })}
                    </a-grid>
                  </div>

                  <div class="delete-btn">{renderDeleleButton(index)}</div>
                </div>
                {index === propertiesList.value.length - 1 ? null : (
                  <a-divider
                    direction="horizontal"
                    type="dashed"
                    size={2}
                  ></a-divider>
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

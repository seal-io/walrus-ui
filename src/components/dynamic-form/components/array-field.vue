<script lang="tsx">
  import {
    defineComponent,
    compile,
    h,
    PropType,
    toRefs,
    ref,
    reactive,
    computed,
    watch,
    toRaw
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
      const items = props.schema.items || [];
      let itemsProperties: FieldSchema[] = [];
      const propertiesList = ref<FieldSchema[][]>([]);

      itemsProperties = genObjectFieldProperties({
        schema: props.schema.items as FieldSchema,
        formData: props.formData,
        fieldPath: props.fieldPath
      });

      const handleAddClick = () => {
        const newProperties = _.cloneDeep(itemsProperties);
        propertiesList.value = [...propertiesList.value, [...newProperties]];
        console.log('propertiesList=======', propertiesList.value);
      };

      const handleDeleteClick = (index) => {
        propertiesList.value.splice(index, 1);
      };

      const renderDeleleButton = (index) => {
        return (
          <CommonButton onClick={() => handleDeleteClick(index)} type="text">
            <icon-minus-circle style="stroke-width: 3" class="size-24" />
            {props.schema.title}
          </CommonButton>
        );
      };
      const renderAddButton = () => {
        return props.schema.items ? (
          <div class="add-btn">
            <CommonButton onClick={() => handleAddClick()} type="primary">
              <icon-plus class="m-r-5" style="stroke-width: 4" /> 添加
              {props.schema.title}
            </CommonButton>
          </div>
        ) : null;
      };
      return () => (
        <FieldGroup
          {...props}
          class={[`level-${props.level}`]}
          v-slots={{
            buttons: () => {
              return <>{renderAddButton()}</>;
            }
          }}
        >
          {_.map(propertiesList.value, (item, index) => {
            return (
              <div class="add-item">
                <div class="add-content">
                  {_.map(item, (sItem, sIndex) => {
                    return (
                      <SchemaField
                        level={props.level + 1}
                        key={_.join([props.fieldPath, index], '-')}
                        schema={sItem}
                        formData={props.formData}
                        fieldPath={props.fieldPath}
                      ></SchemaField>
                    );
                  })}
                </div>
                <div class="delete-btn">{renderDeleleButton(index)}</div>
              </div>
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
      padding: 0 10px;
    }
  }
</style>

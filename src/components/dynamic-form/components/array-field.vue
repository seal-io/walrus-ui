<script lang="tsx">
  import {
    defineComponent,
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
      const propertiesList = ref<FieldSchema[]>([]);

      itemsProperties = genObjectFieldProperties({
        schema: props.schema.items as FieldSchema,
        formData: props.formData,
        fieldPath: props.fieldPath
      });

      const handleAddClick = () => {
        const newProperties = _.cloneDeep(itemsProperties);
        propertiesList.value = [...propertiesList.value, ...newProperties];
      };

      const renderAddButton = () => {
        return props.schema.items ? (
          <div>
            <CommonButton onClick={() => handleAddClick()} type="primary">
              添加{props.schema.title}
            </CommonButton>
          </div>
        ) : null;
      };
      return () => (
        <>
          {_.map(propertiesList.value, (item, index) => {
            return (
              <SchemaField
                key={_.join([props.fieldPath, index], '-')}
                schema={item}
                formData={props.formData}
                fieldPath={props.fieldPath}
              ></SchemaField>
            );
          })}
          {renderAddButton()}
        </>
      );
    }
  });
</script>

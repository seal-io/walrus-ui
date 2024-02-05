<script lang="tsx">
  import { defineComponent, ref, inject } from 'vue';
  import _ from 'lodash';
  import { InjectSchemaCustomMetaKey } from '@/views/config';
  import schemaFieldProps from '../schema-field-props';
  import BasicField from '../../components/basic-field.vue';
  import { genFieldPropsAndRules } from '../../utils';

  export default defineComponent({
    inject: ['schemaFormStatus'],
    props: schemaFieldProps,
    emits: ['change'],
    setup(props, { emit }) {
      const schemaCustomMeta = inject(InjectSchemaCustomMetaKey, ref({}));

      const { fieldProps, rules } = genFieldPropsAndRules({
        schema: props.schema,
        schemaCustomMeta: schemaCustomMeta.value,
        requiredFields: props.requiredFields
      });

      props.FieldPathMap.set(_.join(props.fieldPath, '.'), {
        required: fieldProps.required,
        isBasicType: true,
        isNullable: props.schema.nullable || props.schema.originNullable,
        fieldPath: props.fieldPath,
        ..._.pick(props.schema, [
          'type',
          'nullable',
          'originNullable',
          'isItemsProperty'
        ])
      });

      const handleChange = (data) => {
        emit('change', data);
      };

      return () => {
        return (
          <a-grid-item
            span={{ lg: props.schema.colSpan, md: 12, sm: 12, xs: 12 }}
          >
            <BasicField
              {...fieldProps}
              readonly={fieldProps.readonly}
              required={fieldProps.required}
              formData={props.formData}
              uiFormData={props.uiFormData}
              defaultFormData={props.defaultFormData}
              cachedFormData={props.cachedFormData}
              FieldPathMap={props.FieldPathMap}
              fieldPath={props.fieldPath}
              schema={props.schema}
              rules={rules}
              action={props.action}
              onChange={(data) => handleChange(data)}
            ></BasicField>
          </a-grid-item>
        );
      };
    }
  });
</script>

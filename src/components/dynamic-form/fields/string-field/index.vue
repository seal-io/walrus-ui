<script lang="tsx">
  import {
    defineComponent,
    inject,
    toRefs,
    ref,
    reactive,
    computed,
    watch
  } from 'vue';
  import _ from 'lodash';
  import schemaFieldProps from '../schema-field-props';
  import BasicField from '../../components/basic-field.vue';
  import { genFieldPropsAndRules } from '../../utils';

  export default defineComponent({
    inject: ['schemaFormStatus'],
    props: schemaFieldProps,
    setup(props, { emit }) {
      const handleChange = (data) => {
        emit('change', data);
      };

      const { fieldProps, rules } = genFieldPropsAndRules({
        schema: props.schema,
        requiredFields: props.requiredFields
      });

      console.log('fieldProps=======', props.requiredFields, {
        fieldProps,
        rules
      });
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

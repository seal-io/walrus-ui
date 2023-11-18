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
    inject: ['schemaFormEditable'],
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
          <BasicField
            {...fieldProps}
            required={fieldProps.required}
            formData={props.formData}
            fieldPath={props.fieldPath}
            schema={props.schema}
            rules={rules}
            onChange={(data) => handleChange(data)}
          ></BasicField>
        );
      };
    }
  });
</script>

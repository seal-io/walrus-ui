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
  import { getConditionValue } from '../../form-create/config/utils';
  import { parseExpression } from '../../form-create/config/experssion-parser';
  import schemaFieldProps from '../fields/schema-field-props';
  import { genFieldPropsAndRules } from '../utils';
  import { getSchemaFieldComponent } from '../fields/field-map';

  export default defineComponent({
    props: schemaFieldProps,
    emits: ['change'],
    setup(props, { emit }) {
      if (!_.keys(props.schema.properties)) {
        return null;
      }

      const handleChange = (data) => {
        if (props.onChange) {
          props.onChange(data);
          return;
        }
        emit('change', data);
      };
      const { component, fieldPath } = getSchemaFieldComponent({
        schema: props.schema,
        formData: props.formData,
        fieldPath: props.fieldPath
      });
      console.log('fieldPath=======', props.schema);
      const {
        fieldProps,
        rules,
        default: defauleValue
      } = genFieldPropsAndRules({
        schema: props.schema
      });
      if (fieldProps.showIf) {
        const conditions = parseExpression(fieldProps.showIf);
        const isShow = getConditionValue(
          {
            conditions,
            showIf: fieldProps.showIf
          },
          props.formData
        );
        if (!isShow) {
          return null;
        }
      }
      if (fieldProps.hidden) {
        if (!_.get(props.formData, fieldPath)) {
          _.set(props.formData, fieldPath, defauleValue);
        }
        return null;
      }
      if (!component) return null;

      const currentProps = {
        ...props,
        ...fieldProps,
        rules,
        fieldPath,
        onChange: handleChange
      };
      console.log('currentProps=======', props.schema);
      return () => {
        const Component = component;
        return (
          <Component
            {...currentProps}
            onChange={(data) => handleChange(data)}
          />
        );
      };
    }
  });
</script>

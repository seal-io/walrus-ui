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
  import schemaFieldProps from '../fields/schema-field-props';
  import {
    genFieldPropsAndRules,
    getShowIfValue,
    initFieldDefaultValue
  } from '../utils';
  import { getSchemaFieldComponent } from '../fields/field-map';

  export default defineComponent({
    props: schemaFieldProps,
    emits: ['change'],
    setup(props, { emit }) {
      if (!_.keys(props.schema.properties)) {
        return null;
      }

      // init field value
      if (!_.get(props.formData, props.fieldPath)) {
        _.set(
          props.formData,
          props.fieldPath,
          initFieldDefaultValue(props.schema)
        );
      }

      const handleChange = (data) => {
        emit('change', data);
      };
      const setShowIfField = () => {
        _.unset(props.formData, props.fieldPath);
        emit('change', props.formData);
        return null;
      };

      const { component, fieldPath } = getSchemaFieldComponent({
        schema: props.schema,
        formData: props.formData,
        fieldPath: props.fieldPath
      });

      const {
        fieldProps,
        rules,
        default: defauleValue
      } = genFieldPropsAndRules({
        schema: props.schema
      });

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
      const renderComponent = () => {
        const Component = component;
        if (fieldProps.showIf) {
          return getShowIfValue(fieldProps.showIf, props.formData) ? (
            <Component
              {...currentProps}
              onChange={(data) => handleChange(data)}
            />
          ) : (
            setShowIfField()
          );
        }
        return (
          <Component
            {...currentProps}
            onChange={(data) => handleChange(data)}
          />
        );
      };
      return () => {
        return <>{renderComponent()}</>;
      };
    }
  });
</script>

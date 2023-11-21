<script lang="tsx">
  import { defineComponent } from 'vue';
  import _ from 'lodash';
  import schemaFieldProps from '../fields/schema-field-props';
  import {
    getShowIfValue,
    initFieldDefaultValue,
    setHiddenFieldValue
  } from '../utils';
  import { getSchemaFieldComponent } from '../fields/field-map';

  export default defineComponent({
    props: schemaFieldProps,
    emits: ['change'],
    setup(props, { emit }) {
      if (!_.keys(props.schema.properties)) {
        return null;
      }
      // hidden
      const hidden = _.get(props.schema, ['x-walrus-ui', 'hidden'], false);
      // showIf
      const showIf = _.get(props.schema, ['x-walrus-ui', 'showIf'], '');

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

      //  generate field component and fieldPath
      const { component, fieldPath, requiredFields } = getSchemaFieldComponent({
        schema: props.schema,
        formData: props.formData,
        fieldPath: props.fieldPath
      });

      if (hidden) {
        setHiddenFieldValue({
          schema: props.schema,
          formData: props.formData,
          fieldPath: props.fieldPath
        });
        emit('change', props.formData);
        return null;
      }
      if (!component) return null;

      const renderComponent = () => {
        const Component = component;
        if (showIf) {
          return getShowIfValue(
            showIf,
            props.formData,
            _.initial(fieldPath)
          ) ? (
            <Component
              fieldPath={fieldPath}
              formData={props.formData}
              schema={props.schema}
              requiredFields={props.requiredFields}
              onChange={(data) => handleChange(data)}
            />
          ) : (
            setShowIfField()
          );
        }
        return (
          <Component
            fieldPath={fieldPath}
            formData={props.formData}
            schema={props.schema}
            requiredFields={props.requiredFields}
            parentSpan={props.parentSpan || 12}
            level={props.schema.level || 0}
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

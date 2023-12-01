<script lang="tsx">
  import { defineComponent, inject, ref } from 'vue';
  import _ from 'lodash';
  import { InjectSchemaFormStatusKey, PageAction } from '@/views/config';
  import schemaFieldProps from '../fields/schema-field-props';
  import {
    getShowIfValue,
    initFieldDefaultValue,
    setHiddenFieldValue,
    isRequiredInitField,
    initFieldValue
  } from '../utils';
  import { getSchemaFieldComponent } from '../fields/field-map';

  export default defineComponent({
    props: schemaFieldProps,
    emits: ['change'],
    setup(props, { emit }) {
      const schemaFormStatus = inject(
        InjectSchemaFormStatusKey,
        ref(PageAction.CREATE)
      );
      if (!_.keys(props.schema.properties)) {
        return null;
      }
      // hidden
      const hidden = _.get(props.schema, ['x-walrus-ui', 'hidden'], false);
      // showIf
      const showIf = _.get(props.schema, ['x-walrus-ui', 'showIf'], '');

      // init field value
      // if (
      //   schemaFormStatus.value === PageAction.CREATE &&
      //   isRequiredInitField(
      //     props.schema,
      //     _.includes(props.requiredFields, props.schema.name)
      //   )
      // ) {
      //   _.set(
      //     props.formData,
      //     props.fieldPath,
      //     initFieldDefaultValue(props.schema)
      //   );
      // }

      const handleChange = (data) => {
        emit('change', data);
      };
      const setShowIfField = () => {
        _.unset(props.formData, props.fieldPath);
        _.unset(props.uiFormData, props.fieldPath);
        emit('change', props.formData);
        return null;
      };

      //  generate field component and fieldPath
      const { component, fieldPath } = getSchemaFieldComponent({
        schema: props.schema,
        fieldPath: props.fieldPath
      });

      if (hidden) {
        // init hidden field default value
        if (
          isRequiredInitField(
            props.schema,
            _.includes(props.requiredFields, props.schema.name)
          )
        ) {
          setHiddenFieldValue({
            schema: props.schema,
            formData: props.formData,
            fieldPath: props.fieldPath
          });
          emit('change', props.formData);
        }

        return null;
      }
      if (!component) return null;

      // init field value
      if (schemaFormStatus.value === PageAction.CREATE) {
        initFieldValue({
          schema: props.schema,
          formData: props.formData,
          uiFormData: props.uiFormData,
          fieldPath,
          required: _.includes(props.requiredFields, props.schema.name)
        });
      }
      console.log('data+++++++++', fieldPath, props.formData, props.uiFormData);
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
              uiFormData={props.uiFormData}
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
            uiFormData={props.uiFormData}
            schema={props.schema}
            requiredFields={props.requiredFields}
            parentSpan={props.parentSpan || 12}
            level={props.schema.level || 0}
            action={props.action}
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

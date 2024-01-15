<script lang="tsx">
  import { defineComponent, inject, ref } from 'vue';
  import _ from 'lodash';
  import { InjectSchemaFormStatusKey, PageAction } from '@/views/config';
  import schemaFieldProps from '../fields/schema-field-props';
  import {
    getShowIfValue,
    isBasicType,
    isSelect,
    initFieldValue,
    viewFieldValue
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

      // hidden
      const hidden = _.get(props.schema, ['x-walrus-ui', 'hidden'], false);
      // showIf
      const showIf = _.get(props.schema, ['x-walrus-ui', 'showIf'], '');

      const handleChange = (data) => {
        emit('change', data);
      };
      const setShowIfField = () => {
        _.unset(props.formData, props.fieldPath);
        _.unset(props.uiFormData, props.fieldPath);
        _.unset(props.defaultFormData, props.fieldPath);
        emit('change', props.formData);
        return null;
      };

      //  generate field component and fieldPath
      const { component, fieldPath } = getSchemaFieldComponent({
        schema: props.schema,
        fieldPath: props.fieldPath
      });

      props.FieldPathMap.set(_.join(props.fieldPath, '.'), {
        required: _.includes(props.requiredFields, props.schema.name),
        fieldPath,
        isBasicType: isBasicType(props.schema) || isSelect(props.schema),
        isNullable: props.schema.nullable || props.schema.originNullable,
        ..._.pick(props.schema, [
          'type',
          'nullable',
          'originNullable',
          'isItemsProperty'
        ])
      });

      // init field value
      const initValue = () => {
        if (schemaFormStatus.value === PageAction.CREATE) {
          initFieldValue({
            schema: props.schema,
            defaultFormData: props.defaultFormData,
            formData: props.formData,
            uiFormData: props.uiFormData,
            fieldPath,
            required: _.includes(props.requiredFields, props.schema.name)
          });
          handleChange(props.formData);
        } else {
          viewFieldValue({
            defaultFormData: props.defaultFormData,
            schema: props.schema,
            formData: props.formData,
            uiFormData: props.uiFormData,
            fieldPath,
            required: _.includes(props.requiredFields, props.schema.name)
          });
        }
      };

      initValue();
      console.log(
        'create+++++++++++++',
        props.schema,
        props.fieldPath,
        schemaFormStatus.value,
        props.uiFormData,
        props.formData,
        props.defaultFormData
      );
      // hidden field
      if (!component || hidden) return null;

      const renderComponent = () => {
        const Component = component;
        if (showIf) {
          return getShowIfValue(
            showIf,
            props.uiFormData,
            _.initial(fieldPath)
          ) ? (
            <Component
              fieldPath={fieldPath}
              formData={props.formData}
              uiFormData={props.uiFormData}
              defaultFormData={props.defaultFormData}
              FieldPathMap={props.FieldPathMap}
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
            defaultFormData={props.defaultFormData}
            FieldPathMap={props.FieldPathMap}
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

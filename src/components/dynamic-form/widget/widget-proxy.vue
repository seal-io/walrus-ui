<script lang="tsx">
  import { defineComponent, inject, ref } from 'vue';
  import { InjectSchemaFormStatusKey, PageAction } from '@/views/config';
  import _ from 'lodash';
  import schemaFieldProps from '../fields/schema-field-props';
  import { genFieldPropsAndRules } from '../utils';
  import { widgetTypeMap } from '../../form-create/bussiness-components';
  import widgetMaps from './widget-maps';
  import ComponentsMap from '../components/components-map';

  export default defineComponent({
    inject: ['schemaFormStatus'],
    props: schemaFieldProps,
    emits: ['change'],
    setup(props, { emit }) {
      const schemaFormStatus = inject(
        InjectSchemaFormStatusKey,
        ref(PageAction.CREATE)
      );
      const { fieldProps, rules } = genFieldPropsAndRules({
        schema: props.schema,
        requiredFields: props.requiredFields
      });

      const widget = _.get(props.schema, ['x-walrus-ui', 'widget'], '');
      const widgetType = widgetTypeMap[widget];
      let Component = _.get(widgetMaps, widgetType);

      if (!widgetType) {
        Component = ComponentsMap[widget];
      }

      props.FieldPathMap.set(_.join(props.fieldPath, '.'), {
        required: fieldProps.required,
        type: props.schema.type,
        fieldPath: props.fieldPath,
        isBasicType: true,
        isNullable: props.schema.nullable || props.schema.originNullable
      });

      const handleChange = (data) => {
        emit('change', data);
      };

      return () => {
        return (
          <a-grid-item
            span={{ lg: props.schema.colSpan, md: 12, sm: 12, xs: 12 }}
          >
            <Component
              {...fieldProps}
              widget={widget}
              readonly={fieldProps.readonly}
              required={fieldProps.required}
              formData={props.formData}
              uiFormData={props.uiFormData}
              defaultFormData={props.defaultFormData}
              FieldPathMap={props.FieldPathMap}
              fieldPath={props.fieldPath}
              schema={props.schema}
              rules={rules}
              action={props.action}
              onChange={(data) => handleChange(data)}
            ></Component>
          </a-grid-item>
        );
      };
    }
  });
</script>

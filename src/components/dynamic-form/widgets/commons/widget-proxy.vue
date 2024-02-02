<script lang="tsx">
  import { defineComponent, inject, ref } from 'vue';
  import {
    InjectSchemaFormStatusKey,
    InjectSchemaCustomMetaKey,
    PageAction
  } from '@/views/config';
  import _ from 'lodash';
  import schemaFieldProps from '@/components/dynamic-form/fields/schema-field-props';
  import { genFieldPropsAndRules } from '@/components/dynamic-form/utils';
  import ComponentsMap from '@/components/dynamic-form/components/components-map';
  import { widgetTypeMap } from '../components/index';
  import widgetWrapMaps from './widget-wrap-maps';

  export default defineComponent({
    inject: ['schemaFormStatus'],
    props: schemaFieldProps,
    emits: ['change'],
    setup(props, { emit }) {
      const schemaFormStatus = inject(
        InjectSchemaFormStatusKey,
        ref(PageAction.CREATE)
      );
      const schemaCustomMeta = inject(InjectSchemaCustomMetaKey, ref({}));
      const { fieldProps, rules } = genFieldPropsAndRules({
        schema: props.schema,
        schemaCustomMeta: schemaCustomMeta.value,
        requiredFields: props.requiredFields
      });

      const widget = _.get(props.schema, ['x-walrus-ui', 'widget'], '');
      const widgetType = widgetTypeMap[widget];
      let Component = _.get(widgetWrapMaps, widgetType);

      if (!widgetType) {
        Component = ComponentsMap[widget];
      }

      props.FieldPathMap.set(_.join(props.fieldPath, '.'), {
        required: fieldProps.required,
        type: props.schema?.type,
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
            class="widget-proxy"
            span={{ lg: props.schema.colSpan, md: 12, sm: 12, xs: 12 }}
          >
            <Component
              {...fieldProps}
              widget={widget}
              readonly={fieldProps.readonly}
              required={fieldProps.required}
              requiredFields={props.requiredFields}
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

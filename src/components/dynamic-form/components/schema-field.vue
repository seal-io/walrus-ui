<script lang="tsx">
  import {
    defineComponent,
    inject,
    ref,
    onMounted,
    computed,
    watch
  } from 'vue';
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

      const showIfValue = computed(() => {
        if (!showIf) return false;
        return getShowIfValue(
          showIf,
          props.uiFormData,
          _.initial(props.fieldPath)
        );
      });
      const handleChange = (data) => {
        emit('change', data);
      };
      const unsetShowIfField = () => {
        _.unset(props.formData, props.fieldPath);
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
            hidden,
            required: _.includes(props.requiredFields, props.schema.name)
          });
        }
      };
      watch(
        () => showIfValue.value,
        () => {
          // only used on showIf field
          if (showIf) {
            if (showIfValue.value) {
              initValue();
            } else {
              unsetShowIfField();
            }
          }
        },
        { immediate: true }
      );

      // do not init value when field has configured showIf
      if (!showIf) {
        initValue();
      }

      // hidden field
      if (!component || hidden) return null;

      const renderComponent = () => {
        const Component = component;

        // =============== showIf start =================
        if (showIf && !showIfValue.value) {
          return null;
        }
        // =============== showIf end =================

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

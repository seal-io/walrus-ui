<script lang="tsx">
  import _ from 'lodash';
  import {
    defineComponent,
    toRefs,
    inject,
    ref,
    reactive,
    computed,
    watch
  } from 'vue';
  import schemaFieldProps from '../fields/schema-field-props';
  import { FieldTypes } from '../fields/field-map';
  import { isSelect, isNumber, isDatePicker, isPassword } from '../utils';
  import { Option } from '../interface';

  export default defineComponent({
    inject: ['schemaFormEditable'],
    props: schemaFieldProps,
    emits: ['change'],
    setup(props, { emit }) {
      const schemaFormEditable = inject('schemaFormEditable');
      const { type } = toRefs(props.schema);

      let Component = FieldTypes[type.value];
      let options: Option[] = [];
      if (isSelect(props.schema)) {
        Component = FieldTypes.common.select;
        if (props.schema.enum) {
          options = props.schema.enum.map((item) => {
            return {
              label: item,
              value: item
            };
          });
        }

        if (props.schema.items) {
          const currentValue = _.get(props.formData, props.fieldPath, []);
          options = currentValue.map((item) => {
            return {
              label: item,
              value: item
            };
          });
        }
      }

      if (isNumber(props.schema)) {
        Component = FieldTypes[type.value]?.number;
      }

      if (isDatePicker(props.schema) && props.schema.format) {
        Component = FieldTypes.formats[props.schema.format];
      }

      if (isPassword(props.schema)) {
        Component = FieldTypes.common.password;
      }

      const handleChange = (val) => {
        _.set(props.formData, props.fieldPath, val);
        if (props.onChange) {
          props.onChange(val);
          return;
        }
        emit('change', val);
      };

      return () => (
        <a-form-item
          hide-label={true}
          rules={props.rules}
          field={_.join(props.fieldPath, ',')}
        >
          <Component
            {...props}
            options={options}
            onChange={(val) => {
              handleChange(val);
            }}
          ></Component>
        </a-form-item>
      );
    }
  });
</script>

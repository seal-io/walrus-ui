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
  import {
    BasicFieldMaps,
    CommonFieldMaps,
    FormatsFieldMaps
  } from '../fields/field-map';
  import {
    isSelect,
    isNumber,
    isBoolean,
    isDatePicker,
    isPassword
  } from '../utils';
  import { Option } from '../interface';

  export default defineComponent({
    inject: ['schemaFormEditable'],
    props: schemaFieldProps,
    emits: ['change'],
    setup(props, { emit, attrs }) {
      console.log('props=====99==', { props, attrs });
      const schemaFormEditable = inject('schemaFormEditable');
      const { type } = toRefs(props.schema);

      let Component = BasicFieldMaps[type.value];
      let options: Option[] = [];
      if (isSelect(props.schema)) {
        Component = CommonFieldMaps.select;
        if (props.schema.enum) {
          options = props.schema.enum.map((item) => {
            return {
              label: item,
              value: item
            };
          });
        }
      }

      if (isDatePicker(props.schema) && props.schema.format) {
        Component = FormatsFieldMaps[props.schema.format];
      }

      if (isPassword(props.schema)) {
        Component = CommonFieldMaps.password;
      }

      const handleChange = (val) => {
        _.set(props.formData, props.fieldPath, val);
        if (props.onChange) {
          props.onChange(val);
          return;
        }
        emit('change', val);
      };

      const handleSelectInputChange = (e: any) => {
        if (isBoolean(props.schema)) {
          _.set(props.formData, props.fieldPath, e.target.checked);
        } else {
          _.set(props.formData, props.fieldPath, e);
        }
      };

      return () => (
        <a-form-item
          hide-label={true}
          rules={props.rules}
          field={_.join(props.fieldPath, '.')}
        >
          <Component
            {...props}
            {...attrs}
            style="width: 100%"
            popupInfo={attrs.description}
            modelValue={_.get(props.formData, props.fieldPath)}
            options={options}
            onInput={(e) => {
              handleSelectInputChange(e);
            }}
            onChange={(val) => {
              handleChange(val);
            }}
          ></Component>
        </a-form-item>
      );
    }
  });
</script>

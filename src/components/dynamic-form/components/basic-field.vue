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
  import { InjectSchemaFormEditableKey } from '@/views/config';
  import schemaFieldProps from '../fields/schema-field-props';
  import {
    BasicFieldMaps,
    CommonFieldMaps,
    FormatsFieldMaps,
    isAllowCreateNumberSelect,
    isAllowCreateSelect
  } from '../fields/field-map';
  import {
    isSelect,
    isNumber,
    isBoolean,
    isDatePicker,
    isMuliSelect,
    isPassword,
    initFieldDefaultValue
  } from '../utils';
  import { Option } from '../interface';

  export default defineComponent({
    props: schemaFieldProps,
    emits: ['change'],
    setup(props, { emit, attrs }) {
      console.log('props=====99==', { props, attrs });
      const schemaFormEditable = inject(InjectSchemaFormEditableKey);

      const numberReg = /\d+/;
      const { type } = toRefs(props.schema);

      let Component = BasicFieldMaps[type.value];
      const options = ref<Option[]>([]);

      const handleChange = (data) => {
        emit('change', data);
      };

      // init field value
      if (!_.get(props.formData, props.fieldPath)) {
        _.set(
          props.formData,
          props.fieldPath,
          initFieldDefaultValue(props.schema)
        );
      }

      if (isSelect(props.schema)) {
        Component = CommonFieldMaps.select;
        if (props.schema.enum) {
          options.value = props.schema.enum.map((item) => {
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

      const handleSelectInputChange = (e: any) => {
        if (isBoolean(props.schema)) {
          _.set(props.formData, props.fieldPath, e.target.checked);
        }
        if (!isSelect(props.schema)) {
          _.set(props.formData, props.fieldPath, e);
        }
      };

      return () => (
        <a-form-item
          hide-label={true}
          rules={props.rules}
          field={_.join(props.fieldPath, '.')}
          validate-trigger={['change']}
        >
          <Component
            {...props}
            {...attrs}
            style="width: 100%"
            popupInfo={attrs.description}
            model-value={_.get(props.formData, props.fieldPath)}
            options={options.value}
            onInput={(e) => {
              console.log('basic-field==', e.target?.value, props.schema);
              handleSelectInputChange(e);
            }}
            onChange={(val) => {
              _.set(props.formData, props.fieldPath, val);
              console.log('basic-field==change', val, props, props.formData);
              handleChange(props.formData);
            }}
          ></Component>
        </a-form-item>
      );
    }
  });
</script>

<script lang="tsx">
  import _ from 'lodash';
  import {
    defineComponent,
    toRefs,
    inject,
    ref,
    withModifiers,
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

      const filterEmptyOnSelect = (list, e) => {
        if (isAllowCreateSelect(props.schema)) {
          return _.filter(list, (v) => !_.isEmpty(v));
        }
        return list;
      };
      const handleSelectInputChange = (e: any) => {
        if (
          isAllowCreateNumberSelect(props.schema) &&
          !numberReg.test(e.data)
        ) {
          e.target.value = e.target.value.replace(/[^\d]/g, '');
        }
      };

      const renderSelectOptions = () => {
        if (isSelect(props.schema)) {
          return (
            <>
              <a-option style={{ display: 'none' }}></a-option>
              {_.map(options.value, (item) => {
                return <a-option value={item.value}>{item.label}</a-option>;
              })}
            </>
          );
        }
        return null;
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
            allow-search={false}
            popupInfo={attrs.description}
            model-value={_.get(props.formData, props.fieldPath)}
            onInput={(e) => {
              console.log('basic-field==input', e.target?.value, props.schema);
              handleSelectInputChange(e);
            }}
            onChange={(val, e) => {
              val = filterEmptyOnSelect(val, e);
              _.set(props.formData, props.fieldPath, val);
              console.log('basic-field==change', val, props, props.formData);
              handleChange(props.formData);
            }}
          >
            {renderSelectOptions()}
          </Component>
        </a-form-item>
      );
    }
  });
</script>

<script lang="tsx">
  import _ from 'lodash';
  import { defineComponent, toRefs, inject, ref } from 'vue';
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
    checkValidValue,
    initFieldDefaultValue
  } from '../utils';
  import { Option } from '../interface';
  import { ProviderFormRefKey } from '../config';

  export default defineComponent({
    props: {
      ...schemaFieldProps,
      rules: {
        type: Array,
        default: () => []
      }
    },
    emits: ['change'],
    setup(props, { emit, attrs }) {
      const schemaFormEditable = inject(InjectSchemaFormEditableKey);
      const formref = inject(ProviderFormRefKey, ref());

      const widget = _.get(props.schema, ['x-walrus-ui', 'widget'], '');
      const numberReg = /\d+/;
      const { type } = toRefs(props.schema);

      let Component = BasicFieldMaps[type.value];
      const options = ref<Option[]>([]);

      const handleUnsetField = () => {
        if (
          !checkValidValue({
            schema: props.schema,
            value: _.get(props.schema, props.fieldPath),
            required: props.required
          })
        ) {
          const res = _.unset(props.schema, props.fieldPath);
          emit('change', props.formData);
        }
      };
      const handleChange = (data) => {
        emit('change', data);

        setTimeout(() => {
          formref.value?.validateField(props.fieldPath);
        });
      };

      // init field value
      if (!_.get(props.formData, props.fieldPath)) {
        _.set(
          props.formData,
          props.fieldPath,
          initFieldDefaultValue(props.schema)
        );
      }

      // textarea
      if (type.value === 'string' && widget === 'TextArea') {
        Component = CommonFieldMaps.textArea;
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
        } else if (props.schema.default) {
          const defaultList = _.isArray(props.schema.default)
            ? props.schema.default
            : [props.schema.default];
          options.value = defaultList.map((item) => {
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
        } else if (isBoolean(props.schema)) {
          _.set(props.schema, props.fieldPath, e.target.checked);
        } else {
          _.set(props.schema, props.fieldPath, e);
        }
        console.log('basic-field==input---2', e, e.target?.value, props.schema);
      };
      const renderSelectOptions = () => {
        if (isSelect(props.schema)) {
          return (
            <>
              {_.map(options.value, (item) => {
                return <a-option value={item.value}>{item.label}</a-option>;
              })}
            </>
          );
        }
        return null;
      };

      const fieldValue = ref(_.get(props.formData, props.fieldPath));

      return () => (
        <a-form-item
          hide-label={true}
          rules={props.rules}
          label={props.schema.title}
          field={_.join(props.fieldPath, '.')}
          validate-trigger={['change']}
        >
          <Component
            {...attrs}
            required={props.required}
            label={props.label}
            style="width: 100%"
            allow-search={false}
            editor-id={_.join(props.fieldPath, '-')}
            popupInfo={props.schema.description}
            v-model={fieldValue.value}
            onInput={(e) => {
              console.log(
                'basic-field==input----1',
                e,
                e.target?.value,
                props.schema
              );
              handleSelectInputChange(e);
            }}
            onChange={(val, e) => {
              val = filterEmptyOnSelect(val, e);
              _.set(props.formData, props.fieldPath, val);

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

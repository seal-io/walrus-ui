<script lang="tsx">
  import _ from 'lodash';
  import { defineComponent, toRefs, inject, ref, watch } from 'vue';
  import { InjectSchemaFormEditableKey } from '@/views/config';
  import SealFormItemWrap from '@/components/seal-form/components/seal-form-item-wrap.vue';
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
    initFieldDefaultValue,
    isRequiredInitField,
    isEmptyvalue
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
      const schemaFormEditable = inject(InjectSchemaFormEditableKey, ref(true));
      const formref = inject(ProviderFormRefKey, ref());

      const widget = _.get(props.schema, ['x-walrus-ui', 'widget'], '');
      const numberReg = /\d+/;
      const { type } = toRefs(props.schema);

      let Component = BasicFieldMaps[type.value];
      const options = ref<Option[]>([]);

      const handleUnsetField = () => {
        if (
          isEmptyvalue(_.get(props.formData, props.fieldPath)) &&
          !props.schema.default
        ) {
          _.unset(props.formData, props.fieldPath);
        }
      };
      const handleChange = (data) => {
        handleUnsetField();
        emit('change', data);

        setTimeout(() => {
          formref.value?.validateField(props.fieldPath);
        });
      };

      // init field value
      if (
        props.action === 'create' &&
        isRequiredInitField(
          props.schema,
          _.includes(props.requiredFields, props.schema.name)
        )
      ) {
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
          options.value = _.map(props.schema.enum, (item) => {
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
        if (props.action !== 'create') {
          const value = _.get(props.formData, props.fieldPath);
          const list = _.concat(value).map((item) => {
            return {
              label: item,
              value: item
            };
          });
          options.value = _.uniqBy(_.concat(options.value, list), 'value');
        }
      }

      if (isDatePicker(props.schema) && props.schema.format) {
        Component = FormatsFieldMaps[props.schema.format];
      }

      if (isPassword(props.schema)) {
        Component = CommonFieldMaps.password;
      }
      const isNotEmpty = (val) => {
        return val === '' || val === undefined || val === null;
      };
      const filterEmptyOnSelect = (list, e) => {
        if (isAllowCreateSelect(props.schema)) {
          return _.filter(list, (v) => !isNotEmpty(v));
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
      const renderEdit = () => {
        return (
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
              allow-clear={!props.schema.enum}
              editor-id={_.join(props.fieldPath, '-')}
              popupInfo={props.schema.description}
              v-model={fieldValue.value}
              onInput={(e) => {
                console.log('basic-field==input----1', e, props.schema);
                handleSelectInputChange(e);
              }}
              onChange={(val, e) => {
                const newVal = filterEmptyOnSelect(val, e);

                if (isAllowCreateNumberSelect(props.schema)) {
                  fieldValue.value = _.map(newVal, (v) => {
                    return _.toNumber(v);
                  });
                } else {
                  fieldValue.value = val;
                }

                _.set(props.formData, props.fieldPath, fieldValue.value);
                console.log(
                  'basic-field==change----1',
                  fieldValue.value,
                  props.schema
                );
                handleChange(props.formData);
              }}
            >
              {renderSelectOptions()}
            </Component>
          </a-form-item>
        );
      };

      return () => (
        <>
          {schemaFormEditable.value ? (
            renderEdit()
          ) : (
            <a-form-item
              hide-label={true}
              rules={props.rules}
              label={props.schema.title}
              field={_.join(props.fieldPath, '.')}
              validate-trigger={['change']}
            >
              <SealFormItemWrap label={props.schema.title} style="width: 100%">
                {isBoolean(props.schema) ? (
                  <a-checkbox
                    modelValue={fieldValue.value}
                    size="small"
                  ></a-checkbox>
                ) : (
                  <span>{_.get(props.formData, props.fieldPath)}</span>
                )}
              </SealFormItemWrap>
            </a-form-item>
          )}
        </>
      );
    }
  });
</script>

<script lang="tsx">
  import _ from 'lodash';
  import { defineComponent, toRefs, inject, ref, watch } from 'vue';
  import { InjectSchemaFormStatusKey, PageAction } from '@/views/config';
  import SealFormItemWrap from '@/components/seal-form/components/seal-form-item-wrap.vue';
  import schemaFieldProps from '../fields/schema-field-props';
  import {
    isSelect,
    isNumber,
    isBoolean,
    isDatePicker,
    isMuliSelect,
    isPassword,
    initFieldDefaultValue,
    isRequiredInitField,
    isEmptyvalue,
    isAllowCreateNumberSelect,
    isAllowCreateSelect,
    genFieldPropsAndRules,
    initFieldValue,
    unsetFieldValue
  } from '../utils';
  import { Option } from '../interface';
  import { ProviderFormRefKey } from '../config';

  export default defineComponent({
    props: {
      ...schemaFieldProps
    },
    emits: ['change'],
    setup(props, { emit }) {
      const schemaFormStatus = inject(
        InjectSchemaFormStatusKey,
        ref(PageAction.CREATE)
      );
      const formref = inject(ProviderFormRefKey, ref());
      const { type } = toRefs(props.schema);

      const options = ref<Option[]>([]);

      const handleUnsetField = () => {
        if (
          isEmptyvalue(_.get(props.formData, props.fieldPath)) &&
          !props.schema.default
        ) {
          _.unset(props.formData, props.fieldPath);
        }
      };
      const { fieldProps, rules } = genFieldPropsAndRules({
        schema: props.schema,
        requiredFields: props.requiredFields
      });
      const handleChange = (data) => {
        emit('change', data);

        setTimeout(() => {
          formref.value?.validateField(props.fieldPath);
        });
      };

      // init field value
      if (
        schemaFormStatus.value === PageAction.CREATE &&
        isRequiredInitField(props.schema, fieldProps.required)
      ) {
        _.set(
          props.formData,
          props.fieldPath,
          initFieldDefaultValue(props.schema)
        );
      }

      const initValue = () => {
        if (schemaFormStatus.value === PageAction.CREATE) {
          initFieldValue({
            schema: props.schema,
            formData: props.formData,
            fieldPath: props.fieldPath,
            required: fieldProps.required
          });
        }
      };
      const initOptions = () => {
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
        if (schemaFormStatus.value !== PageAction.CREATE) {
          const value = _.get(props.formData, props.fieldPath);
          const list = _.concat(value).map((item) => {
            return {
              label: item,
              value: item
            };
          });
          options.value = _.uniqBy(_.concat(options.value, list), 'value');
        }
        options.value = _.filter(options.value, (v) => !isEmptyvalue(v.value));
      };

      const isValueEmpty = (val) => {
        return val === '' || val === undefined || val === null;
      };
      const filterEmptyOnSelect = (list) => {
        if (isAllowCreateSelect(props.schema)) {
          return _.filter(list, (v) => !isValueEmpty(v));
        }
        return list;
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

      const showArrayValue = (val) => {
        if (_.isArray(val)) {
          return _.join(val, ',');
        }
        return val;
      };

      initOptions();
      // initValue();
      const renderEdit = () => {
        return (
          <a-form-item
            hide-label={true}
            rules={rules}
            label={fieldProps.label}
            field={_.join(props.fieldPath, '.')}
            validate-trigger={['change']}
          >
            <seal-select
              {...fieldProps}
              style="width: 100%"
              allow-search={false}
              required={fieldProps.required}
              label={fieldProps.label}
              disabled={
                fieldProps.readonly ||
                (fieldProps.immutable &&
                  schemaFormStatus.value !== PageAction.CREATE)
              }
              allow-clear={!props.schema.enum}
              editor-id={_.join(props.fieldPath, '-')}
              popupInfo={props.schema.description}
              modelValue={_.get(props.formData, props.fieldPath)}
              onChange={(val) => {
                const newVal = filterEmptyOnSelect(val);
                let value = newVal;
                if (isAllowCreateNumberSelect(props.schema)) {
                  value = _.map(newVal, (v) => {
                    return _.toNumber(v);
                  });
                } else {
                  value = newVal;
                }

                _.set(props.formData, props.fieldPath, value);
                handleChange(props.formData);
                if (
                  (isEmptyvalue(value) || !value?.length) &&
                  !props.schema.default
                ) {
                  unsetFieldValue({
                    schema: props.schema,
                    formData: props.formData,
                    fieldPath: props.fieldPath,
                    required: fieldProps.required
                  });
                }
                console.log('group====newVal=', newVal, fieldValue.value);
              }}
            >
              {renderSelectOptions()}
            </seal-select>
          </a-form-item>
        );
      };

      return () => (
        <a-grid-item
          span={{ lg: props.schema.colSpan, md: 12, sm: 12, xs: 12 }}
        >
          {schemaFormStatus.value !== PageAction.VIEW ? (
            renderEdit()
          ) : (
            <a-form-item
              hide-label={true}
              rules={rules}
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
                  <span>
                    {(isPassword(props.schema) || props.schema.writeOnly) &&
                    _.get(props.formData, props.fieldPath)
                      ? '******'
                      : showArrayValue(_.get(props.formData, props.fieldPath))}
                  </span>
                )}
              </SealFormItemWrap>
            </a-form-item>
          )}
        </a-grid-item>
      );
    }
  });
</script>

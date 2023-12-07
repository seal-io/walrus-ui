<script lang="tsx">
  import _ from 'lodash';
  import i18n from '@/locale';
  import { defineComponent, toRefs, inject, ref, watch } from 'vue';
  import { InjectSchemaFormStatusKey, PageAction } from '@/views/config';
  import SealViewItemWrap from '@/components/seal-form/components/seal-view-item-wrap.vue';
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
    viewFieldValue,
    unsetFieldValue,
    genFieldInFormData,
    parentObjectExsits,
    isEqualOn
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
      };

      const validateField = () => {
        setTimeout(() => {
          formref.value?.validateField(_.join(props.fieldPath, '.'));
        });
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

      const showArrayValue = (val) => {
        if (_.isArray(val)) {
          return _.join(val, ',');
        }
        return val;
      };

      initOptions();

      const renderEdit = () => {
        return (
          <a-form-item
            hide-label={true}
            label={fieldProps.label}
            field={_.join(props.fieldPath, '.')}
            validate-trigger={['change']}
            rules={[
              ...rules,
              {
                validator: (value, callback) => {
                  if (
                    !parentObjectExsits(props.formData, props.fieldPath) ||
                    !fieldProps.required
                  ) {
                    callback();
                    return;
                  }
                  if (!value) {
                    callback(
                      `${i18n.global.t('common.form.rule.select', {
                        name: fieldProps.label
                      })}`
                    );
                  } else {
                    callback();
                  }
                }
              }
            ]}
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
              modelValue={_.get(props.uiFormData, props.fieldPath)}
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
                _.set(props.uiFormData, props.fieldPath, value);
                console.log(
                  'selectList===',
                  props.fieldPath,
                  value,
                  props.schema.default
                );
                if (isEqualOn(value, props.schema.default)) {
                  unsetFieldValue({
                    defaultFormData: props.defaultFormData,
                    uiFormData: props.uiFormData,
                    schema: props.schema,
                    formData: props.formData,
                    fieldPath: props.fieldPath,
                    required: fieldProps.required
                  });
                } else {
                  genFieldInFormData({
                    uiFormData: props.uiFormData,
                    schema: props.schema,
                    formData: props.formData,
                    fieldPath: props.fieldPath,
                    required: fieldProps.required
                  });
                }
                handleChange(props.formData);
                validateField();
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
              <SealViewItemWrap label={props.schema.title} style="width: 100%">
                {isBoolean(props.schema) ? (
                  <a-checkbox
                    modelValue={_.get(props.uiFormData, props.fieldPath)}
                    size="small"
                  ></a-checkbox>
                ) : (
                  <span>
                    {(isPassword(props.schema) || props.schema.writeOnly) &&
                    _.get(props.uiFormData, props.fieldPath)
                      ? '******'
                      : showArrayValue(
                          _.get(props.uiFormData, props.fieldPath)
                        )}
                  </span>
                )}
              </SealViewItemWrap>
            </a-form-item>
          )}
        </a-grid-item>
      );
    }
  });
</script>

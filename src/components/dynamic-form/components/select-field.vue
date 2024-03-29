<script lang="tsx">
  import _ from 'lodash';
  import i18n from '@/locale';
  import { defineComponent, toRefs, inject, ref, watch } from 'vue';
  import {
    InjectSchemaFormStatusKey,
    InjectSchemaCustomMetaKey,
    InjectSchemaValidationTypeKey,
    PageAction
  } from '@/views/config';
  import SealViewItemWrap from '@/components/seal-form/components/seal-view-item-wrap.vue';
  import schemaFieldProps from '../fields/schema-field-props';
  import {
    isSelect,
    isBoolean,
    isPassword,
    isEmptyvalue,
    isAllowCreateSelect,
    genFieldPropsAndRules,
    unsetFieldValue,
    genFieldInFormData,
    parentObjectExsits,
    isEqualOn,
    parentObjectExsitsInFormData
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

      const InjectSchemaValidationType = inject(
        InjectSchemaValidationTypeKey,
        ref(true)
      );
      const formref = inject(ProviderFormRefKey, ref());
      const schemaCustomMeta = inject(InjectSchemaCustomMetaKey, ref({}));
      const { type } = toRefs(props.schema);

      const options = ref<Option[]>([]);

      const { fieldProps, rules } = genFieldPropsAndRules({
        schema: props.schema,
        schemaCustomMeta: schemaCustomMeta.value,
        requiredFields: props.requiredFields
      });

      props.FieldPathMap.set(_.join(props.fieldPath, '.'), {
        required: fieldProps.required,
        fieldPath: props.fieldPath,
        isNullable: props.schema.nullable || props.schema.originNullable,
        isBasicType: true,
        ..._.pick(props.schema, [
          'type',
          'nullable',
          'originNullable',
          'isItemsProperty'
        ])
      });
      const handleChange = (data) => {
        emit('change', data);
      };

      const validateField = () => {
        setTimeout(() => {
          formref.value?.validateField(_.join(props.fieldPath, '.'));
        });
      };

      const handleInputChangeCall = (value) => {
        _.set(props.formData, props.fieldPath, value);
        _.set(props.uiFormData, props.fieldPath, value);

        if (isEqualOn(value, _.get(props.defaultFormData, props.fieldPath))) {
          unsetFieldValue({
            FieldPathMap: props.FieldPathMap,
            defaultFormData: props.defaultFormData,
            uiFormData: props.uiFormData,
            schema: props.schema,
            formData: props.formData,
            fieldPath: props.fieldPath,
            required: fieldProps.required
          });
        } else {
          genFieldInFormData({
            FieldPathMap: props.FieldPathMap,
            defaultFormData: props.defaultFormData,
            uiFormData: props.uiFormData,
            schema: props.schema,
            formData: props.formData,
            fieldPath: props.fieldPath,
            required: fieldProps.required
          });
        }
        handleChange(props.formData);
        validateField();
      };

      // do not handle nullable peroperty
      const handleInputChange = (val) => {
        const isEmptyList = _.isArray(val) && !val?.length;
        if (
          !props.required &&
          (isEmptyvalue(val) || isEmptyList) &&
          val !== 0
        ) {
          _.unset(props.formData, props.fieldPath);
          _.unset(props.uiFormData, props.fieldPath);
        } else {
          _.set(props.formData, props.fieldPath, val);
          _.set(props.uiFormData, props.fieldPath, val);
        }
        handleChange(props.formData);
        validateField();
      };

      const initOptions = () => {
        if (props.schema.enum) {
          options.value = _.map(props.schema.enum, (item) => {
            return {
              label: _.toString(item),
              value: item
            };
          });
        } else if (props.schema.default) {
          const defaultList = _.isArray(props.schema.default)
            ? props.schema.default
            : [props.schema.default];
          options.value = defaultList.map((item) => {
            return {
              label: _.toString(item),
              value: item
            };
          });
        }
        if (schemaFormStatus.value !== PageAction.CREATE) {
          const value = _.get(props.formData, props.fieldPath);
          const list = _.concat(value).map((item) => {
            return {
              label: _.toString(item),
              value: item
            };
          });
          options.value = _.uniqBy(_.concat(options.value, list), 'value');
        }
        options.value = _.filter(options.value, (v) => !isEmptyvalue(v.value));

        // init default value for enum

        if (
          schemaFormStatus.value !== PageAction.VIEW &&
          props.schema.enum &&
          !props.schema.default &&
          parentObjectExsitsInFormData({
            formData: props.formData,
            fieldPath: props.fieldPath,
            schema: props.schema
          })
        ) {
          _.set(props.formData, props.fieldPath, options.value[0].value);
          _.set(props.uiFormData, props.fieldPath, options.value[0].value);
        }
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
                  if (!InjectSchemaValidationType.value) {
                    callback();
                    return;
                  }
                  if (
                    !parentObjectExsits(props.formData, props.fieldPath) ||
                    !fieldProps.required
                  ) {
                    callback();
                    return;
                  }
                  if (!value || !value?.length) {
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
              options={options.value}
              style="width: 100%"
              allow-search={false}
              required={fieldProps.required}
              label={fieldProps.label}
              disabled={
                fieldProps.readonly ||
                (fieldProps.immutable &&
                  schemaFormStatus.value !== PageAction.CREATE)
              }
              allow-clear={!fieldProps.required && !props.schema.enum}
              editor-id={_.join(props.fieldPath, '-')}
              popupInfo={props.schema.description}
              modelValue={_.get(props.uiFormData, props.fieldPath)}
              onChange={(val) => {
                const newVal = filterEmptyOnSelect(val);
                handleInputChange(newVal);
              }}
            ></seal-select>
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

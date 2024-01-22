<script lang="tsx">
  import _ from 'lodash';
  import i18n from '@/locale';
  import { defineComponent, toRefs, inject, ref, watch } from 'vue';
  import {
    InjectSchemaFormStatusKey,
    InjectSchemaCustomMetaKey,
    PageAction
  } from '@/views/config';
  import SealViewItemWrap from '@/components/seal-form/components/seal-view-item-wrap.vue';
  import schemaFieldProps from '../fields/schema-field-props';
  import {
    isEmptyvalue,
    initFieldValue,
    viewFieldValue,
    unsetFieldValue,
    parentObjectExsits,
    isRequiredInitField,
    initFieldDefaultValue,
    genFieldPropsAndRules,
    genFieldInFormData,
    isEqualOn
  } from '../utils';
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
      const schemaFormStatus = inject(
        InjectSchemaFormStatusKey,
        ref(PageAction.CREATE)
      );
      const schemaCustomMeta = inject(InjectSchemaCustomMetaKey, ref({}));

      const formref = inject(ProviderFormRefKey, ref());

      const { type } = toRefs(props.schema);

      const { fieldProps, rules } = genFieldPropsAndRules({
        schema: props.schema,
        schemaCustomMeta: schemaCustomMeta.value,
        requiredFields: props.requiredFields
      });

      props.FieldPathMap.set(_.join(props.fieldPath, '.'), {
        required: fieldProps.required,
        isBasicType: true,
        isNullable: props.schema.nullable || props.schema.originNullable,
        fieldPath: props.fieldPath,
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

      const initFieldValue = () => {
        if (
          (fieldProps.required || _.isBoolean(props.schema.default)) &&
          !props.schema.readOnly
        ) {
          _.set(props.formData, props.fieldPath, !!props.schema.default);
          _.set(props.uiFormData, props.fieldPath, !!props.schema.default);
          handleChange(props.formData);
        }
      };

      const handleInputChangeCall = (val) => {
        _.set(props.formData, props.fieldPath, val);
        _.set(props.uiFormData, props.fieldPath, val);
        if (
          _.get(props.defaultFormData, props.fieldPath) === null &&
          !val &&
          props.schema.nullable
        ) {
          _.unset(props.formData, props.fieldPath);
        }

        if (isEqualOn(val, _.get(props.defaultFormData, props.fieldPath))) {
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
      };

      const handleInputChange = (val) => {
        if (val === null && !fieldProps.required) {
          _.unset(props.formData, props.fieldPath);
        } else {
          _.set(props.formData, props.fieldPath, val);
          _.set(props.uiFormData, props.fieldPath, val);
        }
      };

      const renderEdit = () => {
        return (
          <a-form-item
            hide-label={true}
            rules={[
              ...rules,
              {
                validator: (value, callback) => {
                  if (
                    !parentObjectExsits(props.formData, props.fieldPath) ||
                    !fieldProps.required
                  ) {
                    callback();
                  }
                }
              }
            ]}
            label={fieldProps.label}
            field={_.join(props.fieldPath, '.')}
            validate-trigger={['change']}
          >
            <seal-checkbox
              {...fieldProps}
              required={fieldProps.required}
              label={fieldProps.label}
              style="width: 100%"
              allow-search={false}
              disabled={
                fieldProps.readonly ||
                (fieldProps.immutable &&
                  schemaFormStatus.value !== PageAction.CREATE)
              }
              popupInfo={props.schema.description}
              modelValue={_.get(props.uiFormData, props.fieldPath)}
              onChange={(val) => {
                if (_.get(props.defaultFormData, props.fieldPath) === null) {
                  val = !val ? null : val;
                }
                handleInputChange(val);
                handleChange(props.formData);
                validateField();
              }}
            ></seal-checkbox>
          </a-form-item>
        );
      };

      initFieldValue();

      return () => (
        <a-grid-item
          span={{ lg: props.schema.colSpan, md: 12, sm: 12, xs: 12 }}
        >
          {schemaFormStatus.value !== PageAction.VIEW ? (
            renderEdit()
          ) : (
            <a-form-item
              hide-label={true}
              rules={props.rules}
              label={props.schema.title}
              field={_.join(props.fieldPath, '.')}
              validate-trigger={['change']}
            >
              <SealViewItemWrap label={props.schema.title} style="width: 100%">
                <a-checkbox
                  modelValue={_.get(props.uiFormData, props.fieldPath)}
                  size="small"
                ></a-checkbox>
              </SealViewItemWrap>
            </a-form-item>
          )}
        </a-grid-item>
      );
    }
  });
</script>

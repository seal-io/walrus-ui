<script lang="tsx">
  import _ from 'lodash';
  import i18n from '@/locale';
  import { defineComponent, toRefs, inject, ref } from 'vue';
  import {
    InjectSchemaFormStatusKey,
    InjectSchemaValidationTypeKey,
    PageAction
  } from '@/views/config';
  import SealViewItemWrap from '@/components/seal-form/components/seal-view-item-wrap.vue';
  import schemaFieldProps from '../fields/schema-field-props';
  import {
    BasicFieldMaps,
    CommonFieldMaps,
    FormatsFieldMaps
  } from './basic-components';
  import {
    isDatePicker,
    isPassword,
    isNumber,
    initFieldValue,
    unsetFieldValue,
    genFieldInFormData,
    parentObjectExsits,
    viewFieldValue,
    isEmptyvalue,
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
      const formref = inject(ProviderFormRefKey, ref());
      const InjectSchemaValidationType = inject(
        InjectSchemaValidationTypeKey,
        ref(true)
      );

      const widget = _.get(props.schema, ['x-walrus-ui', 'widget'], '');

      const { type } = toRefs(props.schema);

      let Component = BasicFieldMaps[type.value];
      const handleChange = (data) => {
        emit('change', data);
      };

      const validateField = () => {
        formref.value?.validateField(_.join(props.fieldPath, '.'));
      };

      const debunceValidateField = _.debounce(validateField, 200);
      // textarea
      if (type.value === 'string' && widget === 'TextArea') {
        Component = CommonFieldMaps.textArea;
      }

      if (isDatePicker(props.schema) && props.schema.format) {
        Component = FormatsFieldMaps[props.schema.format];
      }

      if (isPassword(props.schema)) {
        Component = CommonFieldMaps.password;
      }

      const handleInputChangeCall = (val: any) => {
        val = isEmptyvalue(val) ? null : val;
        _.set(props.formData, props.fieldPath, val);
        _.set(props.uiFormData, props.fieldPath, val);
        if (isEqualOn(val, _.get(props.defaultFormData, props.fieldPath))) {
          unsetFieldValue({
            FieldPathMap: props.FieldPathMap,
            defaultFormData: props.defaultFormData,
            schema: props.schema,
            formData: props.formData,
            uiFormData: props.uiFormData,
            fieldPath: props.fieldPath,
            required: props.required
          });
        } else {
          genFieldInFormData({
            FieldPathMap: props.FieldPathMap,
            defaultFormData: props.defaultFormData,
            schema: props.schema,
            uiFormData: props.uiFormData,
            formData: props.formData,
            fieldPath: props.fieldPath,
            required: props.required
          });
        }
        handleChange(props.formData);
      };

      // do not handle nullable peroperty
      const handleInputChange = (val) => {
        if (isEmptyvalue(val) && val !== 0) {
          val = null;
        }
        _.set(props.formData, props.fieldPath, val);
        _.set(props.uiFormData, props.fieldPath, val);
        if (!props.required && isEmptyvalue(val) && val !== 0) {
          _.unset(props.formData, props.fieldPath);
          _.unset(props.uiFormData, props.fieldPath);
        }
        handleChange(props.formData);
      };

      const debunceHandleInputChange = _.debounce(handleInputChange, 100);
      const debunceHandleChange = _.debounce((val) => {
        handleInputChange(val);
        validateField();
      });
      const renderAppend = () => {
        const unit = _.get(props.schema, ['x-walrus-ui', 'unit'], '');
        if (unit) {
          return {
            append: () => {
              return unit;
            }
          };
        }
        return null;
      };
      const renderEdit = () => {
        return (
          <a-form-item
            hide-label={true}
            rules={[
              ...props.rules,
              {
                validator: (value, callback) => {
                  if (!InjectSchemaValidationType.value) {
                    callback();
                    return;
                  }
                  if (
                    !parentObjectExsits(props.formData, props.fieldPath) ||
                    !props.required
                  ) {
                    callback();
                    return;
                  }
                  if (!value && value !== 0) {
                    callback(
                      `${i18n.global.t('common.form.rule.input', {
                        name: props.schema.title || props.schema.name
                      })}`
                    );
                  } else {
                    callback();
                  }
                }
              }
            ]}
            label={props.schema.title}
            field={_.join(props.fieldPath, '.')}
            validate-trigger={['change']}
          >
            <Component
              {...attrs}
              password={isPassword(props.schema) || props.schema.writeOnly}
              doc={props.doc}
              required={props.required}
              editorId={_.join(props.fieldPath, '.')}
              label={props.schema.title || props.schema.name}
              style="width: 100%"
              key={_.join(props.fieldPath, '.')}
              allow-search={false}
              v-slots={{
                ...renderAppend()
              }}
              disabled={
                props.readonly ||
                (attrs.immutable &&
                  schemaFormStatus.value !== PageAction.CREATE)
              }
              readonly={
                props.readonly ||
                (attrs.immutable &&
                  schemaFormStatus.value !== PageAction.CREATE)
              }
              allow-clear={true}
              popupInfo={props.schema.description}
              modelValue={_.get(props.uiFormData, props.fieldPath)}
              model-event="input"
              onUpdate:modelValue={(val) => {
                if (isNumber(props.schema)) {
                  debunceHandleInputChange(val);
                } else {
                  handleInputChange(val);
                }
                debunceValidateField();
              }}
              onInput={(val) => {
                if (isNumber(props.schema)) {
                  debunceHandleInputChange(val);
                } else {
                  handleInputChange(val);
                }
              }}
              onChange={(val) => {
                handleInputChange(val);
              }}
            ></Component>
          </a-form-item>
        );
      };

      return () => (
        <>
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
              <SealViewItemWrap
                label={props.schema.title}
                style="width: 100%"
                v-slots={{
                  ...renderAppend()
                }}
              >
                <span>
                  {(isPassword(props.schema) || props.schema.writeOnly) &&
                  _.get(props.uiFormData, props.fieldPath)
                    ? '******'
                    : _.get(props.uiFormData, props.fieldPath)}
                </span>
              </SealViewItemWrap>
            </a-form-item>
          )}
        </>
      );
    }
  });
</script>

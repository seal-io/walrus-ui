<script lang="tsx">
  import _ from 'lodash';
  import i18n from '@/locale';
  import { defineComponent, toRefs, inject, ref, watch } from 'vue';
  import { InjectSchemaFormStatusKey, PageAction } from '@/views/config';
  import SealFormItemWrap from '@/components/seal-form/components/seal-form-item-wrap.vue';
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
    isMuliSelect,
    isPassword,
    checkValidValue,
    initFieldDefaultValue,
    isRequiredInitField,
    isEmptyvalue,
    initFieldValue,
    unsetFieldValue,
    parentObjectExsits
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

      const widget = _.get(props.schema, ['x-walrus-ui', 'widget'], '');
      const numberReg = /\d+/;
      const { type } = toRefs(props.schema);

      let Component = BasicFieldMaps[type.value];

      const handleChange = (data) => {
        emit('change', data);

        setTimeout(() => {
          formref.value?.validateField(props.fieldPath);
        });
      };

      // init field value
      // if (
      //   schemaFormStatus.value === PageAction.CREATE &&
      //   isRequiredInitField(
      //     props.schema,
      //     _.includes(props.requiredFields, props.schema.name)
      //   )
      // ) {
      //   _.set(
      //     props.formData,
      //     props.fieldPath,
      //     initFieldDefaultValue(props.schema)
      //   );
      // }

      const initValue = () => {
        if (schemaFormStatus.value === PageAction.CREATE) {
          initFieldValue({
            schema: props.schema,
            formData: props.formData,
            uiFormData: props.uiFormData,
            fieldPath: props.fieldPath,
            required: props.required
          });
        }
      };

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

      const handleSelectInputChange = (e: any) => {
        _.set(props.schema, props.fieldPath, e);
      };

      const fieldValue = ref(_.get(props.uiFormData, props.fieldPath));

      const showArrayValue = (val) => {
        if (_.isArray(val)) {
          return _.join(val, ',');
        }
        return val;
      };

      initValue();
      const renderEdit = () => {
        return (
          <a-form-item
            hide-label={true}
            rules={[
              ...props.rules,
              {
                validator: (value, callback) => {
                  if (
                    !parentObjectExsits(props.uiFormData, props.fieldPath) ||
                    !props.required
                  ) {
                    callback();
                    return;
                  }
                  if (!isBoolean(props.schema)) {
                    if (!value) {
                      callback(
                        `${props.schema.title}${i18n.global.t(
                          'common.form.rule.input'
                        )}`
                      );
                    } else {
                      callback();
                    }
                  } else {
                    callback();
                  }
                }
              }
            ]}
            label={props.schema.title}
            field={_.join(props.fieldPath, '.')}
            validate-trigger={['change', 'blur']}
          >
            <Component
              {...attrs}
              required={props.required}
              label={props.label}
              style="width: 100%"
              allow-search={false}
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
              onInput={(e) => {
                handleSelectInputChange(e);
              }}
              onChange={(val, e) => {
                fieldValue.value = val;
                _.set(props.formData, props.fieldPath, val);
                _.set(props.uiFormData, props.fieldPath, val);
                handleChange(props.formData);
                if (isEmptyvalue(val) && !props.schema.default) {
                  unsetFieldValue({
                    schema: props.schema,
                    formData: props.formData,
                    fieldPath: props.fieldPath,
                    required: props.required
                  });
                }
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
              <SealFormItemWrap label={props.schema.title} style="width: 100%">
                <span>
                  {(isPassword(props.schema) || props.schema.writeOnly) &&
                  _.get(props.uiFormData, props.fieldPath)
                    ? '******'
                    : showArrayValue(_.get(props.uiFormData, props.fieldPath))}
                </span>
              </SealFormItemWrap>
            </a-form-item>
          )}
        </>
      );
    }
  });
</script>

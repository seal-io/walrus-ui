<script lang="tsx">
  import _ from 'lodash';
  import { defineComponent, toRefs, inject, ref } from 'vue';
  import i18n from '@/locale';
  import { InjectSchemaFormStatusKey, PageAction } from '@/views/config';
  import SealViewItemWrap from '@/components/seal-form/components/seal-view-item-wrap.vue';
  import {
    parentObjectExsits,
    isPassword,
    isNumber,
    unsetFieldValue,
    genFieldInFormData,
    isEmptyvalue,
    isEqualOn
  } from '@/components/dynamic-form/utils';
  import schemaFieldProps from '@/components/dynamic-form/fields/schema-field-props';
  import ComponentsMap from '@/components/dynamic-form/components/components-map';
  import { ProviderFormRefKey } from '@/components/dynamic-form/config';

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

      const Component = ComponentsMap[widget];

      const handleChange = (data) => {
        emit('change', data);
      };

      const validateField = () => {
        setTimeout(() => {
          formref.value?.validateField(_.join(props.fieldPath, '.'));
        });
      };

      const handleInputChange = (val: any) => {
        val = isEmptyvalue(val) ? null : val;
        _.set(props.formData, props.fieldPath, val);
        _.set(props.uiFormData, props.fieldPath, val);
        if (!val && val !== 0 && !props.required) {
          _.unset(props.formData, props.fieldPath);
        }
        handleChange(props.formData);
      };

      const debunceHandleInputChange = _.debounce(handleInputChange, 100);
      const renderEdit = () => {
        return (
          <a-form-item
            hide-label={true}
            rules={[
              ...props.rules,
              {
                validator: (value, callback) => {
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
                        name: props.schema.title
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
              widget={widget}
              required={props.required}
              editorId={_.join(props.fieldPath, '.')}
              label={props.label}
              style="width: 100%"
              allow-search={true}
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
              onUpdate:modelValue={(val) => {
                if (isNumber(props.schema)) {
                  debunceHandleInputChange(val);
                } else {
                  handleInputChange(val);
                }
                validateField();
              }}
              onInput={(val) => {
                if (isNumber(props.schema)) {
                  debunceHandleInputChange(val);
                } else {
                  handleInputChange(val);
                }
                validateField();
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
              label={props.schema.title}
              field={_.join(props.fieldPath, '.')}
            >
              <SealViewItemWrap label={props.schema.title} style="width: 100%">
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

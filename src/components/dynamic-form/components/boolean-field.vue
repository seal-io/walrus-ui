<script lang="tsx">
  import _ from 'lodash';
  import i18n from '@/locale';
  import { defineComponent, toRefs, inject, ref, watch } from 'vue';
  import { InjectSchemaFormStatusKey, PageAction } from '@/views/config';
  import SealFormItemWrap from '@/components/seal-form/components/seal-form-item-wrap.vue';
  import schemaFieldProps from '../fields/schema-field-props';
  import {
    isEmptyvalue,
    initFieldValue,
    unsetFieldValue,
    parentObjectExsits,
    isRequiredInitField,
    initFieldDefaultValue
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

      const { type } = toRefs(props.schema);

      const handleUnsetField = () => {
        if (
          isEmptyvalue(_.get(props.formData, props.fieldPath)) &&
          !props.schema.default
        ) {
          _.unset(props.formData, props.fieldPath);
        }
      };
      const handleChange = (data) => {
        emit('change', data);

        setTimeout(() => {
          formref.value?.validateField(props.fieldPath);
        });
      };

      // init field value
      if (
        schemaFormStatus.value === PageAction.CREATE &&
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

      const initValue = () => {
        if (schemaFormStatus.value === PageAction.CREATE) {
          initFieldValue({
            schema: props.schema,
            formData: props.formData,
            fieldPath: props.fieldPath,
            required: props.required
          });
        }
      };

      const fieldValue = ref(_.get(props.formData, props.fieldPath));

      // initValue();
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
                  }
                }
              }
            ]}
            label={props.schema.title}
            field={_.join(props.fieldPath, '.')}
            validate-trigger={['change']}
          >
            <seal-checkbox
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
              popupInfo={props.schema.description}
              modelValue={_.get(props.formData, props.fieldPath)}
              onChange={(val) => {
                fieldValue.value = val;
                _.set(props.formData, props.fieldPath, val);
                handleChange(props.formData);
                if (val === !!props.schema.default) {
                  console.log('unsetFieldValue+++++++++++', props.fieldPath);
                  unsetFieldValue({
                    schema: props.schema,
                    formData: props.formData,
                    fieldPath: props.fieldPath,
                    required: props.required
                  });
                }
              }}
            ></seal-checkbox>
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
              rules={props.rules}
              label={props.schema.title}
              field={_.join(props.fieldPath, '.')}
              validate-trigger={['change']}
            >
              <SealFormItemWrap label={props.schema.title} style="width: 100%">
                <a-checkbox
                  modelValue={_.get(props.formData, props.fieldPath)}
                  size="small"
                ></a-checkbox>
              </SealFormItemWrap>
            </a-form-item>
          )}
        </a-grid-item>
      );
    }
  });
</script>

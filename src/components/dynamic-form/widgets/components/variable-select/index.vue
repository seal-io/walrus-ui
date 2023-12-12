<script lang="tsx">
  import _ from 'lodash';
  import i18n from '@/locale';
  import {
    defineComponent,
    toRefs,
    inject,
    ref,
    onMounted,
    computed,
    watch
  } from 'vue';
  import {
    InjectSchemaFormStatusKey,
    InjectCompleteDataKey,
    PageAction
  } from '@/views/config';
  import { HintKey } from '@/views/config/interface';
  import SealViewItemWrap from '@/components/seal-form/components/seal-view-item-wrap.vue';
  import schemaFieldProps from '@/components/dynamic-form/fields/schema-field-props';
  import {
    isSelect,
    isNumber,
    isBoolean,
    isPassword,
    isEmptyvalue,
    genFieldPropsAndRules,
    unsetFieldValue,
    genFieldInFormData,
    parentObjectExsits,
    isEqualOn
  } from '@/components/dynamic-form/utils';
  import { Option } from '@/components/dynamic-form/interface';
  import { ProviderFormRefKey } from '@/components/dynamic-form/config';
  import { CheckConnectorCatagory, BU } from '../../types';

  export default defineComponent({
    widgets: [BU.SensitiveVariableSelect, BU.VariableSelect],
    props: {
      ...schemaFieldProps,
      widget: {
        type: String,
        default: ''
      }
    },
    emits: ['change'],
    setup(props, { emit }) {
      const schemaFormStatus = inject(
        InjectSchemaFormStatusKey,
        ref(PageAction.CREATE)
      );
      const completeData: any = inject(InjectCompleteDataKey, ref({}));
      const formref = inject(ProviderFormRefKey, ref());

      const { type } = toRefs(props.schema);

      const options = ref<Option[]>([]);

      const optionList = computed(() => {
        let resultList: any[] = [];
        const vars = _.get(completeData.value, 'var', []);
        if (props.widget === BU.SensitiveVariableSelect) {
          resultList = _.filter(vars, (item) => {
            return item?.sensitive;
          });
        }
        if (props.widget === BU.VariableSelect) {
          resultList = _.filter(vars, (item) => {
            return !item?.sensitive;
          });
        }
        return _.map(resultList || [], (item) => {
          return {
            label: item?.label,
            value: `\${var.${item?.label}}`
          };
        });
      });
      const { fieldProps, rules } = genFieldPropsAndRules({
        schema: props.schema,
        requiredFields: props.requiredFields
      });

      props.FieldPathMap.set(_.join(props.fieldPath, '.'), {
        required: fieldProps.required,
        type: props.schema.type,
        fieldPath: props.fieldPath,
        isBasicType: true,
        isNullable: props.schema.nullable || props.schema.originNullable
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
              style="width: 100%"
              allow-search={false}
              required={fieldProps.required}
              label={fieldProps.label}
              disabled={
                fieldProps.readonly ||
                (fieldProps.immutable &&
                  schemaFormStatus.value !== PageAction.CREATE)
              }
              options={optionList.value}
              allow-clear={!props.schema.enum}
              editor-id={_.join(props.fieldPath, '-')}
              popupInfo={props.schema.description}
              modelValue={_.get(props.uiFormData, props.fieldPath)}
              onChange={(value) => {
                _.set(props.formData, props.fieldPath, value);
                _.set(props.uiFormData, props.fieldPath, value);
                if (props.schema.isItemsProperty) {
                  return;
                }
                if (
                  isEqualOn(
                    value,
                    _.get(props.defaultFormData, props.fieldPath)
                  )
                ) {
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
              validate-trigger={['change']}
            >
              <SealViewItemWrap label={props.schema.title} style="width: 100%">
                {
                  _.find(optionList.value, {
                    value: _.get(props.uiFormData, props.fieldPath)
                  })?.label
                }
              </SealViewItemWrap>
            </a-form-item>
          )}
        </a-grid-item>
      );
    }
  });
</script>

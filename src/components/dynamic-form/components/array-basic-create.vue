<script lang="tsx">
  import _ from 'lodash';
  import i18n from '@/locale';
  import { defineComponent, toRefs, inject, ref } from 'vue';
  import { InjectSchemaFormStatusKey, PageAction } from '@/views/config';
  import SealViewItemWrap from '@/components/seal-form/components/seal-view-item-wrap.vue';
  import SealFormItemWrap from '@/components/seal-form/components/seal-form-item-wrap.vue';
  import schemaFieldProps from '../fields/schema-field-props';
  import { BasicFieldMaps, CommonFieldMaps } from './basic-components';
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
    parentObjectExsits,
    viewFieldValue
  } from '../utils';
  import { ProviderFormRefKey } from '../config';
  import CommonButton from './common-button.vue';

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
      const list = ref<any>([]);

      const numberReg = /\d+/;
      const type = props.schema.items?.type || 'string';
      console.log('group props=======', props.schema);
      let Component = BasicFieldMaps[type];

      const handleChange = (data) => {
        emit('change', data);
      };

      const validateField = () => {
        setTimeout(() => {
          formref.value?.validateField(props.fieldPath);
        });
      };
      const initValue = () => {
        if (schemaFormStatus.value === PageAction.CREATE) {
          initFieldValue({
            schema: props.schema,
            formData: props.formData,
            uiFormData: props.uiFormData,
            fieldPath: props.fieldPath,
            required: props.required
          });
          handleChange(props.formData);
        } else {
          viewFieldValue({
            schema: props.schema,
            formData: props.formData,
            uiFormData: props.uiFormData,
            fieldPath: props.fieldPath,
            required: props.required
          });
        }
      };

      if (isPassword(props.schema.items)) {
        Component = CommonFieldMaps.password;
      }

      const handleInputChange = () => {
        _.set(props.formData, props.fieldPath, list.value);
        _.set(props.uiFormData, props.fieldPath, list.value);
        handleChange(props.formData);
      };

      const handleAddClick = () => {
        list.value.push(null);
      };

      const setDataList = () => {
        list.value = _.get(props.uiFormData, props.fieldPath, []);
      };

      setDataList();

      // initValue();

      const renderAddButton = () => {
        if (schemaFormStatus.value === PageAction.VIEW) {
          return null;
        }
        return (
          <CommonButton
            onClick={() => handleAddClick()}
            action="add"
            title={props.schema.title}
          ></CommonButton>
        );
      };
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
                  if (!value) {
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
            <SealFormItemWrap label={props.schema.title} style="width: 100%">
              {_.map(list.value, (item, index) => {
                return (
                  <Component
                    {...attrs}
                    required={props.required}
                    editorId={_.join(props.fieldPath, '.')}
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
                    modelValue={_.get(list.value, index)}
                    onInput={(val) => {
                      console.log(
                        'group inpu+++++input========',
                        val,
                        props.formData
                      );
                      list.value[index] = val;
                      handleInputChange();
                    }}
                    onChange={(val) => {
                      list.value[index] = val;
                      _.set(props.formData, props.fieldPath, list.value);
                      _.set(props.uiFormData, props.fieldPath, list.value);

                      handleChange(props.formData);
                      validateField();
                    }}
                  ></Component>
                );
              })}
              {renderAddButton()}
            </SealFormItemWrap>
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
        </a-grid-item>
      );
    }
  });
</script>

<script lang="tsx">
  import _ from 'lodash';
  import i18n from '@/locale';
  import { defineComponent, toRefs, inject, ref } from 'vue';
  import {
    InjectSchemaFormStatusKey,
    InjectSchemaCustomMetaKey,
    PageAction
  } from '@/views/config';
  import SealViewItemWrap from '@/components/seal-form/components/seal-view-item-wrap.vue';
  import SealFormItemWrap from '@/components/seal-form/components/seal-form-item-wrap.vue';
  import schemaFieldProps from '../fields/schema-field-props';
  import { BasicFieldMaps, CommonFieldMaps } from './basic-components';
  import {
    isBoolean,
    isPassword,
    isEmptyvalue,
    initFieldValue,
    parentObjectExsits,
    viewFieldValue,
    unsetFieldValue,
    isEqualOn,
    genFieldInFormData,
    genFieldPropsAndRules
  } from '../utils';
  import { ProviderFormRefKey } from '../config';
  import CommonButton from './common-button.vue';
  import { FieldSchema } from '../interface';

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
      const schemaCustomMeta = inject(InjectSchemaCustomMetaKey, ref({}));
      const list = ref<any[]>([]);

      const type = props.schema.items?.type || 'string';
      const { fieldProps, rules } = genFieldPropsAndRules({
        schema: props.schema,
        schemaCustomMeta: schemaCustomMeta.value,
        requiredFields: props.requiredFields
      });
      props.FieldPathMap.set(_.join(props.fieldPath, '.'), {
        required: fieldProps.required,
        isNullable: props.schema.nullable || props.schema.originNullable,
        fieldPath: props.fieldPath,
        isBasicType: true,
        ..._.pick(props.schema, [
          'type',
          'nullable',
          'originNullable',
          'isItemsProperty'
        ])
      });
      let Component = BasicFieldMaps[type];

      const handleChange = (data) => {
        emit('change', data);
      };

      const validateField = () => {
        setTimeout(() => {
          formref.value?.validateField(_.join(props.fieldPath, '.'));
        });
      };

      if (isPassword(props.schema.items as FieldSchema)) {
        Component = CommonFieldMaps.password;
      }

      const handleInputChangeCall = () => {
        const res = _.filter(list.value, (item) => {
          return !isEmptyvalue(item);
        });

        _.set(props.formData, props.fieldPath, res);
        _.set(props.uiFormData, props.fieldPath, res);
        if (!res.length && props.schema.nullable) {
          _.unset(props.formData, props.fieldPath);
        }
        // if (props.schema.isItemsProperty) {
        //   return;
        // }
        if (isEqualOn(res, _.get(props.defaultFormData, props.fieldPath))) {
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
      };

      // do not handle nullable peroperty
      const handleInputChange = () => {
        const val = _.filter(list.value, (item) => {
          return !isEmptyvalue(item);
        });
        if (!fieldProps.required && !val?.length) {
          _.unset(props.formData, props.fieldPath);
        } else {
          _.set(props.formData, props.fieldPath, val);
          _.set(props.uiFormData, props.fieldPath, val);
        }
        handleChange(props.formData);
      };

      const debounceHandleInputChange = _.debounce(handleInputChange, 100);
      const handleAddClick = () => {
        const item = !list.value.length
          ? props.schema.items?.default || null
          : null;
        list.value.push(item);
        handleInputChange();
      };

      const handleDeleteClick = (index) => {
        list.value.splice(index, 1);
        handleInputChange();
      };

      const setDataList = () => {
        list.value = _.get(props.uiFormData, props.fieldPath, []);
      };

      setDataList();

      const renderAddButton = ({ size, hoverable }) => {
        if (schemaFormStatus.value === PageAction.VIEW) {
          return null;
        }
        return (
          <CommonButton
            onClick={() => handleAddClick()}
            action="add"
            size={size}
            hoverable={hoverable}
            tooltip={false}
          ></CommonButton>
        );
      };
      const renderDeleteButton = (index) => {
        if (schemaFormStatus.value === PageAction.VIEW) {
          return null;
        }
        return (
          <CommonButton
            onClick={() => handleDeleteClick(index)}
            action="delete"
            size={20}
            tooltip={false}
            hoverable={false}
          ></CommonButton>
        );
      };
      const renderEdit = () => {
        return (
          <a-form-item
            hide-label={true}
            style="width: 100%"
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
            <SealFormItemWrap
              label={`${props.schema.title || props.schema.name || ''}`}
              popupInfo={props.schema.description}
              required={fieldProps.required}
              doc={props.schema.externalDocs}
              style="width: 100%"
            >
              <a-grid cols={12} col-gap={18} row-gap={16}>
                {_.map(list.value, (item, index) => {
                  return (
                    <a-grid-item
                      key={index}
                      span={{
                        lg: props.schema.colSpan || 12,
                        md: 12,
                        sm: 12,
                        xs: 12
                      }}
                    >
                      <span class="item">
                        <Component
                          {...attrs}
                          editorId={_.join(props.fieldPath, '.')}
                          label={`${props.schema.title || ''} ${index + 1}`}
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
                          modelValue={_.get(list.value, index)}
                          onInput={(val) => {
                            if (isBoolean(props.schema.items as FieldSchema)) {
                              list.value[index] = val.target.checked;
                            } else {
                              list.value[index] = val;
                            }
                            debounceHandleInputChange();
                          }}
                          onChange={(val) => {
                            handleInputChange();
                            validateField();
                          }}
                        ></Component>
                        <span class="btn-wrap">
                          {renderDeleteButton(index)}
                          {index === list.value.length - 1
                            ? renderAddButton({ size: 20, hoverable: false })
                            : null}
                        </span>
                      </span>
                    </a-grid-item>
                  );
                })}
                {!list.value.length
                  ? renderAddButton({ size: 24, hoverable: true })
                  : null}
              </a-grid>
            </SealFormItemWrap>
          </a-form-item>
        );
      };

      const renderView = () => {
        return (
          <a-form-item
            style="width: 100%"
            hide-label={true}
            rules={props.rules}
            label={props.schema.title}
            field={_.join(props.fieldPath, '.')}
            validate-trigger={['change']}
          >
            <SealFormItemWrap
              label={`${props.schema.title || props.schema.name || ''}`}
              popupInfo={props.schema.description}
              style="width: 100%"
            >
              <a-grid cols={12} col-gap={18} row-gap={16} style="width: 100%">
                {_.map(list.value, (item, index) => {
                  return (
                    <a-grid-item
                      key={index}
                      span={{
                        lg: props.schema.colSpan || 12,
                        md: 12,
                        sm: 12,
                        xs: 12
                      }}
                    >
                      <SealViewItemWrap
                        label={`${props.schema.title || ''} ${index + 1}`}
                      >
                        {_.get(list.value, index)}
                      </SealViewItemWrap>
                    </a-grid-item>
                  );
                })}
              </a-grid>
            </SealFormItemWrap>
          </a-form-item>
        );
      };
      return () => (
        <a-grid-item
          span={{ lg: props.schema.parentSpan, md: 12, sm: 12, xs: 12 }}
        >
          {schemaFormStatus.value !== PageAction.VIEW
            ? renderEdit()
            : renderView()}
        </a-grid-item>
      );
    }
  });
</script>

<style lang="less" scoped>
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .btn-wrap {
      display: flex;
      flex-basis: 60px;
      align-items: center;
      justify-content: space-between;
      margin-left: 12px;
    }
  }
</style>

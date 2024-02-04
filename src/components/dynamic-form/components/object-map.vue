<script lang="tsx">
  import { defineComponent, ref, inject } from 'vue';
  import _ from 'lodash';
  import i18n from '@/locale';
  import {
    InjectSchemaFormStatusKey,
    InjectSchemaCustomMetaKey,
    InjectSchemaValidationTypeKey,
    PageAction
  } from '@/views/config';
  import MapString from '@/components/form-create/custom-components/map-string.vue';
  import SealFormItemWrap from '@/components/seal-form/components/seal-form-item-wrap.vue';
  import SealViewItemWrap from '@/components/seal-form/components/seal-view-item-wrap.vue';
  import schemaFieldProps from '../fields/schema-field-props';
  import {
    genFieldPropsAndRules,
    isEqualOn,
    genFieldInFormData,
    unsetFieldValue,
    parentObjectExsits
  } from '../utils';
  import { ProviderFormRefKey } from '../config';

  export default defineComponent({
    props: schemaFieldProps,
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

      const schemaCustomMeta = inject(InjectSchemaCustomMetaKey, ref({}));
      const formref = inject(ProviderFormRefKey, ref());

      const initialPath = _.initial(props.fieldPath);

      const validateField = () => {
        formref.value?.validateField(_.join(props.fieldPath, '.'));
      };

      const handleChange = (data) => {
        emit('change', data);
      };

      const debunceValidateField = _.debounce(validateField, 200);

      const { fieldProps, rules } = genFieldPropsAndRules({
        schema: props.schema,
        schemaCustomMeta: schemaCustomMeta.value,
        requiredFields: props.requiredFields
      });
      props.FieldPathMap.set(_.join(props.fieldPath, '.'), {
        required: fieldProps.required,
        fieldPath: props.fieldPath,
        isNullable: props.schema.nullable || props.schema.originNullable,
        isBasicType: false,
        ..._.pick(props.schema, [
          'type',
          'nullable',
          'originNullable',
          'isItemsProperty'
        ])
      });
      // value is number
      const isMapNumber =
        _.isObject(props.schema.additionalProperties) &&
        _.includes(
          ['number', 'integer'],
          props.schema.additionalProperties?.type
        );

      // value is boolean
      const isMapBoolean =
        _.isObject(props.schema.additionalProperties) &&
        props.schema.additionalProperties?.type === 'boolean';

      // init map(string) value

      const validateLabels = () => {
        const labels = _.get(props.uiFormData, props.fieldPath);
        const keys = _.keys(labels);
        return _.some(keys, (key) => {
          return !_.trim(key);
        });
      };

      const checkInvalidKey = (obj) => {
        const keys = _.keys(obj);
        return _.some(keys, (key) => {
          return !_.trim(key);
        });
      };
      const genObjValue = (obj) => {
        const keys = _.keys(obj);
        const res = {};
        _.forEach(keys, (key) => {
          if (key) {
            res[key] = _.get(obj, key);
          }
        });
        return res;
      };

      const handleInputChangeCall = (val) => {
        if (!_.keys(val).length && props.schema.nullable) {
          _.unset(props.formData, props.fieldPath);
          _.unset(props.uiFormData, props.fieldPath);
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
        if (!_.keys(val).length && !fieldProps.required) {
          _.unset(props.formData, props.fieldPath);
          _.unset(props.uiFormData, props.fieldPath);
        }
      };
      const renderEdit = () => {
        return (
          <a-form-item
            hide-label={true}
            required={fieldProps.required}
            label={`${props.schema.title}`}
            field={_.join(props.fieldPath, '.')}
            validate-trigger={['change']}
            rules={[
              {
                required: fieldProps.required,
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
                  if (!value || !_.keys(value).length) {
                    callback(
                      `${i18n.global.t('common.form.rule.input', {
                        name: props.schema.title || props.schema.name
                      })}`
                    );
                    return;
                  }
                  if (validateLabels()) {
                    callback(i18n.global.t('common.rule.object.key'));
                    return;
                  }

                  callback();
                }
              }
            ]}
          >
            <SealFormItemWrap
              popupInfo={props.schema.description}
              required={fieldProps.required}
              label={`${props.schema.title || props.schema.name || ''}`}
              doc={props.schema.externalDocs}
              style="width: 100%"
            >
              <MapString
                showNumberInput={isMapNumber}
                showCheckbox={isMapBoolean}
                editorId={_.join(props.fieldPath, '.')}
                modelValue={_.get(props.uiFormData, props.fieldPath)}
                readonly={
                  PageAction.VIEW === schemaFormStatus.value ||
                  fieldProps.readonly
                }
                onUpdate:value={(val) => {
                  if (checkInvalidKey(val)) {
                    return;
                  }
                  val = genObjValue(_.clone(val));
                  _.set(props.formData, props.fieldPath, _.clone(val));
                  _.set(props.uiFormData, props.fieldPath, _.clone(val));
                  handleInputChange(val);
                  handleChange(props.formData);
                  debunceValidateField();
                }}
              ></MapString>
            </SealFormItemWrap>
          </a-form-item>
        );
      };

      const renderView = () => {
        return (
          <a-form-item
            hide-label={true}
            label={`${props.schema.title}`}
            field={_.join(props.fieldPath, '.')}
          >
            <SealFormItemWrap
              popupInfo={props.schema.description}
              label={`${props.schema.title || props.schema.name || ''}`}
              style="width: 100%"
            >
              {_.map(
                _.keys(_.get(props.uiFormData, props.fieldPath)),
                (key) => {
                  return (
                    <span class="item">
                      <SealViewItemWrap
                        label={`${i18n.global.t('common.input.key')}`}
                        style="width: 100%"
                      >
                        {key}
                      </SealViewItemWrap>
                      <span class="separator">:</span>
                      <SealViewItemWrap
                        label={`${i18n.global.t('common.input.value')}`}
                        style="width: 100%;"
                      >
                        {_.get(props.uiFormData, [...props.fieldPath, key])}
                      </SealViewItemWrap>
                    </span>
                  );
                }
              )}
            </SealFormItemWrap>
          </a-form-item>
        );
      };

      return () => (
        <a-grid-item
          span={{
            lg:
              _.get(props.schema, 'colSpan') ||
              _.get(props.schema, ['x-walrus-ui', 'colSpan']) ||
              props.schema.parentSpan,
            md: 12,
            sm: 12,
            xs: 12
          }}
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

    .separator {
      padding: 0 4px;
      color: var(--color-text-2);
    }
  }
</style>

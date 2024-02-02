<script lang="tsx">
  import { defineComponent, PropType, inject, ref, watch, toRaw } from 'vue';
  import AceEditor from '@/components/ace-editor/index.vue';
  import _ from 'lodash';
  import i18n from '@/locale';
  import {
    InjectSchemaFormStatusKey,
    InjectSchemaCustomMetaKey,
    PageAction
  } from '@/views/config';
  import { ProviderFormRefKey } from '../config';
  import schemaFieldProps from '../fields/schema-field-props';
  import {
    genFieldPropsAndRules,
    initFieldDefaultValue,
    isRequiredInitField,
    isEmptyvalue,
    isEmptyValueField,
    isEqualOn,
    unsetFieldValue,
    genFieldInFormData
  } from '../utils';
  import FIELD_TYPE from '../config/field-type';
  import {
    json2Yaml,
    yaml2Json,
    validateYaml
  } from '../../form-create/config/yaml-parse';

  export default defineComponent({
    props: {
      ...schemaFieldProps
    },
    emits: ['change'],
    setup(props, { emit, attrs }) {
      const widget = _.get(props.schema, ['x-walrus-ui', 'widget'], '');
      const schemaFormStatus = inject(
        InjectSchemaFormStatusKey,
        ref(PageAction.CREATE)
      );
      const schemaCustomMeta = inject(InjectSchemaCustomMetaKey, ref({}));
      const formref = inject(ProviderFormRefKey, ref());
      const fieldValue = ref('');
      const defaultValue = ref('');
      const lang = ref('yaml');

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

      const validator = (val, callback) => {
        if (
          ![FIELD_TYPE.OBJECT, FIELD_TYPE.ARRAY].includes(props.schema.type)
        ) {
          if (fieldProps.required && !fieldValue.value) {
            return callback(
              `${props.schema.name}${i18n.global.t('common.form.rule.input')}`
            );
          }
          return callback();
        }
        const result = validateYaml(fieldValue.value);

        if (result.error) {
          return callback(`${result.error?.message}`);
        }
        if (!fieldProps.required) {
          return callback();
        }

        const data = yaml2Json(fieldValue.value, props.schema.type);
        if (props.schema.type === FIELD_TYPE.ARRAY) {
          if (data.length === 0) {
            return callback(
              `${props.schema.name}${i18n.global.t('common.form.rule.input')}`
            );
          }
          return callback();
        }

        if (Object.keys(data).length === 0) {
          return callback(
            `${props.schema.name}${i18n.global.t('common.form.rule.input')}`
          );
        }
        return callback();
      };

      // init field value

      const initDefaultValue = () => {
        if (props.schema.type === FIELD_TYPE.STRING) {
          defaultValue.value = _.get(props.uiFormData, props.fieldPath, '');
          return;
        }
        if (
          schemaFormStatus.value === PageAction.CREATE &&
          fieldProps.required
        ) {
          const jsonStr = initFieldDefaultValue(props.schema);
          fieldValue.value = json2Yaml(jsonStr);
        } else {
          const jsonStr = _.get(props.uiFormData, props.fieldPath, '');
          fieldValue.value = json2Yaml(jsonStr);
        }
        defaultValue.value = fieldValue.value;
      };

      const handleInputChangeCall = () => {
        const jsonstr = yaml2Json(fieldValue.value);
        _.set(props.formData, props.fieldPath, jsonstr);
        _.set(props.uiFormData, props.fieldPath, jsonstr);

        if (_.trim(fieldValue.value) === _.trim(defaultValue.value)) {
          unsetFieldValue({
            FieldPathMap: props.FieldPathMap,
            defaultFormData: props.defaultFormData,
            uiFormData: props.uiFormData,
            schema: props.schema,
            formData: props.formData,
            fieldPath: props.fieldPath,
            required: props.required
          });
        } else {
          genFieldInFormData({
            FieldPathMap: props.FieldPathMap,
            defaultFormData: props.defaultFormData,
            uiFormData: props.uiFormData,
            schema: props.schema,
            formData: props.formData,
            fieldPath: props.fieldPath,
            required: props.required
          });
        }
        handleChange(props.formData);
        validateField();
      };

      const handleInputChange = () => {
        if (
          !_.trim(fieldValue.value) &&
          (!fieldProps.required || !props.schema.isRequired)
        ) {
          _.unset(props.formData, props.fieldPath);
        } else {
          const jsonstr =
            props.schema.type === FIELD_TYPE.STRING
              ? fieldValue.value
              : yaml2Json(fieldValue.value, props.schema.type);
          _.set(props.formData, props.fieldPath, jsonstr);
          _.set(props.uiFormData, props.fieldPath, jsonstr);
        }

        handleChange(props.formData);
        setTimeout(() => {
          if (
            !isEmptyValueField(
              props.schema,
              _.get(props.formData, props.fieldPath)
            )
          ) {
            formref.value?.validateField(_.join(props.fieldPath, '.'));
          }
        }, 100);
      };

      const debounceHandleInputChange = _.debounce(handleInputChange, 100);

      watch(
        () => _.get(props.uiFormData, props.fieldPath),
        () => {
          initDefaultValue();
        },
        { immediate: true }
      );
      const renderEditor = () => {
        return (
          <a-form-item
            hide-label={true}
            label={props.schema.title}
            field={_.join(props.fieldPath, '.')}
            validate-trigger={['blur', 'change']}
            rules={[
              {
                required: fieldProps.required,
                validator
              },
              ...rules
            ]}
          >
            <AceEditor
              key={`${_.join(props.fieldPath, '_')}`}
              {...attrs}
              doc={props.schema.externalDocs}
              lang={lang.value}
              v-model={fieldValue.value}
              required={
                fieldProps.required &&
                schemaFormStatus.value !== PageAction.VIEW
              }
              label={props.schema.title || props.schema.name}
              popup-info={props.schema.description}
              editor-default-value={defaultValue.value}
              readOnly={schemaFormStatus.value === PageAction.VIEW}
              style={{ width: '100%' }}
              height={300}
              editor-id={`${_.join(props.fieldPath, '_')}`}
              onBlur={() => {
                handleInputChange();
              }}
            ></AceEditor>
          </a-form-item>
        );
      };

      return () => (
        <>
          {widget ? (
            renderEditor()
          ) : (
            <a-grid-item
              class="y-d"
              span={{ lg: props.schema.colSpan, md: 12, sm: 12, xs: 12 }}
            >
              {renderEditor()}
            </a-grid-item>
          )}
        </>
      );
    }
  });
</script>

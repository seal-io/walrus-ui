<script lang="tsx">
  import { defineComponent, PropType, inject, ref, toRaw } from 'vue';
  import AceEditor from '@/components/ace-editor/index.vue';
  import _ from 'lodash';
  import i18n from '@/locale';
  import { InjectSchemaFormEditableKey } from '@/views/config';
  import { ProviderFormRefKey } from '../config';
  import schemaFieldProps from '../fields/schema-field-props';
  import {
    genFieldPropsAndRules,
    initFieldDefaultValue,
    isRequiredInitField,
    isEmptyvalue
  } from '../utils';
  import {
    json2Yaml,
    yaml2Json,
    validateYaml
  } from '../../form-create/config/yaml-parse';

  export default defineComponent({
    props: {
      ...schemaFieldProps
    },
    setup(props, { emit, attrs }) {
      const schemaFormEditable = inject(InjectSchemaFormEditableKey, ref(true));
      const formref = inject(ProviderFormRefKey, ref());
      const fieldValue = ref('');
      const defaultValue = ref('');

      const { fieldProps, rules } = genFieldPropsAndRules({
        schema: props.schema,
        requiredFields: props.requiredFields
      });

      const handleUnsetField = () => {
        if (
          isEmptyvalue(_.get(props.formData, props.fieldPath)) &&
          !props.schema.default
        ) {
          _.unset(props.formData, props.fieldPath);
        }
      };

      const handleChange = (data) => {
        handleUnsetField();
        emit('change', data);
        setTimeout(() => {
          formref.value?.validateField(props.fieldPath);
        });
      };

      const validator = (val, callback) => {
        const result = validateYaml(val);
        if (result.error) {
          callback(`${result.error?.message}`);
        } else if (!fieldProps.required) {
          callback();
        } else if (result?.empty) {
          callback(
            `${props.schema.name}${i18n.global.t('common.form.rule.input')}`
          );
        } else {
          callback();
        }
      };

      // init field value
      if (
        props.action === 'create' &&
        isRequiredInitField(
          props.schema,
          _.includes(props.requiredFields, props.schema.name)
        )
      ) {
        const jsonStr = initFieldDefaultValue(props.schema);
        fieldValue.value = json2Yaml(jsonStr);
      } else {
        const jsonStr = _.get(props.formData, props.fieldPath, '');
        fieldValue.value = json2Yaml(jsonStr);
      }
      defaultValue.value = fieldValue.value;

      return () => (
        <a-grid-item
          span={{ lg: props.schema.colSpan, md: 12, sm: 12, xs: 12 }}
        >
          <a-form-item
            hide-label={true}
            label={props.schema.title}
            field={_.join(props.fieldPath, '.')}
            validate-trigger={['blur']}
            rules={[
              ...rules,
              {
                required: fieldProps.required,
                validator
              }
            ]}
          >
            <AceEditor
              key={`${_.join(props.fieldPath, '_')}`}
              {...attrs}
              lang="yaml"
              v-model={fieldValue.value}
              label={props.schema.title || props.schema.name}
              popup-info={props.schema.description}
              editor-default-value={defaultValue.value}
              readOnly={!schemaFormEditable.value}
              style={{ width: '100%' }}
              height={300}
              editor-id={`${_.join(props.fieldPath, '_')}`}
              onBlur={(val) => {
                const jsonstr = yaml2Json(fieldValue.value);
                _.set(props.formData, props.fieldPath, jsonstr);
                handleChange(props.formData);
                console.log(
                  'josn===',
                  defaultValue.value,
                  jsonstr,
                  fieldValue.value
                );
              }}
            ></AceEditor>
          </a-form-item>
        </a-grid-item>
      );
    }
  });
</script>

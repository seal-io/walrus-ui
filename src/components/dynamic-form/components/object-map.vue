<script lang="tsx">
  import { defineComponent, ref, inject } from 'vue';
  import _ from 'lodash';
  import i18n from '@/locale';
  import { InjectSchemaFormStatusKey, PageAction } from '@/views/config';
  import KeyValueLabels from '@/components/form-create/custom-components/key-value-labels.vue';
  import SealFormItemWrap from '@/components/seal-form/components/seal-form-item-wrap.vue';
  import schemaFieldProps from '../fields/schema-field-props';
  import {
    genObjectFieldProperties,
    initFieldDefaultValue,
    genFieldPropsAndRules,
    isRequiredInitField
  } from '../utils';

  export default defineComponent({
    props: schemaFieldProps,
    emits: ['change'],
    setup(props, { emit }) {
      const schemaFormStatus = inject(
        InjectSchemaFormStatusKey,
        ref(PageAction.CREATE)
      );
      const handleChange = (data) => {
        emit('change', data);
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
        handleChange(props.formData);
      }

      const { fieldProps, rules } = genFieldPropsAndRules({
        schema: props.schema,
        requiredFields: props.requiredFields
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
        const labels = _.get(props.formData, props.fieldPath);
        const keys = _.keys(labels);
        return _.some(keys, (key) => {
          return !_.trim(key);
        });
      };

      return () => (
        <a-grid-item
          span={{ lg: props.schema.colSpan, md: 12, sm: 12, xs: 12 }}
        >
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
                  if (!validateLabels()) {
                    callback();
                    return;
                  }
                  callback(i18n.global.t('common.rule.object.key'));
                },
                message: i18n.global.t('common.rule.object.key')
              }
            ]}
          >
            <SealFormItemWrap
              popupInfo={props.schema.description}
              required={props.required}
              label={`${props.schema.title || props.schema.name || ''}`}
              style="width: 100%"
            >
              <KeyValueLabels
                editorId={_.join(props.fieldPath, '-')}
                showNumberInput={isMapNumber}
                showCheckbox={isMapBoolean}
                labels={props.formData}
                labelsKey={props.fieldPath}
                readonly={
                  PageAction.VIEW === schemaFormStatus.value ||
                  fieldProps.readonly
                }
                onUpdate:value={(val) => {
                  _.set(props.formData, props.fieldPath, val);
                  handleChange(props.formData);
                }}
              ></KeyValueLabels>
            </SealFormItemWrap>
          </a-form-item>
        </a-grid-item>
      );
    }
  });
</script>

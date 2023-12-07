<script lang="tsx">
  import { defineComponent, ref, inject } from 'vue';
  import _ from 'lodash';
  import i18n from '@/locale';
  import { InjectSchemaFormStatusKey, PageAction } from '@/views/config';
  import MapString from '@/components/form-create/custom-components/map-string.vue';
  import SealFormItemWrap from '@/components/seal-form/components/seal-form-item-wrap.vue';
  import SealViewItemWrap from '@/components/seal-form/components/seal-view-item-wrap.vue';
  import schemaFieldProps from '../fields/schema-field-props';
  import {
    genFieldPropsAndRules,
    isEqualOn,
    genFieldInFormData
  } from '../utils';

  export default defineComponent({
    props: schemaFieldProps,
    emits: ['change'],
    setup(props, { emit }) {
      const schemaFormStatus = inject(
        InjectSchemaFormStatusKey,
        ref(PageAction.CREATE)
      );
      const initialPath = _.initial(props.fieldPath);
      const handleChange = (data) => {
        emit('change', data);
      };

      console.log('schema=map==string=', props.schema.nullable);
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
        const labels = _.get(props.uiFormData, props.fieldPath);
        const keys = _.keys(labels);
        return _.some(keys, (key) => {
          return !_.trim(key);
        });
      };

      const renderEdit = () => {
        return (
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
                    if (_.keys(val).length) {
                      _.set(props.uiFormData, props.fieldPath, val);
                    } else if (!_.keys(val).length && _.last(props.fieldPath)) {
                      _.pullAt(
                        _.get(props.uiFormData, initialPath),
                        _.toNumber(_.last(props.fieldPath))
                      );
                    }
                    console.log('schema==111=', props.schema);
                    if (props.schema.nullable || props.schema.originNullable) {
                      if (
                        isEqualOn(
                          _.get(props.uiFormData, initialPath),
                          _.get(props.defaultFormData, initialPath)
                        ) ||
                        !_.get(props.uiFormData, initialPath)?.length
                      ) {
                        _.unset(props.formData, initialPath);
                      }
                    } else {
                      _.set(
                        props.formData,
                        initialPath,
                        _.cloneDeep(_.get(props.uiFormData, initialPath))
                      );
                    }
                    handleChange(props.formData);
                  }}
                ></MapString>
              </SealFormItemWrap>
            </a-form-item>
          </a-grid-item>
        );
      };

      const renderView = () => {
        return (
          <a-grid-item
            span={{ lg: props.schema.colSpan, md: 12, sm: 12, xs: 12 }}
          >
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
                          style="width: 100%"
                        >
                          {_.get(props.uiFormData, [...props.fieldPath, key])}
                        </SealViewItemWrap>
                      </span>
                    );
                  }
                )}
              </SealFormItemWrap>
            </a-form-item>
          </a-grid-item>
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

    .separator {
      padding: 0 4px;
      color: var(--color-text-2);
    }
  }
</style>

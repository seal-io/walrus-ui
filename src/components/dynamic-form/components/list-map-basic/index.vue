<script lang="tsx">
  import {
    defineComponent,
    ref,
    withModifiers,
    onMounted,
    nextTick,
    inject
  } from 'vue';
  import _ from 'lodash';
  import i18n from '@/locale';
  import {
    InjectSchemaFormStatusKey,
    PageAction,
    InjectSchemaCustomMetaKey
  } from '@/views/config';
  import MapString from '@/components/form-create/custom-components/map-string.vue';
  import SealFormItemWrap from '@/components/seal-form/components/seal-form-item-wrap.vue';
  import SealViewItemWrap from '@/components/seal-form/components/seal-view-item-wrap.vue';
  import schemaFieldProps from '../../fields/schema-field-props';
  import { FieldSchema } from '../../interface';
  import FieldGroup from '../field-group.vue';
  import {
    calcFieldSpan,
    initFieldDefaultValue,
    parentObjectExsits,
    isEmptyValueField,
    genFieldPropsAndRules
  } from '../../utils';
  import { ProviderFormRefKey } from '../../config';
  import CommonButton from '../common-button.vue';

  export default defineComponent({
    props: schemaFieldProps,
    emits: ['change'],
    setup(props, { emit }) {
      const schemaFormStatus = inject(
        InjectSchemaFormStatusKey,
        ref(PageAction.CREATE)
      );
      const schemaCustomMeta = inject(InjectSchemaCustomMetaKey, ref({}));
      const formref = inject(ProviderFormRefKey, ref());
      const activeItemIndex = ref(-1);
      const items = props.schema.items || ({} as FieldSchema);
      const minItems = props.schema.minItems || 0;
      const maxItems = props.schema.maxItems || Infinity;

      const defaultItems =
        _.get(props.defaultFormData, props.fieldPath)?.length ||
        props.schema.default?.length ||
        0;
      let itemsProperties: FieldSchema[] = [];
      const propertiesList = ref<FieldSchema[][]>([]);

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
      const { fieldProps, rules } = genFieldPropsAndRules({
        schema: props.schema,
        schemaCustomMeta: schemaCustomMeta.value,
        requiredFields: props.requiredFields
      });

      const validateField = () => {
        formref.value?.validateField(_.join(props.fieldPath, '.'));
      };
      const debounceValidateField = _.debounce(validateField, 200);
      const handleChange = (data) => {
        emit('change', data);
      };

      const handleInputChange = (val) => {
        if (!_.keys(val).length && !fieldProps.required) {
          _.unset(props.formData, props.fieldPath);
        }
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
      const genItemsColSpanInfo = () => {
        const parentSpan =
          props.schema?.colSpan ||
          _.get(props.schema, ['x-walrus-ui', 'colSpan']);

        const colSpanData = calcFieldSpan({
          parentSpan,
          colSpan: _.get(props.schema, ['items', 'x-walrus-ui', 'colSpan']),
          parentHalfGrid: props.schema.halfGrid
        });
        return {
          colSpan: colSpanData.span,
          halfGrid: colSpanData.halfGrid,
          parentSpan
        };
      };

      const genItemsProperties = () => {
        const itemSpanInfo = genItemsColSpanInfo();

        itemsProperties = [
          {
            ...props.schema.items,
            ..._.pick(props.schema, ['nullable', 'originNullable']),
            fieldPath: [...props.fieldPath],
            parentHalfGrid: props.schema.halfGrid,
            parentSpan: itemSpanInfo.colSpan,
            level: props.schema.level + 1,
            halfGrid: itemSpanInfo.halfGrid,
            arrayItemProperty: true
          }
        ] as FieldSchema[];
      };

      const setPropertiesList = () => {
        const newProperties = _.cloneDeep(itemsProperties);

        propertiesList.value = propertiesList.value.concat(newProperties);
      };
      const handleAddClick = () => {
        setPropertiesList();
        const len = propertiesList.value.length;
        const fieldPath = [...props.fieldPath, `${len - 1}`];
        const defaultValue = initFieldDefaultValue(itemsProperties[0]);
        const currentValue = _.get(props.defaultFormData, fieldPath);
        _.set(
          props.uiFormData,
          fieldPath,
          _.cloneDeep(currentValue || defaultValue)
        );
        if (schemaFormStatus.value === PageAction.CREATE) {
          _.set(
            props.formData,
            fieldPath,
            _.cloneDeep(currentValue || defaultValue)
          );
        }
      };

      // do not handle nullable peroperty
      const handleDeleteCallback = () => {
        activeItemIndex.value = -1;
        handleChange(props.formData);
      };
      const handleDeleteClick = (index) => {
        propertiesList.value.splice(index, 1);

        _.get(props.uiFormData, props.fieldPath, []).splice(index, 1);
        _.get(props.formData, props.fieldPath, []).splice(index, 1);

        if (
          !fieldProps.required &&
          !_.get(props.uiFormData, props.fieldPath)?.length
        ) {
          _.unset(props.formData, props.fieldPath);
        }
        handleDeleteCallback();
      };

      const handleButtonEnter = (index) => {
        activeItemIndex.value = index;
      };

      const handleButtoneave = () => {
        activeItemIndex.value = -1;
      };

      const renderDeleleButton = (index) => {
        if (
          propertiesList.value.length <= minItems ||
          schemaFormStatus.value === PageAction.VIEW
        ) {
          return null;
        }
        return (
          <span
            onMouseenter={withModifiers(
              () => handleButtonEnter(index),
              ['stop']
            )}
            onMouseleave={withModifiers(() => handleButtoneave(), ['stop'])}
          >
            <CommonButton
              class="delete-btn"
              onClick={() => handleDeleteClick(index)}
              action="delete"
              title={props.schema.title}
            ></CommonButton>
          </span>
        );
      };

      const renderAddButton = () => {
        if (
          schemaFormStatus.value === PageAction.VIEW ||
          propertiesList.value.length >= maxItems
        ) {
          return null;
        }
        return props.schema.items ? (
          <CommonButton
            onClick={() => handleAddClick()}
            action="add"
            title={props.schema.title}
          ></CommonButton>
        ) : null;
      };
      // init data when create
      const init = () => {
        const counts = _.max([minItems, defaultItems]);
        if (counts) {
          for (let i = 0; i < counts; i += 1) {
            setPropertiesList();
          }
        }
      };

      // init field value when edit
      const initFormFieldValue = () => {
        if (schemaFormStatus.value === PageAction.CREATE) {
          init();
          handleChange(props.formData);
        } else {
          const value = _.get(props.uiFormData, props.fieldPath, []);

          if (value && value.length) {
            for (let i = 0; i < value.length; i += 1) {
              setPropertiesList();
            }
          } else if (minItems) {
            init();
          }
        }
      };

      genItemsProperties();

      onMounted(() => {
        initFormFieldValue();
      });

      return () => (
        <FieldGroup
          schema={props.schema}
          level={props.schema.level}
          fieldPath={props.fieldPath}
          formData={props.formData}
          popupInfo={props.schema.description}
          doc={props.schema.externalDocs}
          required={fieldProps.required}
          uiFormData={props.uiFormData}
          defaultFormData={props.defaultFormData}
          FieldPathMap={props.FieldPathMap}
          requiredFields={props.requiredFields}
          onUnset={(isUnset) => {
            if (!isUnset && !propertiesList.value.length) {
              handleAddClick();
            }
          }}
          onChange={(val) => {
            handleChange(val);
          }}
        >
          <a-form-item
            hide-label={true}
            required={fieldProps.required}
            label={`${props.schema.title}`}
            field={_.join(props.fieldPath, '.')}
            validate-trigger={['change']}
            content-flex={false}
            class="list-mp-string-form-item"
            rules={[
              {
                required: fieldProps.required,
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
          >
            {_.map(propertiesList.value, (item, index) => {
              return (
                <>
                  <div class={['add-item']} key={index}>
                    <div
                      class={[
                        'add-content',
                        { active: activeItemIndex.value === index }
                      ]}
                    >
                      <SealFormItemWrap style="width: 100%;" class="m-b-20">
                        <MapString
                          showNumberInput={isMapNumber}
                          showCheckbox={isMapBoolean}
                          editorId={_.join(props.fieldPath, '.')}
                          modelValue={_.get(props.uiFormData, [
                            ...props.fieldPath,
                            `${index}`
                          ])}
                          readonly={
                            PageAction.VIEW === schemaFormStatus.value ||
                            fieldProps.readonly
                          }
                          pageAction={schemaFormStatus.value}
                          onUpdate:value={(val) => {
                            val = genObjValue(val);
                            if (!_.keys(val).length) {
                              _.get(props.formData, props.fieldPath, []).splice(
                                index,
                                1
                              );
                            } else {
                              _.set(
                                props.formData,
                                [...props.fieldPath, `${index}`],
                                _.clone(val)
                              );
                            }

                            _.set(
                              props.uiFormData,
                              [...props.fieldPath, `${index}`],
                              _.clone(val)
                            );
                            if (
                              !fieldProps.required &&
                              !_.get(props.formData, props.fieldPath)?.length
                            ) {
                              _.unset(props.formData, props.fieldPath);
                            }

                            handleChange(props.formData);
                            debounceValidateField();
                          }}
                        ></MapString>
                      </SealFormItemWrap>
                    </div>

                    {renderDeleleButton(index)}
                  </div>
                  {index === propertiesList.value.length - 1 ? null : (
                    <a-divider
                      size={1}
                      type="dashed"
                      class="divider"
                    ></a-divider>
                  )}
                </>
              );
            })}
            <div> {renderAddButton()}</div>
          </a-form-item>
        </FieldGroup>
      );
    }
  });
</script>

<style lang="less" scoped>
  .divider {
    &.arco-divider-horizontal {
      margin-top: 0;
    }
  }

  .arco-form-item.list-mp-string-form-item {
    margin-bottom: 0;
  }

  .add-item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 0;
    border-radius: var(--border-radius-small);
    border-radius: var(--border-radius-small);

    .delete-btn {
      position: relative;
      top: 11px;
      left: 2px;
      padding-left: 10px;
    }

    .add-content {
      position: relative;
      flex: 1;

      :deep(.seal-form-item-wrap) {
        position: relative;
        z-index: 5;
        background-color: #fff;
      }

      &.active {
        &::before {
          position: absolute;
          top: -20px;
          right: -20px;
          bottom: 0;
          left: -20px;
          display: block;
          padding-bottom: 0;
          background-color: var(--color-fill-1);
          border-radius: var(--border-radius-small);
          transition: background-color 0.3s var(--seal-transition-func);
          content: '';
        }
      }
    }
  }
</style>

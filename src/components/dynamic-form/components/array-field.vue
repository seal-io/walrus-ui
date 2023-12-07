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
  import { InjectSchemaFormStatusKey, PageAction } from '@/views/config';
  import schemaFieldProps from '../fields/schema-field-props';
  import { FieldSchema } from '../interface';
  import FieldGroup from './field-group.vue';
  import SchemaField from './schema-field.vue';
  import {
    genObjectFieldProperties,
    calcFieldSpan,
    isEmptyvalue
  } from '../utils';
  import CommonButton from './common-button.vue';

  export default defineComponent({
    props: schemaFieldProps,
    emits: ['change'],
    setup(props, { emit }) {
      const schemaFormStatus = inject(
        InjectSchemaFormStatusKey,
        ref(PageAction.CREATE)
      );
      const activeItemIndex = ref(-1);
      const items = props.schema.items || ({} as FieldSchema);
      const minItems = props.schema.minItems || 0;
      const defaultItems = props.schema.default?.length || 0;
      let itemsProperties: FieldSchema[] = [];
      const propertiesList = ref<FieldSchema[][]>([]);

      const handleChange = (data) => {
        emit('change', data);
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

        if (items?.items) {
          const childColSpanData = calcFieldSpan({
            parentSpan:
              _.get(props.schema, ['items', 'x-walrus-ui', 'colSpan']) ||
              itemSpanInfo.colSpan,
            colSpan:
              _.get(props.schema, [
                'items',
                'item',
                'x-walrus-ui',
                'colSpan'
              ]) || itemSpanInfo.colSpan,
            parentHalfGrid: props.schema.halfGrid || itemSpanInfo.halfGrid
          });
          itemsProperties = [
            {
              ...props.schema.items,
              ..._.pick(props.schema, ['nullable', 'originNullable']),
              fieldPath: [...props.fieldPath],
              title: props.schema.title,
              parentHalfGrid: childColSpanData.halfGrid,
              level: props.schema.level + 1,
              colSpan: childColSpanData.span,
              halfGrid: childColSpanData.halfGrid,
              parentSpan: props.schema.colSpan
            }
          ] as FieldSchema[];
        } else if (items?.properties) {
          itemsProperties = genObjectFieldProperties({
            defaultFormData: props.defaultFormData,
            uiFormData: props.uiFormData,
            schema: props.schema.items as FieldSchema,
            parentNullableObj: {
              ..._.pick(props.schema, ['nullable', 'originNullable'])
            },
            level: props.schema.level + 1,
            parentHalfGrid: props.schema.halfGrid,
            fieldPath: props.fieldPath,
            parentSpan: itemSpanInfo.colSpan
          });
        } else if (items?.additionalProperties) {
          // items.addtionalProperties
          itemsProperties = [
            {
              ...props.schema.items,
              ..._.pick(props.schema, ['nullable', 'originNullable']),
              fieldPath: [...props.fieldPath],
              parentHalfGrid: props.schema.halfGrid,
              parentSpan: itemSpanInfo.colSpan,
              level: props.schema.level + 1,
              halfGrid: itemSpanInfo.halfGrid
            }
          ] as FieldSchema[];
        } else {
          itemsProperties = [
            {
              ...props.schema.items,
              ..._.pick(props.schema, ['nullable', 'originNullable']),
              fieldPath: [...props.fieldPath],
              parentHalfGrid: props.schema.halfGrid || false,
              level: props.schema.level + 1,
              colSpan: itemSpanInfo.colSpan,
              halfGrid: itemSpanInfo.halfGrid,
              parentSpan: props.schema.colSpan
            }
          ] as FieldSchema[];
        }
      };

      const setPropertiesList = () => {
        const newProperties = _.cloneDeep(itemsProperties);
        propertiesList.value = [
          ..._.cloneDeep(propertiesList.value),
          [...newProperties]
        ];
      };
      const handleAddClick = () => {
        setPropertiesList();

        // update formData
        // _.each(propertiesList.value, (item, index) => {
        //   _.each(item, (sItem, sIndex) => {
        //     const fieldPath = [
        //       ...props.fieldPath,
        //       `${index}`,
        //       sItem.name
        //     ].filter((i) => i);
        //     initFieldValue({
        //       schema: sItem,
        //       formData: props.formData,
        //       uiFormData: props.uiFormData,
        //       fieldPath,
        //       required: !!sItem.isRequired
        //     });
        //   });
        // });

        // handleChange(props.formData);
        console.log(
          'add++++++++++++9',
          props.formData,
          props.uiFormData,
          propertiesList.value
        );
      };

      // check array every item is empty or null or undefined
      const filterArrayIsEmpty = (arr) => {
        return _.filter(arr, (item) => {
          return !isEmptyvalue(item);
        });
      };
      const handleDeleteClick = (index) => {
        propertiesList.value.splice(index, 1);

        _.get(props.uiFormData, props.fieldPath, []).splice(index, 1);
        _.get(props.formData, props.fieldPath, []).splice(index, 1);

        // update uiFormData
        if (
          !_.get(props.uiFormData, props.fieldPath, []).length ||
          !filterArrayIsEmpty(
            _.get(props.uiFormData, props.fieldPath, []).length
          )
        ) {
          _.unset(props.uiFormData, props.fieldPath);
        }

        // update formData
        if (
          !_.get(props.formData, props.fieldPath, []).length ||
          !filterArrayIsEmpty(_.get(props.formData, props.fieldPath, []).length)
        ) {
          _.unset(props.formData, props.fieldPath);
        }
        activeItemIndex.value = -1;
        handleChange(props.formData);
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
            onMouseover={withModifiers(
              () => handleButtonEnter(index),
              ['stop', 'prevent']
            )}
            onMouseout={withModifiers(
              () => handleButtoneave(),
              ['stop', 'prevent']
            )}
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
        if (schemaFormStatus.value === PageAction.VIEW) {
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
      const init = () => {
        const counts = minItems || defaultItems;
        if (counts && schemaFormStatus.value === PageAction.CREATE) {
          for (let i = 0; i < counts; i += 1) {
            handleAddClick();
          }
        }
      };

      // init field value when edit
      const initFormFieldValue = () => {
        if (schemaFormStatus.value === PageAction.CREATE) {
          init();
        } else {
          const value = _.get(props.uiFormData, props.fieldPath);
          if (value && value.length) {
            for (let i = 0; i < value.length; i += 1) {
              setPropertiesList();
            }
          }
        }
      };

      genItemsProperties();

      onMounted(() => {
        initFormFieldValue();
      });
      console.log(
        'array++++++++++++',
        props.fieldPath,
        props.formData,
        props.uiFormData,
        props.defaultFormData
      );

      return () => (
        <FieldGroup
          schema={props.schema}
          level={props.schema.level}
          fieldPath={props.fieldPath}
          formData={props.formData}
          uiFormData={props.uiFormData}
          defaultFormData={props.defaultFormData}
          requiredFields={props.requiredFields}
          onChange={(val) => {
            handleChange(val);
          }}
          v-slots={{
            footer: () => {
              return <>{renderAddButton()}</>;
            }
          }}
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
                    <a-grid cols={12} col-gap={18}>
                      {_.map(item, (sItem, sIndex) => {
                        return (
                          <SchemaField
                            level={sItem.level}
                            schema={sItem}
                            key={`${index}-${sIndex}`}
                            formData={props.formData}
                            uiFormData={props.uiFormData}
                            defaultFormData={props.defaultFormData}
                            fieldPath={[
                              ...props.fieldPath,
                              `${index}`,
                              sItem.name
                            ].filter((i) => i)}
                            requiredFields={sItem.parentRequired}
                            parentSpan={props.schema.colSpan}
                            action={props.action}
                          ></SchemaField>
                        );
                      })}
                    </a-grid>
                  </div>

                  {renderDeleleButton(index)}
                </div>
                {index === propertiesList.value.length - 1 ? null : (
                  <a-divider size={1} type="dashed" class="divider"></a-divider>
                )}
              </>
            );
          })}
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

  .add-item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 0;
    border-radius: var(--border-radius-small);
    border-radius: 4px;

    .delete-btn {
      position: relative;
      top: 11px;
      left: 2px;
      padding-left: 10px;
    }

    .add-content {
      position: relative;
      flex: 1;

      &.active {
        &::before {
          position: absolute;
          top: -20px;
          right: -20px;
          bottom: 0;
          left: -20px;
          display: block;
          padding-bottom: 0;
          background-color: var(--color-fill-2);
          border-radius: 4px;
          transition: background-color 0.3s var(--seal-transition-func);
          content: '';
        }
      }
    }
  }
</style>

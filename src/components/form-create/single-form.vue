<script lang="tsx">
  import _ from 'lodash';
  import {
    PropType,
    ref,
    provide,
    computed,
    watch,
    defineComponent,
    withModifiers,
    toRaw
  } from 'vue';
  import axios from 'axios';
  import { useI18n } from 'vue-i18n';
  import ThumbButton from '@/components/buttons/thumb-button.vue';
  import SealFormItemWrap from '@/components/seal-form/components/seal-form-item-wrap.vue';
  import { FieldSchema } from '@/components/dynamic-form/config/interface';
  import { FieldDataType } from '@/components/dynamic-form/config/field-type';
  import { Widget } from '@/components/dynamic-form/config/widget';
  import { InjectShowInputHintKey } from '@/views/config';
  import { json2Yaml, yaml2Json } from './config/yaml-parse';
  import formComponents from './components';
  import {
    parseAdditionalPropertiesField,
    parseOptions,
    getConditionValue
  } from './config/utils';
  import { requiredOptions, hasValueOptions, schemaType } from './config/index';
  import { parseExpression } from './config/experssion-parser';
  import useFillterAttributes from './hooks/use-fillter-attributes';

  export default defineComponent({
    emits: ['done', 'cancel'],
    props: {
      attributes: {
        type: Object,
        default() {
          return {};
        }
      },
      formSize: {
        type: String as PropType<'small' | 'default'>,
        default() {
          return 'default';
        }
      },
      formSchema: {
        type: Array as PropType<FieldSchema[]>,
        default() {
          return [];
        }
      },
      formId: {
        type: String,
        default() {
          return 'local';
        }
      },
      layout: {
        type: String as PropType<'horizontal' | 'vertical' | 'inline'>,
        default() {
          return 'horizontal';
        }
      },
      showFooter: {
        type: Boolean,
        default() {
          return true;
        }
      },
      model: {
        type: Object,
        default() {
          return {};
        }
      },
      showFilter: {
        type: Boolean,
        default() {
          return true;
        }
      }
    },
    setup(props, { slots, emit, expose }) {
      const numberReg = /\d+/;
      const { t } = useI18n();
      const submitLoading = ref(false);
      const formref = ref();
      const schemaList = ref<FieldSchema[]>([]);
      const formData = ref({});
      const subGroupCache = ref({});
      const subGroupListCache = ref({});
      const thirdGroupCache = ref({});
      const activeMenu = ref('');
      const OTHER_SUB_GROUP = 'Other';
      const triggerValidate = ref(false);
      const validateState = ref(false); // if has executed validate

      provide(InjectShowInputHintKey, true);

      const {
        queryName,
        filterFields,
        filterParams,
        handleClear,
        handleQueryChange,
        handleCheckHasValueChange
      } = useFillterAttributes(formData);

      const activeSchemaList = computed(() => {
        if (!activeMenu.value) {
          const list = _.filter(schemaList.value, (sItem) => {
            if (sItem.uiSchema.showIf) {
              return getConditionValue(sItem.uiSchema, {
                ...props.attributes,
                ...formData.value
              });
            }
            return true;
          });
          return list;
        }
        const list = _.filter(schemaList.value, (sItem) => {
          if (sItem.uiSchema.showIf) {
            return (
              sItem.uiSchema.subGroup === activeMenu.value &&
              getConditionValue(sItem.uiSchema, {
                ...props.attributes,
                ...formData.value
              })
            );
          }
          return sItem.uiSchema.subGroup === activeMenu.value;
        });

        return list;
      });

      const setFormData = () => {
        formData.value = {};
        _.each(props.formSchema, (item) => {
          let val = _.get(props.model, item.name) || item.default;
          // transform data type
          if (item.uiSchema.widget === Widget.AceEditor) {
            val = json2Yaml(val);
          } else if (
            schemaType.isListNumber(item.type) ||
            schemaType.isListString(item.type)
          ) {
            val = val || [];
          }
          _.set(formData.value, item.fieldPath, val);
        });
      };
      const calcGridItemSpan = (fm, index) => {
        const isEvenPosition = (index + 1) % 2 === 0;
        const fmSchemaIsCollectionType =
          fm.uiSchema.widget === Widget.AceEditor;
        let bilingSchema: any = null;
        if (isEvenPosition) {
          bilingSchema = activeSchemaList.value[index - 1];
        } else {
          bilingSchema = activeSchemaList.value[index + 1];
        }

        // it's the last item and fm is collection type
        if (
          !bilingSchema &&
          (fmSchemaIsCollectionType || props.formSize === 'small')
        ) {
          return 24;
        }
        // it's the last item and fm is not collection type
        if (!bilingSchema && !fmSchemaIsCollectionType) {
          return 12;
        }

        const bilingSchemaIsCollectionType =
          bilingSchema.uiSchema.widget === Widget.AceEditor;

        if (
          (fmSchemaIsCollectionType && bilingSchemaIsCollectionType) ||
          (!fmSchemaIsCollectionType && !bilingSchemaIsCollectionType)
        ) {
          return 12;
        }
        if (
          (!fmSchemaIsCollectionType && bilingSchemaIsCollectionType) ||
          (fmSchemaIsCollectionType && !bilingSchemaIsCollectionType)
        ) {
          return 24;
        }
        return 12;
      };
      const setGridItemSpan = (fm, i) => {
        if (!activeMenu.value) {
          return calcGridItemSpan(fm, i);
        }
        if (activeMenu.value !== fm.subGroup) {
          return 12;
        }
        const index = _.findIndex(activeSchemaList.value || [], (item) => {
          return item.name === fm.name;
        });
        if (index === -1) {
          return 12;
        }
        return calcGridItemSpan(fm, index);
      };
      const handleSelectInputChange = (e: any, fm) => {
        if (FieldDataType.isListNumber(fm) && !numberReg.test(e.data)) {
          e.target.value = e.target.value.replace(/[^\d]/g, '');
        } else if (FieldDataType.isBoolean(fm)) {
          _.set(formData.value, fm.fieldPath, e.target.checked);
        } else {
          _.set(formData.value, fm.fieldPath, e);
        }
      };
      const handleFieldChange = (val, fm) => {
        _.set(formData.value, fm.fieldPath, val);
        console.log('formData===change', formData.value, val);
      };
      const handleClickSubGroup = (k) => {
        activeMenu.value = k;
        if (validateState.value) {
          setTimeout(() => {
            formref.value?.validate?.();
          });
        }
      };
      const eventHandler = (fm) => {
        const fieldName = _.join(fm.fieldPath, '.');
        formref.value?.validateField?.(fieldName);
      };
      const setSchemaList = () => {
        const showIfMap = {};
        activeMenu.value = '';
        subGroupCache.value = {};
        subGroupListCache.value = {};
        triggerValidate.value = false;
        validateState.value = false;
        thirdGroupCache.value = {};

        let list = _.map(props.formSchema, (o, i) => {
          const item = _.cloneDeep(toRaw(o));
          const ui = item.uiSchema || [];
          // filter empty group
          const groupConfig: string[] = _.filter(
            _.split(ui.group, /\/+/) || [],
            (s) => !!s
          );
          const mainGroup = _.get(groupConfig, '0') || '';
          const subGroup = _.get(groupConfig, '1') || '';
          const thirdGroup = _.get(groupConfig, '2') || '';

          ui.conditions = parseExpression(ui.showIf);
          ui.order = ui.required ? 0 : 100 * (i + 1);
          ui.parentCom = _.get(ui, 'component.0');
          ui.childCom = _.get(ui, 'component.1');
          ui.labelList = parseAdditionalPropertiesField(
            item,
            _.get(formData.value, item.fieldPath)
          );
          ui.subGroup = subGroup;
          ui.mainGroup = mainGroup;
          ui.thirdGroup = thirdGroup;
          ui.subGroupOrder = !_.get(subGroupCache.value, subGroup) ? 0 : 1;
          ui.thirdGroupOrder = !_.get(thirdGroupCache.value, thirdGroup)
            ? 0
            : 1;
          item.options = parseOptions(item);

          if (subGroup) {
            subGroupCache.value[subGroup] = 1;
          }
          if (thirdGroup) {
            thirdGroupCache.value[thirdGroup] = 1;
          }
          // default active subgroup
          if (!activeMenu.value) {
            activeMenu.value = subGroup;
          }

          // for set other Group
          if (subGroupListCache.value[mainGroup] && subGroup) {
            subGroupListCache.value[mainGroup] = 1;
          }
          showIfMap[item.name] = ui.order;
          return item;
        });
        list = _.map(list, (sItem) => {
          const ui = sItem.uiSchema || {};
          if (ui.showIf) {
            const relativeOrders = _.map(ui.conditions, (v) => {
              return _.get(showIfMap, v.variable);
            });
            ui.order = _.add(_.max(relativeOrders), 0.1);
          }
          if (
            ui.mainGroup &&
            subGroupListCache.value[ui.mainGroup] &&
            !ui.subGroup
          ) {
            ui.subGroup = OTHER_SUB_GROUP;
          }
          // transform default value data type

          return sItem;
        });
        list = _.sortBy(list, (pItem) => pItem.uiSchema.order);

        schemaList.value = list;
        console.log('schemaList.value====', schemaList.value);
      };
      const handleAddLabel = (obj, list) => {
        list.push({ ...obj });
      };
      const handleAddOne = (list) => {
        list.push({ key: '', value: '' });
      };
      const handleDeleteLabel = (list, index) => {
        list.splice(index, 1);
      };
      const handleUpdataMapValue = (val, fm) => {
        _.set(formData.value, fm.fieldPath, val);
      };
      const handleUpdateMapDataKey = (val, item) => {
        item.key = val;
      };
      const handleUpdateMapDataValue = (val, item) => {
        item.value = val;
      };
      // reset field default value when showIf is negative
      const resetFieldsDefaultValue = () => {
        _.each(schemaList.value, (item) => {
          if (
            item.uiSchema.showIf &&
            !getConditionValue(item.uiSchema, {
              ...props.attributes,
              ...formData.value
            })
          ) {
            _.unset(formData.value, item.fieldPath);
          }
        });
      };
      // transform data before submit
      const transformDataByType = () => {
        const result = _.cloneDeep(formData.value);
        _.each(schemaList.value, (item) => {
          if (item.uiSchema.parentCom?.[0] === Widget.AceEditor) {
            result[item.name] = yaml2Json(formData.value[item.name], item.type);
          }
        });
        return result;
      };
      // transform data before submit for json type
      const transformJsonData = () => {
        const result = _.cloneDeep(formData.value);
        _.each(schemaList.value, (item) => {
          if (FieldDataType.isJson(item)) {
            _.set(
              result,
              item.fieldPath,
              JSON.parse(_.get(result, item.fieldPath))
            );
          }
        });
        return result;
      };
      const validateLabels = () => {
        const result = _.find(schemaList.value, (sItem) => {
          if (sItem.uiSchema.labelList?.length) {
            return _.some(sItem.uiSchema.labelList, (item) => {
              return !item.key;
            });
          }
          return false;
        });
        return result;
      };
      const clearFormValidStatus = () => {
        formref.value?.clearValidate?.();
      };
      const getFormData = async (noValidate?: boolean) => {
        // no need validate
        if (noValidate) {
          resetFieldsDefaultValue();
          const resultFormData = transformDataByType();
          return resultFormData;
        }
        // validate before submit form
        clearFormValidStatus();
        triggerValidate.value = true;
        const result = await formref.value?.validate();
        const validLabels = validateLabels();
        validateState.value = true;

        if (result) {
          const errorField = _.get(_.keys(result), '0');
          const d = _.find(
            schemaList.value,
            (item) => _.join(item.fieldPath, '.') === errorField
          );
          activeMenu.value = d?.uiSchema.subGroup || activeMenu.value;
        } else if (validLabels) {
          activeMenu.value = validLabels?.uiSchema.subGroup || activeMenu.value;
        }

        if (!result && !validLabels) {
          resetFieldsDefaultValue();
          const resultFormData = transformDataByType();
          return resultFormData;
        }
        return false;
      };

      expose({
        getFormData,
        clearFormValidStatus
      });

      watch(
        () => props.formSchema,
        () => {
          setSchemaList();
        },
        {
          deep: true,
          immediate: true
        }
      );
      watch(
        () => props.model,
        () => {
          setFormData();
          setTimeout(() => {
            clearFormValidStatus();
          });
        },
        {
          immediate: true,
          deep: true
        }
      );

      const renderSubMenu = () => {
        if (_.keys(subGroupCache.value).length) {
          return (
            <div class="side-menu">
              {_.map(_.keys(subGroupCache.value), (k) => (
                <div
                  key={k}
                  class={['menu-item', { active: activeMenu.value === k }]}
                  onClick={withModifiers(
                    () => handleClickSubGroup(k),
                    ['stop']
                  )}
                >
                  {k}
                </div>
              ))}
            </div>
          );
        }
        return null;
      };
      const renderFilterBox = () => {
        return (
          <a-space class="m-b-20 flex-end" fill>
            <a-input-search
              v-model={queryName.value}
              placeholder={t('common.filter.attrs')}
              style="width: 200px"
              allow-clear
              onChange={handleQueryChange}
            ></a-input-search>
            <a-select
              v-model={filterParams.required}
              placeholder={t('common.filter.isrequired.holder')}
              allow-clear
              style="width: 140px"
            >
              {_.map(requiredOptions, (item) => (
                <a-option
                  key={item.value}
                  value={item.value}
                  label={t(item.label)}
                ></a-option>
              ))}
            </a-select>
            <a-select
              v-model={filterParams.hasValue}
              placeholder={t('common.filter.filled.holder')}
              allow-clear
              style="width: 140px"
              onChange={handleCheckHasValueChange}
            >
              {_.map(hasValueOptions, (item) => (
                <a-option
                  key={item.value}
                  value={item.value}
                  label={t(item.label)}
                ></a-option>
              ))}
            </a-select>
            <a-button type="outline" onClick={handleClear}>
              {t('common.button.clear')}
            </a-button>
          </a-space>
        );
      };
      const subGroupTitle = (fm) => {
        if (
          activeMenu.value === fm.subGroup &&
          fm.thirdGroup &&
          !fm.thirdGroupOrder
        ) {
          return (
            <a-grid-item span={24}>
              <div class="sub-group-title">
                <icon-bulb class="mright-5" />
                {fm.thirdGroup}
              </div>
            </a-grid-item>
          );
        }
        return null;
      };
      const renderOtherType = (fm, index) => {
        const ChildComponent = formComponents[fm.uiSchema.childCom];
        const ParentComponent = formComponents[fm.uiSchema.parentCom];

        return (
          <ParentComponent
            key={`${props.formId}_editorId_${index}`}
            {...fm.uiSchema.props}
            widget={fm.uiSchema.widget}
            model-value={_.get(formData.value, fm.fieldPath)}
            label={`${fm.title || fm.name}`}
            required={fm.uiSchema.required}
            popup-info={fm.description}
            editor-default-value={_.get(formData.value, fm.fieldPath) || ''}
            style={{ width: '100%' }}
            width="100%"
            editor-id={`${fm.name}_editorId_${index}`}
            event-handler={() => eventHandler(fm)}
            onInput={(e) => handleSelectInputChange(e, fm)}
            onChange={(val) => handleFieldChange(val, fm)}
          >
            {fm.uiSchema.childCom ? (
              <>
                <ChildComponent
                  key={`${props.formId}_child_editorId_${index}`}
                  editor-id={`${fm.name}_child_editorId_${index}`}
                  style={{ display: 'none' }}
                ></ChildComponent>
                {_.map(fm.options, (com) => {
                  return (
                    <ChildComponent key={com.label} value={com.value}>
                      {com.value}
                    </ChildComponent>
                  );
                })}
              </>
            ) : null}
          </ParentComponent>
        );
      };

      const renderThumbButton = (fm) => {
        return (
          <>
            {!fm.uiSchema.props?.disabled ? (
              <ThumbButton
                size={24}
                fontSize="14px"
                onClick={() => handleAddOne(fm.uiSchema.labelList)}
              ></ThumbButton>
            ) : null}
          </>
        );
      };
      const renderMapStringType = (fm) => {
        const ParentComponet = formComponents[fm.uiSchema.parentCom];
        const ChildComponent = formComponents[fm.uiSchema.childCom];
        return (
          <div style="display: flex; flex: 1; flex-direction: column">
            <SealFormItemWrap
              label={fm.title || fm.name}
              required={fm.uiSchema.required}
              show-required-mark={false}
              popup-info={fm.description}
            >
              {fm?.uiSchema.labelList?.length
                ? _.map(fm.uiSchema.labelList, (sItem, sIndex) => {
                    return (
                      <ParentComponet
                        key={sIndex}
                        dataKey={sItem.key}
                        dataValue={sItem.value}
                        value={_.get(formData.value, fm.fieldPath)}
                        onUpdate:dataKey={(val) =>
                          handleUpdateMapDataKey(val, sItem)
                        }
                        onUpdate:dataValue={(val) =>
                          handleUpdateMapDataValue(val, sItem)
                        }
                        onUpdate:value={(val) => handleUpdataMapValue(val, fm)}
                        class="group-item"
                        style={{ width: '100%' }}
                        width="100%"
                        trigger-validate={triggerValidate.value}
                        form-id={fm.name}
                        label-list={fm.uiSchema.labelList}
                        position={sIndex}
                        onAdd={(obj) =>
                          handleAddLabel(obj, fm.uiSchema.labelList)
                        }
                        onDelete={() =>
                          handleDeleteLabel(fm.uiSchema.labelList, sIndex)
                        }
                        {...fm.uiSchema.props}
                      >
                        {fm.uiSchema.childCom ? (
                          <>
                            {_.map(fm.options, (com) => {
                              return (
                                <ChildComponent
                                  key={com}
                                  value={com.value}
                                  form-id={props.formId}
                                >
                                  {com.value}
                                </ChildComponent>
                              );
                            })}
                          </>
                        ) : null}
                      </ParentComponet>
                    );
                  })
                : renderThumbButton(fm)}
            </SealFormItemWrap>
          </div>
        );
      };

      const renderField = (fm, index) => {
        const showCondition = fm.uiSchema.showIf
          ? getConditionValue(fm.uiSchema, {
              ...props.attributes,
              ...formData.value
            })
          : true;

        const show = showCondition && filterFields(fm);

        if (show) {
          return (
            <a-grid-item
              span={setGridItemSpan(fm, index)}
              class={{
                'hidden-field':
                  activeMenu.value && activeMenu.value !== fm.uiSchema.subGroup
              }}
            >
              <a-form-item
                key={_.join(fm.fieldPath, '.')}
                field={_.join(fm.fieldPath, '.')}
                rules={_.map(fm.uiSchema.rules, (r) => {
                  r.message = t(r.message, { name: fm.name });
                  return r;
                })}
                hide-label
                label={fm.title || _.join(fm.fieldPath, '_')}
                validate-trigger={['change']}
                v-slots={{
                  label: () => (
                    <span>
                      <span>{fm.title || _.join(fm.fieldPath, '_')}</span>
                      {fm.description ? (
                        <a-tooltip content={fm.description}>
                          <icon-info-circle
                            style={{
                              'margin-left': '2px',
                              'stroke-linecap': 'initial'
                            }}
                          />
                        </a-tooltip>
                      ) : null}
                    </span>
                  )
                }}
              >
                {FieldDataType.isMap(fm)
                  ? renderMapStringType(fm)
                  : renderOtherType(fm, index)}
              </a-form-item>
            </a-grid-item>
          );
        }
        return null;
      };

      return () => (
        <div class="form-create-wrap">
          {props.showFilter ? renderFilterBox() : null}
          <a-form
            ref={formref}
            model={formData.value}
            auto-label-width
            layout={props.layout}
          >
            {slots?.default?.()}
            <div class="content-wrap">
              {renderSubMenu()}
              <a-grid cols={24} col-gap={10} style="flex: 1">
                {_.map(activeSchemaList.value, (fm, index) => {
                  return (
                    <>
                      {subGroupTitle(fm)}
                      {renderField(fm, index)}
                    </>
                  );
                })}
              </a-grid>
            </div>
          </a-form>
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  @import url('./style/side-menu.less');

  .form-create-wrap {
    :deep(.arco-select-view) {
      width: 360px;
    }

    .hidden-field {
      display: none;
    }

    .sub-group-title {
      z-index: 10;
      margin-bottom: 10px;
      padding: 2px 0;
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 14px;
      background-color: var(--color-fill-2);
    }
  }

  .x-input {
    margin-bottom: 10px;

    &:only-child {
      margin-bottom: 0;
    }
  }
</style>

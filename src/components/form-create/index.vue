<script lang="tsx">
  import _ from 'lodash';
  import {
    PropType,
    ref,
    computed,
    watch,
    defineComponent,
    withModifiers
  } from 'vue';
  import axios from 'axios';
  import { useI18n } from 'vue-i18n';
  import ThumbButton from '@/components/buttons/thumb-button.vue';
  import SealFormItemWrap from '@/components/seal-form/components/seal-form-item-wrap.vue';
  import i18n from '@/locale/index';
  import { ComponentSchema } from './config/interface';
  import { json2Yaml, yaml2Json } from './config/yaml-parse';
  import formComponents from './components';
  import {
    parseMapstring,
    parseOptions,
    parseQuery,
    getConditionValue,
    parseComponentSchema
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
        type: Array as PropType<ComponentSchema[]>,
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
      submit: {
        type: Function
      },
      api: {
        type: String,
        default() {
          return '';
        }
      },
      showFooter: {
        type: Boolean,
        default() {
          return true;
        }
      },
      action: {
        type: String as PropType<'post' | 'put'>,
        default() {
          return 'post';
        }
      },
      model: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    setup(props, { slots, emit, expose }) {
      const numberReg = /\d+/;
      const { t } = useI18n();
      const submitLoading = ref(false);
      const formref = ref();
      const schemaList = ref<ComponentSchema[]>([]);
      const formData = ref({});
      const subGroupCache = ref({});
      const subGroupListCache = ref({});
      const thirdGroupCache = ref({});
      const activeMenu = ref('');
      const OTHER_SUB_GROUP = 'Other';
      const triggerValidate = ref(false);
      const validateState = ref(false); // if has executed validate

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
            if (sItem.showIf) {
              return getConditionValue(sItem, {
                ...props.attributes,
                ...formData.value
              });
            }
            return true;
          });
          return list;
        }
        const list = _.filter(schemaList.value, (sItem) => {
          if (sItem.showIf) {
            return (
              sItem.subGroup === activeMenu.value &&
              getConditionValue(sItem, {
                ...props.attributes,
                ...formData.value
              })
            );
          }
          return sItem.subGroup === activeMenu.value;
        });

        return list;
      });

      const doSubmit = async () => {
        return axios[props.action](props.api, formData.value);
      };
      const setFormData = () => {
        formData.value = {};
        _.each(props.formSchema, (item) => {
          let val = _.get(props.model, item.name) || item.default;
          // transform data type
          if (
            schemaType.isCollectionType(item.type) ||
            schemaType.isUnknownType(item.type)
          ) {
            val = json2Yaml(val);
          } else if (
            schemaType.isListNumber(item.type) ||
            schemaType.isListString(item.type)
          ) {
            val = val || [];
          }
          formData.value[item.name] = val;
        });
      };
      const calcGridItemSpan = (fm, index) => {
        const isEvenPosition = (index + 1) % 2 === 0;
        const fmSchemaIsCollectionType =
          schemaType.isCollectionType(fm.type) ||
          schemaType.isUnknownType(fm.type);
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
          schemaType.isCollectionType(bilingSchema.type) ||
          schemaType.isUnknownType(bilingSchema.type);

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
      const handleSelectInputChange = (e: any, type) => {
        if (schemaType.isListNumber(type) && !numberReg.test(e.data)) {
          e.target.value = e.target.value.replace(/[^\d]/g, '');
        }
      };
      const handleClickSubGroup = (k) => {
        activeMenu.value = k;
        if (validateState.value) {
          setTimeout(() => {
            formref.value?.validate?.();
          });
        }
      };
      const eventHandler = (filedName) => {
        formref.value?.validateField?.(filedName);
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
          const item = _.cloneDeep(o);
          const content = parseComponentSchema(item);
          // filter empty group
          const groupConfig: string[] = _.filter(
            _.split(item.group, /\/+/) || [],
            (s) => !!s
          );
          const mainGroup = _.get(groupConfig, '0') || '';
          const subGroup = _.get(groupConfig, '1') || '';
          const thirdGroup = _.get(groupConfig, '2') || '';

          item.showCondition = parseQuery(item.showIf);
          item.conditions = parseExpression(item.showIf);
          item.order = item.required ? 0 : 100 * (i + 1);
          item.parentCom = _.get(content, 'component.0');
          item.childCom = _.get(content, 'component.1');
          item.labelList = parseMapstring(
            item,
            _.get(formData.value, item.name)
          );
          item.subGroup = subGroup;
          item.mainGroup = mainGroup;
          item.thirdGroup = thirdGroup;
          item.subGroupOrder = !_.get(subGroupCache.value, subGroup) ? 0 : 1;
          item.thirdGroupOrder = !_.get(thirdGroupCache.value, thirdGroup)
            ? 0
            : 1;
          item.options = parseOptions(item);
          item.props = _.get(content, 'props') || {};
          item.rules = _.map(content.rules, (sItem) => {
            sItem.message = i18n.global.t(sItem?.message, {
              name: item.label || item.name
            });
            return sItem;
          });

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
          showIfMap[item.name] = item.order;
          return item;
        });
        list = _.map(list, (sItem) => {
          if (sItem.showIf) {
            const relativeOrders = _.map(sItem.conditions, (v) => {
              return _.get(showIfMap, v.variable);
            });
            sItem.order = _.add(_.max(relativeOrders), 0.1);
          }
          if (
            sItem.mainGroup &&
            subGroupListCache.value[sItem.mainGroup] &&
            !sItem.subGroup
          ) {
            sItem.subGroup = OTHER_SUB_GROUP;
          }
          // transform default value data type
          if (
            schemaType.isCollectionType(sItem.type) ||
            schemaType.isUnknownType(sItem.type)
          ) {
            sItem.default = json2Yaml(sItem.default);
          }
          return sItem;
        });
        list = _.sortBy(list, (pItem) => pItem.order);
        schemaList.value = list;
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
      // reset field default value when showIf is negative
      const resetFieldsDefaultValue = () => {
        _.each(schemaList.value, (item) => {
          if (
            item.showIf &&
            !getConditionValue(item, { ...props.attributes, ...formData.value })
          ) {
            Reflect.deleteProperty(formData.value, item.name);
          }
        });
      };
      // transform data before submit
      const transformDataByType = () => {
        const result = _.cloneDeep(formData.value);
        _.each(schemaList.value, (item) => {
          if (
            schemaType.isCollectionType(item.type) ||
            schemaType.isUnknownType(item.type)
          ) {
            result[item.name] = yaml2Json(formData.value[item.name], item.type);
          }
        });
        return result;
      };
      const validateLabels = () => {
        const result = _.find(schemaList.value, (sItem) => {
          if (sItem.labelList?.length) {
            return _.some(sItem.labelList, (item) => {
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
            (item) => item.name === errorField
          );
          activeMenu.value = d?.subGroup || activeMenu.value;
        } else if (validLabels) {
          activeMenu.value = validLabels?.subGroup || activeMenu.value;
        }

        if (!result && !validLabels) {
          resetFieldsDefaultValue();
          const resultFormData = transformDataByType();
          return resultFormData;
        }
        return false;
      };

      const handleSubmit = async () => {
        const res = await formref.value?.validate();
        if (!res) {
          try {
            submitLoading.value = true;
            resetFieldsDefaultValue();
            if (props.submit) {
              await props.submit?.(formData.value);
            } else {
              await doSubmit();
            }
            setTimeout(() => {
              emit('done');
            }, 200);
            submitLoading.value = false;
          } catch (error) {
            submitLoading.value = false;
          }
        }
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

      const handleCancel = () => {
        emit('cancel');
      };

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
        const ChildComponent = formComponents[fm.childCom];
        const ParentComponent = formComponents[fm.parentCom];

        return (
          <ParentComponent
            key={`${props.formId}_editorId_${index}`}
            {...fm.props}
            v-model={formData.value[fm.name]}
            label={`${fm.label || fm.name}`}
            required={fm.required}
            popup-info={fm.description}
            editor-default-value={formData.value[fm.name] || ''}
            style={{ width: '100%' }}
            width="100%"
            editor-id={`${fm.name}_editorId_${index}`}
            event-handler={() => eventHandler(fm.name)}
            onInput={(e) => handleSelectInputChange(e, fm.type)}
          >
            {fm.childCom ? (
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

      const renderMapStringType = (fm) => {
        const ParentComponet = formComponents[fm.parentCom];
        const ChildComponent = formComponents[fm.childCom];
        return (
          <div style="display: flex; flex: 1; flex-direction: column">
            <SealFormItemWrap
              label={fm.label || fm.name}
              required={fm.required}
              show-required-mark={false}
              popup-info={fm.description}
            >
              {fm?.labelList?.length ? (
                _.map(fm.labelList, (sItem, sIndex) => {
                  return (
                    <ParentComponet
                      key={sIndex}
                      v-model:dataKey={sItem.key}
                      v-model:dataValue={sItem.value}
                      v-model:value={formData.value[fm.name]}
                      class="group-item"
                      style={{ width: '100%' }}
                      width="100%"
                      trigger-validate={triggerValidate.value}
                      form-id={fm.name}
                      label-list={fm.labelList}
                      position={sIndex}
                      onAdd={(obj) => handleAddLabel(obj, fm.labelList)}
                      onDelete={() => handleDeleteLabel(fm.labelList, sIndex)}
                      {...fm.props}
                    >
                      {fm.childCom ? (
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
              ) : (
                <ThumbButton
                  size={24}
                  fontSize="14px"
                  onClick={() => handleAddOne(fm.labelList)}
                ></ThumbButton>
              )}
            </SealFormItemWrap>
          </div>
        );
      };

      const renderField = (fm, index) => {
        const showCondition = fm.showIf
          ? getConditionValue(fm, {
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
                  activeMenu.value && activeMenu.value !== fm.subGroup
              }}
            >
              <a-form-item
                key={fm.name}
                field={fm.name}
                rules={fm.rules}
                hide-label
                label={fm.label || fm.name}
                validate-trigger={['change']}
                v-slots={{
                  label: () => (
                    <span>
                      <span>{fm.label || fm.name}</span>
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
                {schemaType.isMapString(fm.type)
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
          {renderFilterBox()}
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

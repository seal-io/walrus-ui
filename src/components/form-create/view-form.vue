<script lang="tsx">
  import {
    defineComponent,
    PropType,
    toRef,
    toRefs,
    computed,
    ref,
    withModifiers,
    watchEffect,
    watch
  } from 'vue';
  import i18n from '@/locale';
  import _ from 'lodash';
  import { requiredOptions, hasValueOptions } from './config/index';
  import { checkHasValue, getObjectConditionValue } from './config/utils';
  import useFillterAttributes from './hooks/use-fillter-attributes';
  import { FieldSchema } from '../dynamic-form/config/interface';
  import { FieldDataType } from '../dynamic-form/config/field-type';
  import { Widget } from '../dynamic-form/config/widget';
  import LabelsList from './custom-components/labels-list.vue';

  interface DataItem extends FieldSchema {
    value: any;
    label: string;
    order: number;
    span?: number;
  }

  export default defineComponent({
    props: {
      formData: {
        type: Object,
        default() {
          return {};
        }
      },
      fieldList: {
        type: Array as PropType<DataItem[]>,
        default() {
          return [];
        }
      }
    },
    setup(props, { attrs }) {
      const defaultGroupKey = '_default_default_';
      const defaultGroupLabel = 'Basic';
      const { t } = i18n.global;
      const variablesGroup = ref<any>({});
      const variablesGroupForm = ref<any>({});
      const originalDataList = ref<DataItem[]>([]);
      const activeKey = ref('');
      const subGroupList = ref<string[]>([]);
      const activeSubGroup = ref('');
      const formTabs = ref<string[]>([]);
      const {
        queryName,
        filterFields,
        filterParams,
        handleClear,
        handleQueryChange,
        handleCheckHasValueChange
      } = useFillterAttributes(toRef(props, 'formData'));
      const { fieldList } = toRefs(props);

      const dataList = computed(() => {
        return _.filter(originalDataList.value, (item) => {
          return filterFields(item);
        });
      });

      const setSubGroupList = () => {
        const groupData = _.get(variablesGroup.value, activeKey.value);
        console.log('groupData:', groupData, variablesGroup.value);
        subGroupList.value = [...(groupData?.subGroup || [])];
        activeSubGroup.value = _.get(subGroupList.value, '0');
      };
      const handleTabChange = (val) => {
        activeKey.value = val;
        setSubGroupList();
      };

      const setFieldListValue = () => {
        const list = _.filter(fieldList.value, (v) => !v.uiSchema.hidden);
        originalDataList.value = _.map(list, (o) => {
          const item = _.cloneDeep(o);
          const initialValue = _.get(
            props.formData,
            [...item.fieldPath],
            item.default
          );
          item.value = initialValue;
          item.label = item.title || item.name;
          item.order = item.uiSchema.required ? 0 : 1;

          return item;
        }).sort((a, b) => a.order - b.order);
      };

      const setFormTabs = () => {
        let list = _.keys(variablesGroup.value);
        if (_.includes(list, defaultGroupKey)) {
          list = [defaultGroupKey, ..._.pull(list, defaultGroupKey)];
        }
        formTabs.value = list;
      };

      const generateVariablesGroup = () => {
        variablesGroup.value = {};
        variablesGroupForm.value = {};

        _.each(originalDataList.value, (item) => {
          // filter empty group name
          const groups: string[] = _.filter(
            _.split(item.uiSchema.group, /\/+/) || [],
            (g) => !!g
          );
          const group = _.get(groups, '0');
          if (group) {
            if (!variablesGroup.value[group]) {
              variablesGroup.value[group] = {
                variables: [],
                label: group
              };
              variablesGroup.value[group].variables.push(item);
            } else {
              variablesGroup.value[group].variables.push(item);
            }

            _.set(
              variablesGroupForm.value,
              [group, ...item.fieldPath],
              item.value
            );
          } else {
            if (!variablesGroup.value[defaultGroupKey]) {
              variablesGroup.value[defaultGroupKey] = {
                variables: [],
                label: defaultGroupLabel
              };
            }
            variablesGroup.value[defaultGroupKey].variables.push(item);
            _.set(
              variablesGroupForm.value,
              [defaultGroupKey, ...item.fieldPath],
              item.value
            );
          }
        });
      };
      const renderFilterBox = () => {
        return (
          <a-space class="m-b-20 flex-end m-r-10" fill>
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
      const handleClickSubGroup = (k) => {
        activeSubGroup.value = k;
      };
      const renderSideMenu = () => {
        if (subGroupList.value.length) {
          return (
            <div class="side-menu">
              {_.map(subGroupList.value, (k) => (
                <div
                  key={k}
                  class={[{ active: activeSubGroup.value === k }, 'menu-item']}
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
      const renderLabel = ({ data }) => {
        return (
          <span style={{ fontWeight: 400 }}>{data.title || data.name}</span>
        );
      };
      const renderValue = ({ data }) => {
        const value = _.get(props.formData, data.fieldPath);

        // empty value
        if (!checkHasValue(value)) {
          return <span></span>;
        }
        // writeOnly
        if (data.uiSchema.writeOnly) {
          return value ? <span>******</span> : '';
        }
        // list
        if (
          FieldDataType.isListNumber(data) ||
          FieldDataType.isListString(data)
        ) {
          return <span>{_.join(value, ',')}</span>;
        }
        // map
        if (FieldDataType.isMap(data)) {
          return <LabelsList labels={value}></LabelsList>;
        }
        // textarea
        if (
          [Widget.Textarea, Widget.AceEditor].includes(
            data.uiSchema.components?.[0]
          )
        ) {
          return (
            <a-textarea
              class="border-less"
              readonly
              auto-size={{ maxRows: 8 }}
              model-value={value}
            ></a-textarea>
          );
        }
        return <span>{value}</span>;
      };
      const renderSingleView = (list: DataItem[]) => {
        return (
          <>
            {renderFilterBox()}
            <a-descriptions
              column={{ lg: 2, md: 1, sm: 1, xs: 1 }}
              bordered={true}
              layout="inline-vertical"
              data={list}
              v-slots={{
                value: ({ data }) => {
                  return renderValue({ data });
                },
                label: ({ data }) => {
                  return renderLabel({ data });
                }
              }}
              {...attrs}
            ></a-descriptions>
          </>
        );
      };

      const filterGroupVariables = () => {
        _.each(_.keys(variablesGroup.value), (group) => {
          let variables =
            _.get(variablesGroup.value, `${group}.variables`) || [];
          variables = _.filter(variables, (item) => {
            if (item.showIf) {
              const attributes = _.get(variablesGroupForm.value, `${group}`);
              return getObjectConditionValue(item, attributes);
            }
            return true;
          });
          _.set(variablesGroup.value, `${group}.variables`, variables);
        });
      };
      watch(
        () => props.fieldList,
        () => {
          setFieldListValue();
          generateVariablesGroup();
          filterGroupVariables();
          setFormTabs();
          [activeKey.value] = formTabs.value;
          setSubGroupList();
        },
        {
          immediate: true
        }
      );

      return () => (
        <div class="view-form">
          {formTabs.value.length > 1 ? (
            <a-tabs
              lazy-load
              class="page-line-tabs"
              active-key={activeKey.value}
              onChange={handleTabChange}
            >
              {_.map(formTabs.value, (group) => (
                <a-tab-pane
                  key={group}
                  title={variablesGroup.value[group]?.label}
                >
                  <div class="content-wrap-2">
                    {/* {renderSideMenu()} */}
                    {renderSingleView(variablesGroup.value[group]?.variables)}
                  </div>
                </a-tab-pane>
              ))}
            </a-tabs>
          ) : (
            renderSingleView(dataList.value)
          )}
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  @import url('@/components/form-create/style/side-menu.less');

  .view-form {
    :deep(.arco-tabs-nav-tab-list) {
      padding-left: 10px;
    }

    :deep(.arco-form-item) {
      margin-bottom: 0;

      .arco-form-item-label {
        font-size: 14px;
      }
    }

    :deep(.arco-tabs-content) {
      padding: 16px 0 0 0;
    }

    :deep(.arco-descriptions-layout-inline-vertical) {
      .arco-descriptions-body {
        border: none;
      }

      .arco-descriptions-table {
        border-collapse: separate;
        border-spacing: 10px;

        .arco-descriptions-item {
          padding: 10px;
          border: 1px solid var(--color-border-2);
          border-radius: var(--border-radius-small);
        }
      }

      .arco-textarea-wrapper {
        background-color: var(--color-fill-2);
        border: none;
      }
    }
  }
</style>

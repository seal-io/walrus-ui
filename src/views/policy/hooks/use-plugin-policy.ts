import { ref } from 'vue';
import { get, map, pickBy, cloneDeep, reduce, each } from 'lodash';
import { queryPluginPolicySchemas, PluginPolicyRow } from '@/api/policy';
import i18n from '@/locale';
import { operatorMapToValueType } from '../config';

/**
 * schemas for plugin
 * policyType Map :{
 *  [<category><type>]: locale message key
 * }
 * conditionType map: {
 *  [<policyType><conditionType>]: locale message key
 * }
 */
export const usePluginPolicy = () => {
  const categoriesList = ref<{ value: string; label: string }[]>([]);
  const policyTypeCategory = ref({});
  const localsData = ref({
    en: {},
    zh: {},
  });
  const policyTypeList = ref<PluginPolicyRow[]>([]);
  // policyType and conditionType locale map
  const typeMap = ref({});

  // set policyTypeList
  const setPolicyTypeList = (
    list: PluginPolicyRow[],
    licenseList?: Array<{ value: string; label: string }>
  ) => {
    const arr: Array<PluginPolicyRow> = map(list, (item) => {
      const o = cloneDeep(item);
      o.conditions = map(o.conditions, (sItem) => {
        const s = cloneDeep(sItem);
        const operators = s.operators || [];
        s.conditionType = s.name;
        s.label = `policy.${o.type}.condition.${s.name}`;
        s.subLabel = `${o.type}${s.name}`;
        s.operatorConfigs = map(s.operators, (pItem) => {
          return {
            valueType: operatorMapToValueType[pItem] || 'string',
            value: pItem,
            label: pItem,
          };
        });
        s.min = get(s, 'minimum') || 0;
        s.max = get(s, 'maximum') || 0;
        s.hasOperator = !!(s.operators && s.operators.length);
        s.valueConfigs = map(s.options, (vItem) => {
          return {
            value: vItem,
            label: vItem,
          };
        });
        if (operators.includes('belongToGroup') && licenseList) {
          s.valueConfigs = [].concat(licenseList as never[]);
        }
        return s;
      });
      return o;
    });
    policyTypeList.value = [].concat(arr as never[]);
    console.log('policyTypeList===', policyTypeList.value);
  };
  // policy type map to category
  const setPolicyTypeCategory = (list: PluginPolicyRow[]) => {
    policyTypeCategory.value = reduce(
      list,
      (obj, item) => {
        if (obj[item.category]) {
          obj[item.category].push({
            value: item.type,
            label: `policy.${item.type}`,
            configurationFormat: item.configurationFormat,
            subLabel: `${item.category}${item.type}`,
          });
        } else {
          obj[item.category] = [];
          obj[item.category].push({
            value: item.type,
            label: `policy.${item.type}`,
            configurationFormat: item.configurationFormat,
            subLabel: `${item.category}${item.type}`,
          });
        }
        return obj;
      },
      {}
    );
  };
  const setTypeMap = (list: PluginPolicyRow[]) => {
    each(list, (item) => {
      // policyType map
      // if (!typeMap.value[item.type]) {
      //   typeMap.value[item.type] = `policy.${item.type}`;
      // }
      if (!typeMap.value[`${item.category}${item.type}`]) {
        typeMap.value[`${item.category}${item.type}`] = `policy.${item.type}`;
      }
      // conditionType map
      if (item.conditions && item.conditions.length) {
        each(item.conditions, (sItem) => {
          if (!typeMap.value[`${item.type}${sItem.name}`]) {
            typeMap.value[
              `${item.type}${sItem.name}`
            ] = `policy.${item.type}.condition.${sItem.name}`;
          }
        });
      }
    });
  };
  const getPluginPolicySchemas = async (arr?) => {
    const query = {
      page: 1,
      perPage: 1000,
    };
    const params = pickBy(query, (val) => !!val);

    const { data } = await queryPluginPolicySchemas(params);
    const list = data || [];

    categoriesList.value = map(list, (item) => {
      const o = cloneDeep(item);
      localsData.value.en = {
        ...localsData.value.en,
        ...o.locales.en,
      };
      localsData.value.zh = {
        ...localsData.value.zh,
        ...o.locales.zh,
      };
      return {
        value: o.type,
        label: `policy.${o.type}`,
      };
    });
    setPolicyTypeCategory(list);
    setTypeMap(list);
    setPolicyTypeList(list, arr);
    i18n.global.mergeLocaleMessage('en-US', localsData.value.en);
    i18n.global.mergeLocaleMessage('zh-CN', localsData.value.zh);
  };
  return {
    getPluginPolicySchemas,
    categoriesList,
    policyTypeCategory,
    customTypeMap: typeMap,
    policyTypeList,
  };
};

export default {};

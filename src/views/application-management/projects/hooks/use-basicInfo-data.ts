import { computed } from 'vue';
import _ from 'lodash';
import useCallCommon from '@/hooks/use-call-common';

export default function useBasicInfoData(basicInfoConfig, currentInfo) {
  const { t } = useCallCommon();
  const basicDataList = computed(() => {
    let result = _.cloneDeep(basicInfoConfig);
    result = _.map(result, (item) => {
      return {
        ...item,
        label: t(item.label),
        key: item.key,
        value: item.formatter
          ? item.formatter(_.get(currentInfo.value, item.key))
          : _.get(currentInfo.value, item.key)
      };
    });
    return result;
  });
  return basicDataList;
}

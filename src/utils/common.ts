import { ref } from 'vue';

/**
 *
 * @date 2022-11-21
 * @param {any} {defaultSortField
 * @param {any} defaultOrder
 * @param {any} isResetOrder?:boolean}: whether there has empty sort order: ''
 * @returns {any}
 */
type sortOrderParams = {
  defaultSortField: string;
  defaultOrder: 'ascend' | 'descend' | '';
  isResetOrder?: boolean;
};
type orderType = 'ascend' | 'descend' | '';

export function UseSortDirection(data: sortOrderParams) {
  const { defaultSortField, defaultOrder, isResetOrder } = data;
  const sort = ref(defaultSortField);
  const sortOrder = ref<'ascend' | 'descend' | ''>(defaultOrder);
  const defaultSort = defaultOrder || ('descend' as orderType);
  const setSortDirection = (dataIndex, direction) => {
    const sortMap = {
      ascend: `${dataIndex}`,
      descend: `-${dataIndex}`,
      defaultSort: '',
    };
    const sortOrderMap = {
      ascend: `descend`,
      descend: `ascend`,
      defautOrder: '',
    };
    if (direction === '') {
      sortOrder.value = isResetOrder
        ? sortOrderMap.defautOrder
        : sortOrderMap[sortOrder.value];
      sort.value = isResetOrder
        ? sortMap.defaultSort
        : sortMap[sortOrder.value];
    } else {
      sortOrder.value = direction;
      sort.value = sortMap[direction];
    }
  };
  return {
    sort,
    sortOrder,
    setSortDirection,
  };
}
export default {};

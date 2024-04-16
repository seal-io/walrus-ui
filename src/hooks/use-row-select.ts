import { ref, reactive } from 'vue';

export default function useRowSelect() {
  type BaseType = string | number;
  const rowSelection: any = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    selectedRowKeys: [] as string[]
  });
  const selectedKeys = ref<BaseType[]>([]);
  const handleSelectChange = (list: BaseType[]) => {
    selectedKeys.value = [...list];
    rowSelection.selectedRowKeys = [...list];
    console.log('selectedKeys', selectedKeys.value);
  };

  return {
    rowSelection,
    selectedKeys,
    handleSelectChange
  };
}

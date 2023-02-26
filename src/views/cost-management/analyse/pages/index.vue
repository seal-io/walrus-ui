<template>
  <div class="main-wrapper">
    <perspectiveAll :view-id="viewId" :is-page="true"></perspectiveAll>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { find, map, toLower } from 'lodash';
  import { useCostManageStore } from '@/store';
  import perspectiveAll from './perspective-all.vue';
  import { queryPerspectives } from '../api';

  const costManagentStore = useCostManageStore();
  const viewId = ref('');
  const viewList = ref<{ value: string; label: string }[]>([]);
  const getViewList = async () => {
    try {
      const params = {
        page: 1,
        perPage: 1000
      };
      const { data } = await queryPerspectives(params);
      const list = data?.items || [];
      viewList.value = map(list, (item) => {
        item.label = toLower(item.name);
        item.value = item.id;
        return item;
      }) as Array<{ value: string; label: string }>;
      const allView = find(viewList.value, (sItem) => sItem.label === 'all');
      viewId.value = allView?.value || '';
      costManagentStore.setFilterInfo({ perspectiveList: viewList });
    } catch (error) {
      viewList.value = [];
      costManagentStore.setFilterInfo({ perspectiveList: [] });
      viewId.value = '';
      console.log(error);
    }
  };
  getViewList();
</script>

<style lang="less" scoped></style>

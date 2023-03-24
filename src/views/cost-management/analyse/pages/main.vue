<template>
  <div class="main-wrapper">
    <component
      :is="perspectiveMap[viewComponent]"
      :source="viewComponent"
      :is-page="true"
      :pageloading="loading"
    >
      <template #select>
        <a-select
          v-model="viewId"
          style="width: 180px"
          class="border-less"
          :placeholder="$t('cost.analyse.view.holder')"
          allow-search
          @change="handleViewChange"
        >
          <a-option
            v-for="item in viewList"
            :key="item.value"
            :value="item.value"
            >{{ builtinViewMap[item.label] ?? item.name }}</a-option
          >
          <template #empty><span></span></template>
        </a-select>
      </template>
      <!-- <template #button>
        <a-button
          type="primary"
          @click="handleSearch"
          style="margin-left: 10px"
          >{{ $t('common.button.search') }}</a-button
        >
      </template> -->
      <template #view-btn>
        <a-button type="primary" @click="handleViewManage">{{
          $t('cost.analyse.table.manage')
        }}</a-button>
      </template>
    </component>
  </div>
</template>

<script lang="ts" setup>
  import { markRaw, ref, onMounted, provide } from 'vue';
  import { find, map, toLower } from 'lodash';
  import useCallCommon from '@/hooks/use-call-common';
  import { useCostManageStore } from '@/store';
  import perspectiveAll from './perspective-all.vue';
  import perspectiveCluster from './perspective-cluster.vue';
  import perspectiveProject from './perspective-project.vue';
  import perspectiveCustom from './perspective-custom.vue';
  import { queryPerspectives, queryPerspectiveFields } from '../api';
  import { builtinViewMap } from '../config';

  const perspectiveMap = {
    all: markRaw(perspectiveAll),
    cluster: markRaw(perspectiveCluster),
    project: markRaw(perspectiveProject),
    custom: markRaw(perspectiveCustom)
  };

  const { router, route } = useCallCommon();
  const costManageStore = useCostManageStore();
  const loading = ref(false);
  const viewList = ref<{ value: string; label: string; name?: string }[]>([]);
  const viewId = ref('');
  const viewComponent = ref('');
  provide('componentName', viewComponent.value);

  const handleViewChange = (val) => {
    const data = find(viewList.value, (item) => item.value === val);
    viewId.value = val;
    viewComponent.value = toLower(data?.label);
    router.replace({
      query: {
        id: val,
        page: data?.label
      }
    });
  };
  const handleSearch = () => {};
  const handleViewManage = () => {
    router.push({
      name: 'costAnalyseList'
    });
  };
  const getPerspectiveFields = async () => {
    try {
      const { data } = await queryPerspectiveFields({ fieldType: 'filter' });
      const list = data?.items || [];
      costManageStore.setFilterInfo({
        fieldNameList: list
      });
    } catch (error) {
      costManageStore.setFilterInfo({
        fieldNameList: []
      });
      console.log(error);
    }
  };
  const getViewList = async () => {
    try {
      loading.value = true;
      const params = {
        page: 1,
        perPage: -1
      };
      const { data } = await queryPerspectives(params);
      const list = data?.items || [];
      viewList.value = map(list, (item) => {
        item.label = item?.builtin ? toLower(item.name) : 'custom';
        item.value = item.id;
        return item;
      }) as Array<{ value: string; label: string }>;
      const allView = find(viewList.value, (sItem) => sItem.label === 'all');
      viewId.value = allView?.value || '';
      loading.value = false;
    } catch (error) {
      loading.value = false;
      viewList.value = [];
      viewId.value = '';
      console.log(error);
    }
  };
  const setView = () => {
    if (route.query.id) {
      viewId.value = (route.query.id || '') as string;
    }
    handleViewChange(viewId.value);
  };
  const init = async () => {
    await getViewList();
    setView();
    // getPerspectiveFields();
  };
  onMounted(() => {
    init();
  });
</script>

<style lang="less" scoped>
  .main-wrapper {
    margin-top: 20px;
  }
</style>

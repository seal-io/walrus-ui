<template>
  <div class="main-wrapper">
    <component
      :is="perspectiveMap[viewComponent]"
      :source="viewComponent"
      :is-page="true"
      :pageloading="loading"
      :view-id="viewId"
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
            :label="item.name"
          ></a-option>
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
  import { markRaw, ref, onBeforeUnmount } from 'vue';
  import { find, map, toLower } from 'lodash';
  import useCallCommon from '@/hooks/use-call-common';
  import { useCostManageStore } from '@/store';
  import perspectiveAll from './perspective-all.vue';
  import perspectiveCluster from './perspective-cluster.vue';
  import perspectiveProject from './perspective-project.vue';
  import { queryPerspectives, queryPerspectiveFields } from '../api';

  const perspectiveMap = {
    all: markRaw(perspectiveAll),
    cluster: markRaw(perspectiveCluster),
    project: markRaw(perspectiveProject),
    custom: ''
  };
  const { router } = useCallCommon();
  const loading = ref(false);
  const viewList = ref<{ value: string; label: string; name: string }[]>([]);
  const viewId = ref('');
  const viewComponent = ref('all');
  const handleViewChange = (val) => {
    const data = find(viewList.value, (item) => item.value === val);
    viewId.value = val;
    viewComponent.value = toLower(data?.label);
  };
  const handleSearch = () => {};
  const handleViewManage = () => {
    router.push({
      name: 'costAnalyseList'
    });
  };
  const getPerspectiveFields = async () => {
    try {
      const { data } = await queryPerspectiveFields();
    } catch (error) {
      console.log(error);
    }
  };
  const getViewList = async () => {
    try {
      loading.value = true;
      const params = {
        page: 1,
        perPage: 1000
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
  onBeforeUnmount(() => {
    viewId.value = '';
  });
  getViewList();
  getPerspectiveFields();
</script>

<style lang="less" scoped>
  .main-wrapper {
    margin-top: 20px;
  }
</style>

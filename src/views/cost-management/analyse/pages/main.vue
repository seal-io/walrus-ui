<template>
  <div class="main-wrapper">
    <!-- <component
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
            >{{ $t(item.name || '') }}</a-option
          >
          <template #empty><span></span></template>
        </a-select>
      </template>
    </component> -->
    <!-- <a-select
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
        >{{ $t(item.name || '') }}</a-option
      >
      <template #empty><span></span></template>
    </a-select> -->
    <a-tabs
      :default-active-key="page"
      :active-key="viewComponent"
      destroy-on-hide
    >
      <a-tab-pane v-for="k in keys(perspectiveMap)" :key="k">
        <component
          :is="perspectiveMap[k]"
          :source="viewComponent"
          :is-page="true"
          :view-id="viewId"
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
                >{{ $t(item.name || '') }}</a-option
              >
              <template #empty><span></span></template>
            </a-select>
          </template>
        </component>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
  import { markRaw, ref, onMounted, provide, nextTick } from 'vue';
  import { keys, find, map, toLower } from 'lodash';
  import localStore from '@/utils/localStore';
  import useCallCommon from '@/hooks/use-call-common';
  import perspectiveAll from './perspective-all.vue';
  import perspectiveCluster from './perspective-cluster.vue';
  import perspectiveProject from './perspective-project.vue';
  import perspectiveCustom from './perspective-custom.vue';
  import { queryPerspectives, queryPerspectiveFields } from '../api';

  const HOT_PERSPECTIVE_ID = 'HOT_PERSPECTIVE_ID';
  const perspectiveMap = {
    all: markRaw(perspectiveAll),
    cluster: markRaw(perspectiveCluster),
    project: markRaw(perspectiveProject),
    custom: markRaw(perspectiveCustom)
  };
  const { router, route } = useCallCommon();
  const page = (route.query.page || 'all') as string;
  const loading = ref(false);
  const loadend = ref(false);
  const viewList = ref<{ value: string; label: string; name?: string }[]>([]);
  const viewId = ref('');
  const viewComponent = ref(page);
  provide('componentName', viewComponent.value);
  provide('perspectiveList', viewList);
  const handleViewChange = (val) => {
    const data = find(viewList.value, (item) => item.value === val);
    localStore.setValue(HOT_PERSPECTIVE_ID, {
      hotProjectId: val,
      page: toLower(data?.label || 'all')
    });
    // viewId.value = val;
    // router.replace({
    //   query: {
    //     id: val,
    //     page: data?.label
    //   }
    // });
    setTimeout(() => {
      viewId.value = val;
      viewComponent.value = toLower(data?.label || 'all');
    }, 50);
  };

  const getViewList = async () => {
    if (viewList.value.length) return;
    const { hotProjectId } = await localStore.getValue(HOT_PERSPECTIVE_ID);
    try {
      loading.value = true;
      const params = {
        page: -1
      };
      const { data } = await queryPerspectives(params);
      const list = data?.items || [];
      viewList.value = map(list, (item) => {
        item.label = item?.builtin ? toLower(item.name) : 'custom';
        item.value = item.id;
        return item;
      }) as Array<{ value: string; label: string }>;
      const hotItem = find(
        viewList.value,
        (sItem) => sItem.value === hotProjectId
      );
      if (hotItem) {
        viewId.value = hotItem?.value || '';
      } else {
        const allView = find(viewList.value, (sItem) => sItem.label === 'all');
        viewId.value = allView?.value || '';
      }
      loading.value = false;
    } catch (error) {
      loading.value = false;
      viewList.value = [];
      viewId.value = '';
      console.log(error);
    }
  };
  const setPageComponent = async () => {
    const { hotProjectId, page } = await localStore.getValue(
      HOT_PERSPECTIVE_ID
    );
    console.log('hotProjectId===', { hotProjectId, page });
    viewComponent.value = page || 'all';
    viewId.value = hotProjectId || '';
  };
  const setView = () => {
    localStore.setValue(HOT_PERSPECTIVE_ID, {
      hotProjectId: viewId.value,
      page: viewComponent.value
    });
  };
  const init = async () => {
    setPageComponent();
    await getViewList();
    setView();
  };
  // onMounted(() => {
  //   init();
  // });
  init();
</script>

<style lang="less" scoped>
  .main-wrapper {
    margin-top: 20px;

    :deep(.arco-tabs-content) {
      padding-top: 0;
    }

    :deep(.arco-tabs-nav-tab) {
      display: none;
    }
  }
</style>

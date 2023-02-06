<template>
  <div class="fixed-wrap">
    <div v-if="dataList.length">
      <div style="margin: 10px 0 5px; font-weight: 500">{{
        $t('resource.detail.tabfix.none')
      }}</div>
      <unfixList
        :data-list="dataList"
        style="padding-bottom: 20px"
        :loading="false"
      ></unfixList>
      <!-- <div style="padding-right: 10px">
        <a-pagination
          size="small"
          :total="total"
          :page-size="queryParams.perPage"
          :current="queryParams.page"
          show-total
          show-page-size
          :page-size-options="[10, 30, 50, 100, 500]"
          :hide-on-single-page="queryParams.perPage === 500"
          @change="handlePageChange"
          @page-size-change="handlePageSizeChange"
        />
      </div> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { assignIn, find, get, filter } from 'lodash';
  import { ref, reactive, onMounted } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import unfixList from './unfix-list.vue';
  import {
    queryFixAdviceList,
    ListParams,
    FixAdviceItem,
  } from '../../api/fix-advice';

  const { setLoading, route, loading } = useCallCommon();
  const queryParams = reactive({
    // page: 1,
    // perPage: 500,
    isFixable: false,
  });
  const emits = defineEmits(['infoChange']);
  const unfixSummary = reactive({});
  const needUpdateSettings = ref(false);
  const total = ref(0);
  const dataList = ref<FixAdviceItem[]>([]);
  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {
        resourceID: route.query.id,
        eventID: route.query.versionId,
        ...queryParams,
      } as ListParams;
      const { data } = await queryFixAdviceList(params);
      // const data  = fixData
      const list: any = data?.items || [];
      const summary = get(data, 'summary');
      assignIn(unfixSummary, summary);
      total.value = get(data, 'pagination.total');
      dataList.value = [].concat(list);
      if (find(dataList.value, (v) => v.notice)) {
        dataList.value = filter(dataList.value, (item) => !item.notice);
      }
    } catch (error) {
      dataList.value = [];
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchData();
  };
  const handleStrategyChange = () => {
    // queryParams.page = 1;
    handleFilter();
  };
  const handlePageChange = (page: number) => {
    // queryParams.page = page;
    handleFilter();
  };

  const handlePageSizeChange = (pageSize: number) => {
    // queryParams.page = 1;
    // queryParams.perPage = pageSize;
    handleFilter();
  };
  onMounted(async () => {
    await fetchData();
    emits('infoChange', unfixSummary);
  });
</script>

<style></style>

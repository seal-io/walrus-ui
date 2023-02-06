<template>
  <div class="fix-wrap detail-simple-wrap">
    <com-card v-if="needUpdateSettings" :bordered="false" padding="20px 0px 0">
      <div class="notice">
        <div class="text"
          ><IconFont type="icon-warn" style="margin-right: 6px"></IconFont
          >{{ $t('resource.detail.fix.notice') }}</div
        >
        <a-button
          type="text"
          size="small"
          class="btn"
          @click="handleToSettings"
          >{{ $t('projects.modal.integration.oktext') }}</a-button
        >
      </div>
    </com-card>
    <com-card v-else :bordered="false" padding="20px 0px 0">
      <a-descriptions
        :data="summaryDataList"
        layout="inline-vertical"
        align="center"
        style="margin-bottom: 20px"
        :bordered="false"
      >
        <template #value="{ data, value }">
          <span v-if="data.key === 'total'" style="font-weight: 500">{{
            value
          }}</span>
          <div v-else>
            <severityBar
              :severity="{
                ...value,
              }"
            ></severityBar>
          </div>
        </template>
        <template #label="{ label }">
          <span>{{ $t(label) }}</span>
        </template>
      </a-descriptions>
      <div class="op-wrap">
        <a-select
          v-model="queryParams.strategy"
          style="width: 200px; margin-right: 15px"
          @change="handleStrategyChange"
        >
          <a-option value="security">{{
            $t('projects.resource.tabfix.patch')
          }}</a-option>
          <a-option value="compatibility">{{
            $t('projects.resource.tabfix.compatible')
          }}</a-option>
        </a-select>
        <!-- <a-button type="primary">{{
          $t('projects.resource.tabfix.patchPR')
        }}</a-button> -->
      </div>
    </com-card>
    <!-- <a-divider style="margin: 0"></a-divider> -->
    <div v-if="!needUpdateSettings">
      <simpleTable
        :loading="loading"
        :data-list="dataList"
        style="padding-bottom: 20px"
      ></simpleTable>
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
      <unfixedTableList @infoChange="handleUnfixChange"></unfixedTableList>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { assignIn, get, map, add, each, keys, find } from 'lodash';
  import { ref, reactive, onMounted, computed } from 'vue';
  import { Pagination } from '@/types/global';
  import comCard from '@/components/page-wrap/com-card.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import severityBar from '@/components/severity-bar/index.vue';
  import providerIcon from '@/components/provider-icon/index.vue';
  import simpleTable from './simple-table.vue';
  import unfixedTableList from './unfixed-table-list.vue';
  import {
    queryFixAdviceList,
    ListParams,
    FixAdviceItem,
  } from '../../api/fix-advice';
  // import fixData from '../config/fix-data'

  defineProps({
    needUpdateSettings: {
      type: Boolean,
      default() {
        return false;
      },
    },
  });
  interface ParamsType extends Pagination {
    strategy: string;
  }
  const { setLoading, route, loading, router } = useCallCommon();
  const queryParams = reactive({
    // page: 1,
    // perPage: 500,
    strategy: 'security',
    isFixable: true,
  });
  const unfixSummary = reactive({});
  const fixSummary = reactive({});
  const total = ref(0);
  const dataList = ref<FixAdviceItem[]>([]);
  const descripList = ref([
    { label: 'projects.resource.tabfix.count', value: '', key: 'total' },
    {
      label: 'projects.resource.tabfix.before',
      value: '',
      key: 'beforeVulnerabilities',
    },
    {
      label: 'projects.resource.tabfix.after',
      value: '',
      key: 'afterVulnerabilities',
    },
  ]);
  const severitySum = (
    obj1: Record<string, number> = {},
    obj2: Record<string, number> = {}
  ) => {
    const res = {};
    each(keys(obj1), (key) => {
      if (key !== 'total') {
        res[key] = add(obj1[key], obj2[key]);
      }
    });
    return res;
  };
  const summaryDataList = computed(() => {
    const summary = {
      beforeVulnerabilities: severitySum(
        get(fixSummary, 'fromVulnerabilities'),
        get(unfixSummary, 'fromVulnerabilities')
      ),
      afterVulnerabilities: severitySum(
        get(fixSummary, 'toVulnerabilities'),
        get(unfixSummary, 'fromVulnerabilities')
      ),
      total: total.value,
    };
    const data = map(descripList.value, (item) => {
      item.value = get(summary, item.key);
      return item;
    });
    return data;
  });
  const setDescripList = () => {
    const summary = {
      beforeVulnerabilities: severitySum(
        get(fixSummary, 'fromVulnerabilities'),
        get(unfixSummary, 'fromVulnerabilities')
      ),
      afterVulnerabilities: severitySum(
        get(fixSummary, 'toVulnerabilities'),
        get(unfixSummary, 'fromVulnerabilities')
      ),
      total: total.value,
    };
    descripList.value = map(descripList.value, (item) => {
      item.value = get(summary, item.key);
      return item;
    });
  };
  const handleUnfixChange = (summary) => {
    assignIn(unfixSummary, summary);
  };
  const handleToSettings = () => {
    router.push({
      name: 'systemSetting',
      query: {
        tab: '1',
      },
    });
  };
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
      assignIn(fixSummary, summary);
      total.value = list.length || 0;
      dataList.value = [].concat(list);
      // setDescripList(data);
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
  onMounted(() => {
    fetchData();
  });
</script>

<style lang="less" scoped>
  @import url('../../style/simple-table.less');

  .fix-wrap {
    .title-wrap {
      line-height: 1.2;
    }

    .notice {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 30px 0 20px 0;
      text-align: center;
      border: 1px solid var(--seal-border-gray-2);
      border-radius: 4px;

      .text {
        max-width: 1000px;
        margin-bottom: 10px;
        line-height: 22px;
      }
    }

    .op-wrap {
      display: flex;
      justify-content: space-between;
    }

    :deep(.arco-descriptions-body) {
      .arco-descriptions-item {
        padding: 10px 0 12px;
        // background-color: var(--color-fill-1);
        border-radius: 4px;
      }

      .arco-descriptions-table {
        border-collapse: separate;
        border-spacing: 0;
      }

      .arco-descriptions-item-label-inline {
        line-height: 2;
      }
    }
  }
</style>

<template>
  <spinCard :title="$t('dashboard.cost.title')" borderless>
    <template #title>
      <div>
        <span>{{ $t('dashboard.cost.title') }}</span>
        <DateRange
          v-model:start="queryParams.startTime"
          v-model:end="queryParams.endTime"
          v-model:timeUnit="queryParams.step"
          :show-extra="false"
          :short-cuts="DateShortCuts"
          today-in
          @change="handleDateChange"
        ></DateRange>
      </div>
    </template>
    <div class="box">
      <a-grid :cols="24" :col-gap="10" :row-gap="10">
        <a-grid-item :span="{ xl: 16, lg: 16, md: 16, sm: 24 }">
          <monthlyCost
            style="margin-bottom: 10px"
            :data="dailyCostData"
          ></monthlyCost>
          <dailyyCost :data="projectCostData"></dailyyCost>
        </a-grid-item>
        <a-grid-item :span="{ xl: 8, lg: 8, md: 8, sm: 24 }">
          <DataCard
            :precision="3"
            :title="$t('dashboard.cost.currentMonth')"
            bg-color="linear-gradient(rgba(184, 218, 243, 0.3) 0%, rgba(184, 218, 243, 0.4) 100%)"
          >
            <template #title>
              <span style="font-weight: 500">{{
                $t('dashboard.cost.currentMonth')
              }}</span>
            </template>
            <template #extra>
              <span>{{ round(monthlyCostData.currentMonth, 4) || 0 }}</span>
              <span v-if="monthlyCostData.lastMonth" class="rate">
                <icon-arrow-up
                  v-if="
                    subtract(
                      monthlyCostData.currentMonth,
                      monthlyCostData.lastMonth
                    ) > 0
                  "
                  class="icon-fall"
                />
                <icon-arrow-fall
                  v-if="
                    subtract(
                      monthlyCostData.currentMonth,
                      monthlyCostData.lastMonth
                    ) < 0
                  "
                  class="icon-fall"
                />
                <span
                  >{{ monthCostGrowRate }}
                  {{ $t('dashboard.cost.pervisious') }}</span
                >
              </span>
            </template>
          </DataCard>
          <div class="list" style="margin-top: 10px">
            <div class="title">{{ $t('dashboard.cost.rank') }}</div>
            <applicationRank
              title=""
              height="360px"
              :data-list="appCostRankList"
            ></applicationRank>
          </div>
        </a-grid-item>
      </a-grid>
    </div>
  </spinCard>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { computed, onMounted, ref, reactive } from 'vue';
  import {
    find,
    get,
    map,
    round,
    divide,
    subtract,
    sortBy,
    isNaN
  } from 'lodash';
  import { useI18n } from 'vue-i18n';
  import { getStackLineDataList, getStackLineData } from '@/views/config/utils';
  import spinCard from '@/components/page-wrap/spin-card.vue';
  import DataCard from '@/components/data-card/index.vue';
  import monthlyCost from './monthly-cost.vue';
  import dailyyCost from './daily-trend.vue';
  import { queryCostManagemantData } from '../api/dashboard';
  import applicationRank from './application-rank.vue';
  import { colorList, DateShortCuts } from '../config';

  const grid = {
    left: 0,
    right: 0,
    top: 40,
    bottom: 0,
    containLabel: true
  };
  const title = {
    text: '',
    left: 'auto',
    top: 0,
    textStyle: {
      color: 'rgb(78,89,105)',
      fontSize: 12
    }
  };
  const { t } = useI18n();
  const queryParams = ref({
    filters: [[{ includeAll: true }]],
    shareCosts: [
      {
        idleCostFilters: [{ includeAll: true }],
        managementCostFilters: [{ includeAll: true }],
        sharingStrategy: 'proportionally'
      }
    ],
    groupBy: 'day',
    step: 'day',
    query: '',
    startTime: dayjs().subtract(29, 'd').format('YYYY-MM-DDT00:00:00Z'),
    endTime: dayjs().format('YYYY-MM-DDTHH:mm:ssZ')
  });
  const monthlyCostData = reactive({
    currentMonth: 0,
    lastMonth: 0
  });
  const dailyCostData = reactive({
    xAxis: [],
    list: []
  });
  const projectCostData = reactive({
    xAxis: [],
    list: [],
    dataConfig: []
  });

  const appCostRankList = ref<{ name: string; value: number }[]>([]);

  const monthCostGrowRate = computed(() => {
    const rate = divide(
      subtract(monthlyCostData.currentMonth, monthlyCostData.lastMonth),
      monthlyCostData.lastMonth
    );
    return isNaN(rate) ? '0%' : `${round(rate * 100, 2)}%`;
  });

  const getMonthlyCost = async () => {
    try {
      const params = {
        ...queryParams.value,
        groupBy: 'month',
        startTime: dayjs().subtract(1, 'month').format('YYYY-MM-01T00:00:00Z'),
        endTime: dayjs().format('YYYY-MM-DDTHH:mm:ssZ'),
        step: ''
      };
      const { data } = await queryCostManagemantData(params);
      const currentMonth = find(data.items || [], (o) =>
        dayjs(o.itemName).isSame(params.endTime, 'month')
      );
      const lastMonth = find(data.items || [], (o) =>
        dayjs(o.itemName).isSame(params.startTime, 'month')
      );
      monthlyCostData.currentMonth = get(currentMonth, 'totalCost') || 0;
      monthlyCostData.lastMonth = get(lastMonth, 'totalCost') || 0;
    } catch (error) {
      monthlyCostData.currentMonth = 0;
      monthlyCostData.lastMonth = 0;
    }
  };
  const getDailyCost = async () => {
    try {
      const params = {
        ...queryParams.value,
        groupBy: 'day',
        startTime: dayjs().subtract(29, 'd').format('YYYY-MM-01T00:00:00Z'),
        endTime: dayjs().format('YYYY-MM-DDTHH:mm:ssZ'),
        step: ''
      };
      const { data } = await queryCostManagemantData(params);
      const result = getStackLineDataList(data.items || [], {
        fields: ['totalCost'],
        xAxis: 'itemName'
      });
      dailyCostData.list = result.data as never[];
      dailyCostData.xAxis = result.xAxis as never[];
    } catch (error) {
      dailyCostData.list = [];
      dailyCostData.xAxis = [];
    }
  };
  const getProjectCost = async () => {
    try {
      const params = {
        ...queryParams.value,
        groupBy: 'label:walrus.seal.io/project-name',
        startTime: dayjs().subtract(1, 'month').format('YYYY-MM-01T00:00:00Z'),
        endTime: dayjs().format('YYYY-MM-DDTHH:mm:ssZ'),
        step: 'day'
      };
      const { data } = await queryCostManagemantData(params);
      const list = data.items || [];
      const result = getStackLineData({ list });
      projectCostData.list = result.line as never[];
      projectCostData.xAxis = result.xAxis as never[];
      projectCostData.dataConfig = result.dataConfig as never[];
    } catch (error) {
      projectCostData.list = [];
      projectCostData.xAxis = [];
      projectCostData.dataConfig = [];
    }
  };
  const getAppCostRank = async () => {
    try {
      const params = {
        ...queryParams.value,
        paging: {
          page: 1,
          perPage: 15
        },
        groupBy: 'label:walrus.seal.io/service-path',
        step: ''
      };
      const { data } = await queryCostManagemantData(params);
      appCostRankList.value = map(data.items || [], (item) => {
        return {
          name: item.itemName,
          value: round(item.totalCost, 4)
        };
      });
    } catch (error) {
      appCostRankList.value = [];
    }
  };
  const handleDateChange = () => {};
  const init = () => {
    getMonthlyCost();
    getDailyCost();
    getProjectCost();
    getAppCostRank();
  };
  onMounted(() => {
    init();
  });
</script>

<style lang="less" scoped>
  .box {
    // display: flex;
    .pie {
      padding: 10px;
      background-color: rgba(230, 244, 254, 0.5);
      border-radius: var(--border-radius-small);
    }

    .list {
      // flex-basis: 400px;
      // margin-left: 20px;
      .title {
        color: var(--color-text-1);
        font-weight: 500;
      }
    }

    .rate {
      margin-left: 6px;
      color: var(--seal-color-warning);
      font-weight: 500;
      font-size: 14px;
    }
  }
</style>

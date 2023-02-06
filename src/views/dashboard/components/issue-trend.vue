<template>
  <div class="trend-wrapper">
    <a-grid :cols="24" style="width: 100%">
      <a-grid-item :span="{ lg: 8, md: 12, sm: 24 }" :row-gap="10">
        <issueStackTrend
          key="stackData"
          :data="stackData"
          :title="$t('dashboard.summary.overview.issueTrend')"
          class="chart-item"
        ></issueStackTrend>
      </a-grid-item>
      <a-grid-item :span="{ lg: 8, md: 12, sm: 24 }">
        <issueStackTrend
          key="fixTime"
          :data="fixTimeData"
          :title="$t('dashboard.issue.overview.fixTime')"
          class="chart-item"
        ></issueStackTrend>
      </a-grid-item>
      <a-grid-item :span="{ lg: 8, md: 12, sm: 24 }">
        <issueStackTrend
          key="fixRate"
          :data="fixRateData"
          :title="$t('dashboard.summary.overview.fixRate')"
          class="chart-item"
        ></issueStackTrend>
      </a-grid-item>
    </a-grid>
  </div>
</template>

<script lang="ts" setup>
  import { random, get, map, keys, ceil, round } from 'lodash';
  import spinCard from '@/components/page-wrap/spin-card.vue';
  import dayjs from 'dayjs';
  import { computed, reactive, ref, watch } from 'vue';
  import issueStackTrend from './issue-stack-trend.vue';
  import { getDashBoardIssueTrend, SeriesItem } from '../api/dashboard';

  const props = defineProps({
    query: {
      type: Object,
      default() {
        return {};
      },
    },
  });
  // const query = reactive({
  //   start: '2023-01-08',
  //   end: '2023-01-15',
  //   timeUnit: 'day',
  // });
  const timeFormat = {
    day: 'YYYY.MM.DD',
    month: 'YYYY.MM',
    year: 'YYYY',
  };
  const issueCountData = ref<SeriesItem[]>([]);
  const issueAvgFixTimeData = ref<SeriesItem[]>([]);
  const issueFixRateData = ref<SeriesItem[]>([]);
  const nameMap = {
    issueHighCount: 'HighIssueCount',
    issueMediumCount: 'MiddleIssueCount',
    issueLowCount: 'LowIssueCount',
  };
  const fixTimeNameMap = {
    issueHighAvgFixTime: 'HighIssueCount',
    issueMediumAvgFixTime: 'MiddleIssueCount',
    issueLowAvgFixTime: 'LowIssueCount',
  };
  const fixRateNameMap = {
    issueHighFixRate: 'HighIssueCount',
    issueMediumFixRate: 'MiddleIssueCount',
    issueLowFixRate: 'LowIssueCount',
  };
  const stackData = computed(() => {
    const list = issueCountData.value;
    return {
      xAxis: list.map((item) => {
        return dayjs(get(item, 'statTime')).format(
          get(timeFormat, props.query.timeUnit)
        );
      }),
      data: ['issueHighCount', 'issueMediumCount', 'issueLowCount'].map(
        (key) => {
          return {
            name: nameMap[key],
            value: map(list, (sItem) => {
              return ceil(get(sItem, `metrics.${key}`) || 0);
            }),
          };
        }
      ),
    };
  });
  const fixRateData = computed(() => {
    const list = issueFixRateData.value;
    return {
      xAxis: list.map((item) => {
        return dayjs(get(item, 'statTime')).format(
          get(timeFormat, props.query.timeUnit)
        );
      }),
      data: ['issueHighFixRate', 'issueMediumFixRate', 'issueLowFixRate'].map(
        (key) => {
          return {
            name: fixRateNameMap[key],
            value: map(list, (sItem) => {
              return round(get(sItem, `metrics.${key}`) || 0, 2);
            }),
          };
        }
      ),
    };
  });
  const fixTimeData = computed(() => {
    const list = issueAvgFixTimeData.value;
    return {
      xAxis: list.map((item) => {
        return dayjs(get(item, 'statTime')).format(
          get(timeFormat, props.query.timeUnit)
        );
      }),
      data: [
        'issueHighAvgFixTime',
        'issueMediumAvgFixTime',
        'issueLowAvgFixTime',
      ].map((key) => {
        return {
          name: fixTimeNameMap[key],
          value: map(list, (sItem) => {
            return ceil(get(sItem, `metrics.${key}`) || 0, 1);
          }),
        };
      }),
    };
  });

  const fetchCountData = async () => {
    try {
      const params = {
        type: 'issueCount',
        ...props.query,
      };
      const { data } = await getDashBoardIssueTrend(params);
      issueCountData.value = data;
    } catch (error) {
      console.log(error);
      issueCountData.value = [];
    }
  };
  const fetchFixTimeData = async () => {
    try {
      const params = {
        type: 'issueAvgFixTime',
        ...props.query,
      };
      const { data } = await getDashBoardIssueTrend(params);
      issueAvgFixTimeData.value = data;
    } catch (error) {
      console.log(error);
      issueAvgFixTimeData.value = [];
    }
  };
  const fetchFixRateData = async () => {
    try {
      const params = {
        type: 'issueFixRate',
        ...props.query,
      };
      const { data } = await getDashBoardIssueTrend(params);
      issueFixRateData.value = data;
    } catch (error) {
      console.log(error);
      issueFixRateData.value = [];
    }
  };
  const fetchData = async () => {
    fetchCountData();
    fetchFixTimeData();
    fetchFixRateData();
  };
  watch(
    () => props.query,
    () => {
      if (props.query.start) {
        fetchData();
      }
    },
    {
      immediate: true,
      deep: true,
    }
  );
  // fetchData();
</script>

<style lang="less" scoped>
  .trend-wrapper {
    display: flex;

    .chart-item {
      flex: 1;
      padding: 0 5px;
    }
  }
</style>

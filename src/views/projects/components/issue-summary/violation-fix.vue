<template>
  <!-- <dateRange style="margin-top:10px" v-model:time-unit="query.timeUnit" v-model:end="query.end" v-model:start="query.start"></dateRange> -->
  <div class="fix-chart-wrap">
    <a-grid :cols="24" :col-gap="10" :row-gap="10">
      <a-grid-item :span="{ lg: 12, md: 12, sm: 24 }">
        <issueStackTrend
          class="item"
          :data="fixRateData"
          :title="$t('dashboard.summary.overview.fixRate')"
        ></issueStackTrend>
      </a-grid-item>
      <a-grid-item :span="{ lg: 12, md: 12, sm: 24 }">
        <issueStackTrend
          class="item"
          :data="fixTimeData"
          :title="$t('dashboard.issue.overview.fixTime')"
        ></issueStackTrend>
      </a-grid-item>
    </a-grid>
    <!-- <issueStackTrend
      class="item"
      :data="stackData"
      title="漏洞新增数"
    ></issueStackTrend> -->
  </div>
</template>

<script lang="ts" setup>
  import { get, map, ceil, round } from 'lodash';
  import dayjs from 'dayjs';
  import { computed, onMounted, PropType, reactive, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import issueStackTrend from '@/views/dashboard/components/issue-stack-trend.vue';
  import { getResourceTrendData } from '@/views/projects/api/resource';
  import {
    getApplicationsTrendData,
    SeriesItem,
  } from '@/views/applications/api/applications';
  import dateRange from '@/views/dashboard/components/date-range.vue';

  const props = defineProps({
    page: {
      type: String,
      default() {
        return 'resource';
      },
    },
    query: {
      type: Object,
      default() {
        return {
          timeUnit: 'day',
          start: dayjs().subtract(30, 'd').format('YYYY-MM-DD'),
          end: dayjs().subtract(1, 'd').format('YYYY-MM-DD'),
        };
      },
    },
  });
  const timeFormat = {
    day: 'YYYY.MM.DD',
    month: 'YYYY.MM',
    year: 'YYYY',
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
  const route = useRoute();
  const query = reactive({
    timeUnit: 'day',
    start: dayjs().subtract(30, 'd').format('YYYY-MM-DD'),
    end: dayjs().subtract(1, 'd').format('YYYY-MM-DD'),
  });
  const issueAvgFixTimeData = ref<SeriesItem[]>([]);
  const issueFixRateData = ref<SeriesItem[]>([]);
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
  const fetchFixTimeData = async () => {
    try {
      const params = {
        id: route.query.id as string,
        type: 'issueAvgFixTime',
        ...props.query,
      };
      if (props.page === 'resource') {
        const { data } = await getResourceTrendData(params);
        issueAvgFixTimeData.value = data;
      } else if (props.page === 'application') {
        const { data } = await getApplicationsTrendData(params);
        issueAvgFixTimeData.value = data;
      }
    } catch (error) {
      console.log(error);
      issueAvgFixTimeData.value = [];
    }
  };
  const fetchFixRateData = async () => {
    try {
      const params = {
        id: route.query.id as string,
        type: 'issueFixRate',
        ...props.query,
      };
      if (props.page === 'resource') {
        const { data } = await getResourceTrendData(params);
        issueFixRateData.value = data;
      } else if (props.page === 'application') {
        const { data } = await getApplicationsTrendData(params);
        issueFixRateData.value = data;
      }
    } catch (error) {
      console.log(error);
      issueFixRateData.value = [];
    }
  };
  watch(
    () => props.query,
    () => {
      if (props.query.start) {
        fetchFixTimeData();
        fetchFixRateData();
      }
    },
    {
      immediate: true,
      deep: true,
    }
  );
  // onMounted(() => {
  //   fetchFixTimeData();
  //   fetchFixRateData();
  // });
</script>

<style lang="less" scoped>
  .fix-chart-wrap {
    // display: flex;
    .item {
      // flex: 1;
      // margin-right: 20px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
</style>

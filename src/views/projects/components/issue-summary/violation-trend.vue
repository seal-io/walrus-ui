<template>
  <!-- <dateRange style="margin-top:10px" v-model:time-unit="query.timeUnit" v-model:end="query.end" v-model:start="query.start"></dateRange> -->
  <div>
    <issueStackTrend
      :data="stackData"
      :config-options="configOptions"
      :header="$t('dashboard.summary.overview.issueTrend')"
    ></issueStackTrend>
  </div>
</template>

<script lang="ts" setup>
  import { get, map, ceil } from 'lodash';
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
  const configOptions = {
    legend: {
      left: 'center',
    },
  };
  const nameMap = {
    issueHighCount: 'HighIssueCount',
    issueMediumCount: 'MiddleIssueCount',
    issueLowCount: 'LowIssueCount',
  };
  const route = useRoute();
  // const query = reactive({
  //   timeUnit: 'day',
  //   start: dayjs().subtract(30,'d').format('YYYY-MM-DD'),
  //   end: dayjs().subtract(1,'d').format('YYYY-MM-DD')
  // });
  const issueCountData = ref<SeriesItem[]>([]);
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

  const fetchData = async () => {
    try {
      const params = {
        id: route.query.id as string,
        type: 'issueCount',
        ...props.query,
      };
      if (props.page === 'resource') {
        const { data } = await getResourceTrendData(params);
        issueCountData.value = data;
      } else if (props.page === 'application') {
        const { data } = await getApplicationsTrendData(params);
        issueCountData.value = data;
      }
    } catch (error) {
      console.log(error);
      issueCountData.value = [];
    }
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
  // onMounted(() => {
  //   fetchData();
  // });
</script>

<style></style>

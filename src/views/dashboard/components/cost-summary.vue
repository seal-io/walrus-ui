<template>
  <spinCard :title="$t('成本管理')" borderless>
    <div class="box">
      <a-grid :cols="24" :col-gap="10" :row-gap="10">
        <a-grid-item :span="{ xl: 16, lg: 16, md: 16, sm: 24 }">
          <!-- <pieChart
            class="pie"
            style="flex: 1"
            :data-list="appCostRankList"
            height="360px"
            :center="center"
            :radius="radius"
            :config-options="pieOptions"
          ></pieChart> -->
          <monthlyCost style="margin-bottom: 10px"></monthlyCost>
          <dailyyCost></dailyyCost>
        </a-grid-item>
        <a-grid-item :span="{ xl: 8, lg: 8, md: 8, sm: 24 }">
          <pieChart
            class="pie"
            style="flex: 1"
            :data-list="appCostRankList"
            height="292px"
            :center="center"
            :radius="radius"
            :config-options="pieOptions"
          ></pieChart>
          <div class="list" style="margin-top: 10px">
            <applicationRank
              height="360px"
              :title="$t('Top Application (this month)')"
              :data-list="appCostRankList"
            ></applicationRank>
          </div>
        </a-grid-item>
      </a-grid>
    </div>
  </spinCard>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue';
  import { get, map } from 'lodash';
  import { useI18n } from 'vue-i18n';
  import spinCard from '@/components/page-wrap/spin-card.vue';
  import pieChart from '@/components/pie-chart/index.vue';
  import monthlyCost from './monthly-cost.vue';
  import dailyyCost from './daily-trend.vue';
  import { getDashboardLicenses } from '../api/dashboard';
  import applicationRank from './application-rank.vue';
  import { colorList } from '../config';

  const pieStyleConfig = {
    label: {
      show: true,
      fontWeight: '500',
      formatter: ['{a|{b}}', '{a|({c}, {d}%)}'].join(''),
      rich: {
        a: {
          lineHeight: 16,
          fontSize: 11
        }
      }
    }
  };
  const center = ['50%', '55%'];
  const radius = ['0', '80%'];
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
  const pieOptions = computed(() => {
    return {
      title: {
        ...title,
        text: 'Cost By Application'
      },
      grid: {
        ...grid
      },
      legend: {
        show: false,
        orient: 'vertical',
        top: 'middle',
        left: '60%',
        itemWidth: 20,
        itemHeight: 8
      }
    };
  });
  const appList = ref<{ name: string; value: number }[]>([]);
  const appCostRankList = ref<{ name: string; value: number }[]>([]);
  const fetchData = async () => {
    try {
      appCostRankList.value = map(Array(10).fill(1), (item, i) => {
        return {
          name: `app-${i + 1}`,
          value: 10 - i
        };
      });
    } catch (error) {
      console.log(error);
    }
  };
  onMounted(() => {
    fetchData();
  });
</script>

<style lang="less" scoped>
  .box {
    // display: flex;
    .pie {
      padding: 10px;
      background-color: rgba(230, 244, 254, 0.5);
      border-radius: 4px;
    }

    .list {
      // flex-basis: 400px;
      // margin-left: 20px;
    }
  }
</style>

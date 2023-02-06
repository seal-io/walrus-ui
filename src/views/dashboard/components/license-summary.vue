<template>
  <spinCard :title="$t('dashboard.license.overview.title')" borderless>
    <div class="box">
      <a-grid :cols="24" :col-gap="10" :row-gap="10">
        <a-grid-item :span="{ xl: 16, lg: 16, md: 16, sm: 24 }">
          <pieChart
            class="pie"
            style="flex: 1"
            :data-list="licenseDataList"
            height="360px"
            :center="center"
            :radius="radius"
            :config-options="pieOptions"
          ></pieChart>
        </a-grid-item>
        <a-grid-item :span="{ xl: 8, lg: 8, md: 8, sm: 24 }">
          <div class="list">
            <licenseRank
              height="360px"
              :title="$t('dashboard.license.overview.rank')"
              :data-list="licenseRankList"
            ></licenseRank>
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
  import { getDashboardLicenses } from '../api/dashboard';
  import licenseRank from './license-rank.vue';
  import { colorList } from '../config';

  const pieStyleConfig = {
    label: {
      show: true,
      fontWeight: '500',
      formatter: ['{a|{b}}', '{a|({c}, {d}%)}'].join(''),
      rich: {
        a: {
          lineHeight: 16,
          fontSize: 11,
        },
      },
    },
  };
  const center = ['50%', '55%'];
  const radius = ['0', '80%'];
  const grid = {
    left: 0,
    right: 0,
    top: 40,
    bottom: 0,
    containLabel: true,
  };
  const title = {
    text: '',
    left: 'center',
    top: 0,
    textStyle: {
      color: 'rgb(78,89,105)',
      fontSize: 12,
    },
  };
  const { t } = useI18n();
  const pieOptions = computed(() => {
    return {
      title: {
        ...title,
        text: t('dashboard.license.overview.chartTitle'),
      },
      grid: {
        ...grid,
      },
      legend: {
        show: false,
        orient: 'vertical',
        top: 'middle',
        left: '60%',
        itemWidth: 20,
        itemHeight: 8,
      },
    };
  });
  const licenseDataList = ref<{ name: string; value: number }[]>([]);
  const licenseRankList = ref<{ name: string; value: number }[]>([]);
  const fetchData = async () => {
    try {
      const { data } = await getDashboardLicenses();
      const rank = get(data, 'rank') || [];
      const distribution = get(data, 'distribution') || [];
      licenseDataList.value = map(distribution, (item, index) => {
        return {
          ...pieStyleConfig,
          itemStyle: {
            color: colorList[index],
          },
          name: item.name,
          value: item.packageCount,
        };
      }).filter((sItem) => sItem.value);
      licenseRankList.value = map(rank, (item) => {
        return {
          name: item.name,
          value: item.packageCount,
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

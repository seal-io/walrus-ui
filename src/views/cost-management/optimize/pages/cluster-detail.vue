<template>
  <div class="container">
    <SpinCard
      title="Cluster Optimization"
      borderless
      style="margin-bottom: 10px"
    >
      <a-grid :cols="24" :col-gap="20">
        <a-grid-item
          v-for="(item, index) in saveOverview"
          :key="index"
          :span="{ lg: 8, md: 8, sm: 12, xs: 24 }"
        >
          <DataCard
            :title="item.label"
            :value="item.value"
            bg-color="rgba(159,232,219,.6)"
          >
            <template #title>
              <span style="font-weight: 500">{{ item.label }}</span>
            </template>
          </DataCard>
        </a-grid-item>
      </a-grid>
      <a-grid :cols="24" :col-gap="20" style="margin-top: 10px">
        <a-grid-item
          v-for="(item, index) in resourceCostOverview"
          :key="index"
          :span="{ lg: 6, md: 6, sm: 12, xs: 24 }"
        >
          <DataCard
            :title="item.label"
            :value="item.value"
            bg-color="rgba(255, 197, 192,.5)"
          >
            <template #title>
              <span style="font-weight: 500">{{ item.label }}</span>
            </template>
          </DataCard>
        </a-grid-item>
      </a-grid>
    </SpinCard>
    <SpinCard title="集群消费金额对比" borderless style="margin-bottom: 10px">
      <LineBarChart
        height="220px"
        show-type="line"
        :data-list="dataList"
        :data-config="dataConfig"
        :x-axis="xAxis"
        :config-options="{
          title: {
            ...title
          },
          legend: {
            right: 'center',
            top: 0
          },
          grid: {
            ...grid,
            top: 40
          }
        }"
      ></LineBarChart>
    </SpinCard>
    <SpinCard title="容器资源调整" borderless style="margin-bottom: 10px">
      <a-grid :cols="24" :col-gap="20">
        <a-grid-item
          v-for="(item, index) in saveOverview"
          :key="index"
          :span="{ lg: 8, md: 8, sm: 12, xs: 24 }"
        >
          <DataCard
            :title="item.label"
            :value="item.value"
            :bg-color="item.color"
          >
            <template #title>
              <span style="font-weight: 500">{{ item.label }}</span>
            </template>
          </DataCard>
        </a-grid-item>
      </a-grid>
      <TableList
        :columns="registryResourceCols"
        style="margin-top: 20px"
      ></TableList>
    </SpinCard>
    <SpinCard title="清理未使用持久卷" borderless style="margin-bottom: 10px">
      <TableList :columns="volumeCols"></TableList>
    </SpinCard>
  </div>
</template>

<script lang="ts" setup>
  import { filter } from 'lodash';
  import { reactive, ref, computed } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import DateRange from '@/components/date-range/index.vue';
  import DataCard from '@/components/data-card/index.vue';
  import LineBarChart from '@/components/line-bar-chart/index.vue';
  import FilterBox from '@/components/filter-box/index.vue';
  import TableList from '@/views/cost-management/analyse/components/table-list.vue';
  import { resourceCostOverview } from '@/views/cost-management/analyse/config';
  import { saveOverview, registryResourceCols, volumeCols } from '../config';

  const title = {
    text: '',
    left: 'center',
    top: 8,
    textStyle: {
      color: 'rgb(78,89,105)',
      fontSize: 12
    }
  };
  const grid = {
    left: 0,
    right: 5,
    top: 20,
    bottom: 0,
    containLabel: true
  };
  const { t } = useCallCommon();
  const clusterOptions = [
    { label: 'cluster-1', value: 'cluster1' },
    { label: 'cluster-2', value: 'cluster2' }
  ];
  const dataConfig = ref([
    { name: '一', label: '优化', value: [1, 3, 7, 8, 9] },
    { name: '二', label: '当前', value: [2, 6, 10, 12, 21] }
  ]);
  const xAxis = ref(['一月', '二月', '三月', '四月', '五月']);
  const queryParams = reactive({
    start: '',
    end: '',
    cluster: ''
  });

  const dataList = ref([
    { name: '一', value: [1, 3, 7, 8, 9] },
    { name: '二', value: [2, 6, 10, 12, 21] }
  ]);

  const handleSearch = () => {};
  const handleReset = () => {};
</script>

<style></style>

<template>
  <spinCard :title="$t('dashboard.overview.title')" borderless>
    <a-grid :cols="24" :col-gap="20">
      <a-grid-item
        v-for="(item, index) in overviewData"
        :key="index"
        :span="{ lg: 6, md: 6, sm: 12, xs: 24 }"
      >
        <DataCard
          :title="$t(item.label)"
          :value="item.value"
          :bg-color="item.color"
        >
          <template #title>
            <span style="font-weight: 500">{{ $t(item.label) }}</span>
          </template>
        </DataCard>
      </a-grid-item>
    </a-grid>
  </spinCard>
</template>

<script lang="ts" setup>
  import { cloneDeep, get, map, assignIn } from 'lodash';
  import { ref, computed, reactive } from 'vue';
  import spinCard from '@/components/page-wrap/spin-card.vue';
  import DataCard from '@/components/data-card/index.vue';
  import { overViewConfig } from '../config';
  import { getDashBoardOverview } from '../api/dashboard';

  const basicInfo = reactive({});
  const overviewData = computed(() => {
    const list = map(overViewConfig, (o) => {
      const item = cloneDeep(o);
      item.value = get(basicInfo, item.key) || 0;
      return item;
    });
    return list;
  });
  const fetchData = async () => {
    try {
      const { data } = await getDashBoardOverview();
      assignIn(basicInfo, data);
    } catch (error) {
      assignIn(basicInfo, {
        project: 0,
        template: 0,
        resource: 0,
        revision: 0,
        environment: 0,
        connector: 0
      });
      console.log(error);
    }
  };
  fetchData();
</script>

<style lang="less" scoped>
  .overview-box {
    display: flex;
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
    }

    .card-item {
      flex: 1;
      margin-right: 6px;

      &:last-child {
        margin-right: 0;
      }
    }
  }
</style>

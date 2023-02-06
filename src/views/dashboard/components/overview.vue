<template>
  <spinCard :title="$t('dashboard.overview.title')" borderless>
    <div class="overview-box">
      <cardItem
        v-for="(item, index) in overviewData"
        :key="index"
        :data="item"
        class="card-item"
      ></cardItem>
    </div>
    <div class="overview-box">
      <cardItem
        v-for="(item, index) in overviewComponentData"
        :key="index"
        :data="item"
        class="card-item"
      ></cardItem>
    </div>
  </spinCard>
</template>

<script lang="ts" setup>
  import { cloneDeep, get, map } from 'lodash';
  import { ref, computed } from 'vue';
  import spinCard from '@/components/page-wrap/spin-card.vue';
  import cardItem from './card-item.vue';
  import { overViewConfig, overViewComponentConfig } from '../config';

  const props = defineProps({
    basicInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  });

  const overviewData = computed(() => {
    const list = map(overViewConfig, (o) => {
      const item = cloneDeep(o);
      item.value = get(props.basicInfo, item.key) || 0;
      return item;
    });
    return list;
  });
  const overviewComponentData = computed(() => {
    const list = map(overViewComponentConfig, (o) => {
      const item = cloneDeep(o);
      item.value = get(props.basicInfo, item.key) || 0;
      return item;
    });
    return list;
  });
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

<template>
  <spinCard padding="0">
    <div class="info-component">
      <a-grid :cols="24" :col-gap="10" :row-gap="10">
        <a-grid-item :span="{ xl: 16, lg: 14, md: 12, sm: 24 }">
          <horizontalBar
            style="flex: 1"
            :config-options="barOptions"
            height="400px"
            :data-list="dataList"
          ></horizontalBar>
        </a-grid-item>
        <a-grid-item :span="{ xl: 8, lg: 10, md: 12, sm: 24 }">
          <div class="list">
            <componentTop :data-list="rankList" height="340px"></componentTop>
          </div>
        </a-grid-item>
      </a-grid>
    </div>
  </spinCard>
</template>

<script lang="ts" setup>
  import { get, map } from 'lodash';
  import { computed, onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import spinCard from '@/components/page-wrap/spin-card.vue';
  import horizontalBar from '@/components/bar-chart/horizontal-bar.vue';
  import componentTop from './component-top.vue';
  import { getDashboardPackages, PackageItem } from '../api/dashboard';

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
  const loading = ref(false);
  const rankList = ref<PackageItem[]>([]);
  const dataList = ref<{ name: string; value: number }[]>([]);
  const barOptions = computed(() => {
    return {
      title: {
        ...title,
        text: t('dashboard.component.version.count'),
      },
      grid: {
        right: 10,
        top: 40,
      },
    };
  });
  const fetchData = async () => {
    try {
      loading.value = true;
      const { data } = await getDashboardPackages();
      rankList.value = get(data, 'packageUse') || [];
      const versionList = get(data, 'packageVersion') || [];
      dataList.value = map(versionList, (item) => {
        return {
          name: item.name,
          value: item.versionNum,
        };
      }).reverse();
      loading.value = false;
    } catch (error) {
      loading.value = false;
      rankList.value = [];
      dataList.value = [];
      console.log(error);
    }
  };
  onMounted(() => {
    fetchData();
  });
</script>

<style lang="less" scoped>
  .info-component {
    // display: flex;
    .list {
      // flex-basis: 500px;
      // margin-left: 10px;
    }
  }
</style>

<template>
  <div>
    <horizontalBar
      style="flex: 1"
      :config-options="barOptions"
      height="360px"
      :data-list="dataList"
    ></horizontalBar>
  </div>
</template>

<script lang="ts" setup>
  import { get, map } from 'lodash';
  import { computed, onMounted, ref } from 'vue';
  import horizontalBar from '@/components/bar-chart/horizontal-bar.vue';
  import { useRoute } from 'vue-router';
  import { getApplicationsPackageVersions } from '../api/applications';

  const title = {
    text: '',
    left: 'center',
    top: 0,
    textStyle: {
      color: 'rgb(78,89,105)',
      fontSize: 12,
    },
  };
  const route = useRoute();
  const dataList = ref<{ name: string; value: number }[]>([]);
  const barOptions = computed(() => {
    return {
      title: {
        ...title,
        text: '组件使用频率排行',
      },
      grid: {
        right: 10,
        top: 40,
      },
    };
  });

  const fetchData = async () => {
    try {
      const params = {
        id: route.query.id as string,
      };
      const { data } = await getApplicationsPackageVersions(params);
      const packageVersion = get(data, 'packageVersion') || [];
      dataList.value = map(packageVersion, (item) => {
        return {
          name: item.name,
          value: item.versionNum,
        };
      });
    } catch (error) {
      dataList.value = [];
      console.log(error);
    }
  };
  onMounted(() => [fetchData()]);
</script>

<style></style>

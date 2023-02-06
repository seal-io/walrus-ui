<template>
  <div style="padding-bottom: 40px">
    <a-spin :loading="loading" style="display: block">
      <depsTree
        :search-key="searchKey"
        :deps-data="depsData"
        multi-apps
      ></depsTree>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
  import { pickBy, get } from 'lodash';
  import { onMounted, PropType, ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import { useRoute } from 'vue-router';
  import depsTree from '@/components/dependency-tree/deps-tree.vue';
  import { DepsData } from '@/components/dependency-tree/config/interface';
  import {
    queryAppsDependenciesGrap,
    ComponentsParams,
  } from '../api/applications';

  interface queryParams {
    query: string;
    direct: string;
  }
  const props = defineProps({
    searchKey: {
      type: Object as PropType<queryParams>,
      default() {
        return {
          query: '',
          direct: '',
        };
      },
    },
  });
  const { loading, setLoading } = useLoading(true);
  const route = useRoute();
  const depsData = ref<DepsData>({
    packages: [],
    rootPackageID: '',
  });
  const fetchData = async () => {
    try {
      setLoading(true);
      let params: any = {
        id: route.query.id,
        query: props.searchKey.query,
      };
      params = pickBy(params, (val) => !!val) as ComponentsParams;
      const { data } = await queryAppsDependenciesGrap(params);
      depsData.value = data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  onMounted(() => {
    fetchData();
  });
</script>

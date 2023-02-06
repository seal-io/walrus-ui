<template>
  <div>
    <a-spin :loading="loading" style="display: block">
      <depsTree :search-key="searchKey" :deps-data="depsData"></depsTree>
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
  import { queryDependenciesTree, listParams } from '../../api/sbom';
  import localData from '../../config/open-source-data';

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
        resourceID: route.query.id,
        versionId: route.query.versionId || 'latest',
        query: props.searchKey.query,
      };
      params = pickBy(params, (val) => !!val) as listParams;
      const { data } = await queryDependenciesTree(params);
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

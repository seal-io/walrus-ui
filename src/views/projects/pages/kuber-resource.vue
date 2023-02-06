<template>
  <div class="cluster-wrap">
    <SpinCard :body-style="{ marginTop: '20px' }" :loading="loading">
      <groupTitle :title="$t('projects.resource.import')"></groupTitle>
      <ClusterList
        v-model="seleckedList"
        :data-list="resourceList"
        @change="handleSelectedChange"
      ></ClusterList>
      <a-space style="margin-top: 20px">
        <strong>{{ seleckedList.length }}</strong>
        <span>{{ $t('projects.resource.importText') }}</span>
        <a-button
          type="primary"
          size="small"
          :loading="importLoading"
          :disabled="!seleckedList.length"
          @click="handleToImport"
          >{{ $t('projects.resource.import') }}</a-button
        >
        <a-button
          style="margin-left: 10px"
          type="text"
          size="small"
          @click="handleCancel"
          >{{ $t('common.button.cancel') }}</a-button
        >
      </a-space>
    </SpinCard>
  </div>
</template>

<script lang="ts" setup>
  import {
    each,
    filter,
    map,
    cloneDeep,
    uniqBy,
    includes,
    every,
  } from 'lodash';
  import { computed, ref, watchEffect } from 'vue';
  import SpinCard from '@/components/page-wrap/spin-card.vue';
  import groupTitle from '@/components/group-title/index.vue';
  import ACollapseItem from '@arco-design/web-vue/es/collapse/collapse-item';
  import useCallCommon from '@/hooks/use-call-common';
  import {
    queryKubernetesList,
    kuberItem,
  } from '@/views/intergration/api/kubernetes';
  import useLoading from '@/hooks/loading';
  import ClusterItem from '../components/cluster-item.vue';
  import {
    queryKuberneteResource,
    ResouceItem,
    ResouceSpaceItem,
  } from '../api/resource';
  import { postImportRepos } from '../api/import-repo';
  import ClusterList from '../components/cluster-import/cluster-list.vue';
  // import k8sData from '../config/k8s-data';
  // import kuberList from '../../intergration/config/k8s-data'

  interface KuberDataItem extends kuberItem {
    imported: boolean;
    indeterminate: boolean;
    checked: boolean;
    namespaceList: ResouceSpaceItem[];
  }
  const { router, route } = useCallCommon();
  const { loading, setLoading } = useLoading();
  let kubernetesList: any[] = [];
  const resourceList = ref<KuberDataItem[]>([]);
  const importLoading = ref(false);
  const seleckedList = ref<ResouceItem[]>([]);
  const activeKeys = ref<string[]>([]);

  const handleToImport = async () => {
    try {
      console.log('seleckedList===', seleckedList.value);
      importLoading.value = true;
      await postImportRepos(seleckedList.value);
      importLoading.value = false;
      router.back();
    } catch (error) {
      console.log(error);
      importLoading.value = false;
    }
  };
  const handleCancel = () => {
    router.back();
  };

  const getKubernetesList = async () => {
    const { data } = await queryKubernetesList();
    // const data = kuberList
    kubernetesList = data.items || [];
    activeKeys.value = map(kubernetesList, (item) => item.id);
    console.log('activeKeys==', activeKeys.value);
  };
  const setKuberDataList = (list: ResouceSpaceItem[]) => {
    resourceList.value = map(kubernetesList, (s) => {
      const item = cloneDeep(s);
      const nameList = filter(list, (sItem) => sItem.kubernetesID === item.id);
      const namespaceList = uniqBy(nameList, 'namespace');
      item.namespaceList = map(namespaceList, (o) => {
        const uItem = cloneDeep(o);
        uItem.nameList = filter(
          nameList,
          (nItem) => nItem.namespace === uItem.namespace
        );
        uItem.imported = uItem.nameList.length
          ? every(uItem.nameList, (mItem) => mItem.imported)
          : false;
        uItem.indeterminate = false;
        uItem.checked = uItem.imported;
        return uItem;
      });
      item.indeterminate = false;
      item.imported = item.namespaceList.length
        ? every(item.namespaceList, (nItem) => nItem.imported)
        : false;
      item.checked = item.imported;
      return item;
    });
    console.log('resourceList===', resourceList.value, kubernetesList);
  };
  const handleCollapseChange = (val) => {
    activeKeys.value = [].concat(val);
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      await getKubernetesList();
      const { data } = await queryKuberneteResource();
      // const data = k8sData;
      setLoading(false);
      let list: any[] = data.items || [];
      list = map(list, (sItem) => {
        sItem.checked = sItem.imported;
        return sItem;
      });
      setKuberDataList(list);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const handleSelectedChange = (list) => {
    console.log('selectedList', list);
  };
  fetchData();
</script>

<style lang="less" scoped>
  .cluster-wrap {
    :deep(.arco-collapse-item) {
      border-bottom: 1px solid var(--color-border-1);

      &.arco-collapse-item-active {
        .arco-collapse-item-header {
          border-color: var(--color-neutral-2);
        }
      }
    }

    :deep(.arco-collapse-item-content) {
      padding-left: 8px;
    }

    :deep(.arco-collapse-item-header-title) {
      position: relative;
      font-size: 16px;

      &::before {
        position: absolute;
        top: 2px;
        bottom: 2px;
        left: -10px;
        display: inline-block;
        width: 4px;
        background-color: var(--sealblue-6);
        content: '';
      }
    }
  }
</style>

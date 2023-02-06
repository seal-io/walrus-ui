<template>
  <div class="list-wrap">
    <div class="list-content">
      <ClusterMenu
        :menu-list="dataList"
        :selecte-name-list="selectedNameList"
        :bordered="true"
        width="450px"
        @clusterCheck="handleClusterCheck"
        @ns-click="handleNamespaceClick"
        @check-all="handleNamespaceCheck"
      ></ClusterMenu>
      <div class="resource-list-wrap">
        <div v-show="!currentOpened.clusterName" class="tips">{{
          $t('projects.resource.import.tips')
        }}</div>
        <a-breadcrumb v-show="currentOpened.clusterName">
          <template #separator>
            <icon-right />
          </template>
          <a-breadcrumb-item>{{ currentOpened.clusterName }}</a-breadcrumb-item>
          <a-breadcrumb-item v-show="currentOpened.namespace">{{
            currentOpened.namespace
          }}</a-breadcrumb-item>
        </a-breadcrumb>
        <a-divider style="margin: 6px 0 20px"></a-divider>
        <a-space class="checkbox-wrap" direction="vertical" :size="15">
          <a-checkbox
            v-for="(item, index) in nameList"
            :key="index"
            v-model="item.checked"
            :disabled="item.imported"
            @change="(val) => handleCheckWorkload(val, item)"
          >
            <span>{{ join(tail(split(item.fullName, '/')), '/') }}</span>
            <icon-check-circle
              v-if="item.imported"
              style="
                display: inline-block;
                margin-left: 2px;
                color: #23c343;
                vertical-align: middle;
              "
          /></a-checkbox>
          <a-empty v-if="!nameList.length"></a-empty>
        </a-space>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import {
    each,
    find,
    get,
    filter,
    concat,
    uniqWith,
    map,
    remove,
    includes,
    some,
    every,
    unionBy,
    join,
    split,
    tail,
  } from 'lodash';
  import { PropType, ref, reactive, watchEffect } from 'vue';
  import ClusterMenu from './cluster-menu.vue';
  import { KuberDataItem } from './interface';
  import { ResouceItem, ResouceSpaceItem } from '../../api/resource';

  const props = defineProps({
    dataList: {
      type: Array as PropType<KuberDataItem[]>,
      default() {
        return [];
      },
    },
    modelValue: {
      type: Array as PropType<ResouceItem[]>,
      default() {
        return [];
      },
    },
  });

  const emits = defineEmits(['update:modelValue', 'change']);
  const currentOpened = reactive({
    clusterId: '',
    namespace: '',
    clusterName: '',
  });
  const currentSpace = ref<any>({});
  // it's update the value by increment
  const selectedNamespaceList = ref<ResouceSpaceItem[]>([]);
  const nameList = ref<ResouceItem[]>([]);
  // always compute the value base on the selectedNamespaceList
  const selectedNameList = ref<ResouceItem[]>([]);

  const removeNamespaceFromSelected = () => {
    remove(selectedNameList.value, (item) => {
      const selectedVal = `${item.kubernetesID}-${item.namespace}`;
      const currentVal = `${currentSpace.value.kubernetesID}-${currentSpace.value.namespace}`;
      return selectedVal === currentVal;
    });
  };
  const updateSelectedNameList = () => {
    const nmList = filter(
      get(currentSpace.value, 'nameList'),
      (item) => !item.imported
    );
    const hasChecked = some(nmList, (item) => {
      return item.checked;
    });
    const allChecked = every(nmList, (item) => {
      return item.checked;
    });
    const noneChecked = every(nmList, (item) => {
      return !item.checked;
    });
    const hasCheckedWorkload = some(selectedNameList.value, (item) => {
      return (
        `${item.kubernetesID}${item.namespace}` ===
        `${currentSpace.value.kubernetesID}${currentSpace.value.namespace}`
      );
    });
    if (noneChecked && hasCheckedWorkload) {
      removeNamespaceFromSelected();
    } else if (hasChecked && !hasCheckedWorkload) {
      selectedNamespaceList.value.push(currentSpace.value);
    }

    if (noneChecked) {
      currentSpace.value.checked = false;
      currentSpace.value.indeterminate = false;
    }
    if (allChecked) {
      currentSpace.value.checked = true;
      currentSpace.value.indeterminate = false;
    }
    if (!allChecked && hasChecked) {
      currentSpace.value.checked = false;
      currentSpace.value.indeterminate = true;
    }
    console.log(
      'hasChecked===1=',
      hasChecked,
      allChecked,
      noneChecked,
      hasCheckedWorkload
    );
  };

  // update selected value in time
  const getSelectedList = () => {
    let list: ResouceItem[] = [];
    each(selectedNamespaceList.value, (item) => {
      list = concat(list, get(item, 'nameList') || []);
    });
    list = filter(list, (item) => !item.imported && item.checked);
    selectedNameList.value = [].concat(list as never[]);
    selectedNameList.value = unionBy(selectedNameList.value, (s) => {
      return `${s.kubernetesID}/${s.namespace}/${s.fullName}`;
    });
    emits('change', selectedNameList.value);
  };

  const handleCheckWorkload = (isChecked, workload) => {
    updateSelectedNameList();
    getSelectedList();
  };

  const handleUpdateModelValue = () => {
    selectedNameList.value = unionBy(selectedNameList.value, (s) => {
      return `${s.kubernetesID}/${s.namespace}/${s.fullName}`;
    });
    emits('update:modelValue', selectedNameList.value);
  };
  const updateCheckBoxValue = (list: ResouceItem[], flag: boolean) => {
    each(list, (item) => {
      if (!item.imported) {
        item.checked = flag;
      }
    });
  };
  const handleNamespaceClick = ({ cluster, space }) => {
    // current active namespace
    currentSpace.value = space;

    currentOpened.clusterId = cluster.id;
    currentOpened.namespace = space.namespace;
    currentOpened.clusterName = cluster.name;
    // trigger update nameList in watcheffect
  };
  const handleNamespaceCheck = ({ isChecked, cluster, space }) => {
    if (isChecked) {
      selectedNamespaceList.value.push(space);
      // filter has imported
      const nmList = space.nameList || [];
      // all checked
      updateCheckBoxValue(nmList, true);
    } else {
      remove(selectedNamespaceList.value, (item) => {
        return (
          `${space.kubernetesID}-${space.namespace}` ===
          `${item.kubernetesID}-${item.namespace}`
        );
      });
      // filter has imported
      const nmList = space.nameList || [];
      // all unchecked
      updateCheckBoxValue(nmList, false);
    }
    getSelectedList();
  };
  const handleClusterCheck = (isChecked, cluster) => {
    // update the checkbox value for all workload
    each(cluster.namespaceList, (space) => {
      each(space.nameList, (workload) => {
        if (!workload.imported) {
          workload.checked = isChecked;
        }
      });
    });
    if (isChecked) {
      const clusterNameList = get(cluster, 'namespaceList') || [];
      selectedNamespaceList.value = concat(
        selectedNamespaceList.value,
        clusterNameList
      );
      selectedNamespaceList.value = uniqWith(
        selectedNamespaceList.value,
        (pre, next) => {
          const prePath = `${pre.kubernetesID}-${pre.namespace}`;
          const nextPath = `${next.kubernetesID}-${next.namespace}`;
          return prePath === nextPath;
        }
      );
    } else {
      const removeClusterNameList = get(cluster, 'namespaceList') || [];
      const removeNamespace = map(
        removeClusterNameList,
        (item) => `${item.kubernetesID}-${item.namespace}`
      );
      remove(selectedNamespaceList.value, (namespace) => {
        return includes(
          removeNamespace,
          `${namespace.kubernetesID}-${namespace.namespace}`
        );
      });
    }
    getSelectedList();
  };
  // show the check list
  const getNameList = () => {
    const clusterName = find(
      props.dataList,
      (item) => item.id === currentOpened.clusterId
    );
    const namespaceData = find(
      get(clusterName, 'namespaceList') || [],
      (item) => item.namespace === currentOpened.namespace
    );
    nameList.value = get(namespaceData, 'nameList') || [];
    console.log('nameList===', nameList.value);
  };
  watchEffect(() => {
    getNameList();
    updateSelectedNameList();
    handleUpdateModelValue();
  });
</script>

<style lang="less" scoped>
  .list-wrap {
    .list-content {
      display: flex;
      justify-content: space-between;
    }

    .resource-list-wrap {
      .tips {
        font-weight: 500;
      }

      width: 100%;
      margin-left: 10px;
      padding: 0 0 10px 10px;
      // background-color: var(--color-fill-2);
      border-radius: 2px;

      .checkbox-wrap {
        display: flex;
        height: 480px;
        overflow-y: auto;
      }
    }
  }
</style>

<template>
  <div class="seal-menu-wrap" :style="{ width: width }">
    <div class="menu-collapse">
      <!-- <a-input-search placeholder="请输入集群" allow-clear v-model="query" @change="handleSearch"></a-input-search> -->
      <!-- <a-button type="primary" size="small" class="collapse-btn" @click="handleCollapse">全部收起<icon-shrink style="margin-left:2px;font-size: 14px;" /></a-button> -->
    </div>
    <!-- <a-divider style="margin:0"></a-divider> -->
    <div class="menu-inner" :class="{ 'menu-inner-bordered': bordered }">
      <div
        v-for="cluster in menuList"
        :key="`${cluster.id}`"
        class="menu-block"
        :data-name="cluster.id"
      >
        <div
          class="menu-block-header"
          :class="{ 'content-open': includes(activeKeys, cluster.id) }"
          @click.stop="handleCollapseToggle(cluster)"
        >
          <span class="menu-block-header-indent"></span>
          <a-checkbox
            v-model="cluster.checked"
            class="menu-item-checkbox"
            :disabled="cluster.imported"
            :indeterminate="cluster.indeterminate"
            @change="(val) => handleClusterCheck(val, cluster)"
            @click.stop="() => {}"
          ></a-checkbox>
          <span class="menu-block-header-inner">
            {{ cluster.name }}
          </span>
          <span class="header-collpase-icon">
            <icon-down />
          </span>
        </div>
        <CollapseTransition v-show="includes(activeKeys, cluster.id)">
          <div class="menu-block-content">
            <div
              v-for="space in cluster.namespaceList"
              :key="`${cluster.id}-${space.namespace}`"
              class="menu-item"
              :class="{
                'menu-item-actived':
                  selectedSpace === `${cluster.id}-${space.namespace}`,
              }"
              @click.stop="handleClickNamespace(cluster, space)"
            >
              <span class="menu-item-indent"></span>
              <a-checkbox
                v-model="space.checked"
                class="menu-item-checkbox"
                :disabled="space.imported"
                :indeterminate="space.indeterminate"
                @click.stop="() => {}"
                @change="(val) => handleCheckSpace(val, cluster, space)"
              ></a-checkbox>
              <AutoTip :tooltip-props="{ content: space.namespace }">
                <span class="menu-item-inner">{{ space.namespace }}</span>
              </AutoTip>
            </div>
          </div>
        </CollapseTransition>
      </div>
      <a-empty v-if="!menuList.length"></a-empty>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import {
    includes,
    without,
    filter,
    find,
    get,
    each,
    some,
    every,
    map,
  } from 'lodash';
  import {
    PropType,
    ref,
    computed,
    watch,
    watchEffect,
    onMounted,
    nextTick,
  } from 'vue';
  import { KuberDataItem } from './interface';
  import { ResouceItem } from '../../api/resource';

  const props = defineProps({
    bordered: {
      type: Boolean,
      default() {
        return false;
      },
    },
    width: {
      type: String,
      default() {
        return '100%';
      },
    },
    menuList: {
      type: Array as PropType<KuberDataItem[]>,
      default() {
        return [];
      },
    },
    selecteNameList: {
      type: Array as PropType<ResouceItem[]>,
      default() {
        return [];
      },
    },
  });
  const emits = defineEmits(['nsClick', 'checkAll', 'clusterCheck']);
  const query = ref('');
  const activeKeys = ref<string[]>([]);
  const selectedSpace = ref('');
  const currentCluster = ref<any>({});
  const dataList = computed(() => {
    const arr = filter(props.menuList, (item) => {
      return includes(item.name, query.value);
    });
    console.log('menuList=', props.menuList);
    return arr as KuberDataItem[];
  });
  const updateClusterCheckValue = (cluster) => {};
  const updateSpaceCheckValue = (space) => {
    const nameList = filter(get(space, 'nameList'), (item) => !item.imported);
  };
  const handleClusterCheck = (isChecked, cluster) => {
    cluster.indeterminate = false;
    each(cluster.namespaceList, (item) => {
      if (!item.imported) {
        item.checked = isChecked;
      }
    });
    const space = get(cluster, 'namespaceList.0') || {};
    emits('nsClick', { cluster, space });
    emits('clusterCheck', isChecked, cluster);
  };
  const updateSelectedCluster = () => {
    console.log('updateSelectedCluster', props.selecteNameList);
    let oneClusterWorkloadList: any[] = [];
    each(currentCluster.value.namespaceList, (space) => {
      const nmList = get(space, 'nameList') || ([] as ResouceItem[]);
      oneClusterWorkloadList = oneClusterWorkloadList.concat(nmList);
    });
    oneClusterWorkloadList = filter(
      oneClusterWorkloadList,
      (item) => !item.imported
    );
    if (!oneClusterWorkloadList.length) {
      return;
    }
    const selectedWorkloadList = map(props.selecteNameList, (item) => {
      return `${item.kubernetesID}-${item.namespace}-${item.name}`;
    });

    const hasChecked = some(oneClusterWorkloadList, (item) => {
      const workloadPath = `${item.kubernetesID}-${item.namespace}-${item.name}`;
      return includes(selectedWorkloadList, workloadPath);
    });
    const allChecked = every(oneClusterWorkloadList, (item) => {
      const workloadPath = `${item.kubernetesID}-${item.namespace}-${item.name}`;
      return includes(selectedWorkloadList, workloadPath);
    });
    const noneChecked = every(oneClusterWorkloadList, (item) => {
      const workloadPath = `${item.kubernetesID}-${item.namespace}-${item.name}`;
      return !includes(selectedWorkloadList, workloadPath);
    });
    if (hasChecked && !allChecked) {
      currentCluster.value.checked = false;
      currentCluster.value.indeterminate = true;
    }
    if (allChecked) {
      currentCluster.value.checked = true;
      currentCluster.value.indeterminate = false;
    }
    if (noneChecked) {
      currentCluster.value.checked = false;
      currentCluster.value.indeterminate = false;
    }
    console.log(
      'hasChecked===',
      selectedWorkloadList,
      hasChecked,
      allChecked,
      noneChecked
    );
  };
  const handleCollapseToggle = (clusterItem) => {
    // current active cluster
    currentCluster.value = clusterItem;

    if (includes(activeKeys.value, clusterItem.id)) {
      activeKeys.value = [];
    } else {
      activeKeys.value = [clusterItem.id];
    }
    if (get(currentCluster.value, 'namespaceList')?.length) {
      const activeNamespace = get(currentCluster.value, 'namespaceList.0');
      selectedSpace.value = `${clusterItem.id}-${activeNamespace.namespace}`;
      emits('nsClick', {
        cluster: clusterItem,
        space: get(currentCluster.value, 'namespaceList.0'),
      });
    }
  };
  const handleClickNamespace = (cluster, space) => {
    selectedSpace.value = `${cluster.id}-${space.namespace}`;
    emits('nsClick', { cluster, space });
  };
  const handleCheckSpace = (isChecked, cluster, space) => {
    space.indeterminate = false;
    emits('nsClick', { cluster, space });
    emits('checkAll', { isChecked, cluster, space });
  };
  const handleSearch = (val) => {
    console.log(val);
  };
  const handleCollapse = () => {
    activeKeys.value = [];
  };
  const initView = () => {
    if (props.menuList?.length) {
      const firstCluster = props.menuList[0] || {};
      if (get(firstCluster, 'namespaceList')?.length) {
        const firstSpace = get(firstCluster, 'namespaceList.0');
        emits('nsClick', { cluster: firstCluster, space: firstSpace });
      }
    }
  };
  watchEffect(() => {
    console.log('selecteNameList===', props.selecteNameList);
    updateSelectedCluster();
  });
  onMounted(() => {
    // nextTick(() => {
    //   setTimeout(() => {
    //     initView();
    //   }, 200);
    // });
  });
</script>

<style lang="less" scoped>
  .seal-menu-wrap {
    color: var(--color-text-2);
    font-size: 14px;

    .menu-collapse {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 0;
      font-size: 12px;

      :deep(.arco-checkbox-label) {
        font-size: 12px;
      }

      .collapse-btn {
        display: inline-block;
        min-width: max-content;
        // margin-left: 10px;
        font-size: 12px;
      }
    }

    .menu-inner {
      min-height: 500px;
      max-height: 500px;
      padding: 4px 8px;
      overflow-y: auto;
      background-color: var(--color-fill-2);
      border-radius: 2px;

      &-bordered {
        background-color: #fff;
        border: 1px solid var(--color-neutral-3);
        border-radius: 2px;
      }
    }
    // bordered
    .menu-inner.menu-inner-bordered {
      .menu-block-header:hover,
      .menu-item:hover {
        color: var(--sealblue-6);
        background-color: var(--color-fill-2);
      }
    }

    // no-border
    .menu-block {
      &-header:hover,
      .menu-item:hover {
        color: var(--sealblue-6);
        background-color: #fff;
      }

      &-header,
      .menu-item {
        position: relative;
        display: flex;
        align-items: center;
        height: 36px;
        padding-right: 26px;
        line-height: 36px;
        border-radius: 2px;
        cursor: pointer;

        &-checkbox {
          // position: absolute;
          // left: 12px;
        }

        &-inner {
          padding: 0 4px;
        }
      }

      .menu-item {
        &.menu-item-actived {
          // background-color: var(--sealblue-6);
          color: var(--sealblue-6);
          // font-weight: 500;
        }

        &.menu-item-actived:hover {
          // background-color: var(--sealblue-6);
          // color: #fff;
        }
      }

      .menu-block-header {
        // border-bottom: 1px solid var(--color-neutral-3);
        &-inner {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .header-collpase-icon {
          position: absolute;
          right: 6px;
          font-size: 16px;
          transform: rotate(0);
        }

        &.content-open {
          color: var(--sealblue-6);
          // font-weight: 500;
          .arco-icon-down {
            transform: rotate(-180deg);
          }
        }
      }

      .menu-item-indent {
        flex: none;
        width: 16px;
      }

      &-content {
        .menu-item {
          margin-bottom: 2px;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
</style>

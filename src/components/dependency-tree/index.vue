<template>
  <div class="dependency-tree-wrap">
    <div class="main">
      <template v-if="get(props.data, '0.deps')?.length">
        <treeUL
          v-for="(node, index) in get(data, '0.deps') || []"
          :key="index"
          :node-id="node.nodeId"
          :expand-keys="expandKeys"
          :node-data="node"
          :loadmore="loadmore"
          @expand="handleExpand"
          @loadmore="handleLoadMore"
        >
        </treeUL>
      </template>
      <a-empty
        v-show="!treeDataList.length"
        :description="$t('projects.detail.filter.empty')"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { get } from 'lodash';
  import { PropType, provide, useAttrs, computed } from 'vue';
  import { TreeNodeData, loadMoreType } from './config/interface';
  import treeUL from './components/tree-ul.vue';

  type baseType = string | number;

  const props = defineProps({
    data: {
      type: Array as PropType<TreeNodeData[]>,
      default() {
        return [];
      },
    },
    expandKeys: {
      type: Array as PropType<baseType[]>,
      default() {
        return [];
      },
    },
    loadmore: {
      type: Function as PropType<loadMoreType>,
    },
  });
  const attrs = useAttrs();
  const emits = defineEmits(['expand', 'update:expandKeys', 'loadmore']);

  const treeDataList = computed(() => {
    return get(props.data, '0.deps') || [];
  });
  const handleExpand = (isExpand, expandKeysList) => {
    // console.log('expandKeysList=1==', [...new Set(expandKeysList)])
    emits('update:expandKeys', [...new Set(expandKeysList)]);
    emits('expand', isExpand);
  };
  const handleLoadMore = (node) => {
    emits('loadmore', node);
  };
</script>

<style lang="less" scoped>
  @import url('./style/style.less');
</style>

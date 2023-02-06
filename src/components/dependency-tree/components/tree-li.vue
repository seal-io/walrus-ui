<template>
  <li
    :key="nodeData.nodeKey"
    class="node-tree__item"
    :class="{ 'node-tree-wrap': !nodeData.isLeaf || nodeData.deps?.length }"
  >
    <div class="node-tree__title" @click.stop="handleClickNode(nodeData)">
      <template v-if="hasMatchIndex < 0">
        <span>{{ nodeData.pkgId }}</span>
      </template>
      <span v-else>
        {{ nodeData?.pkgId?.substr(0, hasMatchIndex)
        }}<span
          :style="{
            background: '#206ccf',
            color: '#fff',
            padding: '2px',
          }"
        >
          {{
            nodeData?.pkgId?.substr(hasMatchIndex, searchStr?.query.length)
          }} </span
        >{{ nodeData?.pkgId?.substr(hasMatchIndex + searchStr?.query.length) }}
      </span>
      <!-- <span v-if="showDebug"
        >li {{ includes(expandKeysList, nodeData.nodeKey) }} isLeaf:{{
          nodeData.isLeaf
        }}
        nodeKeys: {{ nodeData.nodeKey }} deps: {{ nodeData.deps.length }}</span
      > -->
      <span
        v-if="!nodeData.isLeaf || nodeData?.deps?.length"
        class="expand-icon-wrap"
        :class="{
          'arco-tree-node-minus-icon': isExpanded,
          'arco-tree-node-plus-icon': !isExpanded,
        }"
      >
      </span>
    </div>
    <template v-if="isExpanded && !nodeData.isLeaf && !!nodeData.deps.length">
      <ul v-show="!!nodeData.deps.length" class="node-tree">
        <treeUL
          v-for="node in nodeData.deps"
          :key="`${node.nodeKey}`"
          :node-data="node"
          :loadmore="loadmore"
          :query="query"
          @loadmore="handleLoadMore"
          @expand="handleExpand"
        >
        </treeUL>
      </ul>
    </template>
  </li>
</template>

<script lang="ts" setup>
  import { toLower, includes, remove, cloneDeep } from 'lodash';
  import {
    PropType,
    inject,
    computed,
    watchEffect,
    watch,
    nextTick,
    ref,
    onMounted,
  } from 'vue';
  import { TreeNodeData, baseType, loadMoreType } from '../config/interface';
  import treeUL from './tree-ul.vue';

  const props = defineProps({
    nodeData: {
      type: Object as PropType<TreeNodeData>,
      default() {
        return {};
      },
    },
    // expandKeys: {
    //   type: Array as PropType<baseType[]>,
    //   default() {
    //     return [];
    //   },
    // },
    loadmore: {
      type: Function as PropType<loadMoreType>,
    },
    query: {
      type: String,
      default() {
        return '';
      },
    },
  });
  const timer: any = null;
  const showDebug = ref(false);
  const loaded = ref(false);
  const isLeafNode = ref(true);
  const hasChildDeps = ref(false);
  const searchStr = inject('searchStr', { query: '' });
  const currentRoot = inject('currentRoot', ref(''));
  const expandKeysList = inject('expandKeys', ref<any[]>([]));
  const emitter = defineEmits(['expand', 'loadmore']);
  const handleExpand = (isExpand, expandKeys) => {
    emitter('expand', isExpand, expandKeys);
  };
  const loadMoreDeps = (node) => {
    props.loadmore?.(node);
  };
  const handleClickNode = (node) => {
    console.log('node click:', node);
    if (node.isLeaf) return;
    const expandKeys = cloneDeep(expandKeysList.value);
    if (includes(expandKeysList.value, node.nodeKey)) {
      remove(expandKeys, (val) => val === node.nodeKey);
      emitter('expand', false, expandKeys);
    } else {
      expandKeys.push(node.nodeKey);
      emitter('expand', true, expandKeys);
    }
    if (includes(expandKeys, node.nodeKey) && !node.deps.length) {
      emitter('loadmore', node);
      loadMoreDeps(node);
    }
  };
  const hasMatchIndex = computed(() => {
    console.log('query==22==', searchStr.query);
    if (!searchStr.query) return -1;
    const title = props.nodeData.pkgId || '';
    return title.indexOf(toLower(searchStr.query));
  });
  const isExpanded = computed(() => {
    return includes(expandKeysList.value, props.nodeData.nodeKey);
  });
  const handleAddExpandKey = () => {
    const expandKeys = cloneDeep(expandKeysList.value);
    expandKeys.push(props.nodeData?.nodeKey as baseType);
    emitter('expand', true, expandKeys);
  };
  const handleRemoveExpandKey = () => {
    const expandKeys = cloneDeep(expandKeysList.value);
    remove(expandKeys, (val) => val === props.nodeData.nodeKey);
    // emitter('expand', false, expandKeys);
  };
  const getMatchIndex = (title) => {
    if (!searchStr.query) return -1;
    return toLower(title).indexOf(toLower(searchStr.query));
  };
  const handleLoadMore = (node) => {
    emitter('loadmore', node);
  };
  const setRenderCondition = () => {
    isLeafNode.value = isExpanded.value && !props.nodeData.isLeaf;
    hasChildDeps.value = !!props.nodeData.deps.length;
  };
  onMounted(() => {
    loaded.value = true;
    setRenderCondition();
  });
</script>

<!-- <script lang="ts">
  export default {
    name: 'DepsLi',
  };
</script> -->

<style lang="less" scoped>
  @import url('../style/style.less');
</style>

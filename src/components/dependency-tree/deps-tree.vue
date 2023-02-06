<template>
  <div id="sbom-tree" class="sbom-tree">
    <div class="root-node-info">
      <a-button type="text" class="one-key" @click="handleClickCollpase">
        {{ $t('sbom.project.dependeny.collpase') }}
      </a-button>
    </div>
    <div class="wrap" :class="{ 'multi-apps': multiApps }">
      <div v-if="multiApps" class="app-wrapper">
        <appMenu
          :list="applicationList"
          :actived="rootNodeKey"
          @click="handleClickResource"
        ></appMenu>
      </div>
      <div class="deps-wrapper">
        <dependencyTree
          v-model:expandKeys="expandedKeys"
          :data="treeData"
          :loadmore="loadMore"
          @expand="handleExpand"
        >
        </dependencyTree>
      </div>
    </div>
  </div>
  <a-back-top :style="{ position: 'fixed', bottom: '80px' }" />
</template>

<script lang="ts" setup>
  import {
    get,
    each,
    map,
    cloneDeep,
    reduce,
    toLower,
    filter,
    includes,
    pickBy,
    assignIn,
    keys,
    find,
    concat,
    findIndex,
    differenceBy,
    has,
    remove,
  } from 'lodash';
  import {
    computed,
    onMounted,
    reactive,
    ref,
    watch,
    PropType,
    nextTick,
    provide,
  } from 'vue';
  import { useRoute } from 'vue-router';
  import useLoading from '@/hooks/loading';
  import { useDebounceFn } from '@vueuse/core';
  import dependencyTree from './index.vue';
  import appMenu from './components/app-menu.vue';
  import { PackagesItem, DepsData } from './config/interface';

  interface queryParams {
    query: string;
    direct: string;
  }
  const props = defineProps({
    multiApps: {
      type: Boolean,
      default() {
        return false;
      },
    },
    searchKey: {
      type: Object as PropType<queryParams>,
      default() {
        return {
          query: '',
          direct: '',
        };
      },
    },
    depsData: {
      type: Object as PropType<DepsData>,
      default() {
        return {
          packages: [],
          rootPackageID: '',
        };
      },
    },
  });

  interface SourceDataItem {
    nodeId: string;
    id: string;
    dependencyPackageIDs: string[];
    pkgId: string;
    deps: SourceDataItem[];
    isLeaf: boolean;
    info: any;
    isCircelNode: boolean;
    depsPkgIds: string[];
    disabled?: boolean;
    nodeKey?: string;
    hasMatch?: boolean;
    misMatch?: boolean;
    nodePath: string[];
    parentId?: string;
    walked?: boolean;
  }
  const tree = ref();
  const { loading, setLoading } = useLoading(true);
  const route = useRoute();
  const timer: any = null;
  let allTreeNodes: Record<string, SourceDataItem> = {};
  let resetExpandedKeys: string[] = ['root-node'];
  const sourceTreeData: any = {};
  const nodekeyCacheMap = new Map();
  let sourceDataList: SourceDataItem[] = [];
  const applicationList = ref<{ value: string; label: string }[]>([]);
  const rootNodeInfo: SourceDataItem = reactive({
    pkgId: '',
    nodeId: '',
    id: '',
    depsPkgIds: [],
    nodeIndex: '',
    nodeKey: '',
    nodePath: [],
    isLeaf: false,
    isCircelNode: false,
    dependencyPackageIDs: [],
    deps: [],
    info: {},
  });
  const childRootList = ref<string[]>([]);
  const expandAllKey = ref<boolean>(true);
  const expandedKeys = ref(['root-node']);
  const rootNodeKey = ref('root-node');
  const searchResult = ref<SourceDataItem[]>([]);
  const nodeParentIdMap = new Map();
  const fieldNames = {
    key: 'nodeKey',
    title: 'pkgId',
    children: 'deps',
    icon: '',
  };
  const treeData = ref<SourceDataItem[]>([]);
  provide('searchStr', props.searchKey);
  provide('currentRoot', rootNodeKey);
  provide('expandKeys', expandedKeys);

  const getPackgeVersion = (data) => {
    return data?.version ? `@${data.version}` : '';
  };

  const cloneJsonDeep = (data) => {
    return JSON.parse(JSON.stringify(data));
  };
  const createNodekey = (id): string => {
    let n = 0;
    let nodeId = id;
    if (nodekeyCacheMap.get(id)) {
      const store_n = nodekeyCacheMap.get(id).n;
      n = store_n + 1;
      nodeId = `${id}_${n}`;
    }
    nodekeyCacheMap.set(id, { n });
    // console.log('nodeId>>>3>>>', nodeId,nodekeyCacheMap.get(nodeId))
    return nodeId;
  };
  const setSourceDataList = (list: PackagesItem[]) => {
    const sourceDataMap = reduce(
      list,
      (obj, s) => {
        if (!obj[s.id]) {
          obj[s.id] = { ...s };
        }
        return obj;
      },
      {}
    );
    childRootList.value = [].concat(
      get(sourceDataMap, `${rootNodeKey.value}.dependencyPackageIDs`) || []
    );
    sourceDataList = map(list, (item) => {
      return {
        nodeId: item.id,
        id: item.id,
        nodePath: [],
        depsPkgIds: [],
        isCircelNode: false,
        pkgId: item.namespace
          ? `${item.namespace}/${item.name}${getPackgeVersion(item)}`
          : `${item.name}${getPackgeVersion(item)}`,
        dependencyPackageIDs: item?.dependencyPackageIDs?.length
          ? [...item.dependencyPackageIDs]
          : [],
        isLeaf: !item.dependencyPackageIDs?.length,
        deps: map(item.dependencyPackageIDs || [], (id) => {
          const sData = cloneJsonDeep(get(sourceDataMap, id) || {});
          const dependencyPackageIDs = get(sData, 'dependencyPackageIDs') || [];
          return {
            info: { ...cloneJsonDeep(sData) },
            nodePath: [item.id],
            nodeId: id,
            id,
            depsPkgIds: [],
            isCircelNode: false,
            dependencyPackageIDs: [...dependencyPackageIDs],
            isLeaf: !get(sData, 'dependencyPackageIDs')?.length,
            deps: [],
            pkgId: sData.namespace
              ? `${sData.namespace}/${sData.name}${getPackgeVersion(sData)}`
              : `${sData.name}${getPackgeVersion(sData)}`,
          };
        }),
        info: {
          ...item,
        },
      };
    });
  };
  const setNodesMap = (list: SourceDataItem[]) => {
    allTreeNodes = reduce(
      list,
      (obj, node, nodeIndex) => {
        if (!obj[node.nodeId]) {
          obj[node.nodeId] = {
            ...cloneJsonDeep(node),
            nodeIndex: `${nodeIndex}`,
            nodeKey: node.nodeId,
          };
        }
        const dependencyPackageIDs = get(node, 'dependencyPackageIDs') || [];
        each(dependencyPackageIDs, (id) => {
          nodeParentIdMap.set(id, node.nodeId);
        });
        return obj;
      },
      {}
    );
  };
  const setRootNode = () => {
    const rootNode: SourceDataItem =
      get(allTreeNodes, `${rootNodeKey.value}`) || {};
    rootNode.isLeaf = false;
    rootNode.disabled = true;
    rootNode.nodeKey = rootNode.nodeId;
    assignIn(rootNodeInfo, rootNode);
    console.log('treeData=00===', allTreeNodes, rootNodeInfo, sourceDataList);
  };
  const filterCallback = (data) => {
    const res = includes(toLower(data.pkgId), toLower(props.searchKey.query));
    return res;
  };
  const filterCallbackByStr = (pkgId) => {
    const res = includes(pkgId, toLower(props.searchKey.query));
    return res;
  };

  const getNodeDeps = (nodeObj) => {
    const dependencyPackageIDs = get(nodeObj, 'dependencyPackageIDs') || [];
    if (!dependencyPackageIDs.length) return [];

    const list = map(dependencyPackageIDs, (sId) => {
      const node = cloneJsonDeep(get(allTreeNodes, sId) || {});
      const nodeDepsIds = get(node, `dependencyPackageIDs`) || [];
      node.isLeaf = !nodeDepsIds.length;
      node.nodeKey = createNodekey(node.nodeId);
      node.nodePath = concat(nodeObj.nodePath, nodeObj.nodeId);
      if (includes(node.nodePath, node.nodeId)) {
        node.isLeaf = true;
      }
      node.deps = [];
      console.log('node.nodeKey:', node.nodeKey);

      return node;
    });
    console.log('nodeDeps=2===', list);
    return list;
  };
  const preOrderDFS = () => {
    const root = cloneJsonDeep(get(allTreeNodes, `${rootNodeKey.value}`) || {});
    const stack: SourceDataItem[] = [];
    const result: SourceDataItem[] = [];
    stack.push(root);
    let i = 0;
    while (stack.length && i < 10000) {
      i += 1;
      const currentNode = stack.pop() as SourceDataItem;
      const isCircelNode = includes(currentNode.nodePath, currentNode.nodeId);
      // console.log('currentNode====', i,currentNode.nodeId)

      if (currentNode.dependencyPackageIDs.length && !isCircelNode) {
        currentNode.deps = cloneJsonDeep(
          get(allTreeNodes[currentNode.nodeId], 'deps') || []
        );
      } else {
        currentNode.deps = [];
      }
      result.push(currentNode);
      if (currentNode.deps.length) {
        for (let n = 0, len = currentNode.deps.length; n < len; n += 1) {
          const node = currentNode.deps[n];
          node.nodePath = [...currentNode.nodePath, currentNode.nodeId];
          stack.push(node);
        }
      }
    }
    // result.reverse();
    console.log('currentNode==length', result.length); // 3000273
    return result;
  };
  const filterTreeByQuery = (list: SourceDataItem[]) => {
    let currentVisitedNode: any = {};
    while (list.length) {
      const currentNode = list.pop() as SourceDataItem;
      currentNode.nodeKey = createNodekey(currentNode.nodeId);
      if (currentNode?.deps?.length) {
        currentNode.deps = filter(currentNode.deps, (dItem) => {
          const hasMatch = filterCallbackByStr(dItem.pkgId);
          return hasMatch || !!dItem.deps.length;
        });
      } else {
        currentNode.deps = [];
      }
      currentNode.isLeaf = !currentNode.deps.length;
      if (currentNode.deps.length) {
        expandedKeys.value.push(currentNode.nodeKey);
      }
      expandedKeys.value = [...new Set(expandedKeys.value)];
      currentVisitedNode = currentNode;
      console.log('currentVisitedNode=======', list.length, currentVisitedNode);
    }
    return currentVisitedNode as SourceDataItem;
  };

  const setApplicationList = () => {
    if (!props.multiApps) return;
    const dataItem = get(allTreeNodes, `${rootNodeKey.value}`) || {};
    const appList = get(dataItem, 'dependencyPackageIDs') || [];
    applicationList.value = appList.map((id) => {
      const info = get(allTreeNodes, id) as SourceDataItem;
      const data = info?.info || {};
      return {
        value: id,
        label: data.namespace
          ? `${data.namespace}/${data.name}${getPackgeVersion(data)}`
          : `${data.name}${getPackgeVersion(data)}`,
      };
    });
    rootNodeKey.value = get(applicationList.value, '0.value');
  };
  const fetchData = async () => {
    try {
      const data = props.depsData;
      const list: PackagesItem[] =
        get(data, 'packages') || ([] as Array<PackagesItem>);

      setSourceDataList(list);
      rootNodeKey.value = get(data, 'rootPackageID') || 'root-node';
      expandedKeys.value = [rootNodeKey.value];
    } catch (error) {
      console.log(error);
    }
  };

  const handleExpand = (arr) => {
    console.log('expand===', arr, expandedKeys.value);
  };

  const handleClickCollpase = () => {
    expandedKeys.value = [rootNodeKey.value];
  };

  const loadMore = async (nodeData) => {
    if (!nodeData.dependencyPackageIDs.length) {
      nodeData.deps = [];
      return;
    }
    console.log('dataList=1==', nodeData);
    const list = getNodeDeps(nodeData);
    console.log('loadmore:', nodeData);
    nodeData.deps = list?.length ? [...cloneJsonDeep(list)] : [];
  };

  const defaultExpandNodes = () => {
    // root node
    const firstChildNode = find(
      get(treeData.value, '0.deps') || [],
      (item) => item?.dependencyPackageIDs?.length
    );
    const childDeps = get(treeData.value, '0.deps') || ([] as SourceDataItem[]);
    const firstChildNodeIndex = findIndex(
      childDeps,
      (item: any) => item?.dependencyPackageIDs?.length
    );
    if (!firstChildNode) return;
    // root node deps
    const firstChildNodeDependencies = getNodeDeps(firstChildNode);
    searchResult.value = cloneJsonDeep(firstChildNodeDependencies);
    treeData.value[0]['deps'][firstChildNodeIndex]['deps'] = cloneJsonDeep(
      firstChildNodeDependencies
    );
    const firstNodeKey = get(
      treeData.value,
      `0.deps.${firstChildNodeIndex}.nodeKey`
    );
    expandedKeys.value.push(firstNodeKey);
    resetExpandedKeys = [...expandedKeys.value];
    console.log('firstNode>>', firstNodeKey);
  };

  const initRootEntrance = () => {
    const rootNode = cloneJsonDeep(rootNodeInfo);
    rootNode.deps = getNodeDeps(rootNode);
    treeData.value = [].concat([cloneJsonDeep(rootNode)] as never[]);
    console.log('treeData=66===', treeData.value, expandedKeys.value);
  };
  const initData = async () => {
    fetchData();
    const t1 = window.performance.now();
    setNodesMap(sourceDataList);
    setApplicationList();
    setRootNode();
    initRootEntrance();
    defaultExpandNodes();
    const t2 = window.performance.now();
    console.log('time:', t2 - t1);
  };
  const handleClickResource = (value) => {
    rootNodeKey.value = value;
    nodekeyCacheMap.clear();
    setRootNode();
    initRootEntrance();
    defaultExpandNodes();
  };
  const handleFilterTree = () => {
    console.log('m====');
    expandedKeys.value = [];
    nodekeyCacheMap.clear();
    // const t1 = window.performance.now()
    const queue = preOrderDFS();
    const result = filterTreeByQuery(queue);
    // const t2 = window.performance.now()
    // console.log('t2-t1----', t2 - t1)
    treeData.value = [result];
    console.log('copy=12==', queue, expandedKeys.value);
  };
  const debounceFn = useDebounceFn(() => {
    if (!props.searchKey.query && sourceDataList.length) {
      setNodesMap(sourceDataList);
      setRootNode();
      initRootEntrance();
      defaultExpandNodes();
    } else if (props.searchKey.query && sourceDataList.length) {
      handleFilterTree();
    }
  }, 200);
  watch(
    () => props.searchKey.query,
    () => {
      debounceFn();
    },
    { immediate: true }
  );
  watch(
    () => props.depsData,
    () => {
      initData();
    },
    { immediate: true }
  );
  onMounted(async () => {
    // await initData();
    console.log('copy==0==', sourceTreeData, treeData.value);
  });
</script>

<style lang="less" scoped>
  .sbom-tree {
    margin-top: 2px;
    padding: 0;
    overflow: hidden;
    background-color: var(--color-fill-2);
    border: 1px solid var(--color-neutral-3);
    border-radius: 4px 4px 0 0;

    .root-node-info {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 46px;
      padding: 0 20px;
      color: var(--color-text-2);
      font-weight: 500;
      font-size: 16px;
      line-height: 46px;
      // background-color: var(--color-fill-2);
      background: #fff;
      border-radius: 4px 4px 0 0;

      .one-key {
        font-weight: 500;
      }
    }

    :deep(.arco-spin-mask) {
      z-index: 100;
    }

    .wrap {
      // max-height: 600px;
      padding-top: 10px;
      padding-right: 20px;
      padding-left: 20px;
      overflow-y: auto;
      background: #fff;
      border-top: 1px solid var(--seal-border-gray-2);

      &.multi-apps {
        display: flex;
        justify-content: space-between;
        padding-left: 0;

        .app-wrapper {
          flex-basis: 220px;
          width: 220px;
        }

        .deps-wrapper {
          flex: 1;
          padding: 0 10px;
          border-left: 1px solid var(--seal-border-gray-2);
        }
      }
    }

    :deep(.arco-tree) {
      padding-bottom: 20px;

      .arco-tree-node-title {
        font-size: 16px;
      }

      .arco-tree-node {
        position: relative;
        box-sizing: border-box;
        height: 48px;
        margin: 0 30px 0 0;
        padding: 6px 0;
        line-height: 36px;

        &:first-child {
          display: none;
          cursor: default;

          .arco-icon-file {
            display: none;
          }

          .arco-tree-node-title {
            background-color: var(--color-fill-2);
            box-shadow: none;

            &:hover {
              background-color: var(--color-fill-2);
              box-shadow: none;
              cursor: default;
            }
          }
        }

        &.arco-tree-node-selected.arco-tree-node-expanded {
          .arco-tree-node-title {
            background: #fff;
            box-shadow: inset 0 0 0 1px var(--seal-color-bg-1),
              0 0 0 1px var(--seal-color-bg-1);
          }
        }

        .arco-tree-node-title {
          position: relative;
          z-index: 10;
          padding: 0;
          padding-left: 10px;
          color: var(--color-text-2);
          background: #fff;
          border-radius: 4px;
          box-shadow: 0 0 0 1px var(--seal-border-gray-2), 0 0 0 2px transparent;
          transition: all 0.2s var(--seal-transition-func);

          &:hover {
            background: #fff;
            box-shadow: inset 0 0 0 1px var(--seal-color-bg-1),
              0 0 0 1px var(--seal-color-bg-1);
            transition: all 0.2s var(--seal-transition-func);
          }
        }
      }

      .arco-icon-file {
        color: var(--color-text-3);
        font-size: 20px;
      }
    }

    :deep(.arco-tree-node-switcher-icon) {
      display: flex;
    }

    :deep(.arco-tree-node-switcher) {
      margin-right: 16px;

      .arco-tree-node-minus-icon,
      .arco-tree-node-plus-icon {
        width: 20px;
        height: 20px;
      }

      .arco-tree-node-minus-icon::after,
      .arco-tree-node-plus-icon::after {
        width: 10px;
        margin-left: -5px;
        background-color: var(--color-text-3);
      }

      .arco-tree-node-plus-icon::before {
        height: 10px;
        margin-top: -5px;
        background-color: var(--color-text-3);
      }
    }

    // :deep(.arco-tree-show-line) {
    //   position: relative;
    //   &::before {
    //     position: absolute;
    //     top: 42px;
    //     bottom: 42px;
    //     left: 22px;
    //     display: inline-block;
    //     border-left: 2px solid var(--color-neutral-4);
    //     content: '';
    //   }
    // }
    :deep(.arco-tree-node-indent-block) {
      margin-right: 16px;

      &::before {
        top: -20px;
        bottom: -20px;
        left: 10px;
        border-left: 2px solid var(--color-neutral-4);
      }
    }

    :deep(.arco-tree-node-indent) {
      &::after {
        display: none;
      }

      .arco-tree-node-indent-block:first-child {
        margin-right: 10px;
      }
    }
  }
</style>

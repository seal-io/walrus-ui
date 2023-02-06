import { cloneDeep, remove, includes } from 'lodash';

export default function useExpandNode(props) {
  const emits = defineEmits(['expand', 'update:expandKeys']);
  const handleClickNode = (node) => {
    if (node.isLeaf) return;
    const expandKeys = cloneDeep(props.expandKeys);
    if (includes(props.expandKeys, node.nodeKey)) {
      remove(expandKeys, node.nodeKey);
      emits('expand', false, expandKeys);
      // emits('update:expandKeys', expandKeys)
    } else {
      expandKeys.push(node.nodeKey);
      emits('expand', true, expandKeys);
      // emits('update:expandKeys', expandKeys)
    }
  };
  const handleExpand = (isExpand, expandKeys) => {
    emits('expand', isExpand, expandKeys);
    emits('update:expandKeys', expandKeys);
  };
  return {
    handleClickNode,
    handleExpand,
  };
}

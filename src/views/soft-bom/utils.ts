import { every, each, cloneDeep, findIndex } from 'lodash';

export const flattenChildren = (list) => {
  // if (every(list, item => !item.children || !item?.children?.length)) return list
  each(list, (s, i) => {
    if (s?.children?.length && s.loaded) {
      const arr = cloneDeep(s.children);
      list.splice(i + 1, 0, ...arr);
      s.children = null;
      flattenChildren(list);
    }
    s.children = null;
  });
  return list;
};

export const findIndexPathDeep = (
  list,
  record,
  path?: Array<string | number>
) => {
  if (!path) {
    path = [];
  }
  const len = list.length || 0;
  for (let i = 0; i < len; i += 1) {
    const data = list[i];
    path.push(i);
    if (data.id === record.id) {
      break;
    }
    if (data?.children?.length) {
      findIndexPathDeep(data.children, record, path);
    } else {
      path = [];
    }
  }
  return path;
};

export const findPathbyId = (tree, record, path) => {
  if (!path) {
    path = [];
  }
  let tempPath: any[] = [];
  for (let i = 0; i < tree.length; i += 1) {
    tempPath = [...path] as never[];
    tempPath.push(i);
    if (tree[i].id === record.id) {
      break;
    }
    if (tree[i].children) {
      const result = findPathbyId(tree[i].children, record, tempPath);
      if (result) {
        tempPath = [...result];
      }
    }
  }
  return tempPath;
};
export default {};

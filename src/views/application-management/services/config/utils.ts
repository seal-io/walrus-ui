import { filter, map, get, split, pickBy, toString, includes } from 'lodash';
import { KeysItem, InstanceResource, Cascader } from './interface';

export const generateResourcesKeys = (
  reourcesList: InstanceResource[],
  type
) => {
  const filterLoop = (keys: KeysItem[]) => {
    if (!keys.length) return [];
    return filter(keys, (o) => {
      if (get(o, 'keys')?.length) {
        filterLoop(get(o, 'keys') || []);
        return true;
      }
      return get(o, type);
    });
  };
  const reources = filter(reourcesList, (r) => {
    let keysList = get(r, 'keys.keys');
    keysList = filterLoop(get(r, 'keys.keys') || []);
    return keysList.length;
  }) as InstanceResource[];
  const loop = (keysItem: KeysItem, id) => {
    let list: KeysItem[] = keysItem.keys || [];
    list = filter(list, (s) => get(s, type)) as KeysItem[];
    if (!list.length) return null;
    const resultList = map(list, (item) => {
      return {
        loggable: item.loggable,
        executable: item.executable,
        label: item.name,
        value: `${item.value || item.name}?id=${id}`,
        children: loop(item, id)
      };
    });
    return resultList;
  };
  const list = map(reources, (o) => {
    const item = {
      label: o.name,
      value: o.name,
      children: map(get(o, 'keys.keys') || [], (s) => {
        return {
          loggable: s.loggable,
          executable: s.executable,
          label: s.name,
          value: `${s.type || s.name}?id=${o.id}`,
          children: loop(s, o.id)
        };
      })
    };
    return item;
  });
  const res = filter(list, (o) => {
    return o?.children?.length;
  }) as never[];
  return res;
};

export const getResourceId = (val) => {
  const res = split(val, '?');
  const d = get(res, 1);
  return {
    key: get(res, 0),
    id: get(split(d, '='), 1)
  };
};

export const getDefaultValue = (list: Cascader[]) => {
  const data: Cascader = get(list, '0') || {};
  const loop = (obj: Cascader) => {
    if (obj?.children?.length) {
      return loop(get(obj, 'children.0'));
    }
    if (obj?.executable || obj?.loggable) {
      return obj.value;
    }
    return '';
  };
  return loop(data);
};

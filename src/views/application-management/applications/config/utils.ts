import { filter, map, get, split } from 'lodash';
import { KeysItem, InstanceResource, Cascader } from './interface';

export const generateResourcesKeys = (reources: InstanceResource[], type) => {
  const loop = (keysItem: KeysItem, id) => {
    let list: KeysItem[] = keysItem.keys || [];
    if (type === 'loggable') {
      list = filter(list, (s) => s.loggable) as KeysItem[];
    }
    if (type === 'executable') {
      list = filter(list, (s) => s.executable) as KeysItem[];
    }
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
          label: s.name,
          value: `${s.type || s.name}?id=${o.id}`,
          loggable: s.loggable,
          executable: s.executable,
          children: loop(s, o.id)
        };
      })
    };
    return item;
  });
  const res = filter(list, (o) => o?.children?.length) as never[];
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

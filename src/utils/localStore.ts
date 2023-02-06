import dayjs from 'dayjs';
import localForage from 'localforage';
import { get } from 'lodash';

class Localestore extends Object.getPrototypeOf(localForage).constructor {
  constructor() {
    super();
    this.state = {};
  }

  public async removeValue(key) {
    return localForage.removeItem(key);
  }

  public async setValue(key, value, callback?, expire?) {
    if (!expire) {
      return localForage.setItem(key, { value }, callback);
    }
    return localForage.setItem(
      key,
      {
        value,
        expire: {
          expire,
          createTime: dayjs().valueOf(),
          expiration: dayjs().add(expire, 'day').valueOf(),
        },
      },
      callback
    );
  }

  public async getValue(key, callback?) {
    const storeValue = await localForage.getItem(key, callback);
    console.log('storeValue:', storeValue);
    const expire = get(storeValue, 'expire');
    if (!expire) return get(storeValue, 'value');
    const expiration = get(expire, 'expiration');
    return {
      value: get(storeValue, 'value'),
      isExpiration: dayjs().isAfter(expiration),
    };
  }
}

export default new Localestore();

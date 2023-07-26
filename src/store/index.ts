import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';
import useAppStore from './modules/app';
import useUserStore from './modules/user';
import useTabBarStore from './modules/tab-bar';
import useCostManageStore from './modules/cost-managment';
import useProjectStore from './modules/project';
import useServiceStore from './modules/service';

const pinia = createPinia();
pinia.use(
  createPersistedState({
    storage: localStorage
  })
);

export {
  useAppStore,
  useUserStore,
  useProjectStore,
  useTabBarStore,
  useCostManageStore,
  useServiceStore
};
export default pinia;

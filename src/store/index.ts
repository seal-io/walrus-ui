import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';
import useAppStore from './modules/app';
import useUserStore from './modules/user';
import useTabBarStore from './modules/tab-bar';
import useIntegrationStore from './modules/integration';

const pinia = createPinia();
pinia.use(
  createPersistedState({
    storage: localStorage,
  })
);

export { useAppStore, useUserStore, useTabBarStore, useIntegrationStore };
export default pinia;

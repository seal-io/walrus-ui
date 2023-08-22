import { ref } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { useActiveTabsStore } from '@/store';

// currentPage Map
export { TabPage } from '@/views/config';

export default function useTabActive(
  currentPage: string,
  defaultActive: string
) {
  const pageTab = ref(currentPage);
  const activeTabsStore = useActiveTabsStore();
  const activeKey = ref<string>(
    activeTabsStore.getDefaultPageTabActive(pageTab.value, defaultActive)
  );

  const setPageTabActive = (val) => {
    activeKey.value = val;
    activeTabsStore.setPageTabActive(pageTab.value, activeKey.value);
  };
  onBeforeRouteLeave((to, from, next) => {
    const cachePages = from.meta.cachePages || [];
    if (!cachePages.includes(to.name as string)) {
      activeTabsStore.setPageTabActive(pageTab.value, '');
    }
    next();
  });
  return {
    activeKey,
    setPageTabActive
  };
}

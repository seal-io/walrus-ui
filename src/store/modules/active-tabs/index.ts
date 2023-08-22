import { defineStore } from 'pinia';

const useActiveTabsStore = defineStore('activeTabs', {
  persist: {
    key: 'activeTabs',
    storage: sessionStorage
  },
  state: () => ({
    pageTabActive: {}
  }),
  actions: {
    resetInfo() {
      this.$reset();
    },
    getPageTabActive(page: string) {
      return this.pageTabActive[page];
    },
    setPageTabActive(page: string, tab: string) {
      this.pageTabActive[page] = tab;
    },
    getDefaultPageTabActive(page: string, tab: string) {
      return this.pageTabActive[page] || tab;
    }
  }
});

export default useActiveTabsStore;

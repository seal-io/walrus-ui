import { defineStore } from 'pinia';

const useCostManageStore = defineStore('costManage', {
  persist: {
    key: 'costManage'
  },
  state: (): any => ({}),
  getters: {
    filterInfo(state: any): any {
      return { ...state };
    }
  },
  actions: {
    setFilterInfo(partial: any) {
      this.$patch(partial);
    }
  }
});

export default useCostManageStore;

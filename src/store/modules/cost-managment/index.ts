import { defineStore } from 'pinia';

const useCostManageStore = defineStore('costManage', {
  persist: {
    key: 'costManage'
  },
  state: (): any => ({
    perspectiveList: [],
    fieldNameList: []
  }),
  getters: {
    filterInfo(state: any): any {
      return { ...state };
    }
  },
  actions: {
    setFilterInfo(partial: any) {
      this.$patch(partial);
    },
    reset() {
      this.$reset();
    }
  }
});

export default useCostManageStore;

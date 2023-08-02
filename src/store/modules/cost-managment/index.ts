import { defineStore } from 'pinia';

const useCostManageStore = defineStore('costManage', {
  persist: {
    key: 'costManage'
  },
  state: (): any => ({
    perspectiveList: [],
    fieldNameList: [],
    defaultActivePerspective: {} // {hotProjectId: '', page: ''}
  }),
  getters: {
    filterInfo(state: any): any {
      return { ...state };
    }
  },
  actions: {
    setInfo(partial: any) {
      this.$patch(partial);
    },
    reset() {
      this.$reset();
    }
  }
});

export default useCostManageStore;

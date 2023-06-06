import { defineStore } from 'pinia';

const useProjectStore = defineStore('project', {
  persist: {
    key: 'project'
  },
  state: (): any => ({
    projectList: [],
    environmentList: [],
    serviceList: []
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

export default useProjectStore;

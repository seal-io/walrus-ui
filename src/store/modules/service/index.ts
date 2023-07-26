import { defineStore } from 'pinia';

const useServiceStore = defineStore('service', {
  persist: {
    key: 'service'
  },
  state: (): any => ({
    currentService: {}
  }),
  actions: {
    setInfo(partial: any) {
      this.$patch(partial);
    },
    resetInfo() {
      this.$reset();
    }
  }
});

export default useServiceStore;

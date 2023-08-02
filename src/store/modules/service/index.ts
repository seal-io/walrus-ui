import { defineStore } from 'pinia';
import _ from 'lodash';

const useServiceStore = defineStore('service', {
  persist: {
    key: 'service'
  },
  state: (): any => ({
    currentService: []
  }),
  actions: {
    getServiceInfo(serviceId) {
      if (serviceId) {
        return _.find(this.currentService, { id: serviceId }) || {};
      }
      return {};
    },
    setServiceInfo(serviceId, data) {
      if (serviceId) {
        const index = _.findIndex(this.currentService, { id: serviceId });
        if (index > -1) {
          this.currentService[index] = data;
        } else {
          this.currentService.push(data);
        }
      }
    },
    deleteService(serviceId) {
      if (serviceId) {
        const index = _.findIndex(this.currentService, { id: serviceId });
        if (index > -1) {
          this.currentService.splice(index, 1);
        }
      }
    },
    resetInfo() {
      this.$reset();
    }
  }
});

export default useServiceStore;

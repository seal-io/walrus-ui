import { defineStore } from 'pinia';
import { IntegrationState } from './types';

const useIntegrationStore = defineStore('integration', {
  persist: true,
  state: (): IntegrationState => ({
    clientIdInfo: {
      state: '',
      form: {
        clientId: '',
        clientSecret: '',
        provider: '',
        code: '',
        enable: false,
        managePrivateRepos: true,
        enablePullRequestCommenting: true,
        enableScheduleEvaluation: true,
      },
    },
  }),
  getters: {
    getIntegrationState(state: IntegrationState): IntegrationState {
      return { ...state };
    },
  },
  actions: {
    setIntegrationState(partial: Partial<IntegrationState>) {
      console.log('partial===', partial);
      this.clientIdInfo = Object.assign(
        this.clientIdInfo,
        partial.clientIdInfo
      );
      this.$patch(partial);
    },
  },
});

export default useIntegrationStore;

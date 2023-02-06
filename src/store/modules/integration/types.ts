export interface IntegrationState {
  clientIdInfo: {
    state: string | number;
    form: {
      clientId: string;
      clientSecret: string;
      code: string;
      provider: string;
      enable: boolean;
      managePrivateRepos: boolean;
      enablePullRequestCommenting: boolean;
      enableScheduleEvaluation: boolean;
    };
  };
}

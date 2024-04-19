export const FirstLoginGetPassword = {
  specified: 'login.config.defaultpswd',
  docker:
    'docker logs <id_of_walrus_container> 2>&1 | grep "Bootstrap Admin Password"',
  kubernetes:
    'kubectl -n <namespace_of_walrus_deploy> logs <name_of_walrus_pod> | grep "Bootstrap Admin Password"',
  // Process: 'search "Bootstrap Admin Password" from the logs of seal process',
  process: 'login.config.pswd.log',
  invalid: 'invalid'
};

export const FirstGetPasswordCommand = {
  Specified: 'specified',
  Docker: 'docker',
  Kubernetes: 'kubernetes',
  Process: 'process',
  Invalid: 'invalid'
};

export const externalProviders = [
  {
    value: 'Github',
    label: 'Github',
    icon: 'github'
  },
  {
    value: 'Gitlab',
    label: 'Gitlab',
    icon: 'gitlab'
  },
  {
    value: 'Google',
    label: 'Google',
    icon: 'google'
  },
  {
    value: 'Bitbucket',
    label: 'Bitbucket',
    icon: 'bitbucket'
  }
];

export const LoginTypeMap = {
  Internal: 'Internal',
  External: 'External'
};

export const ssoLoginButton = {
  google: '使用 Google 账号登录'
};

export const providerOrder = {
  GitHub: 1,
  Google: 2,
  Internal: 3
};
export default {};

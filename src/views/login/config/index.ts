export const FirstLoginGetPassword = {
  Specified: 'login.config.defaultpswd',
  Docker:
    'docker logs <id_of_walrus_container> 2>&1 | grep "Bootstrap Admin Password"',
  Kubernetes:
    'kubectl -n <namespace_of_walrus_deploy> logs <name_of_walrus_pod> | grep "Bootstrap Admin Password"',
  // Process: 'search "Bootstrap Admin Password" from the logs of seal process',
  Process: 'login.config.pswd.log',
  Invalid: 'Invalid'
};

export const FirstGetPasswordCommand = {
  Specified: 'Specified',
  Docker: 'Docker',
  Kubernetes: 'Kubernetes',
  Process: 'Process',
  Invalid: 'Invalid'
};

export default {};

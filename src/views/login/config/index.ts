export const GET_ADMIN_PASSWORD =
  'docker logs <id> 2>&1 | grep "Bootstrap Admin Password"';

export const FirstLoginGetPassword = {
  Specified: 'login.config.defaultpswd',
  Docker:
    'docker logs <id_of_seal_container> 2>&1 | grep "Bootstrap Admin Password"',
  Kubernetes:
    'kubectl -n <namespace_of_seal_deploy> logs <name_of_seal_pod> | grep "Bootstrap Admin Password"',
  // Process: 'search "Bootstrap Admin Password" from the logs of seal process',
  Process: 'login.config.pswd.log',
  Invalid: 'Invalid'
};

export default {
  GET_ADMIN_PASSWORD
};

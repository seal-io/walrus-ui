export const GET_ADMIN_PASSWORD =
  'docker logs <id> 2>&1 | grep "Bootstrap Admin Password"';

export default {
  GET_ADMIN_PASSWORD,
};

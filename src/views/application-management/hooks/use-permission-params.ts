import { useRoute } from 'vue-router';

export default function usePermissionParams() {
  const route = useRoute();
  const projectID = route.params.projectId as string;
  return {
    projectID
  };
}

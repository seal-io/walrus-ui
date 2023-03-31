import { ref } from 'vue';
import { useRoute } from 'vue-router';

export default function usePageAction() {
  const route = useRoute();
  const action = route.params.action as string;
  const pageAction = ref<string>(action || 'edit');
  const handleEdit = () => {
    pageAction.value = 'edit'; // edit, view
  };
  return {
    pageAction,
    handleEdit
  };
}

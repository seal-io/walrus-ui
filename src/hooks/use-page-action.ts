import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { PageAction } from '@/views/config';

export default function usePageAction() {
  const route = useRoute();
  const action = route.params.action as string;
  const pageAction = ref<string>(action || PageAction.EDIT);
  const handleEdit = () => {
    pageAction.value = PageAction.EDIT; // edit, view
  };
  return {
    pageAction,
    handleEdit
  };
}

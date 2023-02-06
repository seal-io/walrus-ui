import { cloneDeep } from 'lodash';
import { ref, defineEmits } from 'vue';
import { issuesItem, resetViolationIgnore } from '../api/report';

export default function useIgnoreModal(emits) {
  const showModal = ref(false);
  const modalData = ref(<issuesItem>{});
  const status = ref<'create' | 'update'>('create');
  const title = ref('');
  // const emits = defineEmits(['refresh', 'editIgnore', 'resetIgnore']);

  // create、edit ignore info.
  const handleEditIgnore = (data, { action, title: violationName }) => {
    modalData.value = cloneDeep(data);
    status.value = action;
    title.value = violationName;
    showModal.value = true;
  };
  // reset ingore
  const handResetIgnore = async (data) => {
    try {
      await resetViolationIgnore({ id: data.id });
      emits('refresh');
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditAction = (data, { action, title: violationName }) => {
    emits('editIgnore', data, { action, title: violationName });
  };
  const handleResetAction = (data) => {
    emits('resetIgnore', data);
  };
  const handleCreateJiraTicket = (data, { title: violationName }) => {
    emits('createJira', { ...data, title: violationName });
  };
  const handleSaved = () => {
    showModal.value = false;
    emits('refresh');
  };
  return {
    showModal,
    modalData,
    handleSaved,
    status,
    title,
    handleEditIgnore,
    handResetIgnore,
    handleEditAction,
    handleResetAction,
    handleCreateJiraTicket,
  };
}

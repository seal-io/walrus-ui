import { computed, ref } from 'vue';

export default function useRollbackRevision() {
  const showRollbackModal = ref(false);
  const rollbackType = ref('');
  const selectedVersion = ref('');

  const handleRollbackRevision = (type, serviceInfo?) => {
    showRollbackModal.value = true;
    rollbackType.value = type;
    selectedVersion.value = serviceInfo?.id || '';
  };
  const rollbackTitle = computed(() => {
    if (rollbackType.value === 'instance') {
      return 'applications.applications.history.rollbackinstance';
    }
    return 'applications.applications.history.rollbackapp';
  });
  return {
    showRollbackModal,
    rollbackTitle,
    selectedVersion,
    handleRollbackRevision
  };
}

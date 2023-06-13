import { computed, ref } from 'vue';

export default function useRollbackRevision() {
  const showRollbackModal = ref(false);
  const rollbackType = ref('');
  const selectedInstance = ref('');

  const handleRollbackRevision = (type, instanceInfo?) => {
    showRollbackModal.value = true;
    rollbackType.value = type;
    selectedInstance.value = instanceInfo?.id || '';
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
    selectedInstance,
    handleRollbackRevision
  };
}

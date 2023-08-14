import { computed, ref } from 'vue';

export default function useRollbackRevision() {
  const showRollbackModal = ref(false);
  const selectedVersion = ref('');

  const handleRollbackRevision = (serviceInfo?) => {
    showRollbackModal.value = true;
    selectedVersion.value = serviceInfo?.id || '';
  };
  const rollbackTitle = computed(() => {
    return 'applications.applications.history.rollbackapp';
  });
  return {
    showRollbackModal,
    rollbackTitle,
    selectedVersion,
    handleRollbackRevision
  };
}

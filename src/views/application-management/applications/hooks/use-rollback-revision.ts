import { computed, ref } from 'vue';

export default function useRollbackRevision() {
  const showRollbackModal = ref(false);
  const rollbackType = ref('');

  const handleRollbackRevision = (type) => {
    showRollbackModal.value = true;
    rollbackType.value = type;
  };
  const rollbackTitle = computed(() => {
    if (rollbackType.value === 'instance') {
      return '实例回滚';
    }
    return '应用回滚';
  });
  return {
    showRollbackModal,
    rollbackTitle,
    handleRollbackRevision
  };
}

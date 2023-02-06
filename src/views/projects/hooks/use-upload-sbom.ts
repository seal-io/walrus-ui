import { ref } from 'vue';

export function useUploadSbom() {
  const showSbomModal = ref(false);
  const handleShowUploadSbomModal = () => {
    showSbomModal.value = true;
  };
  return {
    handleShowUploadSbomModal,
    showSbomModal,
  };
}

export default {};

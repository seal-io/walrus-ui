import { defineEmits } from 'vue';

export default function useCloseModal() {
  const emits = defineEmits(['update:show']);
  const closeModal = () => {
    emits('update:show', false);
  };
  return {
    closeModal
  };
}

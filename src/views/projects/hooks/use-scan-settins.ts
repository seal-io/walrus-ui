import { ref } from 'vue';

export function useScanSettings() {
  const showSettingsModal = ref(false);
  const modalResourceId = ref('');
  const resourceKind = ref('');
  const resourceData = ref({});
  const handleShowSettingModal = (row) => {
    modalResourceId.value = row.id;
    showSettingsModal.value = true;
    resourceKind.value = row.kind;
    resourceData.value = row;
  };
  return {
    showSettingsModal,
    modalResourceId,
    resourceKind,
    resourceData,
    handleShowSettingModal,
  };
}

export default {};

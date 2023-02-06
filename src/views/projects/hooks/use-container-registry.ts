import { assignIn, each, keys } from 'lodash';
import { reactive, ref } from 'vue';
import { PopupItem } from '../config/interface';

export const useContainerRegistry = () => {
  const showContainerModal = ref(false);
  const provider = ref('');
  const registryId = ref<string>('');
  const imageData: any = reactive({});
  const handleAddContainerRegistry = (item: PopupItem) => {
    showContainerModal.value = true;
    provider.value = item.provider;
    registryId.value = item.containerRegistryID as string;
    assignIn(imageData, item);
  };
  const handleResetContainer = () => {
    showContainerModal.value = false;
    provider.value = '';
    registryId.value = '';
    each(keys(imageData), (k) => {
      imageData[k] = '';
    });
  };
  return {
    showContainerModal,
    handleAddContainerRegistry,
    provider,
    registryId,
    imageData,
    handleResetContainer,
  };
};

export default {};

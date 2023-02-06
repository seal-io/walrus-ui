import { ref } from 'vue';

export function useAddTags() {
  const showAddTagsModal = ref(false);
  const resourceId = ref('');
  const tagsList = ref<string[]>([]);
  const handleShowAddTag = (row) => {
    resourceId.value = row.id;
    tagsList.value = row.tags || [];
    showAddTagsModal.value = true;
  };

  return {
    handleShowAddTag,
    showAddTagsModal,
    resourceId,
    tagsList,
  };
}

export default {};

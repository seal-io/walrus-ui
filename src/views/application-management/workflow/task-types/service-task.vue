<template>
  <div>
    <CreateService ref="serviceRef" :flow="flow"></CreateService>
  </div>
</template>

<script lang="ts" setup>
  import CreateService from '@/views/application-management/services/components/create-service.vue';
  import { ref } from 'vue';

  defineProps({
    flow: {
      type: Object,
      default() {
        return {};
      }
    }
  });
  const serviceRef = ref();
  const save = async () => {
    const data = await serviceRef.value?.submit();
    return data;
  };
  const cancel = (callback) => {
    serviceRef.value?.cancel(callback);
  };

  defineExpose({
    save,
    cancel
  });
</script>

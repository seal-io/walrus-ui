<template>
  <div>
    <CreateService
      ref="serviceRef"
      :flow="flow"
      :resource-type="dataType"
      :action="action"
    ></CreateService>
  </div>
</template>

<script lang="ts" setup>
  import { PageAction } from '@/views/config';
  import CreateService from '@/views/application-management/services/components/create-service.vue';
  import { ref, computed } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';

  defineProps({
    flow: {
      type: Object,
      default() {
        return {};
      }
    },
    dataType: {
      type: String,
      default: ''
    },
    action: {
      type: String,
      default: ''
    }
  });
  const { route } = useCallCommon();
  const serviceRef = ref();
  const flowId = route.query.flowId || '';

  // const action = computed(() => {
  //   return flowId ? PageAction.EDIT : PageAction.CREATE;
  // });
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

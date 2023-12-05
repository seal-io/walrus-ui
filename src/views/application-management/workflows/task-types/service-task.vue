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
  import { ref, computed, PropType } from 'vue';
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
      type: String as PropType<'create' | 'edit' | 'view'>,
      default: PageAction.CREATE
    }
  });
  const { route } = useCallCommon();
  const serviceRef = ref();

  const save = async () => {
    const data = await serviceRef.value?.submit();
    return data;
  };
  const getData = () => {
    return serviceRef.value?.getData();
  };
  const cancel = (callback) => {
    serviceRef.value?.cancel(callback);
  };

  defineExpose({
    save,
    getData,
    cancel
  });
</script>

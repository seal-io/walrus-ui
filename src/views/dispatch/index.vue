<template>
  <div></div>
</template>

<script lang="ts" setup>
  import useEnterApplication from '@/views/hooks/use-enter-application';

  const { initDefaultProject, gotoEnvironmentDetail } = useEnterApplication();

  const init = async () => {
    await initDefaultProject();
    gotoEnvironmentDetail();
  };
  init();
</script>

<style></style>

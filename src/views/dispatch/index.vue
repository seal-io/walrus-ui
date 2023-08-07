<template>
  <div></div>
</template>

<script lang="ts" setup>
  import { DASHBOARD } from '@/router/config';
  import { onMounted } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';

  const { router } = useCallCommon();
  const redirectPage = () => {
    const { page, ...othersQuery } = router.currentRoute.value.query;
    router.replace({
      name: (page as string) || DASHBOARD.Main,
      query: {
        ...othersQuery
      }
    });
  };
  onMounted(() => {
    redirectPage();
  });
</script>

<style></style>

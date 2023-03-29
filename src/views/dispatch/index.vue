<template>
  <div></div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';

  const { router } = useCallCommon();
  const redirectPage = () => {
    const { page, ...othersQuery } = router.currentRoute.value.query;
    console.log({ page });
    router.replace({
      name: (page as string) || 'DashboardMain',
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

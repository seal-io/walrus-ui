<template>
  <div></div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';

  const { router } = useCallCommon();
  const redirectPage = () => {
    const { ...othersQuery } = router.currentRoute.value.query;
    const { to } = router.currentRoute.value.params;
    const toPage = to ? `Page${to}` : 'Page500';
    router.replace({
      name: toPage,
      query: {
        ...othersQuery
      }
    });
  };
  onMounted(() => {
    redirectPage();
  });
</script>

<script lang="ts">
  export default {
    name: 'Redirect'
  };
</script>

<style></style>

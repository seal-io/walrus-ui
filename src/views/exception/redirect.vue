<template>
  <div></div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';

  const { router } = useCallCommon();
  const redirectPage = () => {
    const query = router.currentRoute.value;
    const { code, ...othersQuery } = router.currentRoute.value.params;
    const toPage = code ? `Page${code}` : 'Page500';
    router.replace({
      name: toPage,
      query: {
        ...othersQuery,
        back: 'Login'
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

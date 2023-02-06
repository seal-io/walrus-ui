<template>
  <div>oauth</div>
</template>

<script lang="ts" setup>
  import qs from 'query-string';
  import { onMounted } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const getOauthCode = () => {
    // const params = qs.parseUrl(window.location.href);
    const query = route.query || {};
    if (query?.code) {
      localStorage.setItem('code', qs.stringify(query));
    } else {
      localStorage.setItem('code', '');
    }
    window.close();
  };
  onMounted(() => {
    getOauthCode();
  });
</script>

<style></style>

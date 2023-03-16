<template>
  <router-view v-if="isReload"></router-view>
</template>

<script lang="ts" setup>
  import { provide, ref, nextTick } from 'vue';

  const isReload = ref(true);
  const execReload = () => {
    isReload.value = false;
    nextTick(() => {
      isReload.value = true;
    });
  };
  provide('execReload', execReload);
</script>

<style></style>

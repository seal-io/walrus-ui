<template>
  <router-view>
    <template #default>
      <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in">
          <keep-alive :include="cacheList">
            <component :is="Component" :key="route.fullPath" />
          </keep-alive>
        </transition>
      </router-view>
    </template>
  </router-view>
</template>

<script lang="ts" setup>
  import { computed, watch } from 'vue';
  import { useTabBarStore } from '@/store';

  const tabBarStore = useTabBarStore();

  const cacheList = computed(() => {
    return tabBarStore.getCacheList;
  });
</script>

<style lang="less">
  .fade-enter-active {
    transition: opacity 0.3s ease;
  }

  .fade-leave-active {
    transition: opacity ease;
  }

  .fade-enter {
    opacity: 0;
  }

  .fade-leave-to {
    opacity: 0;
  }
</style>

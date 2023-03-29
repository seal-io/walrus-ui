<template>
  <router-view>
    <template #default>
      <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in" appear>
          <!-- <component
            :is="Component"
            v-if="route.meta.ignoreCache"
            :key="route.fullPath"
          /> -->
          <keep-alive :include="cacheList">
            <component :is="Component" :key="route.fullPath" />
          </keep-alive>
        </transition>
      </router-view>
    </template>
  </router-view>
  <!-- <router-view v-slot="{ Component, route }">
    <transition name="fade" mode="out-in" appear>
      <component :is="Component" :key="route.path"></component>
    </transition>
  </router-view> -->
</template>

<script lang="ts" setup>
  import { computed, watch } from 'vue';
  import { useTabBarStore } from '@/store';

  const tabBarStore = useTabBarStore();

  const cacheList = computed(() => {
    return tabBarStore.getCacheList;
  });
  watch(
    () => cacheList.value,
    () => {
      console.log('cacheList===', cacheList.value);
    }
  );
</script>

<style scoped lang="less"></style>

import type { RouteLocationNormalized } from 'vue-router';
import { defineStore } from 'pinia';
import { TabBarState, TagProps } from './types';

const formatTag = (route: RouteLocationNormalized): TagProps => {
  const { name, meta, fullPath, query } = route;
  return {
    title: meta.locale || '',
    name: String(name),
    fullPath,
    query
  };
};

const useTabBarStore = defineStore('tabBar', {
  state: (): TabBarState => ({
    cacheTabList: new Set(),
    tagList: []
  }),

  getters: {
    getTabList(): TagProps[] {
      return this.tagList;
    },
    getCacheList(): string[] {
      return Array.from(this.cacheTabList);
    }
  },

  actions: {
    resetInfo() {
      this.$reset();
    },
    updateTabList(route: RouteLocationNormalized) {
      this.cacheTabList.add?.(route.name as string);
    },
    deleteTag(idx: number, tag: TagProps) {
      this.cacheTabList.delete?.(tag.name);
    },
    clearTags() {
      this.cacheTabList.clear?.();
    }
  }
});

export default useTabBarStore;

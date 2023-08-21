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
    tagList: [],
    tabPage: {
      ProjectTab: 'ProjectTab',
      EnvironmentTab: 'EnvironmentTab',
      CostTab: 'CostTab',
      OperatorHubTab: 'OperatorHubTab',
      SettingsTab: 'SettingsTab'
    },
    pageTabActive: {}
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
    getPageTabActive(page: string) {
      return this.pageTabActive[page];
    },
    setPageTabActive(page: string, tab: string) {
      this.pageTabActive[page] = tab;
    },
    getDefaultPageTabActive(page: string, tab: string) {
      return this.pageTabActive[page] || tab;
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

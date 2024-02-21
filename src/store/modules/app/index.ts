import { defineStore } from 'pinia';
import defaultSettings from '@/config/settings.json';
import { AppState } from './types';

const useAppStore = defineStore('app', {
  persist: true,
  state: (): AppState => ({ ...defaultSettings }),

  getters: {
    appCurrentSetting(state: AppState): AppState {
      return { ...state };
    },
    appDevice(state: AppState) {
      return state.device;
    }
  },

  actions: {
    // Update app settings
    updateSettings(partial: Partial<AppState>) {
      // @ts-ignore-next-line
      this.$patch(partial);
    },

    // Change theme color
    toggleTheme(dark: boolean) {
      if (dark) {
        this.theme = 'dark';
        document.documentElement.setAttribute('arco-theme', 'dark');
        document.body.setAttribute('arco-theme', 'dark');
      } else {
        this.theme = 'light';
        document.documentElement.removeAttribute('arco-theme');
        document.body.removeAttribute('arco-theme');
      }
    },
    toggleDevice(device: string) {
      this.device = device;
    },
    toggleMenu(value: boolean) {
      this.hideMenu = value;
    },
    resetInfo() {
      this.$reset();
    }
  }
});

export default useAppStore;

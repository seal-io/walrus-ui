import { App } from 'vue';
import permission from './permission';
import project from './project';

export default {
  install(Vue: App) {
    Vue.directive('permission', permission);
    Vue.directive('permissionProject', project);
  }
};

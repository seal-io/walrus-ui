import { App } from 'vue';

const components = import.meta.globEager('./components/*.vue');
export default {
  install(Vue: App) {
    Object.keys(components).forEach((key) => {
      const component = components[key].default;
      Vue.component(component.name, component);
    });
  }
};

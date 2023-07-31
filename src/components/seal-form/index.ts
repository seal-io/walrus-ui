import { App } from 'vue';

const components: Record<string, any> = import.meta.glob('./components/*.vue', {
  eager: true
});

export default {
  install(Vue: App) {
    Object.keys(components).forEach((key) => {
      const component = components[key].default;
      Vue.component(component.name, component);
    });
  }
};

const components: Record<string, any> = import.meta.glob('./*/index.vue', {
  eager: true
});
const map = {};

export const widgetTypeMap = {
  TextArea: 'input'
};

Object.keys(components).forEach((key) => {
  const component = components[key].default;
  const widgets = component.widgets || [];
  widgets.forEach((widget) => {
    map[widget] = component;
    widgetTypeMap[widget] = component.widgetType;
  });
});

export default map;

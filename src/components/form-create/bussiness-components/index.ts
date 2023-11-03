const components: Record<string, any> = import.meta.glob('./*.vue', {
  eager: true
});
const map = {};
Object.keys(components).forEach((key) => {
  const component = components[key].default;
  const widgets = component.widgets || [];
  widgets.forEach((widget) => {
    map[widget] = component;
  });
});

export default map;

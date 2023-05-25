import { DirectiveBinding } from 'vue';
import { useUserStore } from '@/store';
import _ from 'lodash';

function checkPermission(el: HTMLElement, binding: DirectiveBinding) {
  // {resource: '*', actions: []}
  const { value } = binding;
  const userStore = useUserStore();
  const { permissions } = userStore;
  const { resource, actions = [] } = value;

  if (resource) {
    if (!actions.includes('*')) {
      const permissionActions = _.get(permissions, resource) || [];
      const hasPermission = _.every(actions, (ac) =>
        _.includes(permissionActions, ac)
      );
      if (!hasPermission && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }
  } else {
    throw new Error(
      `need path! Like v-permission="{resource: 'applications', actions: ['GET']}"`
    );
  }
}

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  }
};

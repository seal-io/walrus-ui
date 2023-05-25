import { DirectiveBinding } from 'vue';
import { useUserStore } from '@/store';
import _ from 'lodash';

function checkPermission(el: HTMLElement, binding: DirectiveBinding) {
  // {resource: '*', actions: []}
  const { value } = binding;
  const userStore = useUserStore();
  const { isSystemAdmin, hasActionsPermission, getProjectUserActions } =
    userStore;
  const { projectID, resource, actions = [] } = value;

  if (projectID) {
    const hasPermission =
      isSystemAdmin() ||
      hasActionsPermission({
        resource: getProjectUserActions(projectID, resource),
        actions
      });
    if (!hasPermission && el.parentNode) {
      el.parentNode.removeChild(el);
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

export default {
  path: 'policy',
  name: 'policy',
  component: () => import('@/views/policy/index.vue'),
  meta: {
    ignoreCache: true,
    locale: 'navbar.policy',
    requiresAuth: true,
    icon: 'icon-apps',
    roles: ['*'],
    order: 3,
  },
  children: [
    // 菜单树形状
    // {
    //   path: 'source-repo',
    //   name: 'policySourceRepo',
    //   component: () => import('@/views/policy/pages/source-index.vue'),
    //   meta: {
    //     ignoreCache: true,
    //     locale: 'policy.menu.sourceRepo',
    //     requiresAuth: true,
    //     roles: ['*'],
    //     order: 31,
    //   },
    //   children: [
    //   ],
    // },
    {
      path: 'basic-config',
      name: 'policyBasicConfig',
      component: () => import('@/views/policy/pages/basic-config.vue'),
      meta: {
        ignoreCache: true,
        locale: 'policy.sourceRepo.basicConfig',
        requiresAuth: true,
        icon: 'icon-apps',
      },
    },
    // {
    //   path: 'flow-control',
    //   name: 'flowControl',
    //   component: () => import('@/views/policy/pages/flow-control.vue'),
    //   meta: {
    //     ignoreCache: true,
    //     locale: 'policy.sourceRepo.flowControl',
    //     requiresAuth: true,
    //     icon: 'icon-apps',
    //   },
    // },
    {
      path: 'code-check',
      name: 'codeCheck',
      component: () => import('@/views/policy/pages/code-check.vue'),
      meta: {
        ignoreCache: true,
        locale: 'policy.sourceRepo.codeCheck',
        requiresAuth: true,
        icon: 'icon-apps',
      },
    },
    {
      path: 'analysis',
      name: 'compositionAnalysis',
      component: () => import('@/views/policy/pages/composition-analysis.vue'),
      meta: {
        ignoreCache: true,
        locale: 'policy.menu.analysis',
        requiresAuth: true,
        icon: 'icon-apps',
      },
    },
    {
      path: 'white-list',
      name: 'policyWhiteList',
      component: () => import('@/views/policy/pages/white-list.vue'),
      meta: {
        ignoreCache: true,
        locale: 'policy.menu.whiteList',
        requiresAuth: true,
        icon: 'icon-apps',
      },
    },
    // {
    //   path: 'proxy-repo',
    //   name: 'proxyRepo',
    //   component: () => import('@/views/policy/pages/proxy-index.vue'),
    //   meta: {
    //     ignoreCache: true,
    //     locale: 'policy.menu.proxyRepo',
    //     requiresAuth: true,
    //     icon: '',
    //     order: 32,
    //   },
    // },
    {
      path: 'edit/:category',
      name: 'policyEdit',
      component: () => import('@/views/policy/pages/policy-edit.vue'),
      meta: {
        ignoreCache: true,
        hideInMenu: true,
        locale: '',
        requiresAuth: true,
        icon: '',
        order: '',
      },
    },
  ],
};

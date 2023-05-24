export default {
  id: '461864044484112995',
  domain: 'builtin',
  groups: [],
  name: 'lucy',
  roles: [
    {
      id: 'system/user',
      policies: [
        {
          actions: ['*'],
          resources: ['projects', 'tokens']
        },
        {
          actions: ['GET', 'POST'],
          paths: ['/account/info']
        },
        {
          actions: ['GET', 'POST'],
          resources: ['costs', 'dashboards']
        },
        {
          actions: ['GET'],
          resources: [
            'connectors',
            'environments',
            'moduleCompletions',
            'moduleVersions',
            'modules',
            'perspectives',
            'roles',
            'secrets',
            'settings'
          ]
        },
        {
          actions: ['POST'],
          paths: ['/account/logout']
        }
      ]
    }
  ],
  projectRoles: [
    {
      project: {
        id: '461748971405062755',
        name: 'test'
      },
      roles: [
        {
          id: 'project/owner',
          policies: [
            {
              actions: ['*'],
              resources: [
                'applicationInstances',
                'applicationResources',
                'applicationRevisions',
                'applications',
                'projects',
                'secrets',
                'subjectRoles'
              ]
            },
            {
              actions: ['GET'],
              resources: ['subjects']
            }
          ]
        }
      ]
    }
  ]
};

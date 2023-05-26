export default {
  nodes: [
    {
      id: 'module/mysql',
      name: 'db',
      type: 'module',
      operations: null,
      data: {
        name: 'db',
        createTime: '2023-05-26T04:55:48.707017Z',
        updateTime: '2023-05-26T04:55:48.707018Z',
        version: '0.0.2',
        attributes: {
          database: 'mysql',
          init_db_script: '',
          namespace: '',
          password: '',
          username: 'mysql'
        },
        application: { id: '462291738736734843' },
        module: { id: 'mysql' }
      }
    },
    {
      id: 'module/webservice',
      name: 'web',
      type: 'module',
      operations: null,
      data: {
        name: 'web',
        createTime: '2023-05-26T04:55:48.707021Z',
        updateTime: '2023-05-26T04:55:48.707021Z',
        version: '0.0.3',
        attributes: {
          env: { test: '{module.db.db_host}' },
          image: 'nginx',
          limit_cpu: '',
          limit_memory: '',
          name: '',
          namespace: '',
          ports: [80],
          request_cpu: '0.1',
          request_memory: '128Mi'
        },
        application: { id: '462291738736734843' },
        module: { id: 'webservice' }
      }
    },
    {
      id: 'resource/462295217996051067',
      name: 'default-test-dev/db-mysql',
      type: 'resource',
      operations: null,
      data: {
        id: '462295217996051067',
        projectID: '462291556653609595',
        createTime: '2023-05-26T05:30:22.502037Z',
        updateTime: '2023-05-26T05:30:23.038902Z',
        module: 'db',
        mode: 'managed',
        type: 'helm_release',
        name: 'default-test-dev/db-mysql',
        deployerType: 'Terraform',
        status: { summaryStatus: 'Deployed' },
        instance: { id: '462295098944664187', status: {} },
        connector: {
          id: '462291655253308027',
          name: 'test',
          status: {},
          type: 'Kubernetes',
          configVersion: 'v1',
          configData: { kubeconfig: { type: 'string', visible: false } },
          category: 'Kubernetes'
        },
        keys: {
          labels: ['Pod', 'Container'],
          keys: [
            {
              keys: [
                {
                  name: 'mysql',
                  value: 'default-test-dev/db-mysql-0/run/mysql',
                  loggable: true,
                  executable: true
                }
              ],
              name: 'db-mysql-0'
            }
          ]
        }
      }
    },
    {
      id: 'resource/462295217995919995',
      name: 'default-test-dev/web',
      type: 'resource',
      operations: null,
      data: {
        id: '462295217995919995',
        projectID: '462291556653609595',
        createTime: '2023-05-26T05:30:22.502031Z',
        updateTime: '2023-05-26T05:30:23.234289Z',
        module: 'web',
        mode: 'managed',
        type: 'kubernetes_service',
        name: 'default-test-dev/web',
        deployerType: 'Terraform',
        status: {
          summaryStatus: 'Ready',
          resourceEndpoints: [
            { endpointType: 'NodePort', endpoints: ['172.20.0.2:30011'] }
          ]
        },
        instance: { id: '462295098944664187', status: {} },
        connector: {
          id: '462291655253308027',
          name: 'test',
          status: {},
          type: 'Kubernetes',
          configVersion: 'v1',
          configData: { kubeconfig: { type: 'string', visible: false } },
          category: 'Kubernetes'
        },
        keys: { labels: ['Pod', 'Container'] }
      }
    },
    {
      id: 'resource/462295217995854459',
      name: 'default-test-dev/web',
      type: 'resource',
      operations: null,
      data: {
        id: '462295217995854459',
        projectID: '462291556653609595',
        createTime: '2023-05-26T05:30:22.502028Z',
        updateTime: '2023-05-26T05:31:00.931654Z',
        module: 'web',
        mode: 'managed',
        type: 'kubernetes_deployment',
        name: 'default-test-dev/web',
        deployerType: 'Terraform',
        status: {
          summaryStatus: 'Available',
          summaryStatusMessage: 'Deployment has minimum availability.',
          conditions: [
            {
              type: 'Available',
              status: 'True',
              lastUpdateTime: '2023-05-26T05:30:02Z',
              message: 'Deployment has minimum availability.',
              reason: 'MinimumReplicasAvailable'
            },
            {
              type: 'Progressing',
              status: 'True',
              lastUpdateTime: '2023-05-26T05:30:00Z',
              message:
                'ReplicaSet "web-5755c7bfc5" has successfully progressed.',
              reason: 'NewReplicaSetAvailable'
            }
          ]
        },
        instance: { id: '462295098944664187', status: {} },
        connector: {
          id: '462291655253308027',
          name: 'test',
          status: {},
          type: 'Kubernetes',
          configVersion: 'v1',
          configData: { kubeconfig: { type: 'string', visible: false } },
          category: 'Kubernetes'
        },
        keys: {
          labels: ['Pod', 'Container'],
          keys: [
            {
              keys: [
                {
                  name: 'web',
                  value: 'default-test-dev/web-5755c7bfc5-ctndd/run/web',
                  loggable: true,
                  executable: true
                }
              ],
              name: 'web-5755c7bfc5-ctndd'
            }
          ]
        }
      }
    },
    {
      id: 'resource/462295282067976827',
      name: 'default-test-dev/web-5755c7bfc5-ctndd',
      type: 'resource',
      operations: null,
      data: {
        id: '462295282067976827',
        projectID: '462291556653609595',
        createTime: '2023-05-26T05:31:00.693865Z',
        updateTime: '2023-05-26T05:32:00.23002Z',
        module: 'web',
        mode: 'discovered',
        type: 'kubernetes_pod_v1',
        name: 'default-test-dev/web-5755c7bfc5-ctndd',
        deployerType: 'Terraform',
        status: {
          summaryStatus: 'Ready',
          conditions: [
            {
              type: 'ContainersReady',
              status: 'True',
              lastUpdateTime: '2023-05-26T05:30:02Z',
              reason: ''
            },
            {
              type: 'Initialized',
              status: 'True',
              lastUpdateTime: '2023-05-26T05:30:00Z',
              reason: ''
            },
            {
              type: 'PodScheduled',
              status: 'True',
              lastUpdateTime: '2023-05-26T05:30:00Z',
              reason: ''
            },
            {
              type: 'Ready',
              status: 'True',
              lastUpdateTime: '2023-05-26T05:30:02Z',
              reason: ''
            }
          ]
        },
        instance: { id: '462295098944664187', status: {} },
        connector: {
          id: '462291655253308027',
          name: 'test',
          status: {},
          type: 'Kubernetes',
          configVersion: 'v1',
          configData: { kubeconfig: { type: 'string', visible: false } },
          category: 'Kubernetes'
        },
        composition: { id: '462295217995854459', status: {} },
        keys: {
          labels: ['Pod', 'Container'],
          keys: [
            {
              keys: [
                {
                  name: 'web',
                  value: 'default-test-dev/web-5755c7bfc5-ctndd/run/web',
                  loggable: true,
                  executable: true
                }
              ],
              name: 'web-5755c7bfc5-ctndd'
            }
          ]
        }
      }
    },
    {
      id: 'resource/462295281833095803',
      name: 'default-test-dev/db-mysql-0',
      type: 'resource',
      operations: null,
      data: {
        id: '462295281833095803',
        projectID: '462291556653609595',
        createTime: '2023-05-26T05:31:00.555362Z',
        updateTime: '2023-05-26T05:32:00.407753Z',
        module: 'db',
        mode: 'discovered',
        type: 'kubernetes_pod_v1',
        name: 'default-test-dev/db-mysql-0',
        deployerType: 'Terraform',
        status: {
          summaryStatus: 'Ready',
          conditions: [
            {
              type: 'ContainersReady',
              status: 'True',
              lastUpdateTime: '2023-05-26T05:30:35Z',
              reason: ''
            },
            {
              type: 'Initialized',
              status: 'True',
              lastUpdateTime: '2023-05-26T05:30:04Z',
              reason: ''
            },
            {
              type: 'PodScheduled',
              status: 'True',
              lastUpdateTime: '2023-05-26T05:30:04Z',
              reason: ''
            },
            {
              type: 'Ready',
              status: 'True',
              lastUpdateTime: '2023-05-26T05:30:35Z',
              reason: ''
            }
          ]
        },
        instance: { id: '462295098944664187', status: {} },
        connector: {
          id: '462291655253308027',
          name: 'test',
          status: {},
          type: 'Kubernetes',
          configVersion: 'v1',
          configData: { kubeconfig: { type: 'string', visible: false } },
          category: 'Kubernetes'
        },
        composition: { id: '462295217996051067', status: {} },
        keys: {
          labels: ['Pod', 'Container'],
          keys: [
            {
              keys: [
                {
                  name: 'mysql',
                  value: 'default-test-dev/db-mysql-0/run/mysql',
                  loggable: true,
                  executable: true
                }
              ],
              name: 'db-mysql-0'
            }
          ]
        }
      }
    },
    {
      id: 'module/462295098944664187',
      name: 'dev',
      type: 'instance',
      operations: null,
      data: {
        id: '462295098944664187',
        projectID: '462291556653609595',
        createTime: '2023-05-26T05:29:11.547424Z',
        updateTime: '2023-05-26T07:22:01.128236Z',
        name: 'dev',
        status: {
          summaryStatus: 'Ready',
          conditions: [
            {
              type: 'Deployed',
              status: 'True',
              lastUpdateTime: '2023-05-26T05:30:29.202269Z',
              reason: ''
            },
            {
              type: 'Ready',
              status: 'True',
              lastUpdateTime: '2023-05-26T05:31:00.946991Z',
              reason: ''
            }
          ]
        },
        application: { id: '462291738736734843' },
        environment: { id: '462291556653609595' }
      }
    }
  ],
  links: [
    { type: 'dependency', source: 'module/db', target: 'instance/web' },
    {
      type: 'contain',
      source: 'module/mysql',
      target: 'resource/462295217996051067'
    },
    {
      type: 'contain',
      source: 'instance/462295098944664187',
      target: 'resource/462295217996051067'
    },
    {
      type: 'contain',
      source: 'module/webservice',
      target: 'resource/462295217995919995'
    },
    {
      type: 'contain',
      source: 'instance/462295098944664187',
      target: 'resource/462295217995919995'
    },
    {
      type: 'contain',
      source: 'module/webservice',
      target: 'resource/462295217995854459'
    },
    {
      type: 'contain',
      source: 'instance/462295098944664187',
      target: 'resource/462295217995854459'
    },
    {
      type: 'parent',
      source: 'resource/462295217995854459',
      target: 'resource/462295282067976827'
    },
    {
      type: 'parent',
      source: 'resource/462295217996051067',
      target: 'resource/462295281833095803'
    }
  ]
};

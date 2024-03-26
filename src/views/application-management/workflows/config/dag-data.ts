export default {
  metadata: {
    name: 'dag-zn8t7',
    generateName: 'dag-',
    namespace: 'argo',
    uid: '4e172538-93c6-48b6-91de-b1877a8f180c',
    resourceVersion: '30043',
    generation: 5,
    creationTimestamp: '2024-03-25T10:53:26Z',
    labels: {
      'workflows.argoproj.io/completed': 'false',
      'workflows.argoproj.io/creator': 'system-serviceaccount-argo-argo-server',
      'workflows.argoproj.io/phase': 'Running'
    },
    annotations: {
      'workflows.argoproj.io/pod-name-format': 'v2'
    },
    managedFields: [
      {
        manager: 'argo',
        operation: 'Update',
        apiVersion: 'argoproj.io/v1alpha1',
        time: '2024-03-25T10:53:26Z',
        fieldsType: 'FieldsV1',
        fieldsV1: {
          'f:metadata': {
            'f:generateName': {},
            'f:labels': {
              '.': {},
              'f:workflows.argoproj.io/creator': {}
            }
          },
          'f:spec': {}
        }
      },
      {
        manager: 'workflow-controller',
        operation: 'Update',
        apiVersion: 'argoproj.io/v1alpha1',
        time: '2024-03-25T10:53:56Z',
        fieldsType: 'FieldsV1',
        fieldsV1: {
          'f:metadata': {
            'f:annotations': {
              '.': {},
              'f:workflows.argoproj.io/pod-name-format': {}
            },
            'f:labels': {
              'f:workflows.argoproj.io/completed': {},
              'f:workflows.argoproj.io/phase': {}
            }
          },
          'f:status': {}
        }
      }
    ]
  },
  spec: {
    templates: [
      {
        name: 'main',
        inputs: {},
        outputs: {},
        metadata: {},
        steps: [
          [
            {
              name: 'stage-1',
              template: 'stage-1',
              arguments: {}
            }
          ],
          [
            {
              name: 'stage-2',
              template: 'stage-2',
              arguments: {}
            }
          ]
        ]
      },
      {
        name: 'echo',
        inputs: {
          parameters: [
            {
              name: 'message'
            }
          ]
        },
        outputs: {},
        metadata: {},
        container: {
          name: '',
          image: 'alpine:3.7',
          command: ['echo', '{{inputs.parameters.message}}'],
          resources: {}
        }
      },
      {
        name: 'approval',
        inputs: {},
        outputs: {},
        metadata: {},
        suspend: {}
      },
      {
        name: 'stage-1',
        inputs: {},
        outputs: {},
        metadata: {},
        dag: {
          tasks: [
            {
              name: 'A',
              template: 'echo',
              arguments: {
                parameters: [
                  {
                    name: 'message',
                    value: 'A'
                  }
                ]
              }
            },
            {
              name: 'B',
              template: 'echo',
              arguments: {
                parameters: [
                  {
                    name: 'message',
                    value: 'B'
                  }
                ]
              },
              depends: 'A.Succeeded'
            },
            {
              name: 'C',
              template: 'echo',
              arguments: {
                parameters: [
                  {
                    name: 'message',
                    value: 'C'
                  }
                ]
              },
              when: '{{tasks.A.outputs.result}} == A',
              depends: 'A'
            },
            {
              name: 'D',
              template: 'echo',
              arguments: {
                parameters: [
                  {
                    name: 'message',
                    value: 'D'
                  }
                ]
              },
              depends: 'A.Failed'
            },
            {
              name: 'E',
              template: 'echo',
              arguments: {
                parameters: [
                  {
                    name: 'message',
                    value: 'E'
                  }
                ]
              },
              depends: 'B'
            },
            {
              name: 'F',
              template: 'echo',
              arguments: {
                parameters: [
                  {
                    name: 'message',
                    value: 'F'
                  }
                ]
              },
              depends: 'B'
            }
          ]
        }
      },
      {
        name: 'stage-2',
        inputs: {},
        outputs: {},
        metadata: {},
        dag: {
          tasks: [
            {
              name: 'approval',
              template: 'approval',
              arguments: {}
            },
            {
              name: 'G',
              template: 'echo',
              arguments: {
                parameters: [
                  {
                    name: 'message',
                    value: 'G'
                  }
                ]
              },
              depends: 'approval'
            },
            {
              name: 'H',
              template: 'echo',
              arguments: {
                parameters: [
                  {
                    name: 'message',
                    value: 'H'
                  }
                ]
              },
              depends: 'approval'
            },
            {
              name: 'I',
              template: 'echo',
              arguments: {
                parameters: [
                  {
                    name: 'message',
                    value: 'I'
                  }
                ]
              },
              depends: 'G \u0026\u0026 H'
            },
            {
              name: 'J',
              template: 'echo',
              arguments: {
                parameters: [
                  {
                    name: 'message',
                    value: 'J'
                  }
                ]
              },
              depends: 'I'
            }
          ]
        }
      }
    ],
    entrypoint: 'main',
    arguments: {}
  },
  status: {
    phase: 'Running',
    startedAt: '2024-03-25T10:53:26Z',
    finishedAt: null,
    progress: '5/6',
    nodes: {
      'dag-zn8t7': {
        id: 'dag-zn8t7',
        name: 'dag-zn8t7',
        displayName: 'dag-zn8t7',
        type: 'Steps',
        templateName: 'main',
        templateScope: 'local/dag-zn8t7',
        phase: 'Running',
        startedAt: '2024-03-25T10:53:26Z',
        finishedAt: null,
        progress: '5/6',
        children: ['dag-zn8t7-1901043263']
      },
      'dag-zn8t7-1042858272': {
        id: 'dag-zn8t7-1042858272',
        name: 'dag-zn8t7[0].stage-1.A',
        displayName: 'A',
        type: 'Pod',
        templateName: 'echo',
        templateScope: 'local/dag-zn8t7',
        phase: 'Succeeded',
        boundaryID: 'dag-zn8t7-3269620181',
        startedAt: '2024-03-25T10:53:26Z',
        finishedAt: '2024-03-25T10:53:30Z',
        progress: '1/1',
        resourcesDuration: {
          cpu: 0,
          memory: 2
        },
        inputs: {
          parameters: [
            {
              name: 'message',
              value: 'A'
            }
          ]
        },
        outputs: {
          artifacts: [
            {
              name: 'main-logs',
              s3: {
                key: 'dag-zn8t7/dag-zn8t7-echo-1042858272/main.log'
              }
            }
          ],
          result: 'A',
          exitCode: '0'
        },
        children: [
          'dag-zn8t7-1076413510',
          'dag-zn8t7-1126746367',
          'dag-zn8t7-1093191129'
        ],
        hostNodeName: 'minikube'
      },
      'dag-zn8t7-1076413510': {
        id: 'dag-zn8t7-1076413510',
        name: 'dag-zn8t7[0].stage-1.C',
        displayName: 'C',
        type: 'Pod',
        templateName: 'echo',
        templateScope: 'local/dag-zn8t7',
        phase: 'Succeeded',
        boundaryID: 'dag-zn8t7-3269620181',
        startedAt: '2024-03-25T10:53:36Z',
        finishedAt: '2024-03-25T10:53:41Z',
        progress: '1/1',
        resourcesDuration: {
          cpu: 0,
          memory: 2
        },
        inputs: {
          parameters: [
            {
              name: 'message',
              value: 'C'
            }
          ]
        },
        outputs: {
          artifacts: [
            {
              name: 'main-logs',
              s3: {
                key: 'dag-zn8t7/dag-zn8t7-echo-1076413510/main.log'
              }
            }
          ],
          exitCode: '0'
        },
        children: ['dag-zn8t7-894636386'],
        hostNodeName: 'minikube'
      },
      'dag-zn8t7-1093191129': {
        id: 'dag-zn8t7-1093191129',
        name: 'dag-zn8t7[0].stage-1.B',
        displayName: 'B',
        type: 'Pod',
        templateName: 'echo',
        templateScope: 'local/dag-zn8t7',
        phase: 'Succeeded',
        boundaryID: 'dag-zn8t7-3269620181',
        startedAt: '2024-03-25T10:53:36Z',
        finishedAt: '2024-03-25T10:53:41Z',
        progress: '1/1',
        resourcesDuration: {
          cpu: 0,
          memory: 2
        },
        inputs: {
          parameters: [
            {
              name: 'message',
              value: 'B'
            }
          ]
        },
        outputs: {
          artifacts: [
            {
              name: 'main-logs',
              s3: {
                key: 'dag-zn8t7/dag-zn8t7-echo-1093191129/main.log'
              }
            }
          ],
          exitCode: '0'
        },
        children: ['dag-zn8t7-1109968748', 'dag-zn8t7-1160301605'],
        hostNodeName: 'minikube'
      },
      'dag-zn8t7-1109968748': {
        id: 'dag-zn8t7-1109968748',
        name: 'dag-zn8t7[0].stage-1.E',
        displayName: 'E',
        type: 'Pod',
        templateName: 'echo',
        templateScope: 'local/dag-zn8t7',
        phase: 'Succeeded',
        boundaryID: 'dag-zn8t7-3269620181',
        startedAt: '2024-03-25T10:53:46Z',
        finishedAt: '2024-03-25T10:53:51Z',
        progress: '1/1',
        resourcesDuration: {
          cpu: 0,
          memory: 2
        },
        inputs: {
          parameters: [
            {
              name: 'message',
              value: 'E'
            }
          ]
        },
        outputs: {
          artifacts: [
            {
              name: 'main-logs',
              s3: {
                key: 'dag-zn8t7/dag-zn8t7-echo-1109968748/main.log'
              }
            }
          ],
          exitCode: '0'
        },
        children: ['dag-zn8t7-894636386'],
        hostNodeName: 'minikube'
      },
      'dag-zn8t7-1126746367': {
        id: 'dag-zn8t7-1126746367',
        name: 'dag-zn8t7[0].stage-1.D',
        displayName: 'D',
        type: 'Skipped',
        templateName: 'echo',
        templateScope: 'local/dag-zn8t7',
        phase: 'Omitted',
        boundaryID: 'dag-zn8t7-3269620181',
        message: 'omitted: depends condition not met',
        startedAt: '2024-03-25T10:53:36Z',
        finishedAt: '2024-03-25T10:53:36Z',
        progress: '0/1',
        nodeFlag: {},
        children: ['dag-zn8t7-894636386']
      },
      'dag-zn8t7-1160301605': {
        id: 'dag-zn8t7-1160301605',
        name: 'dag-zn8t7[0].stage-1.F',
        displayName: 'F',
        type: 'Pod',
        templateName: 'echo',
        templateScope: 'local/dag-zn8t7',
        phase: 'Succeeded',
        boundaryID: 'dag-zn8t7-3269620181',
        startedAt: '2024-03-25T10:53:46Z',
        finishedAt: '2024-03-25T10:53:51Z',
        progress: '1/1',
        resourcesDuration: {
          cpu: 0,
          memory: 2
        },
        inputs: {
          parameters: [
            {
              name: 'message',
              value: 'F'
            }
          ]
        },
        outputs: {
          artifacts: [
            {
              name: 'main-logs',
              s3: {
                key: 'dag-zn8t7/dag-zn8t7-echo-1160301605/main.log'
              }
            }
          ],
          exitCode: '0'
        },
        children: ['dag-zn8t7-894636386'],
        hostNodeName: 'minikube'
      },
      'dag-zn8t7-166033037': {
        id: 'dag-zn8t7-166033037',
        name: 'dag-zn8t7[1].stage-2',
        displayName: 'stage-2',
        type: 'DAG',
        templateName: 'stage-2',
        templateScope: 'local/dag-zn8t7',
        phase: 'Running',
        boundaryID: 'dag-zn8t7',
        startedAt: '2024-03-25T10:53:56Z',
        finishedAt: null,
        progress: '0/1',
        children: ['dag-zn8t7-243551266']
      },
      'dag-zn8t7-1901043263': {
        id: 'dag-zn8t7-1901043263',
        name: 'dag-zn8t7[0]',
        displayName: '[0]',
        type: 'StepGroup',
        templateScope: 'local/dag-zn8t7',
        phase: 'Succeeded',
        boundaryID: 'dag-zn8t7',
        startedAt: '2024-03-25T10:53:26Z',
        finishedAt: '2024-03-25T10:53:56Z',
        progress: '5/6',
        resourcesDuration: {
          cpu: 0,
          memory: 10
        },
        nodeFlag: {},
        children: ['dag-zn8t7-3269620181']
      },
      'dag-zn8t7-243551266': {
        id: 'dag-zn8t7-243551266',
        name: 'dag-zn8t7[1].stage-2.approval',
        displayName: 'approval',
        type: 'Suspend',
        templateName: 'approval',
        templateScope: 'local/dag-zn8t7',
        phase: 'Running',
        boundaryID: 'dag-zn8t7-166033037',
        startedAt: '2024-03-25T10:53:56Z',
        finishedAt: null,
        progress: '0/1'
      },
      'dag-zn8t7-3269620181': {
        id: 'dag-zn8t7-3269620181',
        name: 'dag-zn8t7[0].stage-1',
        displayName: 'stage-1',
        type: 'DAG',
        templateName: 'stage-1',
        templateScope: 'local/dag-zn8t7',
        phase: 'Succeeded',
        boundaryID: 'dag-zn8t7',
        startedAt: '2024-03-25T10:53:26Z',
        finishedAt: '2024-03-25T10:53:56Z',
        progress: '5/6',
        resourcesDuration: {
          cpu: 0,
          memory: 10
        },
        children: ['dag-zn8t7-1042858272'],
        outboundNodes: [
          'dag-zn8t7-1076413510',
          'dag-zn8t7-1126746367',
          'dag-zn8t7-1109968748',
          'dag-zn8t7-1160301605'
        ]
      },
      'dag-zn8t7-894636386': {
        id: 'dag-zn8t7-894636386',
        name: 'dag-zn8t7[1]',
        displayName: '[1]',
        type: 'StepGroup',
        templateScope: 'local/dag-zn8t7',
        phase: 'Running',
        boundaryID: 'dag-zn8t7',
        startedAt: '2024-03-25T10:53:56Z',
        finishedAt: null,
        progress: '0/1',
        nodeFlag: {},
        children: ['dag-zn8t7-166033037']
      }
    },
    conditions: [
      {
        type: 'PodRunning',
        status: 'False'
      }
    ],
    resourcesDuration: {
      cpu: 0,
      memory: 10
    },
    artifactRepositoryRef: {
      configMap: 'artifact-repositories',
      key: 'default-v1',
      namespace: 'argo',
      artifactRepository: {
        archiveLogs: true,
        s3: {
          endpoint: 'minio:9000',
          bucket: 'my-bucket',
          insecure: true,
          accessKeySecret: {
            name: 'my-minio-cred',
            key: 'accesskey'
          },
          secretKeySecret: {
            name: 'my-minio-cred',
            key: 'secretkey'
          }
        }
      }
    },
    artifactGCStatus: {
      notSpecified: true
    },
    taskResultsCompletionStatus: {
      'dag-zn8t7-1042858272': true,
      'dag-zn8t7-1076413510': true,
      'dag-zn8t7-1093191129': true,
      'dag-zn8t7-1109968748': true,
      'dag-zn8t7-1160301605': true
    }
  }
};

export default {
  result: {
    type: 'MODIFIED',
    object: {
      metadata: {
        name: 'dag-ft9mq',
        generateName: 'dag-',
        namespace: 'argo',
        uid: 'b00f4018-736c-48b6-b3f1-4f5678fb38f5',
        resourceVersion: '7517',
        generation: 3,
        creationTimestamp: '2024-03-25T03:21:34Z',
        labels: {
          'workflows.argoproj.io/completed': 'false',
          'workflows.argoproj.io/creator':
            'system-serviceaccount-argo-argo-server',
          'workflows.argoproj.io/phase': 'Running',
          'workflows.argoproj.io/resubmitted-from-workflow': 'dag-jnbcc'
        },
        annotations: { 'workflows.argoproj.io/pod-name-format': 'v2' },
        managedFields: [
          {
            manager: 'argo',
            operation: 'Update',
            apiVersion: 'argoproj.io/v1alpha1',
            time: '2024-03-25T03:21:34Z',
            fieldsType: 'FieldsV1',
            fieldsV1: {
              'f:metadata': {
                'f:annotations': {
                  '.': {},
                  'f:workflows.argoproj.io/pod-name-format': {}
                },
                'f:generateName': {},
                'f:labels': {
                  '.': {},
                  'f:workflows.argoproj.io/creator': {},
                  'f:workflows.argoproj.io/resubmitted-from-workflow': {}
                }
              },
              'f:spec': {}
            }
          },
          {
            manager: 'workflow-controller',
            operation: 'Update',
            apiVersion: 'argoproj.io/v1alpha1',
            time: '2024-03-25T03:21:44Z',
            fieldsType: 'FieldsV1',
            fieldsV1: {
              'f:metadata': {
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
            name: 'echo',
            inputs: { parameters: [{ name: 'message' }] },
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
            name: 'dag-workflow',
            inputs: {},
            outputs: {},
            metadata: {},
            dag: {
              tasks: [
                {
                  name: 'A',
                  template: 'echo',
                  arguments: { parameters: [{ name: 'message', value: 'A' }] }
                },
                {
                  name: 'B',
                  template: 'echo',
                  arguments: { parameters: [{ name: 'message', value: 'B' }] },
                  depends: 'A.Succeeded'
                },
                {
                  name: 'C',
                  template: 'echo',
                  arguments: { parameters: [{ name: 'message', value: 'C' }] },
                  when: '{{tasks.A.outputs.result}} == A',
                  depends: 'A'
                },
                {
                  name: 'D',
                  template: 'echo',
                  arguments: { parameters: [{ name: 'message', value: 'D' }] },
                  depends: 'A.Failed'
                },
                {
                  name: 'E',
                  template: 'echo',
                  arguments: { parameters: [{ name: 'message', value: 'E' }] },
                  depends: 'B'
                },
                {
                  name: 'F',
                  template: 'echo',
                  arguments: { parameters: [{ name: 'message', value: 'F' }] },
                  depends: 'B'
                },
                {
                  name: 'approval',
                  template: 'approval',
                  arguments: {},
                  depends: 'E'
                },
                {
                  name: 'G',
                  template: 'echo',
                  arguments: { parameters: [{ name: 'message', value: 'G' }] },
                  depends: 'approval'
                },
                {
                  name: 'H',
                  template: 'echo',
                  arguments: { parameters: [{ name: 'message', value: 'H' }] },
                  depends: 'approval'
                },
                {
                  name: 'I',
                  template: 'echo',
                  arguments: { parameters: [{ name: 'message', value: 'I' }] },
                  depends: 'G \u0026\u0026 H \u0026\u0026 F'
                },
                {
                  name: 'J',
                  template: 'echo',
                  arguments: { parameters: [{ name: 'message', value: 'J' }] },
                  depends: 'I || C'
                }
              ]
            }
          }
        ],
        entrypoint: 'dag-workflow',
        arguments: {}
      },
      status: {
        phase: 'Running',
        startedAt: '2024-03-25T03:21:34Z',
        finishedAt: null,
        progress: '1/3',
        nodes: {
          'dag-ft9mq': {
            id: 'dag-ft9mq',
            name: 'dag-ft9mq',
            displayName: 'dag-ft9mq',
            type: 'DAG',
            templateName: 'dag-workflow',
            templateScope: 'local/dag-ft9mq',
            phase: 'Running',
            startedAt: '2024-03-25T03:21:34Z',
            finishedAt: null,
            progress: '1/3',
            children: ['dag-ft9mq-588571452']
          },
          'dag-ft9mq-538238595': {
            id: 'dag-ft9mq-538238595',
            name: 'dag-ft9mq.D',
            displayName: 'D',
            type: 'Skipped',
            templateName: 'echo',
            templateScope: 'local/dag-ft9mq',
            phase: 'Omitted',
            boundaryID: 'dag-ft9mq',
            message: 'omitted: depends condition not met',
            startedAt: '2024-03-25T03:21:44Z',
            finishedAt: '2024-03-25T03:21:44Z',
            nodeFlag: {}
          },
          'dag-ft9mq-588571452': {
            id: 'dag-ft9mq-588571452',
            name: 'dag-ft9mq.A',
            displayName: 'A',
            type: 'Pod',
            templateName: 'echo',
            templateScope: 'local/dag-ft9mq',
            phase: 'Succeeded',
            boundaryID: 'dag-ft9mq',
            startedAt: '2024-03-25T03:21:34Z',
            finishedAt: '2024-03-25T03:21:38Z',
            progress: '1/1',
            resourcesDuration: { cpu: 0, memory: 2 },
            inputs: { parameters: [{ name: 'message', value: 'A' }] },
            outputs: {
              artifacts: [
                {
                  name: 'main-logs',
                  s3: { key: 'dag-ft9mq/dag-ft9mq-echo-588571452/main.log' }
                }
              ],
              result: 'A',
              exitCode: '0'
            },
            children: [
              'dag-ft9mq-538238595',
              'dag-ft9mq-638904309',
              'dag-ft9mq-622126690'
            ],
            hostNodeName: 'minikube'
          },
          'dag-ft9mq-622126690': {
            id: 'dag-ft9mq-622126690',
            name: 'dag-ft9mq.C',
            displayName: 'C',
            type: 'Pod',
            templateName: 'echo',
            templateScope: 'local/dag-ft9mq',
            phase: 'Pending',
            boundaryID: 'dag-ft9mq',
            startedAt: '2024-03-25T03:21:44Z',
            finishedAt: null,
            progress: '0/1',
            inputs: { parameters: [{ name: 'message', value: 'C' }] }
          },
          'dag-ft9mq-638904309': {
            id: 'dag-ft9mq-638904309',
            name: 'dag-ft9mq.B',
            displayName: 'B',
            type: 'Pod',
            templateName: 'echo',
            templateScope: 'local/dag-ft9mq',
            phase: 'Pending',
            boundaryID: 'dag-ft9mq',
            startedAt: '2024-03-25T03:21:44Z',
            finishedAt: null,
            progress: '0/1',
            inputs: { parameters: [{ name: 'message', value: 'B' }] }
          }
        },
        conditions: [{ type: 'PodRunning', status: 'False' }],
        resourcesDuration: { cpu: 0, memory: 2 },
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
              accessKeySecret: { name: 'my-minio-cred', key: 'accesskey' },
              secretKeySecret: { name: 'my-minio-cred', key: 'secretkey' }
            }
          }
        },
        artifactGCStatus: { notSpecified: true },
        taskResultsCompletionStatus: { 'dag-ft9mq-588571452': true }
      }
    }
  }
};

export const json = {
  result: {
    type: 'MODIFIED',
    object: {
      metadata: {
        name: 'dag-ft9mq',
        generateName: 'dag-',
        namespace: 'argo',
        uid: 'b00f4018-736c-48b6-b3f1-4f5678fb38f5',
        resourceVersion: '7628',
        generation: 5,
        creationTimestamp: '2024-03-25T03:21:34Z',
        labels: {
          'workflows.argoproj.io/completed': 'false',
          'workflows.argoproj.io/creator':
            'system-serviceaccount-argo-argo-server',
          'workflows.argoproj.io/phase': 'Running',
          'workflows.argoproj.io/resubmitted-from-workflow': 'dag-jnbcc'
        },
        annotations: { 'workflows.argoproj.io/pod-name-format': 'v2' },
        managedFields: [
          {
            manager: 'argo',
            operation: 'Update',
            apiVersion: 'argoproj.io/v1alpha1',
            time: '2024-03-25T03:21:34Z',
            fieldsType: 'FieldsV1',
            fieldsV1: {
              'f:metadata': {
                'f:annotations': {
                  '.': {},
                  'f:workflows.argoproj.io/pod-name-format': {}
                },
                'f:generateName': {},
                'f:labels': {
                  '.': {},
                  'f:workflows.argoproj.io/creator': {},
                  'f:workflows.argoproj.io/resubmitted-from-workflow': {}
                }
              },
              'f:spec': {}
            }
          },
          {
            manager: 'workflow-controller',
            operation: 'Update',
            apiVersion: 'argoproj.io/v1alpha1',
            time: '2024-03-25T03:22:04Z',
            fieldsType: 'FieldsV1',
            fieldsV1: {
              'f:metadata': {
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
            name: 'echo',
            inputs: { parameters: [{ name: 'message' }] },
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
            name: 'dag-workflow',
            inputs: {},
            outputs: {},
            metadata: {},
            dag: {
              tasks: [
                {
                  name: 'A',
                  template: 'echo',
                  arguments: { parameters: [{ name: 'message', value: 'A' }] }
                },
                {
                  name: 'B',
                  template: 'echo',
                  arguments: { parameters: [{ name: 'message', value: 'B' }] },
                  depends: 'A.Succeeded'
                },
                {
                  name: 'C',
                  template: 'echo',
                  arguments: { parameters: [{ name: 'message', value: 'C' }] },
                  when: '{{tasks.A.outputs.result}} == A',
                  depends: 'A'
                },
                {
                  name: 'D',
                  template: 'echo',
                  arguments: { parameters: [{ name: 'message', value: 'D' }] },
                  depends: 'A.Failed'
                },
                {
                  name: 'E',
                  template: 'echo',
                  arguments: { parameters: [{ name: 'message', value: 'E' }] },
                  depends: 'B'
                },
                {
                  name: 'F',
                  template: 'echo',
                  arguments: { parameters: [{ name: 'message', value: 'F' }] },
                  depends: 'B'
                },
                {
                  name: 'approval',
                  template: 'approval',
                  arguments: {},
                  depends: 'E'
                },
                {
                  name: 'G',
                  template: 'echo',
                  arguments: { parameters: [{ name: 'message', value: 'G' }] },
                  depends: 'approval'
                },
                {
                  name: 'H',
                  template: 'echo',
                  arguments: { parameters: [{ name: 'message', value: 'H' }] },
                  depends: 'approval'
                },
                {
                  name: 'I',
                  template: 'echo',
                  arguments: { parameters: [{ name: 'message', value: 'I' }] },
                  depends: 'G \u0026\u0026 H \u0026\u0026 F'
                },
                {
                  name: 'J',
                  template: 'echo',
                  arguments: { parameters: [{ name: 'message', value: 'J' }] },
                  depends: 'I || C'
                }
              ]
            }
          }
        ],
        entrypoint: 'dag-workflow',
        arguments: {}
      },
      status: {
        phase: 'Running',
        startedAt: '2024-03-25T03:21:34Z',
        finishedAt: null,
        progress: '5/6',
        nodes: {
          'dag-ft9mq': {
            id: 'dag-ft9mq',
            name: 'dag-ft9mq',
            displayName: 'dag-ft9mq',
            type: 'DAG',
            templateName: 'dag-workflow',
            templateScope: 'local/dag-ft9mq',
            phase: 'Running',
            startedAt: '2024-03-25T03:21:34Z',
            finishedAt: null,
            progress: '5/6',
            children: ['dag-ft9mq-588571452']
          },
          'dag-ft9mq-2837708534': {
            id: 'dag-ft9mq-2837708534',
            name: 'dag-ft9mq.approval',
            displayName: 'approval',
            type: 'Suspend',
            templateName: 'approval',
            templateScope: 'local/dag-ft9mq',
            phase: 'Running',
            boundaryID: 'dag-ft9mq',
            startedAt: '2024-03-25T03:22:04Z',
            finishedAt: null,
            progress: '0/1'
          },
          'dag-ft9mq-521460976': {
            id: 'dag-ft9mq-521460976',
            name: 'dag-ft9mq.E',
            displayName: 'E',
            type: 'Pod',
            templateName: 'echo',
            templateScope: 'local/dag-ft9mq',
            phase: 'Succeeded',
            boundaryID: 'dag-ft9mq',
            startedAt: '2024-03-25T03:21:54Z',
            finishedAt: '2024-03-25T03:21:59Z',
            progress: '1/1',
            resourcesDuration: { cpu: 0, memory: 2 },
            inputs: { parameters: [{ name: 'message', value: 'E' }] },
            outputs: {
              artifacts: [
                {
                  name: 'main-logs',
                  s3: { key: 'dag-ft9mq/dag-ft9mq-echo-521460976/main.log' }
                }
              ],
              exitCode: '0'
            },
            children: ['dag-ft9mq-2837708534'],
            hostNodeName: 'minikube'
          },
          'dag-ft9mq-538238595': {
            id: 'dag-ft9mq-538238595',
            name: 'dag-ft9mq.D',
            displayName: 'D',
            type: 'Skipped',
            templateName: 'echo',
            templateScope: 'local/dag-ft9mq',
            phase: 'Omitted',
            boundaryID: 'dag-ft9mq',
            message: 'omitted: depends condition not met',
            startedAt: '2024-03-25T03:21:44Z',
            finishedAt: '2024-03-25T03:21:44Z',
            nodeFlag: {}
          },
          'dag-ft9mq-571793833': {
            id: 'dag-ft9mq-571793833',
            name: 'dag-ft9mq.F',
            displayName: 'F',
            type: 'Pod',
            templateName: 'echo',
            templateScope: 'local/dag-ft9mq',
            phase: 'Succeeded',
            boundaryID: 'dag-ft9mq',
            startedAt: '2024-03-25T03:21:54Z',
            finishedAt: '2024-03-25T03:21:59Z',
            progress: '1/1',
            resourcesDuration: { cpu: 0, memory: 2 },
            inputs: { parameters: [{ name: 'message', value: 'F' }] },
            outputs: {
              artifacts: [
                {
                  name: 'main-logs',
                  s3: { key: 'dag-ft9mq/dag-ft9mq-echo-571793833/main.log' }
                }
              ],
              exitCode: '0'
            },
            hostNodeName: 'minikube'
          },
          'dag-ft9mq-588571452': {
            id: 'dag-ft9mq-588571452',
            name: 'dag-ft9mq.A',
            displayName: 'A',
            type: 'Pod',
            templateName: 'echo',
            templateScope: 'local/dag-ft9mq',
            phase: 'Succeeded',
            boundaryID: 'dag-ft9mq',
            startedAt: '2024-03-25T03:21:34Z',
            finishedAt: '2024-03-25T03:21:38Z',
            progress: '1/1',
            resourcesDuration: { cpu: 0, memory: 2 },
            inputs: { parameters: [{ name: 'message', value: 'A' }] },
            outputs: {
              artifacts: [
                {
                  name: 'main-logs',
                  s3: { key: 'dag-ft9mq/dag-ft9mq-echo-588571452/main.log' }
                }
              ],
              result: 'A',
              exitCode: '0'
            },
            children: [
              'dag-ft9mq-538238595',
              'dag-ft9mq-638904309',
              'dag-ft9mq-622126690'
            ],
            hostNodeName: 'minikube'
          },
          'dag-ft9mq-622126690': {
            id: 'dag-ft9mq-622126690',
            name: 'dag-ft9mq.C',
            displayName: 'C',
            type: 'Pod',
            templateName: 'echo',
            templateScope: 'local/dag-ft9mq',
            phase: 'Succeeded',
            boundaryID: 'dag-ft9mq',
            startedAt: '2024-03-25T03:21:44Z',
            finishedAt: '2024-03-25T03:21:49Z',
            progress: '1/1',
            resourcesDuration: { cpu: 0, memory: 2 },
            inputs: { parameters: [{ name: 'message', value: 'C' }] },
            outputs: {
              artifacts: [
                {
                  name: 'main-logs',
                  s3: { key: 'dag-ft9mq/dag-ft9mq-echo-622126690/main.log' }
                }
              ],
              exitCode: '0'
            },
            hostNodeName: 'minikube'
          },
          'dag-ft9mq-638904309': {
            id: 'dag-ft9mq-638904309',
            name: 'dag-ft9mq.B',
            displayName: 'B',
            type: 'Pod',
            templateName: 'echo',
            templateScope: 'local/dag-ft9mq',
            phase: 'Succeeded',
            boundaryID: 'dag-ft9mq',
            startedAt: '2024-03-25T03:21:44Z',
            finishedAt: '2024-03-25T03:21:49Z',
            progress: '1/1',
            resourcesDuration: { cpu: 0, memory: 2 },
            inputs: { parameters: [{ name: 'message', value: 'B' }] },
            outputs: {
              artifacts: [
                {
                  name: 'main-logs',
                  s3: { key: 'dag-ft9mq/dag-ft9mq-echo-638904309/main.log' }
                }
              ],
              exitCode: '0'
            },
            children: ['dag-ft9mq-521460976', 'dag-ft9mq-571793833'],
            hostNodeName: 'minikube'
          }
        },
        conditions: [{ type: 'PodRunning', status: 'False' }],
        resourcesDuration: { cpu: 0, memory: 10 },
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
              accessKeySecret: { name: 'my-minio-cred', key: 'accesskey' },
              secretKeySecret: { name: 'my-minio-cred', key: 'secretkey' }
            }
          }
        },
        artifactGCStatus: { notSpecified: true },
        taskResultsCompletionStatus: {
          'dag-ft9mq-521460976': true,
          'dag-ft9mq-571793833': true,
          'dag-ft9mq-588571452': true,
          'dag-ft9mq-622126690': true,
          'dag-ft9mq-638904309': true
        }
      }
    }
  }
};

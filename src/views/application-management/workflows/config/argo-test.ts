export default [
  {
    name: 'hello-hello-hello',
    steps: [
      [
        // stage 1
        {
          name: 'step1',
          template: 'prepare-data'
        }
      ],
      [
        // stage 2
        {
          name: 'step2a',
          template: 'run-data-first-half'
        },
        {
          name: 'step2b',
          template: 'run-data-second-half'
        }
      ]
    ]
  }
];

const data2 = {
  name: 'test-1',
  type: 'default',
  description: '',
  parallelism: 10,
  timeout: 0,
  variables: [],
  stages: [
    {
      dependencies: [],
      description: '',
      name: 'stage-1',
      steps: [
        {
          type: 'approval',
          name: 'approve-1',
          attributes: {
            name: 'approve-1',
            approvalType: 'and',
            approvalUsers: ['504793695917215750']
          },
          timeout: null
        },
        {
          type: 'approval',
          name: 'statge-1-approval-2',
          attributes: {
            name: 'statge-1-approval-2',
            approvalType: 'and',
            approvalUsers: ['504793695917215750']
          },
          timeout: null
        }
      ]
    },
    {
      dependencies: [],
      description: '',
      name: 'stage-2',
      steps: [
        {
          type: 'approval',
          name: 'approval-2',
          attributes: {
            name: 'approval-2',
            approvalType: 'and',
            approvalUsers: ['504793695917215750']
          },
          timeout: null
        },
        {
          type: 'approval',
          name: 'approval-202',
          attributes: {
            name: 'approval-202',
            approvalType: 'and',
            approvalUsers: ['504793695917215750']
          },
          timeout: null
        }
      ]
    }
  ]
};
export const ArgoTestData = {
  apiVersion: 'argoproj.io/v1alpha1',
  kind: 'Workflow',
  metadata: {
    generateName: 'walrus-'
  },
  spec: {
    entrypoint: 'main',
    templates: [
      {
        name: 'main',
        steps: [
          [
            {
              name: 'stage-1',
              template: 'stage-1'
            }
          ],
          [
            {
              name: 'stage-2',
              template: 'stage-2'
            }
          ]
        ]
      },
      {
        name: 'stage-1',
        steps: [
          [
            {
              name: 'A',
              template: 'whalesay',
              arguments: {
                parameters: [
                  {
                    name: 'message',
                    value: 'hello1'
                  }
                ]
              }
            },
            {
              name: 'Approval-1',
              depends: 'A',
              template: 'whalesay',
              arguments: {
                parameters: [
                  {
                    name: 'message',
                    value: 'hello1'
                  }
                ]
              }
            },
            {
              name: 'B',
              depends: 'Approval-1',
              template: 'whalesay',
              arguments: {
                parameters: [
                  {
                    name: 'message',
                    value: 'hello1'
                  }
                ]
              }
            },
            {
              name: 'C',
              depends: 'Approval-1',
              template: 'whalesay',
              arguments: {
                parameters: [
                  {
                    name: 'message',
                    value: 'hello1'
                  }
                ]
              }
            },
            {
              name: 'F',
              depends: 'B',
              template: 'whalesay',
              arguments: {
                parameters: [
                  {
                    name: 'message',
                    value: 'hello1'
                  }
                ]
              }
            },
            {
              name: 'D',
              depends: 'Approval-1',
              template: 'whalesay',
              arguments: {
                parameters: [
                  {
                    name: 'message',
                    value: 'hello1'
                  }
                ]
              }
            },
            {
              name: 'E',
              depends: 'B',
              template: 'whalesay',
              arguments: {
                parameters: [
                  {
                    name: 'message',
                    value: 'hello1'
                  }
                ]
              }
            }
          ]
        ]
      },
      {
        name: 'stage-2',
        steps: [
          [
            {
              name: 'Approval-2',
              depends: 'E',
              template: 'whalesay',
              arguments: {
                parameters: [
                  {
                    name: 'message',
                    value: 'hello1'
                  }
                ]
              }
            },
            {
              name: 'G',
              depends: 'Approval-2',
              template: 'whalesay',
              arguments: {
                parameters: [
                  {
                    name: 'message',
                    value: 'hello1'
                  }
                ]
              }
            },
            {
              name: 'H',
              depends: 'Approval-2',
              template: 'whalesay',
              arguments: {
                parameters: [
                  {
                    name: 'message',
                    value: 'hello1'
                  }
                ]
              }
            },
            {
              name: 'I',
              depends: 'G && H && F',
              template: 'whalesay',
              arguments: {
                parameters: [
                  {
                    name: 'message',
                    value: 'hello1'
                  }
                ]
              }
            },
            {
              name: 'J',
              depends: 'I || C',
              template: 'whalesay',
              arguments: {
                parameters: [
                  {
                    name: 'message',
                    value: 'hello1'
                  }
                ]
              }
            }
          ]
        ]
      },
      {
        name: 'whalesay',
        inputs: {
          parameters: [
            {
              name: 'message'
            }
          ]
        },
        container: {
          image: 'docker/whalesay',
          command: ['cowsay'],
          args: ['{{inputs.parameters.message}}']
        }
      }
    ]
  }
};

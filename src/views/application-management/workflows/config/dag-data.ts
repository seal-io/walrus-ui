export default {
  apiVersion: 'argoproj.io/v1alpha1',
  kind: 'Workflow',
  metadata: {
    generateName: 'dag-'
  },
  spec: {
    entrypoint: 'dag-workflow',
    templates: [
      {
        name: 'echo',
        inputs: {
          parameters: [
            {
              name: 'message'
            }
          ]
        },
        container: {
          image: 'alpine:3.7',
          command: ['echo', '{{inputs.parameters.message}}']
        }
      },
      {
        name: 'approval',
        suspend: {}
      },
      {
        name: 'dag-workflow',
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
              depends: 'A.Succeeded',
              template: 'echo',
              arguments: {
                parameters: [
                  {
                    name: 'message',
                    value: 'B'
                  }
                ]
              }
            },
            {
              name: 'C',
              depends: 'A',
              when: '{{tasks.A.outputs.result}} == A',
              template: 'echo',
              arguments: {
                parameters: [
                  {
                    name: 'message',
                    value: 'C'
                  }
                ]
              }
            },
            {
              name: 'D',
              depends: 'A.Failed',
              template: 'echo',
              arguments: {
                parameters: [
                  {
                    name: 'message',
                    value: 'D'
                  }
                ]
              }
            },
            {
              name: 'E',
              depends: 'B',
              template: 'echo',
              arguments: {
                parameters: [
                  {
                    name: 'message',
                    value: 'E'
                  }
                ]
              }
            },
            {
              name: 'F',
              depends: 'B',
              template: 'echo',
              arguments: {
                parameters: [
                  {
                    name: 'message',
                    value: 'F'
                  }
                ]
              }
            },
            {
              name: 'approval',
              depends: 'E',
              template: 'approval'
            },
            {
              name: 'G',
              depends: 'approval',
              template: 'echo',
              arguments: {
                parameters: [
                  {
                    name: 'message',
                    value: 'G'
                  }
                ]
              }
            },
            {
              name: 'H',
              depends: 'approval',
              template: 'echo',
              arguments: {
                parameters: [
                  {
                    name: 'message',
                    value: 'H'
                  }
                ]
              }
            },
            {
              name: 'I',
              depends: 'G && H && F',
              template: 'echo',
              arguments: {
                parameters: [
                  {
                    name: 'message',
                    value: 'I'
                  }
                ]
              }
            },
            {
              name: 'J',
              depends: 'I || C',
              template: 'echo',
              arguments: {
                parameters: [
                  {
                    name: 'message',
                    value: 'J'
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  }
};

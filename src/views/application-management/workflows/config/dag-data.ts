export default {
  metadata: {
    generateName: 'dag-'
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
              depends: 'G && H'
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
  }
};

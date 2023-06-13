export default [
  {
    keys: {
      keys: [
        {
          keys: [
            {
              executable: true,
              loggable: true,
              name: 'nginx',
              value: 'nginx-l7p5n/run/nginx'
            },
            {
              executable: false,
              loggable: true,
              name: 'debugger-vq9v9',
              value: 'nginx-l7p5n/ephemeral/debugger-vq9v9'
            }
          ],
          name: 'nginx-l7p5n'
        }
      ],
      labels: ['Pod', 'Container']
    },
    name: 'resource-1'
  }
];

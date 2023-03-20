export const statckLineData = [
  {
    itemName: 'itemName1',
    startTime: '2023-02-23T00:00:00Z',
    totalCost: 5.443428478007643,
    sharedCost: 4.826832947167643,
    cpuCost: 0.4868020000000007,
    ramCost: 0.038201999999999986,
    pvCost: 0.09159153084000009
  },
  {
    itemName: 'itemName1',
    startTime: '2023-02-24T00:00:00Z',
    totalCost: 6.443428478007643,
    sharedCost: 4.826832947167643,
    cpuCost: 0.4868020000000007,
    ramCost: 0.038201999999999986,
    pvCost: 0.09159153084000009
  },
  {
    itemName: 'itemName1',
    startTime: '2023-02-25T00:00:00Z',
    totalCost: 7.443428478007643,
    sharedCost: 4.826832947167643,
    cpuCost: 0.4868020000000007,
    ramCost: 0.038201999999999986,
    pvCost: 0.09159153084000009
  },
  {
    itemName: 'itemName2',
    startTime: '2023-02-23T00:00:00Z',
    totalCost: 2.7084200439384034,
    sharedCost: 2.150695715998403,
    cpuCost: 0.4404500000000005,
    ramCost: 0.03456199999999999,
    pvCost: 0.08271232794000008
  },
  {
    itemName: 'itemName2',
    startTime: '2023-02-24T00:00:00Z',
    totalCost: 3.7084200439384034,
    sharedCost: 2.150695715998403,
    cpuCost: 0.4404500000000005,
    ramCost: 0.03456199999999999,
    pvCost: 0.08271232794000008
  },
  {
    itemName: 'itemName2',
    startTime: '2023-02-25T00:00:00Z',
    totalCost: 4.7084200439384034,
    sharedCost: 2.150695715998403,
    cpuCost: 0.4404500000000005,
    ramCost: 0.03456199999999999,
    pvCost: 0.08271232794000008
  }
];
export const overviewData = {
  itemName: 'itemName2',
  startTime: '2023-02-22T00:00:00Z',
  totalCost: 2.7084200439384034,
  sharedCost: 2.150695715998403,
  cpuCost: 0.4404500000000005,
  ramCost: 0.03456199999999999,
  pvCost: 0.08271232794000008
};
export default [
  {
    itemName: 'itemName1',
    startTime: '2023-02-23T00:00:00Z',
    totalCost: 5.443428478007643,
    sharedCost: 4.826832947167643,
    cpuCost: 0.4868020000000007,
    ramCost: 0.038201999999999986,
    pvCost: 0.09159153084000009
  },
  {
    itemName: 'itemName2',
    startTime: '2023-02-22T00:00:00Z',
    totalCost: 2.7084200439384034,
    sharedCost: 2.150695715998403,
    cpuCost: 0.4404500000000005,
    ramCost: 0.03456199999999999,
    pvCost: 0.08271232794000008
  }
];

export const filtersData = {
  filters: [
    [
      {
        fieldName: 'namespace',
        operator: 'IN',
        values: ['default']
      },
      {
        fieldName: 'namespace',
        operator: 'IN',
        values: ['default']
      }
    ],
    [
      {
        fieldName: 'namespace',
        operator: 'IN',
        values: ['default']
      }
    ]
  ],
  groupBys: ['pod'],
  step: '1d',
  shareCosts: [
    {
      name: 'management',
      sharingStrategy: 'equallySplit',
      filters: [
        [
          {
            fieldName: 'clusterName',
            operatory: 'Equal',
            values: ['test']
          },
          {
            fieldName: 'managementCost',
            operatory: 'Equal',
            values: ['true']
          }
        ]
      ]
    }
  ]
};
export const workloadData = {
  items: [
    {
      totalCost: 15.400544344179284,
      sharedCost: 12.44309434417929,
      cpuCost: 2.899569999999995,
      ramCost: 0.05788000000000007,
      itemName: '__unallocated__'
    },
    {
      totalCost: 5.072189289085003,
      sharedCost: 4.0981492890850015,
      cpuCost: 0.8921699999999992,
      ramCost: 0.08186999999999978,
      itemName: 'kube-system/deployment/coredns'
    },
    {
      totalCost: 2.4773034069405795,
      sharedCost: 2.00157340694058,
      cpuCost: 0.4460899999999996,
      ramCost: 0.0296399999999999,
      itemName: 'kube-system/daemonset/kindnet'
    },
    {
      totalCost: 0.3968538722446377,
      sharedCost: 0.3206438722446378,
      cpuCost: 0.045160000000000096,
      ramCost: 0.031050000000000084,
      itemName: 'seal-system/deployment/seal-opencost'
    },
    { itemName: 'argo/deployment/argo-server' },
    {
      itemName: 'seal-system/daemonset/seal-prometheus-prometheus-node-exporter'
    },
    { itemName: 'kube-system/daemonset/kube-proxy' },
    { itemName: 'argo/deployment/workflow-controller' },
    { itemName: 'seal-system/deployment/seal-prometheus-server' },
    { itemName: 'local-path-storage/deployment/local-path-provisioner' }
  ],
  pagination: { page: 1, perPage: 100, total: 11, totalPage: 1, partial: true }
};

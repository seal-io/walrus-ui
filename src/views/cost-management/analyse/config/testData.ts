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
export const dailyCostData = {
  items: [
    {
      totalCost: 0.7622400000000003,
      cpuCost: 0.7281600000000007,
      ramCost: 0.03408000000000001,
      itemName: 'local-control-plane',
      startTime: '2023-03-19T00:00:00Z'
    },
    {
      totalCost: 0.7622400000000001,
      cpuCost: 0.7281600000000008,
      ramCost: 0.03408000000000001,
      itemName: 'local-control-plane',
      startTime: '2023-03-20T00:00:00Z'
    },
    {
      totalCost: 0.7622400000000001,
      cpuCost: 0.7281600000000008,
      ramCost: 0.034080000000000006,
      itemName: 'local-control-plane',
      startTime: '2023-03-18T00:00:00Z'
    },
    {
      totalCost: 0.7569300000000002,
      cpuCost: 0.7231000000000007,
      ramCost: 0.03383000000000001,
      itemName: 'local-control-plane',
      startTime: '2023-03-16T00:00:00Z'
    },
    {
      totalCost: 0.7543000000000002,
      cpuCost: 0.7205800000000008,
      ramCost: 0.033720000000000014,
      itemName: 'local-control-plane',
      startTime: '2023-03-21T00:00:00Z'
    },
    {
      totalCost: 0.7384000000000001,
      cpuCost: 0.7054000000000007,
      ramCost: 0.033000000000000015,
      itemName: 'local-control-plane',
      startTime: '2023-03-17T00:00:00Z'
    },
    {
      totalCost: 0.06352000000000001,
      cpuCost: 0.06068000000000001,
      ramCost: 0.00284,
      itemName: 'local-control-plane',
      startTime: '2023-03-22T00:00:00Z'
    },
    { itemName: '__unallocated__', startTime: '2023-03-17T00:00:00Z' }
  ],
  pagination: { page: 1, perPage: 100, total: 8, totalPage: 1, partial: false }
};
// namespace by day
export const namespaceData = {
  items: [
    {
      totalCost: 0.19873000000000002,
      cpuCost: 0.17522999999999997,
      ramCost: 0.0235,
      itemName: 'comic-mule',
      startTime: '2023-03-20T00:00:00Z'
    },
    {
      totalCost: 0.19873000000000002,
      cpuCost: 0.17522999999999997,
      ramCost: 0.0235,
      itemName: 'organic-garfish',
      startTime: '2023-03-20T00:00:00Z'
    },
    {
      totalCost: 0.19723000000000002,
      cpuCost: 0.17390999999999998,
      ramCost: 0.02332,
      itemName: 'calm-lobster',
      startTime: '2023-03-20T00:00:00Z'
    },
    {
      totalCost: 0.1378121794871795,
      cpuCost: 0.11594000000000003,
      ramCost: 0.015550000000000001,
      pvCost: 0.006322179487179486,
      itemName: 'default',
      startTime: '2023-03-10T00:00:00Z'
    },
    {
      totalCost: 0.10310000000000001,
      cpuCost: 0.09091000000000002,
      ramCost: 0.012190000000000001,
      itemName: 'comic-mule',
      startTime: '2023-03-17T00:00:00Z'
    },
    {
      totalCost: 0.09461166666666666,
      cpuCost: 0.08169000000000001,
      ramCost: 0.01096,
      pvCost: 0.0019616666666666667,
      itemName: 'default',
      startTime: '2023-03-09T00:00:00Z'
    },
    {
      totalCost: 0.08624,
      cpuCost: 0.079,
      ramCost: 0.0072400000000000025,
      itemName: 'kube-system',
      startTime: '2023-03-11T00:00:00Z'
    },
    {
      totalCost: 0.07646000000000001,
      cpuCost: 0.07004000000000002,
      ramCost: 0.006420000000000002,
      itemName: 'kube-system',
      startTime: '2023-03-20T00:00:00Z'
    },
    {
      totalCost: 0.06425,
      cpuCost: 0.056650000000000006,
      ramCost: 0.007599999999999999,
      itemName: 'organic-garfish',
      startTime: '2023-03-17T00:00:00Z'
    },
    {
      totalCost: 0.06424,
      cpuCost: 0.05665000000000001,
      ramCost: 0.0075899999999999995,
      itemName: 'comic-mule',
      startTime: '2023-03-16T00:00:00Z'
    },
    {
      totalCost: 0.054600000000000024,
      cpuCost: 0.05002000000000002,
      ramCost: 0.00458,
      itemName: 'kube-system',
      startTime: '2023-03-14T00:00:00Z'
    },
    {
      totalCost: 0.04886000000000002,
      cpuCost: 0.04476000000000002,
      ramCost: 0.0040999999999999995,
      itemName: 'kube-system',
      startTime: '2023-03-10T00:00:00Z'
    },
    {
      totalCost: 0.039660000000000015,
      cpuCost: 0.03634000000000001,
      ramCost: 0.0033199999999999996,
      itemName: 'kube-system',
      startTime: '2023-03-15T00:00:00Z'
    },
    {
      totalCost: 0.039660000000000015,
      cpuCost: 0.03634000000000001,
      ramCost: 0.0033199999999999996,
      itemName: 'kube-system',
      startTime: '2023-03-17T00:00:00Z'
    },
    {
      totalCost: 0.03586,
      cpuCost: 0.03162,
      ramCost: 0.00424,
      itemName: 'calm-lobster',
      startTime: '2023-03-21T00:00:00Z'
    },
    {
      totalCost: 0.03586,
      cpuCost: 0.03162,
      ramCost: 0.00424,
      itemName: 'comic-mule',
      startTime: '2023-03-21T00:00:00Z'
    },
    {
      totalCost: 0.03586,
      cpuCost: 0.03162,
      ramCost: 0.00424,
      itemName: 'organic-garfish',
      startTime: '2023-03-21T00:00:00Z'
    },
    {
      totalCost: 0.035060000000000015,
      cpuCost: 0.03212000000000001,
      ramCost: 0.0029399999999999995,
      itemName: 'kube-system',
      startTime: '2023-03-09T00:00:00Z'
    },
    {
      totalCost: 0.035060000000000015,
      cpuCost: 0.03212000000000001,
      ramCost: 0.0029399999999999995,
      itemName: 'kube-system',
      startTime: '2023-03-13T00:00:00Z'
    },
    {
      totalCost: 0.03394,
      cpuCost: 0.031079999999999997,
      ramCost: 0.0028599999999999997,
      itemName: 'kube-system',
      startTime: '2023-03-16T00:00:00Z'
    },
    {
      totalCost: 0.0138,
      cpuCost: 0.01264,
      ramCost: 0.00116,
      itemName: 'kube-system',
      startTime: '2023-03-21T00:00:00Z'
    },
    {
      totalCost: 0.01035833333333333,
      pvCost: 0.01035833333333333,
      itemName: 'default',
      startTime: '2023-03-20T00:00:00Z'
    },
    {
      totalCost: 0.006749999999999998,
      cpuCost: 0.004,
      ramCost: 0.0027500000000000003,
      itemName: 'seal-system',
      startTime: '2023-03-11T00:00:00Z'
    },
    {
      totalCost: 0.005989999999999999,
      cpuCost: 0.00355,
      ramCost: 0.0024400000000000003,
      itemName: 'seal-system',
      startTime: '2023-03-20T00:00:00Z'
    },
    {
      totalCost: 0.005481666666666666,
      pvCost: 0.005481666666666666,
      itemName: 'default',
      startTime: '2023-03-17T00:00:00Z'
    },
    {
      totalCost: 0.005367333333333334,
      cpuCost: 0.00395,
      ramCost: 0.00053,
      pvCost: 0.0008873333333333333,
      itemName: 'default',
      startTime: '2023-03-11T00:00:00Z'
    },
    {
      totalCost: 0.0051516666666666655,
      pvCost: 0.0051516666666666655,
      itemName: 'default',
      startTime: '2023-03-15T00:00:00Z'
    },
    {
      totalCost: 0.004632222222222222,
      pvCost: 0.004632222222222222,
      itemName: 'default',
      startTime: '2023-03-16T00:00:00Z'
    },
    {
      totalCost: 0.00427,
      cpuCost: 0.00253,
      ramCost: 0.0017399999999999998,
      itemName: 'seal-system',
      startTime: '2023-03-14T00:00:00Z'
    },
    {
      totalCost: 0.0038300000000000005,
      cpuCost: 0.0022700000000000003,
      ramCost: 0.00156,
      itemName: 'seal-system',
      startTime: '2023-03-10T00:00:00Z'
    },
    {
      totalCost: 0.003776666666666666,
      pvCost: 0.003776666666666666,
      itemName: 'default',
      startTime: '2023-03-14T00:00:00Z'
    },
    {
      totalCost: 0.0031000000000000003,
      cpuCost: 0.00184,
      ramCost: 0.00126,
      itemName: 'seal-system',
      startTime: '2023-03-17T00:00:00Z'
    },
    {
      totalCost: 0.0031000000000000003,
      cpuCost: 0.00184,
      ramCost: 0.00126,
      itemName: 'seal-system',
      startTime: '2023-03-15T00:00:00Z'
    },
    {
      totalCost: 0.0027500000000000003,
      cpuCost: 0.0016300000000000002,
      ramCost: 0.0011200000000000001,
      itemName: 'seal-system',
      startTime: '2023-03-13T00:00:00Z'
    },
    {
      totalCost: 0.0027500000000000003,
      cpuCost: 0.0016300000000000002,
      ramCost: 0.0011200000000000001,
      itemName: 'seal-system',
      startTime: '2023-03-09T00:00:00Z'
    },
    {
      totalCost: 0.00265,
      cpuCost: 0.00157,
      ramCost: 0.0010800000000000002,
      itemName: 'seal-system',
      startTime: '2023-03-16T00:00:00Z'
    },
    {
      totalCost: 0.00242,
      pvCost: 0.00242,
      itemName: 'default',
      startTime: '2023-03-13T00:00:00Z'
    },
    {
      totalCost: 0.00108,
      cpuCost: 0.00064,
      ramCost: 0.00044,
      itemName: 'seal-system',
      startTime: '2023-03-21T00:00:00Z'
    },
    {
      totalCost: 0.00044,
      pvCost: 0.00044,
      itemName: 'default',
      startTime: '2023-03-21T00:00:00Z'
    }
  ],
  pagination: { page: 1, perPage: 100, total: 39, totalPage: 1, partial: false }
};

import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { GetParams } from '@/types/global';
import qs from 'query-string';
import { concat, toString } from 'lodash';

const { Random } = Mock;

const getMockData = (params) => {
  console.log('params:', params);
  const { type, status, severity, license, query } = params;
  const hasFilter = type || status || severity || license || query;
  const evenData: string[] = [];
  const oddData: string[] = [];
  const count = 200; // node amount

  Array(count)
    .fill(1)
    .forEach((val, i) => {
      const index = toString(i) as string;
      if (i % 2 === 0 && i > 0) {
        evenData.push(index);
      } else if (i > 0) {
        oddData.push(toString(index));
      }
    });
  const data = Mock.mock({
    [`Nodes|${count}`]: [
      {
        id() {
          return Random.pick([...evenData, ...oddData]);
        },
        type() {
          const list = [
            // 'vulnerability',
            'package',
            'resource',
            'license',
            // 'tags',
            'vulnerable',
          ];
          if (type?.length) {
            return Random.pick(concat(type, type));
          }
          return Random.pick(list);
        },
        severity() {
          const list = ['critical', 'high', 'medium', 'low'];
          if (severity?.length) {
            return Random.pick(concat(severity, severity));
          }
          return Random.pick(list);
        },
        status() {
          const list = ['outdate', 'fix'];
          if (status?.length) {
            return Random.pick(concat(status, status));
          }
          return Random.pick(list);
        },
        license() {
          const list = [
            'GL2PS',
            'BSD-4-Clause',
            'LGPL-2.0',
            'NBPL-1.0',
            'AGPL-3.0-or-later',
          ];
          if (license?.length) {
            return Random.pick(concat(list, license, license));
          }
          return Random.pick(list);
        },
        labels() {
          return [Random.word(5)];
        },
        properties: {
          fullName: 'gitlawr/simple-java-maven-app',
          kind: 'repository',
          name() {
            if (query) {
              return query;
            }
            return Random.word(query?.length);
          },
          version: '',
        },
      },
    ],
    [`Edges|${Math.floor(count / 1.5)}`]: [
      {
        startNode() {
          return Random.pick([...evenData]);
        },
        endNode() {
          return Random.pick([...oddData]);
        },
      },
    ],
  });
  return data;
};

setupMock({
  setup() {
    Mock.mock(
      new RegExp('/api/resources/graph'),
      'get',
      (params: GetParams) => {
        const { type, status, severity, license, query } = qs.parseUrl(
          params.url
        ).query;
        const data = getMockData({ type, status, severity, license, query });
        return successResponseWrap({
          ...data,
          total: 1000,
        });
      }
    );
  },
});

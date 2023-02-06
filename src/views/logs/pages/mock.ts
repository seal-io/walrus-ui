import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { PostData, GetParams } from '@/types/global';
import qs from 'query-string';

const { Random } = Mock;

const data = Mock.mock({
  'list|55': [
    {
      'id|8': /[A-Z][a-z][-][0-9]/,
      'updateTime': Random.datetime('yyyy-MM-dd HH:mm:ss'),
      'year|1': ['2022'],
      'month|1': ['01', '02', '03', '04'],
      'day|1': [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
      ],
      'hour|10-23': 10,
      'min|10-59': 20,
      'sec|10-59': 30,
      'type|1': [
        'source_pull_request',
        'source_schedule',
        'package_push',
        'package_pull',
      ],
      'policy|1': [
        // 'Github源码仓库',
        // 'Docker构件仓库',
        // 'Maven构件仓库',
        // 'Gitlab源码仓库',
      ],
      'project|1': [
        'ML-For-Beginners',
        'termux-packages',
        'Walnut',
        'Cider',
        'youtube-dl',
        'neovim',
        'react-three-fiber',
        'BabylonJS',
      ],
      'objectLink|1': [
        'https://github.com/seal-io/seal/issues/7',
        'https://github.com/seal-io/seal/pull/18',
        'https://github.com/seal-io/seal/pull/14',
      ],
      'objectName|1': [
        'PR#16',
        'PR#11',
        'PR#8',
        'ubuntu:1404',
        'og4j-2.12.0',
        'myorg/app:v1.0',
        'master',
      ],
      'status|1': ['permit', 'block', 'warn', 'running'],
      'highRisk|1': [1, 2, 3],
      'middleRisk|1': [1, 2, 3],
      'lowRisk|1': [1, 2, 3],
      'risk': {
        high: Random.natural(1, 20),
        middle: Random.natural(1, 20),
        low: Random.natural(1, 20),
      },
    },
  ],
});
setupMock({
  setup() {
    Mock.mock(new RegExp(/\/events[^/]/), 'get', (params: GetParams) => {
      const { page = 1, perPage = 10 } = qs.parseUrl(params.url).query;
      const p = page as number;
      const ps = perPage as number;
      return successResponseWrap({
        data: data.list.slice((p - 1) * ps, p * ps),
        total: 55,
      });
    });
    Mock.mock(new RegExp('/events/10'), 'delete', () => {
      return successResponseWrap('ok');
    });
    Mock.mock(new RegExp('/events/10'), 'get', () => {
      return successResponseWrap('ok');
    });
  },
});

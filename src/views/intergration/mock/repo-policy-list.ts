import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { GetParams } from '@/types/global';
import qs from 'query-string';

const { Random } = Mock;

const data = Mock.mock({
  'list|55': [
    {
      'id|8': /[A-Z][a-z][-][0-9]/,
      'vendor|1': ['Aliyun', 'Tencent', 'Baidu', 'Huawei', 'Google'],
      'name|1': ['maven', 'docker', 'npm', 'conan'],
      'number': /(SEAL-)[A-Za-z0-9-]{10}/,
      'proxyUrl': Random.url('https'),
      'upstreamUrl': Random.url('https'),
      'level|1': [1, 2, 3],
      'status|1': [1, 2],
      'checkPolicy': Random.csentence(10, 20),
    },
  ],
});
setupMock({
  setup() {
    Mock.mock(new RegExp(/\/proxies[^/]/), 'get', (params: GetParams) => {
      const { page = 1, perPage = 10 } = qs.parseUrl(params.url).query;
      const p = page as number;
      const ps = perPage as number;
      return successResponseWrap({
        data: data.list.slice((p - 1) * ps, p * ps),
        total: 55,
      });
    });
  },
});

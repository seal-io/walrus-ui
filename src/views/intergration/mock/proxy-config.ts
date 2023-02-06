import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { GetParams } from '@/types/global';
import qs from 'query-string';

const { Random } = Mock;

const data = Mock.mock({
  id: '',
  createTime: '',
  updateTime: Random.datetime('yyyy-MM-DD HH:mm:ss'),
  name: Random.word(5, 9),
  type: 'github',
  path: '',
  upstreamUrl: Random.url('https'),
  proxyUrl: Random.url('https'),
});
setupMock({
  setup() {
    Mock.mock(new RegExp('/proxies/10'), 'get', (params) => {
      const { id } = qs.parseUrl(params.url).query;
      data.id = id;
      return successResponseWrap({
        ...data,
        id: params.id,
      });
    });
    // submit
    Mock.mock(new RegExp('/proxies'), 'post', () => {
      return successResponseWrap('ok');
    });
    // delete
    Mock.mock(new RegExp('/proxies/10'), 'delete', () => {
      return successResponseWrap('ok');
    });
  },
});

import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';

const data = Mock.mock({
  'id': '',
  'type|1': ['github', 'gitlab', 'gitee', 'coding'],
  'enable|1': [0, 1],
  'accessType|1': [1, 2],
  'apiToken': /(token-)[A-Za-z0-9-]{20}/,
  'enablePullRequestCommenting|1': [true, false],
  'enableScheduleEvaluation|1': [true, false],
});
setupMock({
  setup() {
    // get config detail
    Mock.mock(new RegExp('/source-control-managers/10'), 'get', (params) => {
      return successResponseWrap({
        ...data,
        id: params.id,
      });
    });
    // submit
    Mock.mock(new RegExp('/source-control-managers'), 'post', () => {
      return successResponseWrap('ok');
    });
  },
});

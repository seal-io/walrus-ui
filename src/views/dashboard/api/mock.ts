import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';

const { Random } = Mock;
const data = Mock.mock({
  'distribution|30': [
    {
      name: Random.word(5, 10),
      value: Random.natural(2, 20),
    },
  ],
  'rank|5': [
    {
      name: Random.word(5, 10),
      value: Random.natural(2, 20),
    },
  ],
});
setupMock({
  setup() {
    // get config detail
    Mock.mock(new RegExp('/api/statistics/_/licenses'), 'get', () => {
      return successResponseWrap({
        ...data,
      });
    });
  },
});

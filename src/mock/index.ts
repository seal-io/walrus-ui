import Mock from 'mockjs';

import './user';

import '@/views/profile/basic/mock';

import '@/components/graph/mock/graph';
import '@/views/user/info/mock';
import '@/views/user/setting/mock';
import '@/views/dashboard/api/mock';

Mock.setup({
  timeout: '600-1000',
});

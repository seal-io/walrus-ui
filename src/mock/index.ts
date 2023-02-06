import Mock from 'mockjs';

import './user';
import './message-box';

// import '@/views/dashboard/workplace/mock';

// import '@/views/dashboard/monitor/mock';

// import '@/views/list/card/mock';
// import '@/views/list/search-table/mock';

// import '@/views/form/step/mock';

// import '@/views/profile/basic/mock';
import '@/views/profile/basic/mock';

// import '@/views/visualization/data-analysis/mock';
// import '@/views/visualization/multi-dimension-data-analysis/mock';

// import '@/views/policy/pages/mock';
// import '@/views/logs/pages/mock';

// import '@/views/projects/mock/project-list';
// import '@/views/projects/mock/import-repo';

// import '@/views/intergration/mock/repo-policy-list';
// import '@/views/intergration/mock/repo-config';
// import '@/views/intergration/mock/proxy-config';

// import '@/views/user/info/mock';
// import '@/views/user/setting/mock';

import '@/components/graph/mock/graph';
import '@/views/user/info/mock';
import '@/views/user/setting/mock';
import '@/views/dashboard/api/mock';

Mock.setup({
  timeout: '600-1000',
});

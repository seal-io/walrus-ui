import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { PostData, GetParams } from '@/types/global';
import qs from 'query-string';

const { Random } = Mock;
const checkType = [
  '凭据检查',
  '内容检查',
  '基础架构检查',
  '漏洞检查',
  '静态应用程序安全测试',
  '许可证检查',
  '依赖检查',
];
const checkContent = [
  '用户凭据使用明文传输',
  '提交中包含二进制文件',
  '源码中存在 Log4Shell 漏洞',
  '源码中存在高危CVE漏洞',
  '发现SQL注入',
  '使用了不被允许的许可证',
  '包含禁用的依赖包',
];
const data = Mock.mock({
  'list|55': [
    {
      'id': 10,
      'number': /(SEAL-SC-SOURCE-)\d{1,2}/,
      'severity|1': ['high', 'low', 'medium'],
      'status|1': [0, 1, 2],
      'type|1': ['sastSecretLeaks', 'vulnerabilityCVSScore'],
      'conditions': {
        cvsParamsMetricMax: 3.9,
        cvsParamsMetricMin: 0.1,
        cvsParamsMetricName: 'baseScore',
      },
      'description|1': checkContent,
    },
  ],
});
const detail = Mock.mock({
  'id': /[A-Z][a-z][-][0-9]/,
  'number': /(SEAL-SC-SOURCE-)\d{1,2}/,
  'severity|1': ['high', 'low', 'medium'],
  'name': Random.word(3, 5),
  'status|1': [0, 1, 2],
  'type|1': ['sastSecretLeaks', 'vulnerabilityCVSScore'],
  'conditions': {
    cvsParamsMetricMax: 3.9,
    cvsParamsMetricMin: 0.1,
    cvsParamsMetricName: 'baseScore',
  },
  'actions|1': ['block'],
  'description|1': checkContent,
});
setupMock({
  setup() {
    Mock.mock(new RegExp(/\/policies[^/]/), (params: GetParams) => {
      const { page = 1, perPage = 10 } = qs.parseUrl(params.url).query;
      const p = page as number;
      const ps = perPage as number;
      return successResponseWrap({
        data: data.list.slice((p - 1) * ps, p * ps),
        total: 55,
      });
    });

    Mock.mock(new RegExp('/policies/10'), 'get', () => {
      return successResponseWrap({
        data: detail,
      });
    });
  },
});

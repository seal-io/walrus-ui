import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { GetParams } from '@/types/global';
import qs from 'query-string';

const { Random } = Mock;

const data = Mock.mock({
  'list|55': [
    {
      'id|8': /[A-Z][a-z][-][0-9]/,
      'time': Random.datetime('yyyy-MM-DD HH:mm:ss'),
      'events': Random.csentence(4),
      'source|1': ['github', 'gitlab', 'gitee', 'coding', 'bitbucket'],
      'namespace|1': [
        'microsoft',
        'termux',
        'TheCherno',
        'ciderapp',
        'ytdl-org',
        'neovim',
        'pmndrs',
        'BabylonJS',
      ],
      'description|1': [
        'Machine Learning for Beginners - A Curriculum',
        'This project contains scripts and patches to build packages for the Termux Android application.',
        'Walnut is a simple application framework built with Dear ImGui ',
        'A new cross-platform Apple Music experience based on Electron and Vue.js',
        'youtube-dl - download videos from youtube.com or other video platforms',
        'is a project that seeks to aggressively refactor Vim',
        'react-three-fiber is a React renderer for threejs.',
        'Babylon.js is a powerful, beautiful, simple, and open game and rendering engine',
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
      'status|1': [1, 2, 3, 4],
      'critical': Random.natural(1, 20),
      'highRisk|1': Random.natural(1, 20),
      'middleRisk|1': Random.natural(1, 20),
      'lowRisk|1': Random.natural(1, 20),
      'risk': {
        critical: Random.natural(1, 20),
        high: Random.natural(1, 20),
        middle: Random.natural(1, 20),
        low: Random.natural(1, 20),
      },
    },
  ],
});
setupMock({
  setup() {
    Mock.mock(
      new RegExp(`/source-control-managers/10/repositories`),
      (params: GetParams) => {
        const { page = 1, perPage = 10 } = qs.parseUrl(params.url).query;
        const p = page as number;
        const ps = perPage as number;
        return successResponseWrap({
          data: data.list.slice((p - 1) * ps, p * ps),
          total: 55,
        });
      }
    );
    Mock.mock(new RegExp(`/resources`), 'post', () => {
      return successResponseWrap('ok');
    });
  },
});

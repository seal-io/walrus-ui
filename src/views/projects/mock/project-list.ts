import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { PostData, GetParams } from '@/types/global';
import qs from 'query-string';
import { time } from 'console';

const { Random } = Mock;

const data = Mock.mock({
  'list|60': [
    {
      'id': /[A-Z][a-z][-][0-9]{6}/,
      'updateTime': Random.datetime('2021-MM-dd HH:mm:ss'),
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
      'events': Random.csentence(4),
      'url|1': [
        'https://github.com/microsoft/ML-For-Beginners',
        'https://github.com/termux/termux-packages',
        'https://github.com/TheCherno/Walnut',
        'https://github.com/ciderapp/Cider',
        'https://github.com/ytdl-org/youtube-dl',
        'https://github.com/sherlock-project/sherlock',
      ],
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
        'sherlock-project',
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
        'Hunt down social media accounts by username across social networks',
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
        'sherlock',
      ],
      'status|1': [1, 2, 3, 4],
      'critical': /\d{1}/,
      'highRisk|1-20': 1,
      'middleRisk|1-20': 1,
      'lowRisk': /[1-9]{1}/,
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
    Mock.mock(new RegExp(/\/resources[^/]/), 'get', (params: GetParams) => {
      const { page = 1, perPage = 10 } = qs.parseUrl(params.url).query;
      const p = page as number;
      const ps = perPage as number;
      return successResponseWrap({
        data: data.list.slice((p - 1) * ps, p * ps),
        total: 60,
        dataAnlayse: {
          integration: {
            github: Random.natural(0, 20),
            gitlab: Random.natural(0, 10),
            coding: Random.natural(0, 15),
            gitee: Random.natural(0, 10),
            bitbucket: Random.natural(0, 10),
          },
        },
      });
    });
    Mock.mock(new RegExp(`/resources/10`), 'delete', () => {
      return successResponseWrap('deleted success!');
    });
  },
});

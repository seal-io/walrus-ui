const proxyTableList = [
  'v1',
  'account',
  'proxy',
  'cli',
  'debug',
  'openapi',
  'verify-auth',
  'ws',
  'wss',
  'walrus-file-hub',
  'api'
];

export default function createProxyTable(remote?) {
  const proxyTable = proxyTableList.reduce((obj, api) => {
    let target = remote;
    if (api === 'api') {
      target = 'https://localhost:2746';
    } else {
      target = remote;
    }
    obj[`^/${api}`] = {
      target: target ? `${target}` : 'https://localhost',
      changeOrigin: true,
      secure: false,
      ws: true,
      rewrite: (pth) => pth.replace(`/^/${api}/`, `/${api}`),
      headers: {
        origin: target ? `${target}` : 'https://localhost'
      }
    };
    return obj;
  }, {});
  return proxyTable;
}

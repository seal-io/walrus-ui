const proxyTableList = [
  'v1',
  'account',
  'cli',
  'debug',
  'openapi',
  'verify-auth',
  'ws',
  'wss'
];

export default function createProxyTable(target?) {
  const proxyTable = proxyTableList.reduce((obj, api) => {
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

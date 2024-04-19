const proxyTableList = [
  'apis',
  'loopback',
  'identify',
  'account',
  'proxy',
  'cli',
  'debug',
  'openapi',
  'verify-auth',
  'ws',
  'wss',
  'walrus-file-hub'
];

export default function createProxyTable(target?) {
  const proxyTable = proxyTableList.reduce((obj, api) => {
    const newTarget = target || 'https://localhost';
    obj[`^/${api}`] = {
      target: newTarget,
      changeOrigin: true,
      secure: false,
      ws: true,
      rewrite: (pth) => pth.replace(`/^/${api}/`, `/${api}`),
      headers: {
        origin: newTarget
      }
    };
    return obj;
  }, {});
  return proxyTable;
}

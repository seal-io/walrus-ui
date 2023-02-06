const setRequestHeader = () => ({
  name: 'set-request-header',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      console.log('req====', req);
      req.setHeader('origin', 'https://192.168.1.8:4000');
      next();
    });
  },
});
export default setRequestHeader;

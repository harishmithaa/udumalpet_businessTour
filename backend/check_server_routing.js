const app = require('./app');

// Initialize lazyrouter if not already done
if (!app._router) {
  app.lazyrouter();
}

function printRoutes(app) {
  const routes = [];
  app._router.stack.forEach(middleware => {
    if (middleware.route) { // routes registered directly on the app
      routes.push(middleware.route);
    } else if (middleware.name === 'router') { // router middleware
      const base = middleware.regexp.toString()
        .replace('/^\\', '')
        .replace('\\/?(?=\\/|$)/i', '')
        .replace(/\\\//g, '/');
      
      middleware.handle.stack.forEach(handler => {
        if (handler.route) {
          const path = handler.route.path;
          const methods = Object.keys(handler.route.methods).join(',').toUpperCase();
          routes.push({
            path: base + path,
            methods
          });
        }
      });
    }
  });
  return routes;
}

console.log('--- REGISTERED EXPRESS ROUTES ---');
const routes = printRoutes(app);
routes.forEach(r => {
  console.log(`- [${r.methods}] ${r.path}`);
});
process.exit(0);

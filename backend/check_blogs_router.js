const router = require('./routes/blogs');

console.log('--- BLOGS ROUTER LAYERS ---');
router.stack.forEach((layer, idx) => {
  if (layer.route) {
    const path = layer.route.path;
    const methods = Object.keys(layer.route.methods).join(',').toUpperCase();
    console.log(`[${idx}] ${methods} ${path}`);
  } else {
    console.log(`[${idx}] Middleware: ${layer.name}`);
  }
});
process.exit(0);

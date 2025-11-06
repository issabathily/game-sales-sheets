const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Utiliser le port fourni par Render ou 3001 par défaut
const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';

server.use(middlewares);
server.use(router);

server.listen(PORT, HOST, () => {
  console.log(`JSON Server is running on http://${HOST}:${PORT}`);
  console.log(`Resources available at:`);
  console.log(`  http://${HOST}:${PORT}/games`);
  console.log(`  http://${HOST}:${PORT}/sheets`);
  console.log(`  http://${HOST}:${PORT}/users`);
});


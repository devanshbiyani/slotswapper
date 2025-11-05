require('dotenv').config();
const http = require('http');
const app = require('./app');
const { initWebsocket } = require('./controllers/websocket');

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

initWebsocket(server);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

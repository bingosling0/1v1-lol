const http = require('http');
const path = require('path');
const express = require('express');
const { createBareServer } = require('@tomphttp/bare-server-node');
const { uvPath } = require('@titaniumnetwork-dev/ultraviolet');

const app = express();
const server = http.createServer();
const bare = createBareServer('/bare/');
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));
app.use('/uv/', express.static(uvPath));

server.on('request', (req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
    return;
  }
  app(req, res);
});

server.on('upgrade', (req, socket, head) => {
  if (bare.shouldRoute(req)) {
    bare.routeUpgrade(req, socket, head);
    return;
  }
  socket.end();
});

server.listen(port, () => {
  console.log(`Unblocked Arcade running at http://localhost:${port}`);
});

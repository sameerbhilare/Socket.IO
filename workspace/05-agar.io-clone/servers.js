// This file's only job is to create socket.io server and express http server
const express = require('express');
const app = express();

// serve static files
app.use(express.static(__dirname + '/public'));

const socketio = require('socket.io');
// listen to http server
const expressServer = app.listen(3000);
// created socket.io server
const io = socketio(expressServer);
const helmet = require('helmet');
app.use(helmet());
console.log('Express and Socket.io servers are listening on port 3000');

// export both socket.io and express servers
module.exports = {
  app,
  io,
};

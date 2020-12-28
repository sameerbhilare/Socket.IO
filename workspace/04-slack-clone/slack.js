const express = require('express');
const socketio = require('socket.io');
const namespaces = require('./data/namespaces');

const app = express();

// serving static files
app.use(express.static(__dirname + '/public'));

// http server listening to port
const expressServer = app.listen(3000);

// socketio server piggybacking on express http server
// so our socket server is listening on the same port as http server.
// 'io' is our socketio server
const io = socketio(expressServer);

/* 1. JOIN THE MAIN NAMESPACE ('/') */
// when someone connects to socketio server, this callback runs
// 'connection' and 'connect' built-in events are literally exactly the same.
// io.on() is SAME as io.of('/).on() => main namespace
io.on('connection', (socket) => {
  /* 2. AS SOON AS SOMEBODY CONNECTS TO MAIN NS, SEND BACK NAMESPACES INFO */

  // A) build an array to send back img and endpoint for each namespace.
  let nsData = namespaces.map((ns) => {
    return { img: ns.img, endpoint: ns.endpoint };
  });

  // B) Send the nsData back to client.
  // Need to use socket, NOT io bcz we want to the data only to this client, NOT to everybody
  socket.emit('nsList', nsData);
});

// loop through each namespace and listen for connection
namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on('connection', (socket) => {
    console.log(`${socket.id} has joined namespace ${namespace.endpoint}`);
  });
});

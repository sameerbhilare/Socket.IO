const express = require('express');
const socketio = require('socket.io');

const app = express();

// serving static files
app.use(express.static(__dirname + '/public'));

// http server listening to port
const expressServer = app.listen(3000);

// socketio server piggybacking on express http server
// so our socket server is listening on the same port as http server.
// 'io' is our socketio server
const io = socketio(expressServer);

// when someone connects to socketio server, this callback runs
// 'connection' and 'connect' built-in events are literally exactly the same.
io.on('connection', (socket) => {
  // you will see the SAME socket.id for both at client side and here at server side.
  console.log(`socket.id => ${socket.id}`);

  // send message to client by emitting custom event 'messageFromServer'
  socket.emit('messageFromServer', {
    data: 'Welcome to the socket.io server!',
  });

  // listen to custom event 'messageToServer' from client
  socket.on('messageToServer', (dataFromClient) => {
    console.log(dataFromClient);
  });

  socket.on('newMessage', (msg) => {
    // send message to ALL clients. Hence using 'io'
    // if you use 'socket' instead of 'io', below emitted msg will go only to current socket
    io.emit('messageToClients', { text: msg.text });
  });
});

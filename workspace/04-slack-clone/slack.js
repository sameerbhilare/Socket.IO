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
// io.on() is SAME as io.of('/).on()
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

  // join a room
  socket.join('level1');
  // only this client will get this msg
  socket.emit(
    'joined',
    `${socket.id} has joined the level1 room. (Sending from socket)`
  );
  // all sockets connected to this namespace will get this message.Since it is sent from namespace.
  // io.of('/') returns main namespace
  io.of('/').emit(
    'joined',
    `${socket.id} has joined the level1 room. (Sending from Namespace)`
  );
});

io.of('/admin').on('connection', (socket) => {
  console.log(
    'Someone just connected to admin namespace. Admin socket.id=' + socket.id
  );
  io.of('/admin').emit('welcome', 'Welcome to the admin channel/namespace.');
});

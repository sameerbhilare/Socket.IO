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

  socket.on('newMessage', (msg) => {
    // send message to ALL clients. Hence using 'io'
    // if you use 'socket' instead of 'io', below emitted msg will go only to current socket
    io.emit('messageToClients', { text: msg.text });
    // below line is exactly same as above
    // io.of('/').emit('messageToClients', { text: msg.text });
  });

  /*
    The server can still communicate across name spaces as it has access to everything.
    but on the client, the socket needs to be in that name space in order to get the events.
  */
  /*
    Here we are inside main('/') namespace, but a server can communicate across different namespaces.

    it may happen that the client connected to main('/') namespace
    and server sends below message to admin namespace before the client could connect to the admin namespace.
    In this case, the client misses this message.
    So using setTimeout, just for testing. Never use this workaround in production :)
  */
  setTimeout(() => {
    io.of('/admin').emit(
      'welcome',
      'Welcome to the admin channel, from main channel.'
    );
  }, 2000);
});

io.of('/admin').on('connection', (socket) => {
  console.log(
    'Someone just connected to admin namespace. Admin socket.id=' + socket.id
  );
  io.of('/admin').emit('welcome', 'Welcome to the admin channel/namespace.');
});

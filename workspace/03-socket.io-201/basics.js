// we need http because we are not using express
const http = require('http');
// we need socket.io. It's 3rd party
const socketio = require('socket.io');

// creating http server
const server = http.createServer((req, res) => {
  res.end('I am connected');
});

// socketio server piggybacking on http server
const io = socketio(server);

io.on('connection', (socket, req) => {
  socket.emit('welcome', 'Welcome to the websocket server!!'); // ws.send becomes socket.emit

  socket.on('message', (msg) => {
    console.log(msg);
  });
});

server.listen(3000);

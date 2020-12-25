const socket = io('http://localhost:3000'); // this is a '/' namespace/endpoint
const adminSocket = io('http://localhost:3000/admin'); // this is a '/admin' namespace/endpoint

socket.on('connect', () => {
  // you will see the SAME socket.id for both at server side and here at client side.
  console.log(`socket.id => ${socket.id}`);
});

adminSocket.on('connect', () => {
  // you will see the SAME socket.id for both at server side and here at client side.
  console.log(`adminSocket.id => ${adminSocket.id}`);
});

adminSocket.on('welcome', (dataFromServer) => {
  // you will see the SAME socket.id for both at server side and here at client side.
  console.log(dataFromServer);
});

socket.on('messageFromServer', (dataFromServer) => {
  console.log(dataFromServer);

  socket.emit('messageToServer', { data: 'Hello from client !' });
});

document.getElementById('message-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const newMessage = document.getElementById('user-message').value;
  if (newMessage) {
    socket.emit('newMessage', { text: newMessage });
  }
});

const messagesElement = document.getElementById('messages');
socket.on('messageToClients', (msgFromServer) => {
  messagesElement.innerHTML += `<li>${msgFromServer.text}</li>`;
});

/*
        ping and pong are built in events.
        That's the heartbeat mechanism that maintains whether or not we're connected.
        The server uses - pingTimeout and pingInterval properties for ping and pong events.
    */
/*
    socket.on('ping', () => {
        console.log('Ping was received from server.');
    })

    socket.on('pong', (latency) => {
        console.log(`Pong was sent to server with latency ${latency}`);
    })
    */

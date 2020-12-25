const socket = io('http://localhost:3000'); // this is a '/' namespace/endpoint
const adminSocket = io('http://localhost:3000/admin'); // this is a '/admin' namespace/endpoint

socket.on('messageFromServer', (dataFromServer) => {
  console.log(dataFromServer);

  socket.emit('messageToServer', { data: 'Hello from client !' });
});

// the client has no idea that it's part of a room. It's just listening to the name space for event 'joined'
socket.on('joined', (msg) => {
  console.log(msg);
});

adminSocket.on('welcome', (dataFromServer) => {
  // you will see the SAME socket.id for both at server side and here at client side.
  console.log(dataFromServer);
});

document.getElementById('user-input').addEventListener('submit', (event) => {
  event.preventDefault();

  const newMessage = document.getElementById('user-message').value;
  if (newMessage) {
    socket.emit('newMessage', { text: newMessage });
  }
});

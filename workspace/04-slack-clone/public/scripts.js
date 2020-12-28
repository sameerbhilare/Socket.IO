const socket = io('http://localhost:3000'); // this is a '/' namespace/endpoint

socket.on('connect', () => {
  console.log(socket.id + ' connected.');
});

// listen for 'nsList' event, which will have all namespaces
socket.on('nsList', (nsData) => {
  /* 3. UPDATE DOM WITH NAMESPACE DATA */
  let namespacesDiv = document.querySelector('.namespaces');
  namespacesDiv.innerHTML = '';
  nsData.forEach((ns) => {
    // 'ns' is a random attribute here
    namespacesDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.img}"></div>`;
  });

  // Add click listeners for each namespace
  Array.from(document.getElementsByClassName('namespace')).forEach(
    (nsElement) => {
      nsElement.addEventListener('click', (event) => {
        const endpoint = nsElement.getAttribute('ns'); // get endpoint name attached to 'ns' attribute of 'namespace' div
        console.log(`${endpoint} I should go to now.`);
      });
    }
  );
});

socket.on('messageFromServer', (dataFromServer) => {
  console.log(dataFromServer);

  socket.emit('messageToServer', { data: 'Hello from client !' });
});

// the client has no idea that it's part of a room. It's just listening to the name space for event 'joined'
socket.on('joined', (msg) => {
  console.log(msg);
});

document.getElementById('user-input').addEventListener('submit', (event) => {
  event.preventDefault();

  const newMessage = document.getElementById('user-message').value;
  if (newMessage) {
    socket.emit('newMessage', { text: newMessage });
  }
});

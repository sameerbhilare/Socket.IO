function joinNS(endpoint) {
  /* 4. JOIN THE (CHAT) NAMESPACE. */
  const nsSocket = io(`http://localhost:3000${endpoint}`);
  nsSocket.on('nsRoomLoad', (nsRooms) => {
    // console.log(nsRooms);

    /* 6. UPDATE DOM WITH ROOM INFO FOR GIVEN NAMESPACE. */
    let roomListDiv = document.querySelector('.room-list');
    roomListDiv.innerHTML = '';
    nsRooms.forEach((nsRoom) => {
      let glyph;
      if (nsRoom.privateRoom) {
        glyph = 'lock';
      } else {
        glyph = 'globe';
      }

      roomListDiv.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${nsRoom.roomTitle}</li>`;
    });

    // Add click listeners for each ROOM
    Array.from(document.getElementsByClassName('room')).forEach((roomEle) => {
      roomEle.addEventListener('click', (event) => {
        console.log('Someone clicked on ' + event.target.innerText);
      });
    });
  });

  // receive msg from server
  nsSocket.on('messageToClients', (msg) => {
    console.log(msg);
    document.querySelector('#messages').innerHTML += `<li>${msg}</li>`;
  });

  // send msg to server
  document.getElementById('user-input').addEventListener('submit', (event) => {
    event.preventDefault();

    const newMessage = document.getElementById('user-message').value;
    if (newMessage) {
      nsSocket.emit('newMessageToServer', { text: newMessage });
    }
  });
}

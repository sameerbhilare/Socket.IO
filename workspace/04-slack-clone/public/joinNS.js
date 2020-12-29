function joinNS(endpoint) {
  if (nsSocket) {
    // if nsSocket is already created, close it before creating a new one.
    // that's because we should disconnect/close socket when we leave a namespace
    console.log('Closing ' + nsSocket.id);
    nsSocket.close();

    // remove the submit button event listener before it is added again.
    document
      .getElementById('user-input')
      .removeEventListener('submit', formSubmissionCallback);
  }
  /* 4. JOIN THE (CHAT) NAMESPACE. */
  nsSocket = io(`http://localhost:3000${endpoint}`);
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
        // join selected room
        joinRoom(event.target.innerText);
      });
    });

    // Join a room automatically... for first time
    const topRoom = document.querySelector('.room'); // returns element with first occurance of 'room' class
    const topRoomName = topRoom.innerText;
    console.log(topRoomName);
    // Join top room
    joinRoom(topRoomName);
  });

  // receive msg from server
  nsSocket.on('messageToClients', (msg) => {
    console.log(msg);
    document.querySelector('#messages').innerHTML += buildHTMLMessage(msg);
  });

  // send msg to server
  document
    .getElementById('user-input')
    .addEventListener('submit', formSubmissionCallback);
}

function formSubmissionCallback(event) {
  event.preventDefault();

  const newMessage = document.getElementById('user-message').value;
  document.getElementById('user-message').value = ''; // reset form

  if (newMessage) {
    nsSocket.emit('newMessageToServer', { text: newMessage });
  }
}

function buildHTMLMessage(msg) {
  const convertedDate = new Date(msg.time).toLocaleString();
  const newHTML = `
    <li>
        <div class="user-image">
            <img src="${msg.avatar}" />
        </div>
        <div class="user-message">
            <div class="user-name-time">${msg.username} <span>${convertedDate}</span></div>
            <div class="message-text">${msg.text}</div>
        </div>
    </li>
    `;
  return newHTML;
}

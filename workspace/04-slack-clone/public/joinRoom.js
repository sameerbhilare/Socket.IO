function joinRoom(roomName) {
  // Send this room name to server and also pass acknowledgement callback
  nsSocket.emit('joinRoom', roomName, (newNumberOfMembers) => {
    // Sending this callback to the server so that it will be called by the server
    // we want to update the room number total now that we have joined
    // commenting below code as this is being handled by 'updateMembers' server event.
    // this commented piece of code was to demonstrate the ACK arg function available to the socket.on function
    /*
    document.querySelector(
      '.curr-room-num-users'
    ).innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span>`;
    */
  });

  // get the chat history
  nsSocket.on('historyCatchup', (history) => {
    // console.log(history);
    /* 9. UPDATE THE DOM WITH CHAT HISTORY ON JOINING */
    const messagesEle = document.querySelector('#messages');
    messagesEle.innerHTML = ''; // wipe everything out
    history.forEach((msg) => {
      messagesEle.innerHTML += buildHTMLMessage(msg);
    });

    // scroll to the bottom of the messages div so that user will see latest message which is at the bottom
    messagesEle.scrollTo(0, messagesEle.scrollHeight);
  });

  // get number of users joining this room
  nsSocket.on('updateMembers', (numberOfUsersJoined) => {
    console.log('updateMembers ' + numberOfUsersJoined);
    document.querySelector(
      '.curr-room-num-users'
    ).innerHTML = `${numberOfUsersJoined} <span class="glyphicon glyphicon-user"></span>`;

    document.querySelector('.curr-room-text').innerText = roomName;
  });

  // listen to the search input change event
  let searchBoxEle = document.getElementById('search-box');
  console.log(searchBoxEle);
  searchBoxEle.addEventListener('input', (e) => {
    let messages = Array.from(document.getElementsByClassName('message-text'));
    //console.log(searchBoxEle.value);
    console.log('messages', messages);
    messages.forEach((msg) => {
      // case insensitive search
      if (
        msg.innerText.toLowerCase().indexOf(e.target.value.toLowerCase()) === -1
      ) {
        // message does not contain user searched input text, so hide the message
        msg.style.display = 'none';
      } else {
        msg.style.display = 'block';
      }
    });
  });
}

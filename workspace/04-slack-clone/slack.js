const express = require('express');
const socketio = require('socket.io');
const namespaces = require('./data/namespaces');

const app = express();

// serving static files
app.use(express.static(__dirname + '/public'));

// http server listening to port
const expressServer = app.listen(3000);

// socketio server piggybacking on express http server
// so our socket server is listening on the same port as http server.
// 'io' is our socketio server
const io = socketio(expressServer);

/* 1. JOIN THE MAIN NAMESPACE ('/') */
// when someone connects to socketio server, this callback runs
// 'connection' and 'connect' built-in events are literally exactly the same.
// io.on() is SAME as io.of('/).on() => main namespace
io.on('connection', (socket) => {
  /* 2. AS SOON AS SOMEBODY CONNECTS TO MAIN NS, SEND BACK NAMESPACES INFO */

  // A) build an array to send back img and endpoint for each namespace.
  let nsData = namespaces.map((ns) => {
    return { img: ns.img, endpoint: ns.endpoint };
  });

  // B) Send the nsData back to client.
  // Need to use socket, NOT io bcz we want to the data only to this client, NOT to everybody
  socket.emit('nsList', nsData);
});

// loop through each namespace and listen for connection
namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on('connection', (nsSocket) => {
    console.log(`${nsSocket.id} has joined namespace ${namespace.endpoint}`);

    /* 5. ONCE A SOCKET IS CONNECTED TO ONE OF OUR NAMESPACES, SEND THAT NS'S ROOM INFO BACK. */
    nsSocket.emit('nsRoomLoad', namespaces[0].rooms);

    // listen to 'joinRoom event -> join the room and send back room chat history
    nsSocket.on('joinRoom', (roomToJoin, numberOfUsersCallback) => {
      /* 7. JOIN TO SELECTED ROOM */
      nsSocket.join(roomToJoin);

      // Below commented code is to demonstrate the ACK arg function available to the socket.on function
      // get the total number of clients connected to this room & call the callback sent from client
      /*
      io.of(namespace.endpoint)
        .in(roomToJoin)
        .clients((error, clients) => {
          // call the callback sent from client
          numberOfUsersCallback(clients.length);
        });
      */

      /* 8. SEND THE CHAT HISTORY ON JOINING A ROOM. */
      // we need to find the Room object for this room
      const nsRoom = namespace.rooms.find(
        (room) => room.roomTitle === roomToJoin
      );
      // console.log(nsRoom);
      // send the history to the client who just joined
      nsSocket.emit('historyCatchup', nsRoom.history);

      // send back number of users in the room to ALL sockets connected to THIS room.
      io.of(namespace.endpoint)
        .in(roomToJoin)
        .clients((error, clients) => {
          console.log(
            `There are ${clients.length} users in the ${roomToJoin} room`
          );

          io.of(namespace.endpoint)
            .in(roomToJoin)
            .emit('updateMembers', clients.length);
        });
    });

    // listen to client messages
    nsSocket.on('newMessageToServer', (msg) => {
      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        username: 'Sameer',
        avatar: 'https://via.placeholder.com/30', // placeholder image of size 30 x 30
      };

      /**************/
      // send this message to ALL the sockets that are in the room that THIS socket is in.

      // every socket joins its own room immediately upon connection to a namespace.
      // The second thing will always be the next room.
      console.log(nsSocket.rooms);
      const roomTitle = Object.keys(nsSocket.rooms)[1]; // 0th key will always be of the socket's OWN room

      // we need to find the Room object for this room
      const nsRoom = namespace.rooms.find(
        (room) => room.roomTitle === roomTitle
      );
      // add the message to the room's chat history
      nsRoom.addMessage(fullMsg);

      // using 'io' instead of nsSocket (namespace) so that everyone including this socket will get this msg
      io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', fullMsg);
    });
  });
});

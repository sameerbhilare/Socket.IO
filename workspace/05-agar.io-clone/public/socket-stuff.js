let socket = io.connect('http://localhost:3000');

// this function gets called when user clicks on the Start Game button
function init() {
  // start drawing screen
  // It internally keeps recursively calling itself beause we have used requestAnimationFrame(draw)
  draw();

  // send 'init' event to server so that server does initialization
  // and sends back 'initReturn' event with some relevant data like orbs
  socket.emit('init', {
    // player.name is set in ui-stuff.js
    playerName: player.name,
  });
}

// server sends back 'initReturn' event with some relevant data like orbs
socket.on('initReturn', (data) => {
  // console.log(data.orbs);
  // orbs is gloabal variable declared in ui-stuff.js
  orbs = data.orbs;
});

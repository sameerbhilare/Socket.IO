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
// this gets called only once because it is part of server's response to the client's 'init' event (above).
// And the client's 'init' event will fire only once when user clicks on Strt Game button
socket.on('initReturn', (data) => {
  // console.log(data.orbs);
  // orbs is gloabal variable declared in ui-stuff.js
  orbs = data.orbs;

  // send 'tick' event EVERY 33ms and pass THIS player's x and y coordinates
  setInterval(() => {
    socket.emit('tick', {
      xVector: player.xVector || 0,
      yVector: player.yVector || 0,
    });
  }, 33);
});

// listen to the server 'tock' event to get ALL players data
socket.on('tock', (data) => {
  // console.log(data);
  // players is declared in ui-stuff.js
  players = data.players;
});

socket.on('orbSwitch', (data) => {
  // remove the orb and add new orb
  orbs.splice(data.orbIndex, 1, data.newOrb);
});

// 'tickTock' message to THIS socket ONLY at 30fps and get THIS player's X and Y locations
socket.on('tickTock', (data) => {
  // player is declared in ui-stuff.js
  player.locX = data.playerX;
  player.locY = data.playerY;
});

// listen to updated leaderboard event
socket.on('updateLeaderBoard', (data) => {
  let leaderBoardEle = document.querySelector('.leader-board');
  leaderBoardEle.innerHTML = '';

  data.forEach((currPlayer) => {
    leaderBoardEle.innerHTML += `<li class='leaderboard-player'>${currPlayer.name} - ${currPlayer.score}</li>`;
  });
});

socket.on('playerDeath', (data) => {
  console.log(`${data.died.name} absorbed by ${data.killedBy.name}`);
  document.getElementById(
    'game-message'
  ).innerHTML = `${data.died.name} absorbed by ${data.killedBy.name}`;
  $('#game-message').css({
    'background-color': '#00e6e6',
    opacity: 1,
  });
  $('#game-message').show();
  // fadeout after 5 seconds
  $('#game-message').fadeOut(5000);
});

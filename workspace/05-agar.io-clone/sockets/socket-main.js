// this is where our main socket stuff will go
const io = require('../servers').io;
const Orb = require('./classes/Orb');

let orbs = [];

// call init game on load
initGame();

io.sockets.on('connect', (socket) => {
  socket.emit('init', { orbs });
});

// run at the beginning of each game
function initGame() {
  for (i = 0; i < 500; i++) {
    orbs.push(new Orb());
  }
}

module.exports = io;

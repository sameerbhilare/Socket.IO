// this is where our main socket stuff will go
const io = require('../servers').io;
const Orb = require('./classes/Orb');
const Player = require('./classes/Player');
const PlayerConfig = require('./classes/PlayerConfig');
const PlayerData = require('./classes/PlayerData');

let orbs = [];
// default game settings
let settings = {
  defaultOrbs: 500, // number of orbs
  defaultSpeed: 6, // how fast a player should move
  defaultSize: 6, // radius
  // as player gets bigger the zoom needs to go out
  // because once a player gets really big, it's very possible for the orb to take up the whole screen.
  defaultZoom: 1.5,
  worldWidth: 500,
  worldHeight: 500,
};

// call init game on load
initGame();

io.sockets.on('connect', (socket) => {
  // a player has connected now.

  // make PlayerConfig object
  let playerConfig = new PlayerConfig(settings);
  // make PlayerData object
  let playerData = new PlayerData(null, settings);
  // make master Player object which will hold both PlayerConfig and PlayerData
  let player = new Player(socket.id, playerConfig, playerData);

  socket.emit('init', { orbs });
});

// run at the beginning of each game
function initGame() {
  for (i = 0; i < settings.defaultOrbs; i++) {
    orbs.push(new Orb(settings));
  }
}

module.exports = io;

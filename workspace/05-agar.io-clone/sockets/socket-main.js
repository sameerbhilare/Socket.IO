// this is where our main socket stuff will go
const io = require('../servers').io;
const Orb = require('./classes/Orb');
const Player = require('./classes/Player');
const PlayerConfig = require('./classes/PlayerConfig');
const PlayerData = require('./classes/PlayerData');

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

// orbs
let orbs = [];
// players - PlayerData array
let players = [];

// call init game on load
initGame();

io.sockets.on('connect', (socket) => {
  // a player has connected now.

  // listening to client's request for init
  socket.on('init', (data) => {
    // make PlayerConfig object
    let playerConfig = new PlayerConfig(settings);
    // make PlayerData object
    let playerData = new PlayerData(data.playerName, settings);
    // make master Player object which will hold both PlayerConfig and PlayerData
    let player = new Player(socket.id, playerConfig, playerData);

    // return orbs as response to the client's 'init' event
    socket.emit('initReturn', { orbs });

    players.push(playerData);
  });
});

// run at the beginning of each game
function initGame() {
  for (i = 0; i < settings.defaultOrbs; i++) {
    orbs.push(new Orb(settings));
  }
}

module.exports = io;

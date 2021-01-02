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
  let player = {};

  // listening to client's request for init
  socket.on('init', (data) => {
    // add the player to the 'game' room
    socket.join('game');
    // make PlayerConfig object
    let playerConfig = new PlayerConfig(settings);
    // make PlayerData object
    let playerData = new PlayerData(data.playerName, settings);
    // make master Player object which will hold both PlayerConfig and PlayerData
    player = new Player(socket.id, playerConfig, playerData);
    console.log('playerData: ', playerData.locX, playerData.locY);

    // issue a 'tock' message to EVERY socket connected at 'game' room at 30fps
    setInterval(() => {
      //console.log(player.playerData.locX, player.playerData.locY);
      io.to('game').emit('tock', {
        players,
        playerX: player.playerData.locX,
        playerY: player.playerData.locY,
      });
    }, 33);

    // return orbs as response to the client's 'init' event
    socket.emit('initReturn', { orbs });

    players.push(playerData);
  });

  // client sends the 'tick' event, that means we now to which direction to move the player
  socket.on('tick', (data) => {
    let speed = player.playerConfig.speed;
    // update playerconfig object with new direction
    player.playerConfig.xVector = data.xVector;
    player.playerConfig.yVector = data.yVector;
    // local variable
    let xV = data.xVector;
    let yV = data.yVector;

    //console.log(xV, yV);

    /*
      Logic here checks to see if the users trying to go off the page 
      or the players trying to go off off the grid. 
      1. Ours is below 5 and bigger than 500. That's the only way we'll will allow them to move along the y.
      2. The same thing is true here for our in between 5 and 500 for the X.
      3. If they're not trying to pull either of those off then we move them in both directions
      Move the user on the line by their speed.
      Move them within the bounds of the game.
    */

    if (
      (player.playerData.locX < 5 && player.playerData.xVector < 0) ||
      (player.playerData.locX > settings.worldWidth && xV > 0)
    ) {
      player.playerData.locY -= speed * yV;
    } else if (
      (player.playerData.locY < 5 && yV > 0) ||
      (player.playerData.locY > settings.worldHeight && yV < 0)
    ) {
      player.playerData.locX += speed * xV;
    } else {
      player.playerData.locX += speed * xV;
      player.playerData.locY -= speed * yV;
    }
    console.log('tick=> ', speed, player.playerData.locX, player.playerData.locY);
  });
});

// run at the beginning of each game
function initGame() {
  for (i = 0; i < settings.defaultOrbs; i++) {
    orbs.push(new Orb(settings));
  }
}

module.exports = io;

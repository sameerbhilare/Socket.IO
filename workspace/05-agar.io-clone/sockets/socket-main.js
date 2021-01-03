// this is where our main socket stuff will go
const io = require('../servers').io;
const Orb = require('./classes/Orb');
const Player = require('./classes/Player');
const PlayerConfig = require('./classes/PlayerConfig');
const PlayerData = require('./classes/PlayerData');
const checkForOrbCollisions = require('./check-collisions').checkForOrbCollisions;
const checkForPlayerCollisions = require('./check-collisions').checkForPlayerCollisions;

// default game settings
let settings = {
  defaultOrbs: 50, // number of orbs
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

// issue a 'tock' message to EVERY socket connected at 'game' room at 30fps
setInterval(() => {
  if (players.length > 0) {
    // using 'tock' event from server side and then 'tick' event from client side
    io.to('game').emit('tock', {
      players, // send data of all connected players
    });
  }
}, 33); // there are 30 33s in 1000 ms OR 1/30th of a second OR 1 of 30 frames per second

io.sockets.on('connect', (socket) => {
  console.log(socket.id);
  // a player has connected now.
  let player = {};

  // listening to client's request for init
  socket.on('init', (data) => {
    console.log('init', data);
    // add player to the 'game' room
    socket.join('game');
    // make PlayerConfig object
    let playerConfig = new PlayerConfig(settings);
    // make PlayerData object
    let playerData = new PlayerData(data.playerName, settings);
    // make master Player object which will hold both PlayerConfig and PlayerData
    player = new Player(socket.id, playerConfig, playerData);

    // issue a 'tickTock' message to THIS socket ONLY and pass THIS player's X and Y locations at 30fps
    setInterval(() => {
      // using 'tock' event from server side and then 'tick' event from client side
      socket.emit('tickTock', {
        playerX: player.playerData.locX, // THIS player's location X, so that the client knows where to clamp the camera/viewport
        playerY: player.playerData.locY, // THIS player's location Y, so that the client knows where to clamp the camera/viewport
      });
    }, 33); // there are 30 33s in 1000 ms OR 1/30th of a second OR 1 of 30 frames per second

    // return orbs as response to the client's 'init' event
    socket.emit('initReturn', { orbs });

    players.push(playerData);
  });

  // listen to client's 'tick' event
  // get the player's x and y coordinates. That means we know what direction to move the socket
  socket.on('tick', (data) => {
    // console.log(player);
    speed = player.playerConfig.speed;
    // update the playerConfig object with new directions
    // also at the same time store this in local variables for readability
    xV = player.playerConfig.xVector = data.xVector;
    yV = player.playerConfig.yVector = data.yVector;

    /*
        This must be done at server side as opposed to client side 
        because a savvy JS developer could exploit this if this code is at client side.
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

    // ORBS COLLISION
    let capturedOrbs = checkForOrbCollisions(
      player.playerData,
      player.playerConfig,
      orbs,
      settings
    );

    capturedOrbs
      .then((data) => {
        // collision happened
        console.log(`Orbs Collision at ${data}`);
        // if there is a collision we want to emit that to everybody
        // because it doesn't matter what player ran into the orb that orb is removed from the board.
        const orbData = {
          orbIndex: data,
          newOrb: orbs[data],
        };
        io.sockets.emit('orbSwitch', orbData);
        // every socket needs to know that leader board has changed
        io.sockets.emit('updateLeaderBoard', getLeaderBoard());
      })
      .catch(() => {
        // no collision
      });

    // PLAYERS COLLISION
    let playerDeath = checkForPlayerCollisions(
      player.playerData,
      player.playerConfig,
      players,
      player.socketId
    );
    playerDeath
      .then((data) => {
        // player collision
        console.log('Player collision');
        // every socket needs to know that leader board has changed
        io.sockets.emit('updateLeaderBoard', getLeaderBoard());
        // broadcast player death to everyone
        io.sockets.emit('playerDeath', data);
      })
      .catch(() => {
        // no player collision
      });
  });

  socket.on('disconnect', (data) => {
    // console.log(data);

    // avoid nullpointer in case when player has connected the socket and has not joined the game yet
    // but then they disconnect, then they won't have playerData setup yet
    if (player.playerData) {
      players.forEach((currPlayer, i) => {
        if (currPlayer.uid === player.playerData.uid) {
          // remove the player (who just left) from the players list
          players.splice(i, 1);
          // update the leaderboard
          io.sockets.emit('updateLeaderBoard', getLeaderBoard());
        }
      });
    }
  });
});

function getLeaderBoard() {
  // sort players in desc order
  players.sort((a, b) => b.score - a.score);
  let leaderBoard = players.map((currPlayer) => {
    return {
      name: currPlayer.name,
      score: currPlayer.score,
    };
  });
  return leaderBoard;
}

// run at the beginning of each game
function initGame() {
  for (i = 0; i < settings.defaultOrbs; i++) {
    orbs.push(new Orb(settings));
  }
}

module.exports = io;

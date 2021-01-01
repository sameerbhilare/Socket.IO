/*
    The player class is going to have 
    - an ID : Socket ID
    - PlayerData object: what everybody needs to know about everybody else. We have to store that somewhere.
    - PlayerConfig object: server needs to know about an individual client but nobody else needs to know.

    We're grouping them together in this one big thing. 
    So the server can keep track of all the data that belongs to a given player 
    but we're segregating them internally because we only want to send out some data to everybody 
    and we need to keep this data just for ourselves.
*/
class Player {
  constructor(socketId, playerConfig, playerData) {
    this.socketId = socketId;
    this.playerConfig = playerConfig;
    this.playerData = playerData;
  }
}

module.exports = Player;

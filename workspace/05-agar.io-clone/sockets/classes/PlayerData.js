// what everybody needs to know about everybody else. We have to store that somewhere.
const { v4: uuidv4 } = require('uuid');

class PlayerData {
  constructor(playerName, settings) {
    // we should not use socketid as unique id and pass to client because of security reasons, socket id should not be exposed to clients
    this.uid = uuidv4(); // random unique id for player
    this.name = playerName;
    this.locX = Math.floor(settings.worldWidth * Math.random() + 100);
    this.locY = Math.floor(settings.worldHeight * Math.random() + 100);
    this.radius = settings.defaultSize;
    this.color = this.getRandomColor();
    this.score = 0;
    this.orbsAbsorbed = 0;
  }

  getRandomColor() {
    // get random number between 50 and 250 for each color
    const r = Math.floor(Math.random() * 200 + 50);
    const g = Math.floor(Math.random() * 200 + 50);
    const b = Math.floor(Math.random() * 200 + 50);
    return `rgb(${r}, ${g}, ${b})`;
  }
}

module.exports = PlayerData;

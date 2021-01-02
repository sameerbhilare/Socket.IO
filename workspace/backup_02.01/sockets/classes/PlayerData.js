// what everybody needs to know about everybody else. We have to store that somewhere.
class PlayerData {
  constructor(playerName, settings) {
    this.name = playerName;
    this.locX = Math.floor(settings.worldWidth * Math.random() + 100);
    this.locY = Math.floor(settings.worldHeight * Math.random() + 100);
    this.radius = settings.defaultSize;
    this.color = this.getRandomColor();
    this.score = 0;
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

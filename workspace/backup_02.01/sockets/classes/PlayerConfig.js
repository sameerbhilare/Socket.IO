// server needs to know about an individual client but nobody else needs to know.
class PlayerConfig {
  constructor(settings) {
    // mouse poistions
    this.xVector = 0;
    this.yVector = 0;

    this.speed = settings.defaultSpeed;
    this.zoom = settings.defaultZoom;
  }
}

module.exports = PlayerConfig;

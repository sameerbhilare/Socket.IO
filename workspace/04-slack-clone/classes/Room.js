class Room {
  constructor(roomId, roomTitle, namespace, privateRoom = false) {
    this.roomId = roomId;
    this.roomTitle = roomTitle;
    this.namespace = namespace;
    this.privateRoom = privateRoom;
    this.history = []; // to maintain history of the chats
  }
  addMessage(message) {
    this.history.push(message);
  }
  clearHistory() {
    this.history = [];
  }
}

module.exports = Room;

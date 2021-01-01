let socket = io.connect('http://localhost:3000');

socket.on('init', (data) => {
  // console.log(data.orbs);
  // orbs is gloabal variable declared in ui-stuff.js
  orbs = data.orbs;
});

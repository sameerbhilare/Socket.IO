// everything related to DOM manipulations

let wHeight = $(window).height();
let wWidth = $(window).width();
let player = {}; // all about player
let orbs = []; // orbs

let canvas = document.getElementById('the-canvas');
// we are going to draw 2d on the canvas
let context = canvas.getContext('2d');
// set canvas dimensions
canvas.height = wHeight;
canvas.width = wWidth;

// on page load, show login modal
$(window).load(() => {
  $('#loginModal').modal('show');
});

// submit event handler
$('.name-form').submit((event) => {
  event.preventDefault(); // to avoid page refresh
  // save player name
  player.name = document.getElementById('name-input').value;
  // close the login modal
  $('#loginModal').modal('hide');
  // show next modal
  $('#spawnModal').modal('show');
  // show player name on UI
  document.querySelector('.player-name').innerHTML = player.name;
});

// start game listener
$('.start-game').click((event) => {
  // hide all modals
  $('.modal').modal('hide');
  // show score and leader board
  $('.hiddenOnStart').removeAttr('hidden');

  // initialize
  init();
});

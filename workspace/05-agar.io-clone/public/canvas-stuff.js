// everything related to drawing on the canvas

// ==============================
// ========== DRAWING ===========
// ==============================

/*
    Every time this draw function gets called and it's going to get called every single frame,
    we will draw the player in a new spot, if they have if they have moved the mouse at all.
*/
function draw() {
  // reset the context translatino back to default bcz context.translate down below is accumulative
  // this should happen first, before clearRect()
  context.setTransform(1, 0, 0, 1, 0, 0);

  // it tells the canvas (the screen) to start at 0,0 which is the upper left corner of the screen
  // and draw a rectangle down to canvas with canvas height which is going to be the bottom right corner
  // of the canvas and clear everything out.
  // i.e. every time we draw a frame, wipe the entire canvas out
  context.clearRect(0, 0, canvas.width, canvas.height);

  // clamp the camera/viewport to the player
  const camX = -player.locX + canvas.width / 2;
  const camY = -player.locY + canvas.height / 2;
  console.log(camX, camY);
  // move the canvas around
  context.translate(camX, camY);

  // ================
  // Draw all players including THIS player/client
  players.forEach((p) => {
    // inform that we are about to start drawing
    context.beginPath();

    // this means whatever we draw will be filled with given color - e.g. red
    context.fillStyle = p.color;

    // draw a circle
    // arg 1,2 = x,y of the center of the arc
    // arg 3   = radius of the arc
    // arg 4   = where to start drawing the arc/circle in radians (0 means 3 'o clock)
    // arg 5   = where to stop drawing the arc/circle in radians
    // 1 Math.PI = half circle, 2 Math.PI = full circle
    context.arc(p.locX, p.locY, p.radius, 0, Math.PI * 2);
    // actually fills in/draws
    context.fill();

    // draw border around
    // border width
    context.line = 3; // 3px
    // border color
    context.strokeStyle = 'rgb(0, 255, 0)';
    // border draw
    context.stroke();
  });

  // ================
  // Draw orbs
  orbs.forEach((orb) => {
    // get us a new path which will disconnect us from the old one
    context.beginPath();
    // this means whatever we draw will be filled with given color - e.g. red
    context.fillStyle = orb.color;
    // draw a circle
    // arg 1,2 = x,y of the center of the arc
    // arg 3   = radius of the arc
    // arg 4   = where to start drawing the arc/circle in radians (0 means 3 'o clock)
    // arg 5   = where to stop drawing the arc/circle in radians
    // 1 Math.PI = half circle, 2 Math.PI = full circle
    context.arc(orb.locX, orb.locY, orb.radius, 0, Math.PI * 2);
    // actually fills in/draws
    context.fill();
  });

  /*
    Recursively call the 'draw' function forever for every new frame that the browser is capable of running.
    So let's say if it's running at roughly 30 frames a second, then This will call draw 30 frames a second.
    So it's kind of a safe while loop for our game.
  */
  requestAnimationFrame(draw);
}

/*
    Add a listener so that as the mouse moves around, we can make our player move.
    So we're going to need to update randomX and randomY.

    There isn't really animation going on here. All we're doing is calling draw over and over again.
    And every time we draw the arc of the circle, we're drawing a different x and a different y.
    That's the only thing that's actually changing is that every time we draw, we draw so fast 
    in a different position that it looks like it's moving.

    We need to figure out where and what direction to move the player relative to the mouse position.    
*/
canvas.addEventListener('mousemove', (event) => {
  // console.log(event);

  // extract mouse position to x and y coordinates
  const mousePosition = {
    x: event.clientX,
    y: event.clientY,
  };

  // angle relative to our player, the angle degree that we need to go towards.
  const angleDeg =
    (Math.atan2(mousePosition.y - canvas.height / 2, mousePosition.x - canvas.width / 2) * 180) /
    Math.PI;

  if (angleDeg >= 0 && angleDeg < 90) {
    // mouse is in the lower right quadron relative to center of the screen. bcz 0 radians = 3 'o clock, 90 radians = 6 'o clock
    // console.log('mouse is in the lower right quadron relative to center of the screen.');
    // find the line up to that point from the center and then we use that down to actually move them
    xVector = 1 - angleDeg / 90;
    yVector = -(angleDeg / 90);
  } else if (angleDeg >= 90 && angleDeg <= 180) {
    // mouse is in the lower left quadron relative to center of the screen. bcz 90 radians = 6 'o clock, 180 radians = 9 'o clock
    // console.log('mouse is in the lower left quadron relative to center of the screen.');
    xVector = -(angleDeg - 90) / 90;
    yVector = -(1 - (angleDeg - 90) / 90);
  } else if (angleDeg >= -180 && angleDeg < -90) {
    // mouse is in the upper left quadron relative to center of the screen. bcz -180 radians = 9 'o clock, -90 radians = 12 'o clock
    // console.log('mouse is in the upper left quadron relative to center of the screen.');
    xVector = (angleDeg + 90) / 90;
    yVector = 1 + (angleDeg + 90) / 90;
  } else if (angleDeg < 0 && angleDeg >= -90) {
    // mouse is in the upper right quadron relative to center of the screen. bcz 0 radians = 3 'o clock, -90 radians = 12 'o clock
    // console.log('mouse is in the upper right quadron relative to center of the screen.');
    xVector = (angleDeg + 90) / 90;
    yVector = 1 - (angleDeg + 90) / 90;
  }

  player.xVector = xVector;
  player.yVector = yVector;
});

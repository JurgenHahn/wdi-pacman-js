// Setup initial game stats
var score = 0;
var lives = 2;
var dots = 240;
var level = 1;
var powerPellets = 4;
var ghostsEaten = 0.5;
var powerPelletAvailable = true;



// Define your ghosts here
var inky = {
  menu_option: '1',
  name: 'Inky',
  colour: 'Red',
  character: 'Shadow',
  edible: false
};

var blinky = {
  menu_option: '2',
  name: 'Blinky',
  colour: 'Cyan',
  character: 'Speedy',
  edible: false
};

var pinky = {
  menu_option: '3',
  name: 'Pinky',
  colour: 'Pink',
  character: 'Bashful',
  edible: false
};

var clyde = {
  menu_option: '4',
  name: 'Clyde',
  colour: 'Orange',
  character: 'Pokey',
  edible: false
};

var ghosts = [inky, blinky, pinky, clyde]

// Draw the screen functionality
function drawScreen() {
  clearScreen();
  setTimeout(function() {
    displayStats();
    displayMenu();
    displayPrompt();
  }, 10);
}

function clearScreen() {
  console.log('\x1Bc');
}

function displayStats() {
  console.log('Score: ' + score + '     Lives: ' + lives + '     Dots: ' + dots + '     Level: ' + level);
  console.log('\n\nPower-Pellets: ' + powerPellets);
}

function displayMenu() {
  console.log('\n\nSelect Option:\n');  // each \n creates a new line
  if (dots > 0){
  console.log('(d) Eat Dot');
  }
  if (dots > 9){
    console.log('(f) Eat 10 Dots');
  }
  if (dots > 99){
    console.log('(g) Eat 100 Dots');
  }
  if (dots > 0){
  console.log('(h) Eat All Dots');
  }

  if (powerPellets > 0 && powerPelletAvailable === true){
  console.log('(p) Eat Power-Pellet');
  }
  for (var i=0; i < ghosts.length; i++) {
    console.log( '(' + ghosts[i].menu_option + ') Eat ' + ghosts[i].name  + edibilityStatus(ghosts[i]) )
  }
  console.log('(q) Quit');
}

function edibilityStatus(ghost){
  if (ghost.edible) {
    return ' (edible)';
  } else {
    return ' (inedible)';
  }

}

function displayPrompt() {
  // process.stdout.write is similar to console.log except it doesn't add a new line after the text
  process.stdout.write('\nWaka Waka :v '); // :v is the Pac-Man emoji.
}


// Menu Options
function eatDot() {
  console.log('\nChomp!');
  score += 10;
  dots -= 1;
}

function eatPowerPellet() {
  console.log('\nCHOMP!!');
  score += 50;
  powerPellets -= 1;
  powerPelletAvailable = false;
  for (var i=0; i < ghosts.length; i++) {
    ghosts[i].edible = true;
  }

}

function PowerPelletWearingOff() {
  for (var i=0; i < ghosts.length; i++) {
    ghosts[i].edible = false;
  }
  ghostsEaten = 0.5;
  powerPelletAvailable = true;
  drawScreen();

}

function eatGhost(ghost) {
    if (ghost.edible === false) {
      lives -= 1;
      gameOver();
      console.log('\n' + ghost.name + ' killed Pac-man!');
    } else {
      ghostsEaten *= 2;
      score += (200 * ghostsEaten); //200, 400, 800, 1600
      if (ghostsEaten === 8){
        ghostsEaten = 0.5;
        powerPelletAvailable = true;
      }
      ghost.edible = false;
      console.log('\nPac-man ate ' + ghost.name);
    }

}

// Process Player's Input
function processInput(key) {
  switch(key) {
    case '\u0003': // This makes it so CTRL-C will quit the program
    case 'q':
      process.exit();
      break;
    case 'p':
      if (powerPellets > 0 && powerPelletAvailable === true){
        eatPowerPellet();
        levelUp();
        setTimeout(PowerPelletWearingOff, 10000);
        break;
      } else {
        console.log('\nInvalid Command!');
        break;
      }
    case '1':
      eatGhost(inky);
      break;
    case '2':
      eatGhost(blinky);
      break;
    case '3':
      eatGhost(pinky);
      break;
    case '4':
      eatGhost(clyde);
      break;

    case 'd':
      if (dots > 0) {
      eatDot();
      levelUp();
      break;
      } else {
        console.log('\nInvalid Command!');
      }

      break;
    case 'f':
      if (dots > 9) {
        for (var i=0; i<10; i++)
          eatDot();
          levelUp();
          break;
      } else {
        console.log('\nInvalid Command!');
        break;
      }
    case 'g':
      if (dots > 99) {
        for (var i=0; i<100; i++)
          eatDot();
          levelUp();
          break
      } else {
        console.log('\nInvalid Command!');
        break;
      }
    case 'h':
      currentDots = dots
      if (dots > 0) {
        for (var i=0; i<currentDots; i++)
          eatDot();
          levelUp();
          break
      }else {
        console.log('\nInvalid Command!');
        break;
      }
    default:
      console.log('\nInvalid Command!');
  }
}

function levelUp() {
  if (dots === 0 && powerPellets === 0) {
    level += 1;
    dots = 240;
    powerPellets = 4;
    for (var i=0; i < ghosts.length; i++){
      ghosts[i].edible = false;
    }
  }
}

function gameOver() {
  if (lives === 0){
    process.exit();
  }
}

//
// YOU PROBABLY DON'T WANT TO CHANGE CODE BELOW THIS LINE
//

// Setup Input and Output to work nicely in our Terminal
var stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');

// Draw screen when game first starts
drawScreen();

// Process input and draw screen each time player enters a key
stdin.on('data', function(key) {
  process.stdout.write(key);
  processInput(key);
  setTimeout(drawScreen, 800); // The command prompt will flash a message for 300 milliseoncds before it re-draws the screen. You can adjust the 300 number to increase this.
});

// Player Quits
process.on('exit', function() {
  console.log('\n\nGame Over!\n');
});

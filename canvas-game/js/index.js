//
// Entrypoint for Mazebot game example
//
// - Sets up the game on window load
// - Manages the "phase" ("starting", "playing", or "results") of the game.
// - Connects data from the api to the game (fetches new mazes and sends solutions for checking)
// - Listens for window resize and tells the game to resize itself.
//

var statusBarContainer;
var game;

window.onload = function() {

  // Set up the maze game
  statusBarContainer = document.getElementById('status-bar');

  // see game/maze-game.js
  game = MazeGame(
    document.getElementById('map'),
    document.getElementById('avatar-path'),
    document.getElementById('overlay'),
    statusBarContainer,
    window.innerWidth,
    window.innerHeight - statusBarContainer.clientHeight
  );

  // listen for resize
  window.onresize = handleResize;

  // hook up our two buttons that start a maze (on start and after a maze is completed)
  document.getElementById('start').addEventListener('click', startNewMaze);
  document.getElementById('next-maze').addEventListener('click', startNewMaze);
}

function startNewMaze() {
  //
  // one fun thing to do would be to use the minSize and maxSize query parameters
  // here to make the game get harder over time.
  //
  // in this case, we just pass along the search query
  getJson('/mazebot/random' + window.location.search).then(
    function(r) {
      setPhase('playing');
      game.startMaze(r, onSolution);
      handleResize();
    },
    function(err) {
      document.getElementById('error-message').innerText = err.message;
      setPhase('error');
    }
  );
}

// Setting the phase shows/hides the dom elements that are
// relevant
function setPhase(phase) {
  var el = document.getElementById('maze-browser');
  el.classList.remove('phase-starting');
  el.classList.remove('phase-playing');
  el.classList.remove('phase-results');
  el.classList.remove('phase-error');
  el.classList.add('phase-' + phase);
}

function handleResize() {
  game.setDisplaySize(window.innerWidth, window.innerHeight - statusBarContainer.clientHeight);
}

// when a maze is solved, show the results div and await a click to continue
function onSolution(result) {
  document.getElementById('results-message').innerText = result.message;
  setPhase('results');
  document.getElementById('next-maze').focus();
}

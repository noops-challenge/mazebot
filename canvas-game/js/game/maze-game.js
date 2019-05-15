//
// The top-level game manager
//
function MazeGame(
  mapCanvas,
  avatarPathCanvas,
  overlayCanvas,
  statusBarContainer,
  width,
  height
) {

  var currentMaze = null;
  var onSolution;
  var currentPosition = null;
  var moves = [];

  // Maps between display positions and map positions
  var coordinates = Coordinates();
  coordinates.setDisplaySize(width, height);

  // When user taps/drags in a position,
  // Find a path to the position so we can move them there
  // This is a really basic depth-first pathfinder
  var pathfinder = Pathfinder();

  // Handles user input on the maze and tells us about it:
  // click to move, keyboard movement, toggling zoom, etc.
  var mazeInput = MazeInput(coordinates, overlay);

  // Renders the maze
  var renderer = Renderer(
    coordinates,
    mapCanvas,
    avatarPathCanvas,
    overlayCanvas
  );

  // The status bar at the bottom of the screen
  var statusBar = StatusBar(statusBarContainer, coordinates);

  return {
    // start a new maze
    startMaze: startMaze,

    // when the screen size changes, re-render and configure the coordinate system
    setDisplaySize: setDisplaySize
  };

  function startMaze(maze, onSolution_) {
    moves = [];
    setMaze(maze);
    onSolution = onSolution_;
    renderFrame();
  }

  // the render loop.
  function renderFrame() {
    if (currentMaze) {
      // time is used for periodic animations
      var time = Date.now();

      // There are three stacked canvases:
      // the map, the avatar path, and the overlay with the avatar and goal.
      // Only the overlay is animated, so it is updated here
      renderer.updateOverlay(currentPosition, moves[moves.length - 1], currentMaze.endingPosition, time);
    }

    // do it again
    requestAnimationFrame(renderFrame);
  }

  // Configure the gmae with a new maze
  function setMaze(maze) {
    currentMaze = maze;
    currentPosition = maze.startingPosition;

    // pathfinder needs the map to find paths
    pathfinder.setMap(maze.map);
    pathfinder.setMaxLength(Math.min(10, maze.map.length));

    // set up the coordinate system that everything else relies upon
    coordinates.setMapSize(maze.map[0].length, maze.map.length);
    coordinates.zoom(maze.startingPosition)

    // set the map in the renderer, which will kick off map rendering etc.
    renderer.setMap(maze.map);
    statusBar.setMaze(maze);

    // turn input on. We ignore input when there is no game active.
    mazeInput.setHandlers(handleInputCell, handleInputDirection, handleInputZoom);

  }

  // user requested zoom, optionally with a position
  // (double-click/tap on a square as opposed to keyboard plus)
  function handleInputZoom(position) {
    if (coordinates.zoomed()) {
      coordinates.unzoom();
    }
    else {
      coordinates.zoom(position || currentPosition);
    }

    renderer.displaySizeChanged();
  }

  // User click, tapped, or dragged to a cell.
  // if it is reachable with the current pathfinder,
  // we move them there
  function handleInputCell(pos) {
    var path = pathfinder.findPath(currentPosition, pos);
    if (path) {
      path.forEach(handleInputDirection);
    }
  }

  // user hit an arrow key
  // if the neighboring square is open, move there
  function handleInputDirection(direction) {
    var nextPosition = applyDirectionToCurrentPosition(direction);
    if (isValidPosition(nextPosition)) {
      // save the move
      moves.push(direction);

      // update all the display bits
      statusBar.setMoveCount(moves.length);
      statusBar.setPosition(nextPosition);
      renderer.addToAvatarPath(currentPosition, nextPosition);
      currentPosition = nextPosition;

      // tell the coordinate system about the move
      // if it returns true that means it movesd the viewport
      // in which case we need to tell the renderer it changed
      if (coordinates.scrollIfNeeded(currentPosition, direction)) {
        renderer.displaySizeChanged();
      }

      // See if we have readched the goal
      checkForSolution();
    }
  }

  // configure display; see coordinates.js for the meat of what happnens here.
  function setDisplaySize(width, height) {
    coordinates.setDisplaySize(width, height);
    renderer.displaySizeChanged();
  }

  // given a direction, find the coordinates in that direction
  function applyDirectionToCurrentPosition(d) {
    var offsets = {
      N: [0, -1],
      S: [0, 1],
      W: [-1, 0],
      E: [1, 0],
    }

    return [currentPosition[0] + offsets[d][0], currentPosition[1] + offsets[d][1]];
  }

  // Check to see if we are at the goal.
  // If so, submit our solution to the Mazebot api
  // and call back with our result so we can show it
  // (ending the current maze)
  function checkForSolution() {
    if (
      currentPosition[0] === currentMaze.endingPosition[0] &&
      currentPosition[1] === currentMaze.endingPosition[1]
    ) {
      mazeInput.setHandlers(null, null);
      postJson(currentMaze.mazePath, {
        directions: moves.join('')
      }).then(function (result) {
        onSolution(result);
      });
    }
  }

  // is this a valid position to move to?
  // is it either the start, the end, or an open position
  function isValidPosition(p) {
    var map = currentMaze.map;

    // out of bounds
    if (
      p[0] < 0 ||
      p[1] < 0 ||
      p[0] >= map[0].length ||
      p[1] >= map.length
    ) return false;

    // wall
    if (map[p[1]][p[0]] === 'X') return false;

    return true;
  }
}

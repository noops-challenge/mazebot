// bottom of the game -- status bar
function StatusBar() {

  return {
    setMaze: setMaze,
    setPosition: setPosition,
    setMoveCount: setMoveCount
  }

  function setMaze(maze) {
    document.getElementById('current-maze').innerText = maze.name;
    setMoveCount(0);
    setPosition(maze.startingPosition);
  }

  function setMoveCount(c) {
    document.getElementById('move-count').innerText = c;
  }

  function setPosition(position) {
    document.getElementById('current-position').innerText = position[0] + ', ' + position[1];
  }
}

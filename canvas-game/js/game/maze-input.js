// Input handling for ...
//
// - mouse input
// - keyboard inpot
// - touch input
//
// ... that converts user actions to *maze* coordinates.
//
// If you want to add support for vim or emacs keys, this is the place to do it.
//
function MazeInput(coordinates, overlay) {
  function noop() { } // ;^)

  var mouseOrTouchActive = false;
  var mousePos = [];
  var onPosition = noop;
  var onDirection = noop;
  var onZoom = noop;
  var lastTap = 0;
  var firstTouch;

  var last10 = [];

  document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
  });

  //window.addEventListener('keydown', handleKeydown);
  window.addEventListener('keydown', handleKeydown);

  overlay.addEventListener('dblclick', handleMapDoubleClick);

  overlay.addEventListener('mousedown', handleMousedown);
  overlay.addEventListener('mouseup', handleMouseup);
  overlay.addEventListener('mousemove', handleMousemove);

  overlay.addEventListener('touchstart', handleTouchstart);
  overlay.addEventListener('touchend', handleTouchend);
  overlay.addEventListener('touchmove', handleTouchmove);

  return {
    setHandlers: setHandlers
  };

  // these are the handlers that are invoked when a position is clicked
  // or a direction key is pressed.
  // They are all set at once for convenience.
  //
  // Note that these handlers are always invoked with maze coordinates.
  function setHandlers(onPosition_, onDirection_, onZoom_) {
    onPosition = onPosition_ || noop;
    onDirection = onDirection_ || noop;
    onZoom = onZoom_ || noop;
    mouseOrTouchActive = false;
  }

  //
  // Mouse handling: double-click for zoom, mouse hold and move for moving.
  //
  function handleMapDoubleClick(e) {
    var pos = coordinates.mapPosition([e.clientX, e.clientY]);
    onZoom(pos);
  }

  function handleMousedown(e) {
    notifyMove(e);
    mouseOrTouchActive = true;
  }

  function handleMouseup(e) {
    mouseOrTouchActive = false;
    mouseCell = [];
  }

  function handleMousemove(e) {
    if (mouseOrTouchActive) {
      notifyMove(e);
    }
  }

  //
  // This touch handling is pretty basic and a bit rough.
  //

  // on start, set
  function handleTouchstart(e) {
    firstTouch = e.touches[0];
    mouseOrTouchActive = true;
  }

  function handleTouchmove(e) {
    var touch = e.changedTouches[0];
    notifyMove(touch);
    e.preventDefault();
  }

  function handleTouchend(e) {
    mouseOrTouchActive = false;
    if (lastTap > Date.now() - 500) {
      notifyZoom(firstTouch);
      e.preventDefault();
    }
    lastTap = Date.now();
  }

  // convert from client coordinates to grid coordinates and notify
  // the listener of a move attempt (click on grid square)
  function notifyMove(e) {
    var pos = coordinates.mapPosition([e.clientX, e.clientY]);
    if (pos[0] !== mousePos[0] || pos[1] !== mousePos[1]) {
      onPosition(pos);
    }
    mousePos = pos;
  }

  // convert an event with client coordinates into a zoom
  // event to the corresponding grid position
  function notifyZoom(e) {
    var pos = coordinates.mapPosition([e.clientX, e.clientY]);
    onZoom(pos);
  }

  // Handle arrow keys.

  function handleKeydown(e) {
    const key = e.key.replace(/^Arrow/, '');

    var directions = {
      Right: 'E',
      Left: 'W',
      Up: 'N',
      Down: 'S',
    }

    if (checkKonami(key)) console.log('KONAMI CODE ACTIVATED');
    var direction = directions[key];
    if (direction) onDirection(direction);
    if (key === '=' || key === '+') onZoom();
  }

  // ohai what's this?
  // this would be a good place to invoke a maze solver if you had one.
  function checkKonami(code) {
    var k = ['Up', 'Up', 'Down', 'Down', 'Left', 'Right', 'Left', 'Right', 'b', 'a'];
    last10.push(code);
    if (last10.length > 10) last10.shift();
    if (last10.length !== 10) return false;
    for (var i = 0; i < 10; i++) {
      if (last10[i] !== k[i]) return false;
    }
    return true;
  }
}

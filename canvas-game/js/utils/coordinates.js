// Coordinate system that maps between display coordinates and maze coordinates
function Coordinates() {
  var displayWidth = 1;
  var displayHeight = 1;
  var mapHeight = 1;
  var mapWidth = 1;
  var cellSize = 0;

  var displayOffsetX = 0;
  var displayOffsetY = 0;

  var cellOffsetX = 0;
  var cellOffsetY = 0;
  var displayCells = 1;

  return {
    // set the size of the display
    setDisplaySize: setDisplaySize,
    // set the size of the map
    setMapSize: setMapSize,

    // given a map coordinate, get the position on the canvas
    canvasPosition: canvasPosition,

    // from a point on the canvas, get the map position
    mapPosition: mapPosition,

    // zoom into a point
    zoom: zoom,
    unzoom: unzoom,

    // given a player move, scroll to keep the player in view
    // returns true if scrolled, so renderers can update
    scrollIfNeeded: scrollIfNeeded,

    // boolean: are we zoomed?
    zoomed: zoomed,

    // number: pixel size of cells
    cellSize: function() { return cellSize },

    // size of the display in pixels
    displaySize: function(){ return { width: displayWidth, height: displayHeight }; }
  };

  function zoomed() {
    return displayCells !== mapWidth;
  }

  // zoom the viewport in on a point;
  function zoom(center) {
    // figure out how many cells wide/high to show
    // note it is always an odd number so there is a center cell
    // "responsive" -- try to keep the viewport reasonable
    var cells = 17;
    var smallestScreenDimension = Math.min(displayHeight, displayWidth);

    if (smallestScreenDimension < 600) {
      cells = 9;
    }
    else if (smallestScreenDimension < 1200) {
      cells = 13;
    }

    // Only zoom if the map is bigger than the screen while zoomed
    if (cells > mapWidth) {
      unzoom();
      return;
    }

    displayCells = cells;

    setCenter(center);
    setCellSize();
  }

  // center the viewpoprt on a maze square
  function setCenter(center) {
    var offset =  Math.floor(displayCells / 2);
    cellOffsetX = Math.min(mapWidth - displayCells, Math.max(0, center[0] - offset));
    cellOffsetY = Math.min(mapHeight - displayCells, Math.max(0, center[1] - offset));
  }

  // undo any zooming
  function unzoom() {
    displayCells = mapWidth;
    cellOffsetX = 0;
    cellOffsetY = 0;
    setCellSize();
  }


  // when a move happens, decide if we need to scroll and recenter the screen
  function scrollIfNeeded(position, direction) {
    if (!zoomed()) return;

    if ( direction === 'W' && position[0] <= cellOffsetX && cellOffsetX > 0) {
      cellOffsetX = Math.max(0, cellOffsetX - 1);
      return true;
    }
    else if (direction === 'N' && position[1] <= cellOffsetY && cellOffsetY > 0) {
      cellOffsetY = Math.max(0, cellOffsetY - 1)
      return true;
    }
    else if (direction === 'E' && position[0] >= cellOffsetX + displayCells - 1 && cellOffsetX < mapHeight - displayCells) {
      cellOffsetX = Math.min(mapWidth - displayCells, cellOffsetX + 1);
      return true;
    }
    else if (direction === 'S' && position[1] >= cellOffsetY + displayCells - 1 && cellOffsetY < mapHeight - displayCells) {
      cellOffsetY = Math.min(mapHeight - displayCells, cellOffsetY + 1);
      return true;
    }

    // if avatar was completely offscreen, center on them
    if (canvasPosition(position).offscreen) {
      setCenter(position);
      return true;
    }
  }

  // When display size changes, recalculate our offsets
  function setDisplaySize(width, height) {
    displayWidth = width;
    displayHeight = height;

    if (width > height) {
      displayOffsetX = Math.round((width - height) / 2);
      displayOffsetY = 0;
    }
    else {
      displayOffsetX = 0;
      displayOffsetY = Math.round((height - width) / 2);
    }

    setCellSize();
  }

  // Set the size of map.
  // This is immediately followed by zooming in practice,
  // so we dont' need to do anything else here -- but that could be kind of fragile
  function setMapSize(width, height) {
    mapWidth = width;
    mapHeight = height;
  }

  // cache the size of cell; we use it everywhere
  function setCellSize() {
    // note: only really supports square maps
    cellSize = Math.min(displayWidth, displayHeight) / displayCells;
  }

  function mapPosition(canvasCoords) {
    return [Math.floor((canvasCoords[0] - displayOffsetX) / cellSize) + cellOffsetX, Math.floor((canvasCoords[1] - displayOffsetY) / cellSize) + cellOffsetY];
  }

  // canvas positions are used all over the renderers
  // to figure out screen coordinates from map coordinates
  // they have a bunch of pre-calced props with piel coordinates
  // for renderers to use
  function canvasPosition(coords) {
    var x = coords[0] - cellOffsetX;
    var y = coords[1] - cellOffsetY;
    var l = Math.floor(x * cellSize + displayOffsetX);
    var t = Math.floor(y * cellSize + displayOffsetY);

    return makePosition(l, t, cellSize);
  }

  function makePosition(l, t, size) {
    var half = Math.floor(size / 2);
    var hc = l + half;
    var vc = t + half;

    var r = l + size;
    var b = t + size;

    // all values are in canvas (ie. pixel) coordinates
    var p = {
      // numeric values
      t: t, // top
      l: l, // left
      r: r, // right
      b: b, // bottom
      hc: hc, // horizontal center
      vc: vc, // vertical center
      size: size, // width/height (it is a square)

      // coordinates for various points in the cell
      // [x, y] pairs
      center: [hc, vc], // the center

      n: [hc, t], // north: the center point of the north edge
      s: [hc, b], // south
      e: [r, vc], // east
      w: [l, vc], // west

      nw: [l, t], // northwest corner ("top left") of the box
      sw: [l, b], // southwest
      ne: [r, t], // northeast
      se: [r, b], // southeast

      // boolean: is this offscreen (out of the viewport)?
      // used to skip rendering
      offscreen: l > displayWidth || r < 0 || t > displayHeight || b < 0
    };

    // scale method creates another position that has the same center
    // but is larger/smaller -- useful for rendering
    p.scale = scalePosition.bind(null, p);

    return p;
  }


  // see above - scales a canvas position bigger or smaller
  // scale < 1 shrinks, > 1 makes it bigger
  function scalePosition(position, scale) {
    var size = position.size * scale;
    var half = Math.floor(size / 2);
    var vc = position.vc;
    var hc = position.hc;

    var t = vc - half;
    var l = hc - half;
    return makePosition(l, t, size);
  }
}

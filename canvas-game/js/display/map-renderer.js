//

var MapRenderer = function (
  mapContext,
  coordinates
) {
  var map = [];
  var walls = [];
  var corners = [];

  return {
    setMap: setMap,
    render: render
  };

  function setMap(m) {
    map = m;
    render();
  }

  // There are two phases:
  // 1. collect all of the elements to render
  // 2. render those elements in the proper order from back to front
  function render() {
    // Collect all the contents we will render
    clearContents();
    map.forEach(collectRowContents);
    collectBoundaries();

    //  Now draw
    CanvasUtils.resetCanvas(mapContext, Styles.mapBackground);

    // Draw floor
    map.forEach(drawRowBackground);

    // Draw walls
    renderContents();
  }

  function clearContents() {
    walls = [];
    corners = [];
    endcaps = [];
  }


  function collectBoundaries() {
    var tl = coordinates.canvasPosition([-1,-1]);
    var bl = coordinates.canvasPosition([-1,map.length]);
    var tr = coordinates.canvasPosition([map[0].length, -1]);
    var br = coordinates.canvasPosition([map[0].length, map.length]);

    addWallSegment(tl.center, bl.center, tl.size);
    addWallSegment(tr.center, br.center, tl.size);
    addWallSegment(bl.center, br.center, tl.size);
    addWallSegment(tl.center, tr.center, tl.size);
  }

  function collectRowContents(row, y) {
    row.forEach(function (value, x) {
      processCell(x, y, value, map);
    });
  }

  // collect walls
  function processCell(x, y, value, map) {
    if (value === 'X') {
      processFilledCell(x, y, map);
    }
  }

  // This cell has an X -- figure out how to render the walls
  function processFilledCell(x, y, map) {
    var cell = coordinates.canvasPosition([x, y]);

    if (cell.offscreen) return;

    var neighbors = getNeighbors(x, y, map);

    addCorners(cell, neighbors);
    addWalls([x, y], cell, neighbors);
  }

  // Fill in corners with white
  function addCorners(cell, neighbors) {
    var scaled = cell.scale(1.1);
    var half = Math.floor(scaled.size / 2)

    if (neighbors.n && neighbors.w) {
      addCorner(scaled.nw, half, half);
    }
    if (neighbors.n && neighbors.e) {
      addCorner(scaled.n, half, half);
    }
    if (neighbors.s && neighbors.w) {
      addCorner(scaled.w, half, half);
    }
    if (neighbors.s && neighbors.e) {
      addCorner(scaled.center, half, half);
    }
  }

  function addCorner(topLeft, width, height) {
    corners.push({
      topLeft: topLeft,
      width: width,
      height: height
    });
  }

  //
  // get the neighbors of the cell.
  //
  // each direction is either 'X' (wall),
  // 'O' (out of bounds), or undefined
  function getNeighbors(x, y, map) {
    var count = 0;
    var edgeCount = 0;

    function neighbor(dx, dy) {
      var value = (map[dy + y] || [])[x + dx];

      if (!value) {
        // on an edge
        edgeCount++;
        return 'O';
      }
      if (value === 'X') {
        // neighbor is a wall
        count++;
        return 'X';
      }
    }
    return {
      n: neighbor(0, -1),
      s: neighbor(0, 1),
      w: neighbor(-1, 0),
      e: neighbor(1, 0),
      nw: neighbor(-1, -1),
      sw: neighbor(-1, 1),
      ne: neighbor(1, -1),
      se: neighbor(1, 1),
      edgeCount: edgeCount,
      count: count
    };
  }

  // add wall to each neighbor that is occupied
  function addWalls(position, cell, neighbors) {
    addCellWallSegment(cell, neighbors, "n");
    addCellWallSegment(cell, neighbors, "w");
    addCellWallSegment(cell, neighbors, "s");
    addCellWallSegment(cell, neighbors, "e");

    addCellWallSegment(cell, neighbors, "ne");
    addCellWallSegment(cell, neighbors, "nw");
    addCellWallSegment(cell, neighbors, "se");
    addCellWallSegment(cell, neighbors, "sw");

    // don't render endcaps if zoomed out and squares are tiny
    if (cell.size < 13) return;

    // add an endcap if this is a lone wall square or
    // if there is only one neighbor
    if ((neighbors.count === 1 && !neighbors.edgeCount) || neighbors.count === 0) {
      // pick a color
      var colorIndex = (position[0] + position[1]) % Styles.endcapFill.length;
      addEndcap(cell.center, colorIndex);
    }
  }

  function addEndcap(center, colorIndex) {
    endcaps.push({ center: center, colorIndex: colorIndex});
  }

  // add a piece of wall if the direction specified by prop is occupied
  function addCellWallSegment(cell, neighbors, prop) {
    var contents = neighbors[prop];

    if (contents === 'O') {
      // If we are at the edge, we don't want to treat the diagonal
      // edges as occupied, only the cardinal ones
      // so if we are drawing a "nw" wall, only do it if we have north and west neighbors
      if (prop.length  === 2) {
        if (!neighbors[prop[0]] || !neighbors[prop[1]]) {
          return;
        }
      }
      // out of bounds means we are at the edge
      // scale up so we draw past the edge
      var doubled = cell.scale(2);
      addWallSegment(doubled[prop], doubled.center, coordinates.cellSize() / 1.7);
    }
    else if (contents === 'X') {
      // fudge enough to always connect adjacent lines
      var enlarged = cell.scale(1.1);
      addWallSegment(enlarged[prop], cell.center, coordinates.cellSize() / 1.7);
    }
  }

  function addWallSegment(from, to, thickness) {
    walls.push({
      from: from, to: to, thickness: thickness
    });
  }

  // draw the background, a tiled floor pattern
  function drawRowBackground(row, y) {
    row.forEach(function (value, x) {
      drawBackground(mapContext, x, y, value, map);
    });
  }

  // draw tiles on the entire visible map
  function drawBackground(mapContext, x, y) {
    var cell = coordinates.canvasPosition([x, y]);
    if (cell.offscreen) return;

    var width = cell.size / 40;

    var shrunk = cell.scale(0.95);

    // highlight/shadow
    CanvasUtils.drawPath(mapContext, width, Styles.tileOutline[0], [shrunk.sw, shrunk.nw, shrunk.ne]);
    CanvasUtils.drawPath(mapContext, width, Styles.tileOutline[1], [shrunk.ne, shrunk.se, shrunk.sw]);
  }

  // render the walls, edge boundary, and endcaps
  function renderContents() {
    // calculate how far to offset our highlight and shadow layers
    // that create the faux 3d look based on the cell size.
    var dx = Math.min(8, Math.max(2, coordinates.cellSize() / 15));
    var dy = dx / 2;
    var highlightOffset = [-dx, -dy];
    var shadowOffset = [dx, dy];

    // only render the shadow and highlight layers if cells are big enough
    if (coordinates.cellSize() > 12) {
      // we draw all of the the highlights and shadows on top of each other
      endcaps.forEach(drawEndcapBackground.bind(null, highlightOffset, shadowOffset));
      walls.forEach(drawWallBackground.bind(null, highlightOffset, shadowOffset));
      // border layer
      walls.forEach(drawWallLayer1);
    }

    // draw the tops of walls ad boundaries
    walls.forEach(drawWallLayer2);

    // fill in the corners where needed -
    corners.forEach(drawCorner);

    // draw the colored endcaps (if on a large enough screen)
    if (coordinates.cellSize() > 12) {
      endcaps.forEach(drawEndcap);
    }
  }

  // draw the highlight and shadow layers
  function drawWallBackground(highlightOffset, shadowOffset, wall) {
    CanvasUtils.drawPath(mapContext, wall.thickness, Styles.highlight, translateMany(highlightOffset, [wall.from, wall.to]));
    CanvasUtils.drawPath(mapContext, wall.thickness, Styles.shadow, translateMany(shadowOffset, [wall.from, wall.to]));
  }

  // highlight and shado for the endcap circless
  function drawEndcapBackground(highlightOffset, shadowOffset, endcap) {
    CanvasUtils.drawFilledCircle(mapContext, translate(highlightOffset, endcap.center), coordinates.cellSize() / 2.5, 2, Styles.highlight, Styles.highlight);
    CanvasUtils.drawFilledCircle(mapContext, translate(shadowOffset, endcap.center), coordinates.cellSize() / 2.5, 2, Styles.shadow, Styles.shadow);
  }

  // the border layer (black)
  function drawWallLayer1(wall) {
    CanvasUtils.drawPath(mapContext, wall.thickness, Styles.wallLayer1, [wall.from, wall.to]);
  }

  // The top layer (white)
  function drawWallLayer2(wall) {
    CanvasUtils.drawPath(mapContext, wall.thickness * 0.8, Styles.wallLayer2, [wall.from, wall.to]);
  }

  // Corners are just white rects that fill in the corner by a diagonal wall
  // so that there is no ugly hole there
  function drawCorner(corner) {
    mapContext.strokeStyle = Styles.corner;
    mapContext.fillStyle = Styles.corner;
    mapContext.fillRect(
      corner.topLeft[0],
      corner.topLeft[1],
      corner.width,
      corner.height
    );
  }

  // Endcaps are circles on the end of walls
  function drawEndcap(endcap) {
    CanvasUtils.drawFilledCircle(mapContext, endcap.center, coordinates.cellSize() / 2.5, coordinates.cellSize() / 12, 'black', 'white');
    CanvasUtils.drawFilledCircle(mapContext, endcap.center, coordinates.cellSize() / 3.5, coordinates.cellSize() / 12, 'black', Styles.endcapFill[endcap.colorIndex]);
  }

  // utility functions for translating coordinates for highlight and shadow
  function translate(offset, pair) {
    return [pair[0] + offset[0], pair[1] + offset[1]];
  }

  function translateMany(offset, pairs) {
    return pairs.map(function(p) { return [p[0] + offset[0], p[1] + offset[1]]; });
  }
}

// Render the overlay:
// - the avatar
// - the goal
// this is continuously animating and is called many times per second
function OverlayRenderer(
  overlayContext,
  coordinates
) {
  return {
    updateOverlay: function (avatarPosition, avatarDirection, endingPosition, frame) {
      CanvasUtils.resetCanvas(overlayContext, "rgba(0,0,0,0)");

      // goal first, so the avatar "floats" above if adjacent
      drawGoal(avatarPosition, endingPosition, frame);
      drawAvatar(avatarPosition, avatarDirection, frame);
    }
  };

  function drawGoal(currentPosition, endingPosition, time) {
    var position = coordinates.canvasPosition(endingPosition);

    if (position.offscreen) {
      // goal is offscreen - render a directional pointer to the goal
      var avatarScreenPosition = coordinates.canvasPosition(currentPosition);

      // figure out the direction
      var direction = angle(currentPosition, endingPosition);
      var distance = Math.abs(currentPosition[0] - endingPosition[0]) + Math.abs(currentPosition[1] - endingPosition[1]);

      // make it farther away from the avatar the farther from goal
      var distanceModifier = (Math.min(40, distance - 20) / 100);
      var radius = position.size * (0.85 + distanceModifier);

      // could vary this too...
      var lineWidth = 3;

      // cycle the colors based on current time
      var frame = Math.floor((time / 150) % Styles.goalDirection.length);

      // draw the arcs
      for (var i = 0; i < Styles.goalDirection.length; i++) {
        var magnitude = 0.08 * (i + 0.5);
        var style = Styles.goalDirection[(frame + i) % Styles.goalDirection.length]
        CanvasUtils.drawArc(overlayContext, avatarScreenPosition.center, radius * (1 - (i * 0.05)), direction - magnitude, direction + magnitude, lineWidth, style)
      }
    }
    else {
      // hrender a target

      // how big?
      if (position.size < 30) factor = factor * 1.2;
      if (position.size < 15) factor = factor * 1.2;

      // pulse the size over time
      var factor = Math.abs(time % 2000 - 1000) / 4000;
      var scale = 0.4 + factor;
      var basis = scale * position.size;

      CanvasUtils.drawFilledCircle(overlayContext, position.center, basis * 1.2, position.size / 10, "black", "yellow");
      if (coordinates.cellSize() > 12) {
        CanvasUtils.drawFilledCircle(overlayContext, position.center, basis, position.size / 9, "black", "yellow");
      }
      CanvasUtils.drawFilledCircle(overlayContext, position.center, basis * 0.8, position.size / 8, "red", "white");
      if (coordinates.cellSize() > 12) {
        CanvasUtils.drawFilledCircle(overlayContext, position.center, basis * 0.6, position.size / 8, "red", "yellow");
      }
      CanvasUtils.drawFilledCircle(overlayContext, position.center, basis * 0.4, position.size / 8, "red", "white");
      CanvasUtils.drawFilledCircle(overlayContext, position.center, basis * 0.2, position.size / 8, "black", "red");
    }
  }

  function angle(from, to) {
    var dy = to[1] - from[1];
    var dx = to[0] - from[0];
    return Math.atan2(dy, dx);
  }

  // Draw the arrow that represensts the avatar
  function drawAvatar(avatarPosition, avatarDirection, time) {
    var cell = coordinates.canvasPosition(avatarPosition);

    var scale = 0.8 - (0.0003 * Math.abs(time % 1000 - 500));

    // size for the display, kinda
    if (cell.size < 20) scale += 0.4;
    if (cell.size < 10) scale += 0.4;

    var c = cell.scale(scale);
    var width = Math.floor(cell.size / 15);

    // point the arrow
    if (avatarDirection === 'W') {
      drawArrow(overlayContext, c.w, c.ne, c.se, width);
    }
    else if (avatarDirection === 'E') {
      drawArrow(overlayContext, c.e, c.nw, c.sw, width);
    }
    else if (avatarDirection === 'S') {
      drawArrow(overlayContext, c.s, c.ne, c.nw, width);
    }
    else {
      drawArrow(overlayContext, c.n, c.se, c.sw, width);
    }
  }


  function drawArrow(overlayContext, tip, c1, c2, width) {
    //shadow
    CanvasUtils.drawPath(overlayContext, 2, 'black', shadowOffset(width, [c1, c2, tip, c1]), { fill: 'black' });

    // arrow
    CanvasUtils.drawPath(overlayContext, width, '#00E8F6', [c1, c2, tip, c1], { fill: 'yellow' });
  }

  function shadowOffset(width, points) {
    return points.map(function(p) { return [p[0] + width * 1.5, p[1] + width * 1.5] });
  }
}

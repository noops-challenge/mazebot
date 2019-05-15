// Renders the avatar's path through the maze
function AvatarPathRenderer(
  avatarPathContext,
  coordinates
) {

  var positions = [];

  return {
    clearAvatarPath: clearAvatarPath,
    addToAvatarPath: addToAvatarPath,
    redraw: redraw
  };

  // redraw the whole path.
  // this happens when display size changes or viewport scrolls
  function redraw() {
    CanvasUtils.resetCanvas(avatarPathContext, "rgba(0,0,0,0)");
    for(var i = 0; i < positions.length - 1; i++) {
      renderSegment(positions[i], positions[i + 1]);
    }
  }

  function clearAvatarPath() {
    positions = [];
    CanvasUtils.resetCanvas(avatarPathContext, "rgba(0,0,0,0)");
  }

  // add a new segment. We don't redraw the whole path, just add to the avatar path canvas.
  function addToAvatarPath(from, to) {
    if (positions.length === 0) positions = [from];
    positions.push(to);

    renderSegment(from, to);
  }

  function renderSegment(from, to) {
    var f = coordinates.canvasPosition(from);
    var t = coordinates.canvasPosition(to);
    // only if we can see it!
    if (f.offscreen && t.offscreen) return;

    var dashBasis = Math.ceil(f.size / 20);

    CanvasUtils.drawPath(avatarPathContext, f.size / 8, Styles.avatarPath, [f.center, t.center], { dash: [dashBasis * 5, dashBasis * 5] });
  }
}

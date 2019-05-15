// Top-level renderer
// Sets up the renderers for each layer
var Renderer = function (
  coordinates,
  mapCanvas,
  avatarPathCanvas,
  overlayCanvas
) {

  // There are 3 layers, listed here from bottom to top.
  // Each layer is sized to the entire viewport size

  // The map: floor and walls
  // Only updated when a maze starts or the viewport changes
  // (scroll, or zoom)
  var mapContext = mapCanvas.getContext('2d', {alpha: false});

  var mapRenderer = MapRenderer(
    mapContext,
    coordinates
  );

  // Avatar path: transparent and only updated when the path changes
  // or the viewport changes
  var avatarPathContext = avatarPathCanvas.getContext('2d');

  var avatarPathRenderer = AvatarPathRenderer(
    avatarPathContext,
    coordinates
  );


  // Overlay with the avatar and goal
  // This is continuously animated content, and is updated every frame
  var overlayContext = overlayCanvas.getContext('2d');
  var overlayRenderer = OverlayRenderer(
    overlayContext,
    coordinates
  );

  // New map: configure all the renderers
  function setMap(map) {
    CanvasUtils.resetCanvas(mapContext);
    mapRenderer.setMap(map);
    avatarPathRenderer.clearAvatarPath();
    displaySizeChanged();
  }

  // Resize all the canvases to the new size and tell the renderers to do their thing
  function displaySizeChanged() {
    var displaySize = coordinates.displaySize();

    mapCanvas.width = displaySize.width;
    mapCanvas.height = displaySize.height;

    avatarPathCanvas.width = displaySize.width;
    avatarPathCanvas.height = displaySize.height;

    overlayCanvas.width = displaySize.width;
    overlayCanvas.height = displaySize.height;

    // overlay is updated continuously so doesn't need to be here
    mapRenderer.render();
    avatarPathRenderer.redraw();
  }

  return {
    // called when a maze starts
    setMap: setMap,
    // called in render loop
    updateOverlay: overlayRenderer.updateOverlay,
    displaySizeChanged: displaySizeChanged,
    // player moved
    addToAvatarPath: avatarPathRenderer.addToAvatarPath
  };
}

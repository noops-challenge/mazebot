// Pathfinder takes a map and finds a path from one point to another, up to
// the provided max length.
// This lets us support navigating by clicking on map squares.

function Pathfinder() {
  var map, maxLength = 1;

  return {
    setMap: setMap,
    setMaxLength: setMaxLength,
    findPath: findPath
  }

  function setMap(m) {
    map = m;
  }

  function setMaxLength(value) {
    maxLength = value;
  }

  function findPath(from, to) {
    return _findPath(from, to, [])
  }

  // recursively search all cardinal directions until we hit a wall or the target
// This is not a very smart pathfinder
  function _findPath(c, to, soFar) {
    var x = c[0];
    var y = c[1];
    if (((map[y] || [])[x] || 'X') === 'X') return;
    if (distance(c, to) === 0) return soFar;

    if (soFar.length < maxLength) {
      var paths = [
        _findPath([x, y - 1], to, soFar.concat(['N'])),
        _findPath([x, y + 1], to, soFar.concat(['S'])),
        _findPath([x + 1, y], to, soFar.concat(['E'])),
        _findPath([x - 1, y], to, soFar.concat(['W']))
      ].filter(function(p) { return !!p; });

      if (paths.length) {
        paths.sort(shortest);
        return paths[0];
      }
    }
  }

  // comparator for finding shortest path among many
  function shortest(a, b) {
    return a.length - b.length;
  }

  // minimum number of moves from a to b
  // (x distance + y distance)
  function distance(a, b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
  }
}
